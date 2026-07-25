import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/** @typedef {"mobile" | "tablet" | "desktop"} ViewportTier */
/** @typedef {"interactive" | "reduced" | "save-data"} MotionMode */
/**
 * @typedef {object} JourneyReading
 * @property {string} id
 * @property {number} index
 * @property {HTMLElement} node
 * @property {number} progress
 * @property {number} enter
 * @property {number} exit
 * @property {number} distance
 */

/**
 * @typedef {object} JourneyPointer
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef {object} SpaceJourneyMotion
 * @property {string} activeSection
 * @property {string} previousSection
 * @property {number} activeIndex
 * @property {number} sectionProgress
 * @property {number} enterProgress
 * @property {number} exitProgress
 * @property {number} globalProgress
 * @property {MotionMode} motionMode
 */

/** @param {number} value */
const cssNumber = (value) => value.toFixed(4);

/** @param {number} value @param {number} min @param {number} max */
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/** @returns {ViewportTier} */
function readViewportTier() {
  if (typeof window === "undefined" || window.innerWidth >= 1100) return "desktop";
  return window.innerWidth < 768 ? "mobile" : "tablet";
}

/** @returns {MotionMode} */
function readMotionMode() {
  if (typeof window === "undefined") return "reduced";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "reduced";

  const connection =
    /** @type {Navigator & {connection?: {saveData?: boolean}}} */ (navigator).connection;
  return connection?.saveData ? "save-data" : "interactive";
}

/**
 * Couples native document scrolling to CSS scenery and the decorative astronaut
 * without putting per-frame values in React state. Each supplied section must
 * expose a matching DOM id.
 *
 * @param {readonly string[]} sectionIds
 */
export function useSpaceJourney(sectionIds) {
  const idsKey = sectionIds.join("\u0000");
  const stableIds = useMemo(() => (idsKey ? idsKey.split("\u0000") : []), [idsKey]);
  const rootRef = useRef(/** @type {HTMLDivElement | null} */ (null));
  const frameRef = useRef(/** @type {number | null} */ (null));
  const pointerFrameRef = useRef(/** @type {number | null} */ (null));
  const [viewportTier, setViewportTier] = useState(readViewportTier);
  const viewportTierRef = useRef(/** @type {ViewportTier} */ (viewportTier));
  const initialSection = stableIds[0] ?? "";
  const [activeSection, setActiveSection] = useState(initialSection);
  const [motionMode, setMotionMode] = useState(readMotionMode);
  const [documentVisible, setDocumentVisible] = useState(
    () => typeof document === "undefined" || document.visibilityState !== "hidden",
  );

  const pointerRef = useRef(
    /** @type {JourneyPointer} */ ({ x: 0, y: 0 }),
  );
  const motionRef = useRef(
    /** @type {SpaceJourneyMotion} */ ({
      activeSection: initialSection,
      previousSection: initialSection,
      activeIndex: 0,
      sectionProgress: 0,
      enterProgress: 0,
      exitProgress: 0,
      globalProgress: 0,
      motionMode: readMotionMode(),
    }),
  );

  const measure = useCallback(() => {
    frameRef.current = null;
    if (typeof window === "undefined") return;

    const root = rootRef.current;
    const viewportHeight = Math.max(1, window.innerHeight);
    const focusLine = viewportHeight * 0.48;
    const scrollableHeight = Math.max(
      1,
      document.documentElement.scrollHeight - viewportHeight,
    );
    const readings = /** @type {JourneyReading[]} */ ([]);

    // Read all layout first, then write CSS variables to avoid layout thrashing.
    for (const [index, id] of stableIds.entries()) {
      const node = document.getElementById(id);
      if (!node || (root && !root.contains(node))) continue;

      const rect = node.getBoundingClientRect();
      const progress = clamp(
        (viewportHeight - rect.top) / Math.max(1, viewportHeight + rect.height),
        0,
        1,
      );
      const containsFocus = rect.top <= focusLine && rect.bottom >= focusLine;
      readings.push({
        id,
        index,
        node,
        progress,
        enter: clamp(progress / 0.24, 0, 1),
        exit: clamp((progress - 0.76) / 0.24, 0, 1),
        distance: containsFocus
          ? 0
          : Math.abs(rect.top + rect.height / 2 - focusLine),
      });
    }

    let current = /** @type {JourneyReading | null} */ (null);
    for (const reading of readings) {
      if (current === null || reading.distance < current.distance) current = reading;
    }
    const motionMode = readMotionMode();
    const globalProgress = clamp(window.scrollY / scrollableHeight, 0, 1);
    const effectiveGlobalProgress =
      motionMode === "interactive" ? globalProgress : 0;
    const motion = motionRef.current;

    motion.globalProgress = effectiveGlobalProgress;
    motion.motionMode = motionMode;

    if (current) {
      if (motion.activeSection !== current.id) {
        motion.previousSection = motion.activeSection;
        motion.activeSection = current.id;
        setActiveSection(current.id);
      }
      motion.activeIndex = current.index;
      motion.sectionProgress = current.progress;
      motion.enterProgress = current.enter;
      motion.exitProgress = current.exit;
    }

    root?.style.setProperty(
      "--space-global-progress",
      cssNumber(effectiveGlobalProgress),
    );
    root?.style.setProperty(
      "--space-section-progress",
      cssNumber(motion.sectionProgress),
    );
    if (root) {
      root.dataset.activeSection = motion.activeSection;
      root.dataset.motionMode = motionMode;
    }

    const nextTier = readViewportTier();
    if (viewportTierRef.current !== nextTier) {
      viewportTierRef.current = nextTier;
      setViewportTier(nextTier);
    }
  }, [stableIds]);

  const scheduleMeasure = useCallback(() => {
    if (frameRef.current !== null || typeof window === "undefined") return;
    frameRef.current = window.requestAnimationFrame(measure);
  }, [measure]);

  const flushPointer = useCallback(() => {
    pointerFrameRef.current = null;
    const root = rootRef.current;
    root?.style.setProperty("--space-pointer-x", cssNumber(pointerRef.current.x));
    root?.style.setProperty("--space-pointer-y", cssNumber(pointerRef.current.y));
  }, []);

  const schedulePointer = useCallback(() => {
    if (pointerFrameRef.current !== null || typeof window === "undefined") return;
    pointerFrameRef.current = window.requestAnimationFrame(flushPointer);
  }, [flushPointer]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection =
      /** @type {Navigator & {connection?: EventTarget & {saveData?: boolean}}} */ (navigator)
        .connection;
    let pointerListenersAttached = false;

    const handleVisibility = () => {
      const nextVisible = document.visibilityState !== "hidden";
      setDocumentVisible(nextVisible);
      if (nextVisible) scheduleMeasure();
    };
    /** @param {PointerEvent} event */
    const handlePointerMove = (event) => {
      if (!window.matchMedia("(pointer: fine)").matches) return;
      pointerRef.current.x = clamp(
        (event.clientX / Math.max(1, window.innerWidth)) * 2 - 1,
        -1,
        1,
      );
      pointerRef.current.y = clamp(
        -((event.clientY / Math.max(1, window.innerHeight)) * 2 - 1),
        -1,
        1,
      );
      schedulePointer();
    };
    const resetPointer = () => {
      pointerRef.current.x = 0;
      pointerRef.current.y = 0;
      schedulePointer();
    };
    /** @param {boolean} enabled */
    const syncPointerListeners = (enabled) => {
      if (enabled === pointerListenersAttached) return;
      pointerListenersAttached = enabled;
      if (enabled) {
        window.addEventListener("pointermove", handlePointerMove, { passive: true });
        document.documentElement.addEventListener("mouseleave", resetPointer);
      } else {
        window.removeEventListener("pointermove", handlePointerMove);
        document.documentElement.removeEventListener("mouseleave", resetPointer);
        resetPointer();
      }
    };
    const handleMotionPreference = () => {
      const mode = readMotionMode();
      motionRef.current.motionMode = mode;
      setMotionMode(mode);
      if (rootRef.current) rootRef.current.dataset.motionMode = mode;
      syncPointerListeners(mode === "interactive");
      scheduleMeasure();
    };

    window.addEventListener("scroll", scheduleMeasure, { passive: true });
    window.addEventListener("resize", scheduleMeasure);
    document.addEventListener("visibilitychange", handleVisibility);
    reducedMotion.addEventListener?.("change", handleMotionPreference);
    connection?.addEventListener?.("change", handleMotionPreference);

    rootRef.current?.style.setProperty("--space-pointer-x", "0");
    rootRef.current?.style.setProperty("--space-pointer-y", "0");
    handleMotionPreference();
    scheduleMeasure();

    return () => {
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
      if (pointerFrameRef.current !== null) {
        window.cancelAnimationFrame(pointerFrameRef.current);
      }
      frameRef.current = null;
      pointerFrameRef.current = null;
      window.removeEventListener("scroll", scheduleMeasure);
      window.removeEventListener("resize", scheduleMeasure);
      syncPointerListeners(false);
      document.removeEventListener("visibilitychange", handleVisibility);
      reducedMotion.removeEventListener?.("change", handleMotionPreference);
      connection?.removeEventListener?.("change", handleMotionPreference);
    };
  }, [scheduleMeasure, schedulePointer, stableIds]);

  return {
    rootRef,
    motionRef,
    pointerRef,
    activeSection,
    viewportTier,
    documentVisible,
    motionMode,
  };
}

export default useSpaceJourney;
