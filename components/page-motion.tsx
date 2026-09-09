"use client";

import { useEffect } from "react";

/** Keep keyboard focus clear of the actual sticky surfaces, at any zoom. */
export function keepFocusVisible(target: EventTarget | null) {
  if (!(target instanceof HTMLElement) || !target.matches(":focus-visible")) return;
  if (target.closest("dialog, .site-header, .mobile-booking-bar")) return;
  const box = target.getBoundingClientRect();
  const header = document.querySelector(".site-header")?.getBoundingClientRect();
  const bar = document.querySelector('.mobile-booking-bar[data-visible="true"]');
  const barBox = bar?.getBoundingClientRect();
  const bottom = barBox && barBox.height > 0 ? barBox.top : window.innerHeight;
  if (box.top < (header?.bottom ?? 0) + 12 || box.bottom > bottom - 12) {
    target.scrollIntoView({ block: "center", behavior: "instant" });
  }
}

export function PageMotion() {
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const element = entry.target as HTMLElement;
        observer.unobserve(element);
        element.dataset.revealed = "true";
        if (media.matches) continue;
        const animation = element.animate(
          [{ opacity: 0.78, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }],
          { duration: 380, delay: Number(element.dataset.reveal) * 35, easing: "cubic-bezier(.16,1,.3,1)" },
        );
        animations.add(animation);
        void animation.finished.then(() => animations.delete(animation)).catch(() => {});
      }
    }, { threshold: 0.12 });
    document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
    const reduce = () => { if (media.matches) animations.forEach((animation) => animation.cancel()); };
    const focus = (event: FocusEvent) => keepFocusVisible(event.target);
    media.addEventListener("change", reduce);
    document.addEventListener("focusin", focus);
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      media.removeEventListener("change", reduce);
      document.removeEventListener("focusin", focus);
    };
  }, []);
  return null;
}
