import { useCallback, useEffect, useRef, useState } from "react";

/** @typedef {import('../data/types.js').ChapterId} ChapterId */
/** @typedef {import('../data/types.js').ChapterMotionState} ChapterMotionState */
/** @typedef {import('../data/types.js').ArtworkPointer} ArtworkPointer */
/** @typedef {import('../data/types.js').MotionMode} MotionMode */

export const CHAPTER_IDS = /** @type {const} */ (["home", "work", "practice", "project-kyber", "tremor-track", "experience", "about", "contact"]);

/** @param {number} value @param {number} min @param {number} max */
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
/** @param {number} value */
const cssNumber = (value) => value.toFixed(4);

/** @returns {'mobile' | 'tablet' | 'desktop'} */
function getViewportTier() {
  if (typeof window === "undefined" || window.innerWidth >= 1100) return "desktop";
  return window.innerWidth < 768 ? "mobile" : "tablet";
}

/** @returns {MotionMode} */
function getMotionMode() {
  if (typeof window === "undefined") return "static";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "reduced";
  const connection = /** @type {Navigator & {connection?: {saveData?: boolean}}} */ (navigator).connection;
  return connection?.saveData ? "save-data" : "interactive";
}

/**
 * Publishes normalized chapter progress directly to CSS custom properties.
 * React state changes only for rare chapter, viewport, visibility, and motion
 * mode changes; scroll and pointer frames remain ref-driven.
 */
export function useChapterMotion() {
  const motionRootRef = useRef(/** @type {HTMLElement | null} */ (null));
  const chapterNodesRef = useRef(/** @type {Map<ChapterId, HTMLElement>} */ (new Map()));
  const chapterCallbacksRef = useRef(/** @type {Map<ChapterId, (node: HTMLElement | null) => void>} */ (new Map()));
  const frameRef = useRef(/** @type {number | null} */ (null));
  const pointerFrameRef = useRef(/** @type {number | null} */ (null));
  const impulseTimerRef = useRef(/** @type {number | null} */ (null));
  const initialTier = getViewportTier();
  const viewportTierRef = useRef(initialTier);
  const [activeChapter, setActiveChapter] = useState(/** @type {ChapterId} */ ("home"));
  const [viewportTier, setViewportTier] = useState(initialTier);
  const [motionMode, setMotionMode] = useState(getMotionMode);
  const [visible, setVisible] = useState(() => typeof document === "undefined" || document.visibilityState !== "hidden");

  const pointerRef = useRef(/** @type {ArtworkPointer} */ ({ x: 0, y: 0, impulse: 0 }));
  const motionRef = useRef(/** @type {ChapterMotionState} */ ({ activeChapter: "home", previousChapter: "home", progress: 0, enter: 0, exit: 0, transitionProgress: 0, globalProgress: 0 }));

  const updateFrame = useCallback(() => {
    frameRef.current = null;
    const viewportHeight = Math.max(1, window.innerHeight);
    const focalY = viewportHeight * 0.5;
    const scrollableHeight = Math.max(1, document.documentElement.scrollHeight - viewportHeight);
    const nextTier = getViewportTier();
    const root = motionRootRef.current;
    const measurements = /** @type {Array<{id: ChapterId, node: HTMLElement, rect: DOMRect}>} */ ([]);
    const readings = /** @type {Array<{id: ChapterId, progress: number, enter: number, exit: number, transition: number, distance: number}>} */ ([]);

    for (const id of CHAPTER_IDS) {
      const node = chapterNodesRef.current.get(id);
      if (node) measurements.push({ id, node, rect: node.getBoundingClientRect() });
    }

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

    const current = readings.reduce((closest, reading) => closest === null || reading.distance < closest.distance ? reading : closest, /** @type {(typeof readings)[number] | null} */ (null));
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
      nextState.globalProgress = clamp(window.scrollY / scrollableHeight, 0, 1);
      root?.setAttribute("data-active-chapter", current.id);
      root?.style.setProperty("--global-progress", cssNumber(nextState.globalProgress));
      root?.style.setProperty("--transition-progress", cssNumber(current.transition));
    }

    if (root) root.dataset.motionMode = motionMode;
    if (viewportTierRef.current !== nextTier) {
      viewportTierRef.current = nextTier;
      setViewportTier(nextTier);
    }
  }, [motionMode]);

  const schedule = useCallback(() => {
    if (frameRef.current === null) frameRef.current = window.requestAnimationFrame(updateFrame);
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
    if (pointerFrameRef.current === null) pointerFrameRef.current = window.requestAnimationFrame(updatePointerFrame);
  }, [updatePointerFrame]);

  const registerChapter = useCallback((/** @type {ChapterId} */ id) => {
    const existing = chapterCallbacksRef.current.get(id);
    if (existing) return existing;
    const callback = (/** @type {HTMLElement | null} */ node) => {
      if (node) {
        chapterNodesRef.current.set(id, node);
        node.style.setProperty("--chapter-progress", "0");
        node.style.setProperty("--chapter-enter", "1");
        node.style.setProperty("--chapter-exit", "0");
        node.style.setProperty("--chapter-transition", "0");
        if (typeof window !== "undefined") schedule();
      } else chapterNodesRef.current.delete(id);
    };
    chapterCallbacksRef.current.set(id, callback);
    return callback;
  }, [schedule]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = /** @type {Navigator & {connection?: {saveData?: boolean, addEventListener?: Function, removeEventListener?: Function}}} */ (navigator).connection;
    const updateMode = () => setMotionMode(getMotionMode());
    media.addEventListener?.("change", updateMode);
    connection?.addEventListener?.("change", updateMode);
    return () => {
      media.removeEventListener?.("change", updateMode);
      connection?.removeEventListener?.("change", updateMode);
    };
  }, []);

  useEffect(() => {
    const handleVisibility = () => { const nextVisible = document.visibilityState !== "hidden"; setVisible(nextVisible); if (nextVisible) schedule(); };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", handleVisibility);

    const root = motionRootRef.current;
    if (root) {
      root.dataset.motionMode = motionMode;
      root.setAttribute("data-active-chapter", "home");
      root.style.setProperty("--global-progress", "0");
      root.style.setProperty("--transition-progress", "0");
      root.style.setProperty("--pointer-x", "0");
      root.style.setProperty("--pointer-y", "0");
      root.style.setProperty("--pointer-impulse", "0");
    }

    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    if (root) observer?.observe(root);
    for (const node of chapterNodesRef.current.values()) observer?.observe(node);
    let active = true;
    document.fonts?.ready?.then(() => { if (active) schedule(); });
    schedule();

    return () => {
      active = false;
      observer?.disconnect();
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [motionMode, schedule]);

  useEffect(() => {
    const root = motionRootRef.current;
    if (motionMode !== "interactive") {
      pointerRef.current = { x: 0, y: 0, impulse: 0 };
      root?.style.setProperty("--pointer-x", "0");
      root?.style.setProperty("--pointer-y", "0");
      root?.style.setProperty("--pointer-impulse", "0");
      return undefined;
    }

    const handlePointerMove = (/** @type {PointerEvent} */ event) => {
      if (!window.matchMedia("(pointer: fine)").matches) return;
      pointerRef.current.x = clamp((event.clientX / Math.max(1, window.innerWidth)) * 2 - 1, -1, 1);
      pointerRef.current.y = clamp(-((event.clientY / Math.max(1, window.innerHeight)) * 2 - 1), -1, 1);
      schedulePointer();
    };
    const handlePointerDown = (/** @type {PointerEvent} */ event) => {
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
    const handlePointerLeave = () => { pointerRef.current.x = 0; pointerRef.current.y = 0; schedulePointer(); };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    document.documentElement.addEventListener("mouseleave", handlePointerLeave);
    return () => {
      if (pointerFrameRef.current !== null) window.cancelAnimationFrame(pointerFrameRef.current);
      if (impulseTimerRef.current !== null) window.clearInterval(impulseTimerRef.current);
      pointerFrameRef.current = null;
      impulseTimerRef.current = null;
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      document.documentElement.removeEventListener("mouseleave", handlePointerLeave);
    };
  }, [motionMode, schedulePointer]);

  return { activeChapter, motionMode, motionRef, pointerRef, registerChapter, viewportTier, visible, motionRootRef };
}
