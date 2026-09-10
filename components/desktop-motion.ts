import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export type MotionController = { setSuspended: (value: boolean) => void; destroy: () => void };

let heroIntroHasStarted = false;

/** Loaded only for wide screens with a fine pointer and no reduced-motion preference. */
export function mountDesktopMotion(root: HTMLElement, initiallySuspended: boolean): MotionController {
  gsap.registerPlugin(ScrollTrigger);
  const select = <T extends HTMLElement>(selector: string) => root.querySelector<T>(selector)!;
  const all = <T extends HTMLElement>(selector: string) => Array.from(root.querySelectorAll<T>(selector));
  const cleanups: (() => void)[] = [];
  const autoplay: { animation: gsap.core.Animation; visible: boolean }[] = [];
  const suspensionListeners = new Set<() => void>();
  let suspended = initiallySuspended;
  const listen = (element: EventTarget, type: string, callback: EventListener) => {
    element.addEventListener(type, callback, { passive: true });
    cleanups.push(() => element.removeEventListener(type, callback));
  };
  const sync = () => autoplay.forEach(item => item.animation.paused(suspended || !item.visible));
  const context = gsap.context(() => {}, root);
  try {
    context.add(() => {
      const hero = select(".hero-scene");
      const backArrival = select(".hero-layer-back .hero-arrival");
      const mainArrival = select(".hero-layer-main .hero-arrival");
      const frontArrival = select(".hero-layer-front .hero-arrival");
      const backDepth = select(".hero-layer-back .hero-depth");
      const frontDepth = select(".hero-layer-front .hero-depth");
      const mainImage = select<HTMLImageElement>(".hero-layer-main img");
      const heroLoops = [
        gsap.fromTo(mainImage, { scale: 1 }, { scale: 1.025, duration: 12, repeat: -1, yoyo: true, ease: "sine.inOut", paused: true }),
        gsap.fromTo(backDepth, { y: -12 }, { y: 12, duration: 11, repeat: -1, yoyo: true, ease: "sine.inOut", paused: true }).progress(0.5),
        gsap.fromTo(frontDepth, { y: 10 }, { y: -10, duration: 9, repeat: -1, yoyo: true, ease: "sine.inOut", paused: true }).progress(0.5),
      ];
      const heroLoopItems = heroLoops.map(animation => ({ animation, visible: false }));
      autoplay.push(...heroLoopItems);
      const heroRect = hero.getBoundingClientRect();
      let heroVisible = heroRect.bottom > 0 && heroRect.top < window.innerHeight;
      let introDone = heroIntroHasStarted;
      let introItem: { animation: gsap.core.Animation; visible: boolean } | null = null;
      if (!heroIntroHasStarted) {
        const intro = gsap.timeline({
          paused: true,
          defaults: { ease: "power3.out" },
          onStart: () => { heroIntroHasStarted = true; },
          onComplete: () => {
            introDone = true;
            if (introItem) introItem.visible = false;
            heroLoopItems.forEach(item => { item.visible = heroVisible; });
            sync();
          },
        });
        intro.fromTo(mainArrival, { y: 18 }, { y: 0, duration: 0.82 }, 0)
          .fromTo(backArrival, { y: -24 }, { y: 0, duration: 0.9 }, 0.02)
          .fromTo(frontArrival, { y: 22 }, { y: 0, duration: 0.86 }, 0.1);
        introItem = { animation: intro, visible: heroVisible };
        autoplay.push(introItem);
      } else {
        heroLoopItems.forEach(item => { item.visible = heroVisible; });
      }
      const heroObserver = new IntersectionObserver(([entry]) => {
        heroVisible = entry.isIntersecting;
        if (introItem && !introDone) introItem.visible = heroVisible;
        heroLoopItems.forEach(item => { item.visible = introDone && heroVisible; });
        hero.dataset.visible = String(heroVisible);
        hero.dataset.running = String(heroVisible && !suspended);
        sync();
      }, { threshold: 0 });
      heroObserver.observe(hero);
      cleanups.push(() => heroObserver.disconnect());
      cleanups.push(() => { delete hero.dataset.visible; delete hero.dataset.running; });

      const teamPointerTweens: gsap.core.Tween[] = [];
      // Portraits move independently; adjacent names and selection buttons never move.
      all(".team-photo").forEach((photo, index) => {
        const entrance = gsap.fromTo(photo, { y: [24, 42, 16][index], rotationX: [4, -3, 3][index], opacity: 0.85 }, { y: 0, rotationX: 0, opacity: 1, duration: 0.7, paused: true, ease: "power3.out" });
        const item = { animation: entrance, visible: false };
        autoplay.push(item);
        ScrollTrigger.create({ trigger: photo, start: "top 92%", end: "bottom top", onToggle: self => { item.visible = self.isActive; sync(); } });
        const img = photo.querySelector("img")!;
        gsap.set(img, { scale: 1.035, x: 0, y: 0 });
        const xTo = gsap.quickTo(img, "x", { duration: 0.45, ease: "power3.out" });
        const yTo = gsap.quickTo(img, "y", { duration: 0.45, ease: "power3.out" });
        teamPointerTweens.push(xTo.tween, yTo.tween);
        let box: DOMRect | null = null;
        listen(photo, "pointerenter", () => { box = photo.getBoundingClientRect(); });
        listen(photo, "pointermove", ((event: PointerEvent) => {
          if (suspended || !box) return;
          xTo(((event.clientX - box.left) / box.width - 0.5) * 9);
          yTo(((event.clientY - box.top) / box.height - 0.5) * 9);
        }) as EventListener);
        listen(photo, "pointerleave", () => { xTo(0); yTo(0); box = null; });
      });

      const gallery = select(".inspiration-section");
      const stage = select(".gallery-stage");
      const frames = all(".gallery-frame");
      const title = select("[data-gallery-title]");
      const detail = select("[data-gallery-detail]");
      const counter = select("[data-gallery-index]");
      const previous = select<HTMLButtonElement>(".gallery-previous");
      const next = select<HTMLButtonElement>(".gallery-next");
      const progress = select(".gallery-progress span");
      gallery.dataset.galleryReady = "true";
      let active = -1;
      let spacing = Math.min(stage.clientWidth * 0.36, 435);
      frames.forEach(frame => gsap.set(frame, { xPercent: -50, yPercent: -50, x: 0, y: 0, z: 0, rotationY: 0, rotation: 0, opacity: 1, visibility: "visible" }));
      const setters = frames.map(frame => gsap.quickSetter(frame, "css"));
      gsap.set(progress, { scaleX: 0.2, transformOrigin: "left center" });
      const setProgress = gsap.quickSetter(progress, "scaleX");
      const position = { value: 0 };
      const draw = () => {
        setters.forEach((set, i) => {
          const distance = i - position.value;
          const magnitude = Math.abs(distance);
          set({ x: distance * spacing * (1 + 0.16 * distance * distance), y: magnitude * magnitude * 26 - 5,
            z: -175 * distance * distance - (distance < 0 ? magnitude * 60 : 0),
            rotationY: -distance * 27, rotation: distance * 2,
            opacity: 1,
            visibility: magnitude > 1.9 ? "hidden" : "visible",
          });
        });
        setProgress((position.value + 1) / frames.length);
        const index = Math.round(position.value);
        if (index === active) return;
        active = index;
        title.textContent = frames[index].dataset.title!;
        detail.textContent = frames[index].dataset.detail!;
        counter.textContent = String(index + 1).padStart(2, "0");
        previous.setAttribute("aria-disabled", String(index === 0));
        next.setAttribute("aria-disabled", String(index === frames.length - 1));
        frames.forEach((frame, i) => {
          frame.setAttribute("aria-hidden", String(i !== index));
          frame.inert = i !== index;
        });
      };
      const slideTimes = [0];
      const galleryTimeline = gsap.timeline({ paused: true, repeat: -1, yoyo: true, onUpdate: draw });
      const dwell = 3.2;
      galleryTimeline.to(position, { value: 0, duration: dwell / 2, ease: "none" });
      for (let index = 1; index < frames.length; index++) {
        galleryTimeline.to(position, { value: index, duration: 1.1, ease: "power3.inOut" });
        slideTimes[index] = galleryTimeline.duration();
        galleryTimeline.to(position, { value: index, duration: index === frames.length - 1 ? dwell / 2 : dwell, ease: "none" });
      }
      const galleryItem = { animation: galleryTimeline, visible: false };
      autoplay.push(galleryItem);
      const galleryRect = gallery.getBoundingClientRect();
      let galleryVisible = galleryRect.bottom > 0 && galleryRect.top < window.innerHeight;
      galleryItem.visible = galleryVisible;
      gallery.dataset.visible = String(galleryVisible);
      const galleryObserver = new IntersectionObserver(([entry]) => {
        galleryVisible = entry.isIntersecting;
        galleryItem.visible = galleryVisible;
        gallery.dataset.visible = String(galleryVisible);
        gallery.dataset.running = String(galleryVisible && !suspended);
        sync();
      }, { threshold: 0 });
      galleryObserver.observe(gallery);
      const galleryResizeObserver = new ResizeObserver(() => {
        spacing = Math.min(stage.clientWidth * 0.36, 435);
        draw();
      });
      galleryResizeObserver.observe(stage);
      cleanups.push(() => galleryObserver.disconnect());
      cleanups.push(() => galleryResizeObserver.disconnect());
      draw();
      const step = (direction: number) => {
        const target = Math.max(0, Math.min(frames.length - 1, active + direction));
        if (target === active) return;
        galleryTimeline.pause().totalTime(slideTimes[target], false);
        if (!suspended && galleryVisible) galleryTimeline.play();
      };
      listen(previous, "click", () => step(-1));
      listen(next, "click", () => step(1));
      const skip = select<HTMLAnchorElement>(".gallery-skip");
      // Native anchor scrolling remains available if JS fails; focus follows it.
      listen(skip, "click", () => { select("#khong-gian").focus({ preventScroll: true }); });

      const ribbons = select(".space-ribbons");
      const loops = all(".ribbon-track").map((track, index) => gsap.fromTo(track,
        { yPercent: index === 0 ? 0 : -100 / 3 },
        { yPercent: index === 0 ? -100 / 3 : 0, duration: index === 0 ? 34 : 41, repeat: -1, ease: "none", paused: true },
      ));
      const loopItems = loops.map(animation => ({ animation, visible: false }));
      autoplay.push(...loopItems);
      const observer = new IntersectionObserver(entries => {
        const visible = entries[0].isIntersecting;
        loopItems.forEach(item => { item.visible = visible; });
        ribbons.dataset.visible = String(visible);
        ribbons.dataset.running = String(visible && !suspended);
        sync();
      }, { threshold: 0 });
      observer.observe(ribbons);
      cleanups.push(() => observer.disconnect());
      cleanups.push(() => {
        delete gallery.dataset.galleryReady;
        delete gallery.dataset.visible;
        delete gallery.dataset.running;
        delete ribbons.dataset.visible;
        delete ribbons.dataset.running;
        frames.forEach(frame => { frame.removeAttribute("aria-hidden"); frame.inert = false; });
      });
      cleanups.push(() => teamPointerTweens.forEach(tween => tween.kill()));
      // Pause existing quickTo tweens too; new pointer events are gated above.
      cleanups.push(subscribeSuspension(() => teamPointerTweens.forEach(tween => tween.pause())));
      document.documentElement.dataset.solMotion = "ready";
      sync();
    });
  } catch (error) {
    context.revert();
    cleanups.reverse().forEach(cleanup => cleanup());
    root.querySelector(".inspiration-section")?.removeAttribute("data-gallery-ready");
    throw error;
  }
  function subscribeSuspension(listener: () => void) {
    suspensionListeners.add(listener);
    return () => { suspensionListeners.delete(listener); };
  }
  return {
    setSuspended(value) {
      suspended = value;
      if (value) suspensionListeners.forEach(listener => listener());
      sync();
      const hero = root.querySelector<HTMLElement>(".hero-scene");
      if (hero) hero.dataset.running = String(!value && hero.dataset.visible === "true");
      const ribbons = root.querySelector<HTMLElement>(".space-ribbons");
      if (ribbons) ribbons.dataset.running = String(!value && ribbons.dataset.visible === "true");
      const gallery = root.querySelector<HTMLElement>(".inspiration-section");
      if (gallery) gallery.dataset.running = String(!value && gallery.dataset.visible === "true");
    },
    destroy() {
      // Reverting an active timeline can run its onUpdate one last time.
      // Restore ARIA/inert only after that final render has finished.
      context.revert();
      cleanups.reverse().forEach(cleanup => cleanup());
      delete document.documentElement.dataset.solMotion;
    },
  };
}
