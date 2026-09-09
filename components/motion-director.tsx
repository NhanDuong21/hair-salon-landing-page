"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { useSiteChrome } from "./booking";
import type { MotionController } from "./desktop-motion";

export const fullMotionQuery = "(min-width: 1100px) and (min-height: 650px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
let paused = false;
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
const snapshot = () => paused;
const serverSnapshot = () => false;

export function MotionToggle() {
  const isPaused = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  return <button className="motion-toggle" type="button" aria-pressed={isPaused}
    aria-label={isPaused ? "Tiếp tục chuyển động tự chạy" : "Tạm dừng chuyển động tự chạy"}
    onClick={() => { paused = !paused; listeners.forEach(listener => listener()); }}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      {isPaused ? <path d="m5 3 7 5-7 5V3Z" stroke="currentColor" strokeWidth="1.5" /> : <path d="M5 3v10M11 3v10" stroke="currentColor" strokeWidth="1.5" />}
    </svg>
    <span>{isPaused ? "Tiếp tục" : "Dừng tự chạy"}</span>
  </button>;
}

export function MotionDirector() {
  const { bookingOpen } = useSiteChrome();
  const controller = useRef<MotionController | null>(null);
  const booking = useRef(bookingOpen);
  useEffect(() => {
    booking.current = bookingOpen;
    controller.current?.setSuspended(paused || bookingOpen || document.hidden);
  }, [bookingOpen]);
  useEffect(() => {
    const media = matchMedia(fullMotionQuery);
    let disposed = false;
    let generation = 0;
    const sync = () => controller.current?.setSuspended(paused || booking.current || document.hidden);
    const setup = async () => {
      const current = ++generation;
      controller.current?.destroy();
      controller.current = null;
      if (!media.matches) return;
      try {
        const { mountDesktopMotion } = await import("./desktop-motion");
        if (disposed || current !== generation || !media.matches) return;
        const root = document.querySelector<HTMLElement>("main");
        if (root) controller.current = mountDesktopMotion(root, paused || booking.current || document.hidden);
      } catch (error) {
        // Server-rendered photos, captions, native overflow and booking survive.
        console.warn("Sol motion unavailable; keeping static photographs.", error);
      }
    };
    const unsubscribe = subscribe(sync);
    media.addEventListener("change", setup);
    document.addEventListener("visibilitychange", sync);
    void setup();
    return () => {
      disposed = true;
      generation++;
      controller.current?.destroy();
      controller.current = null;
      unsubscribe();
      media.removeEventListener("change", setup);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);
  return null;
}
