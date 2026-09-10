"use client";

import { useEffect, useRef } from "react";
import { useSiteChrome } from "./booking";
import type { MotionController } from "./desktop-motion";

export const fullMotionQuery = "(min-width: 1100px) and (min-height: 650px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

export function MotionDirector() {
  const { bookingOpen } = useSiteChrome();
  const controller = useRef<MotionController | null>(null);
  const booking = useRef(bookingOpen);
  useEffect(() => {
    booking.current = bookingOpen;
    controller.current?.setSuspended(bookingOpen || document.hidden);
  }, [bookingOpen]);
  useEffect(() => {
    const media = matchMedia(fullMotionQuery);
    let disposed = false;
    let generation = 0;
    const sync = () => controller.current?.setSuspended(booking.current || document.hidden);
    const setup = async () => {
      const current = ++generation;
      controller.current?.destroy();
      controller.current = null;
      if (!media.matches) return;
      try {
        const { mountDesktopMotion } = await import("./desktop-motion");
        if (disposed || current !== generation || !media.matches) return;
        const root = document.querySelector<HTMLElement>("main");
        if (root) controller.current = mountDesktopMotion(root, booking.current || document.hidden);
      } catch (error) {
        // Server-rendered photos, captions, native overflow and booking survive.
        console.warn("Sol motion unavailable; keeping static photographs.", error);
      }
    };
    media.addEventListener("change", setup);
    document.addEventListener("visibilitychange", sync);
    void setup();
    return () => {
      disposed = true;
      generation++;
      controller.current?.destroy();
      controller.current = null;
      media.removeEventListener("change", setup);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);
  return null;
}
