import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export type MotionController = { setSuspended: (value: boolean) => void; destroy: () => void };

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
      const layers = all(".hero-layer");
      const planes = all(".hero-depth");
      const arrivals = all(".hero-arrival");
      const intro = gsap.timeline({ defaults: { duration: 0.9, ease: "power3.out" } });
      intro.fromTo(arrivals[0], { x: 38, y: -35, z: -150, rotationY: -14 }, { x: 0, y: 0, z: 0, rotationY: 0 }, 0)
        .fromTo(arrivals[1], { x: 8, y: 24, z: -45, rotationY: 5 }, { x: 0, y: 0, z: 0, rotationY: 0 }, 0)
        .fromTo(arrivals[2], { x: 55, y: 65, z: 110, rotationY: 16 }, { x: 0, y: 0, z: 0, rotationY: 0 }, 0.1);
      autoplay.push({ animation: intro, visible: true });
      gsap.to(layers, {
        y: (i) => [-28, -65, -120][i], ease: "none",
        scrollTrigger: { trigger: select(".hero"), start: "top top", end: "bottom top", scrub: true },
      });
      const pointerTweens: gsap.core.Tween[] = [];
      const pointer = planes.map((plane, index) => {
        gsap.set(plane, { rotationY: 0, rotationX: 0, x: 0, y: 0 });
        const options = { duration: 0.55, ease: "power3.out" };
        const setters = { x: gsap.quickTo(plane, "x", options), y: gsap.quickTo(plane, "y", options), rx: gsap.quickTo(plane, "rotationX", options), ry: gsap.quickTo(plane, "rotationY", options), depth: [5, 10, 18][index] };
        pointerTweens.push(setters.x.tween, setters.y.tween, setters.rx.tween, setters.ry.tween);
        return setters;
      });
      let heroBox: DOMRect | null = null;
      listen(hero, "pointerenter", () => { heroBox = hero.getBoundingClientRect(); });
      listen(hero, "pointermove", ((event: PointerEvent) => {
        if (suspended) return;
        heroBox ??= hero.getBoundingClientRect();
        const x = (event.clientX - heroBox.left) / heroBox.width - 0.5;
        const y = (event.clientY - heroBox.top) / heroBox.height - 0.5;
        pointer.forEach(p => { p.x(x * p.depth); p.y(y * p.depth); p.rx(-y * 6); p.ry(x * 9); });
      }) as EventListener);
      listen(hero, "pointerleave", () => { heroBox = null; pointer.forEach(p => { p.x(0); p.y(0); p.rx(0); p.ry(0); }); });
      listen(window, "scroll", () => { heroBox = null; });
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
        pointerTweens.push(xTo.tween, yTo.tween);
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
      const galleryTimeline = gsap.timeline({ onUpdate: draw, scrollTrigger: {
        id: "sol-gallery", trigger: gallery, pin: select(".gallery-pin"),
        start: () => `top ${document.querySelector(".site-header")!.getBoundingClientRect().height}px`,
        end: "+=1250", scrub: true, anticipatePin: 1,
        onRefresh: () => { spacing = Math.min(stage.clientWidth * 0.36, 435); draw(); },
      } });
      galleryTimeline.to(position, { value: frames.length - 1, duration: 1, ease: "none" });
      draw();
      const step = (direction: number) => {
        const target = Math.max(0, Math.min(frames.length - 1, active + direction));
        const trigger = galleryTimeline.scrollTrigger!;
        window.scrollTo({ top: trigger.start + target / (frames.length - 1) * (trigger.end - trigger.start), behavior: "instant" });
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
        ribbons.dataset.running = String(visible && !suspended);
        sync();
      }, { threshold: 0 });
      observer.observe(ribbons);
      cleanups.push(() => observer.disconnect());
      cleanups.push(() => {
        delete gallery.dataset.galleryReady;
        delete ribbons.dataset.running;
        frames.forEach(frame => { frame.removeAttribute("aria-hidden"); frame.inert = false; });
      });
      cleanups.push(() => pointerTweens.forEach(tween => tween.kill()));
      // Pause existing quickTo tweens too; new pointer events are gated above.
      cleanups.push(subscribeSuspension(() => pointerTweens.forEach(tween => tween.pause())));
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
      const ribbons = root.querySelector<HTMLElement>(".space-ribbons");
      if (ribbons) ribbons.dataset.running = String(!value && autoplay.some(item => item.visible && item.animation.repeat() === -1));
    },
    destroy() {
      // Reverting a scrubbed timeline can run its onUpdate one last time.
      // Restore ARIA/inert only after that final render has finished.
      context.revert();
      cleanups.reverse().forEach(cleanup => cleanup());
      delete document.documentElement.dataset.solMotion;
    },
  };
}
