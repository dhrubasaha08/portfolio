import { useCallback, useEffect, useRef, useState } from "react";

/** @typedef {import("../data/types.js").ChapterId} ChapterId */
/** @typedef {import("../data/types.js").ChapterMotionState} ChapterMotionState */
/** @typedef {import("../data/types.js").ScenePointer} ScenePointer */

export const CHAPTER_IDS = /** @type {const} */ ([
  "home",
  "work",
  "practice",
  "project-kyber",
  "tremor-track",
  "experience",
  "about",
  "contact",
]);

/** @param {number} value @param {number} min @param {number} max */
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/** @param {number} value */
const cssNumber = (value) => value.toFixed(4);

/** @returns {"mobile" | "tablet" | "desktop"} */
function getViewportTier() {
  if (typeof window === "undefined" || window.innerWidth >= 1100) return "desktop";
  return window.innerWidth < 768 ? "mobile" : "tablet";
}

/**
 * Connects native document scrolling to both CSS chapter choreography and the
 * fixed decorative scene. Per-frame values stay in refs and CSS custom
 * properties; React state only changes when the active chapter, viewport tier,
 * or page visibility changes.
 */
export function useChapterMotion() {
  const motionRootRef = useRef(/** @type {HTMLElement | null} */ (null));
  const chapterNodesRef = useRef(/** @type {Map<ChapterId, HTMLElement>} */ (new Map()));
  const chapterCallbacksRef = useRef(
    /** @type {Map<ChapterId, (node: HTMLElement | null) => void>} */ (new Map()),
  );
  const frameRef = useRef(/** @type {number | null} */ (null));
  const pointerFrameRef = useRef(/** @type {number | null} */ (null));
  const impulseTimerRef = useRef(/** @type {number | null} */ (null));
  const initialTier = getViewportTier();
  const viewportTierRef = useRef(initialTier);
  const [activeChapter, setActiveChapter] = useState(/** @type {ChapterId} */ ("home"));
  const [viewportTier, setViewportTier] = useState(initialTier);
  const [visible, setVisible] = useState(
    () => typeof document === "undefined" || document.visibilityState !== "hidden",
  );

  const pointerRef = useRef(
    /** @type {ScenePointer} */ ({ x: 0, y: 0, impulse: 0 }),
  );
  const motionRef = useRef(
    /** @type {ChapterMotionState} */ ({
      activeChapter: "home",
      previousChapter: "home",
      progress: 0,
      enter: 0,
      exit: 0,
      transitionProgress: 0,
      globalProgress: 0,
    }),
  );

  const updateFrame = useCallback(() => {
    frameRef.current = null;
    const viewportHeight = Math.max(1, window.innerHeight);
    const focalY = viewportHeight * 0.5;
    const scrollableHeight = Math.max(
      1,
      document.documentElement.scrollHeight - viewportHeight,
    );
    const nextTier = getViewportTier();
    const root = motionRootRef.current;
    const readings = /** @type {Array<{id: ChapterId, progress: number, enter: number, exit: number, transition: number, distance: number}>} */ ([]);
    const measurements = /** @type {Array<{id: ChapterId, node: HTMLElement, rect: DOMRect}>} */ ([]);

    for (const id of CHAPTER_IDS) {
      const node = chapterNodesRef.current.get(id);
      if (!node) continue;
      measurements.push({ id, node, rect: node.getBoundingClientRect() });
    }

    // Read every layout box before writing any custom properties. Keeping the
    // phases separate avoids one forced layout per chapter on slower devices.
    for (const { id, node, rect } of measurements) {
      const progress = clamp((viewportHeight - rect.top) / (viewportHeight + rect.height), 0, 1);
      const enter = clamp(progress / 0.28, 0, 1);
      const exit = clamp((progress - 0.72) / 0.28, 0, 1);
      const transition = clamp((progress - 0.58) / 0.3, 0, 1);
      const containsFocus = rect.top <= focalY && rect.bottom >= focalY;
      const distance = containsFocus ? 0 : Math.abs(rect.top + rect.height / 2 - focalY);

      node.style.setProperty("--chapter-progress", cssNumber(progress));
      node.style.setProperty("--chapter-enter", cssNumber(enter));
      node.style.setProperty("--chapter-exit", cssNumber(exit));
      node.style.setProperty("--chapter-transition", cssNumber(transition));
      readings.push({ id, progress, enter, exit, transition, distance });
    }

    const current = readings.reduce((closest, reading) => (
      closest === null || reading.distance < closest.distance ? reading : closest
    ), /** @type {(typeof readings)[number] | null} */ (null));

    if (current) {
      const nextState = motionRef.current;
      if (nextState.activeChapter !== current.id) {
        nextState.previousChapter = nextState.activeChapter;
        nextState.activeChapter = current.id;
        setActiveChapter(current.id);
      }
      nextState.progress = current.progress;
      nextState.enter = current.enter;
      nextState.exit = current.exit;
      nextState.transitionProgress = current.transition;
      nextState.globalProgress = clamp(
        window.scrollY / scrollableHeight,
        0,
        1,
      );

      root?.setAttribute("data-active-chapter", current.id);
      root?.style.setProperty("--global-progress", cssNumber(nextState.globalProgress));
      root?.style.setProperty("--transition-progress", cssNumber(current.transition));
    }

    if (root) {
      const connection = /** @type {Navigator & {connection?: {saveData?: boolean}}} */ (navigator)
        .connection;
      const motionMode = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "reduced"
        : connection?.saveData ? "save-data" : "interactive";
      root.dataset.motionMode = motionMode;
    }

    if (viewportTierRef.current !== nextTier) {
      viewportTierRef.current = nextTier;
      setViewportTier(nextTier);
    }
  }, []);

  const schedule = useCallback(() => {
    if (frameRef.current !== null) return;
    frameRef.current = window.requestAnimationFrame(updateFrame);
  }, [updateFrame]);

  const updatePointerFrame = useCallback(() => {
    pointerFrameRef.current = null;
    const root = motionRootRef.current;
    const pointer = pointerRef.current;
    root?.style.setProperty("--pointer-x", cssNumber(pointer.x));
    root?.style.setProperty("--pointer-y", cssNumber(pointer.y));
    root?.style.setProperty("--pointer-impulse", cssNumber(pointer.impulse));
  }, []);

  const schedulePointer = useCallback(() => {
    if (pointerFrameRef.current !== null) return;
    pointerFrameRef.current = window.requestAnimationFrame(updatePointerFrame);
  }, [updatePointerFrame]);

  const registerChapter = useCallback(
    /** @param {ChapterId} id */
    (id) => {
      const existing = chapterCallbacksRef.current.get(id);
      if (existing) return existing;

      /** @param {HTMLElement | null} node */
      const callback = (node) => {
        if (node) {
          chapterNodesRef.current.set(id, node);
          node.style.setProperty("--chapter-progress", "0");
          node.style.setProperty("--chapter-enter", "1");
          node.style.setProperty("--chapter-exit", "0");
          node.style.setProperty("--chapter-transition", "0");
        } else chapterNodesRef.current.delete(id);
      };
      chapterCallbacksRef.current.set(id, callback);
      return callback;
    },
    [],
  );

  useEffect(() => {
    const handleViewportChange = () => schedule();
    const handleVisibility = () => {
      const nextVisible = document.visibilityState !== "hidden";
      setVisible(nextVisible);
      if (nextVisible) schedule();
    };
    /** @param {PointerEvent} event */
    const handlePointerMove = (event) => {
      if (!window.matchMedia("(pointer: fine)").matches) return;
      pointerRef.current.x = clamp((event.clientX / Math.max(1, window.innerWidth)) * 2 - 1, -1, 1);
      pointerRef.current.y = clamp(-((event.clientY / Math.max(1, window.innerHeight)) * 2 - 1), -1, 1);
      schedulePointer();
    };
    /** @param {PointerEvent} event */
    const handlePointerDown = (event) => {
      if (event.pointerType !== "touch") return;
      pointerRef.current.x = clamp((event.clientX / Math.max(1, window.innerWidth)) * 2 - 1, -1, 1);
      pointerRef.current.y = clamp(-((event.clientY / Math.max(1, window.innerHeight)) * 2 - 1), -1, 1);
      pointerRef.current.impulse = 1;
      if (impulseTimerRef.current !== null) window.clearInterval(impulseTimerRef.current);
      impulseTimerRef.current = window.setInterval(() => {
        pointerRef.current.impulse *= 0.72;
        if (pointerRef.current.impulse < 0.01) {
          pointerRef.current.impulse = 0;
          if (impulseTimerRef.current !== null) window.clearInterval(impulseTimerRef.current);
          impulseTimerRef.current = null;
        }
        schedulePointer();
      }, 50);
      schedulePointer();
    };
    const handlePointerLeave = () => {
      pointerRef.current.x = 0;
      pointerRef.current.y = 0;
      schedulePointer();
    };

    window.addEventListener("scroll", handleViewportChange, { passive: true });
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    document.documentElement.addEventListener("mouseleave", handlePointerLeave);
    document.addEventListener("visibilitychange", handleVisibility);
    const root = motionRootRef.current;
    const connection = /** @type {Navigator & {connection?: {saveData?: boolean}}} */ (navigator)
      .connection;
    root?.setAttribute("data-active-chapter", "home");
    if (root) {
      root.style.setProperty("--global-progress", "0");
      root.style.setProperty("--transition-progress", "0");
      root.style.setProperty("--pointer-x", "0");
      root.style.setProperty("--pointer-y", "0");
      root.style.setProperty("--pointer-impulse", "0");
      root.dataset.motionMode = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "reduced"
        : connection?.saveData ? "save-data" : "interactive";
    }

    return () => {
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
      if (pointerFrameRef.current !== null) {
        window.cancelAnimationFrame(pointerFrameRef.current);
      }
      if (impulseTimerRef.current !== null) window.clearInterval(impulseTimerRef.current);
      frameRef.current = null;
      pointerFrameRef.current = null;
      impulseTimerRef.current = null;
      window.removeEventListener("scroll", handleViewportChange);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      document.documentElement.removeEventListener("mouseleave", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [schedule, schedulePointer]);

  return {
    activeChapter,
    motionRef,
    pointerRef,
    registerChapter,
    viewportTier,
    visible,
    motionRootRef,
  };
}
