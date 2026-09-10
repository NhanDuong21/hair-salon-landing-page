# Sol desktop art direction — 2026-09-10

Implemented the three requested desktop scenes while retaining the accepted mobile layout, booking business logic, service content, brand, and demo limits. No commit, push or deployment.

## Implementation

- Hero: visible, stable main frame and immediate left CTA; the image inside it zooms by 2.5% while two face-on secondary frames drift vertically over separate 22s/18s round trips and opposite starting directions. The one-time vertical entrance completes in under one second. The hero has no pointer response or scroll-linked transform.
- Gallery: five photographs autoplay through horizontal movement, Y rotation and front/back depth in normal page flow. A 1.1s transition and ~3.2s hold move forward then backward without a wrap jump. Stable central caption, previous/next, count/progress and Skip remain. Offstage photographs have no focusable controls and are inert/ARIA-hidden.
- Space: two opposite 34s/41s vertical loops, restrained perspective and white-fading edges. Copy and booking CTA stay still; this section does not pin.
- Desktop motion starts automatically and the former header pause control is removed. Hero, gallery and ribbons stop offscreen and while booking is open; `visibilitychange` also suspends playback. Resume continues from the held playhead and does not replay the hero entrance.
- GSAP 3.15.0 is a conditional import; its production scene chunk is 118,739 bytes raw / 45,890 bytes gzip. Full motion requires ≥1100px wide, ≥650px tall, hover/fine pointer, and no reduced-motion preference.
- Seven new optimized WebP photographs total 311,566 bytes. All sources, photographer names, license links and crop settings are in `public/images/motion/sources.json`. Original eight images, including personnel, are unchanged. Only the five requested GSAP skills were installed under `.agents/skills/`; global configuration was not changed.

## Checks and evidence

Evidence is local in `evidence/art-direction/` (already ignored by this repository).

| Check | Result |
|---|---|
| Baseline before UI edits | Full page screenshots at 375, 430, 1280, 1440, 1920; `baseline.json` |
| Desktop 1280 / 1440 / 1920 × 900 | Three scenes captured; no horizontal overflow |
| Mobile touch emulation 375 / 430 × 900 | No motion controller, zero `/images/motion/` requests before/after scrolling |
| Tablet touch emulation 768 / 1280 × 900 | Lightweight version, no controller/pin or additional image requests |
| Mobile layout comparison | Section-height differences below 0.6px and accumulated top differences below 2px, attributable to browser subpixel rasterization; original layout structure/crops preserved |
| Booking | Opened in gallery and via mobile bar; service → default stylist/date → enabled time → review; explicit no-appointment-created message |
| Keyboard | Gallery Next, Tab to Skip, Enter, target focus; booking Escape and opener focus return |
| Gallery autoplay | With scroll and pointer idle, the active frame advanced from 01 to 02; Next moved to 03 and autoplay continued |
| Normal page flow | Live gallery height measured ~577px at 1186×698; its bottom met the next section top and the DOM contained zero pin spacers |
| Offscreen / booking suspension | Gallery transform samples remained identical offscreen and while booking was open, then changed again after close |
| Reduced motion mid-gallery | All five photos visible, non-inert, with inline transforms/visibility cleared |
| Repeated mobile → desktop resize | Zero inline frame transforms on mobile; the desktop controller and autoplay returned after re-entering the breakpoint |
| Motion import failure | Blocked the actual scene JS chunk through browser network tools; static five-photo gallery and booking remain usable |
| Hero pointer independence | With autoplay paused, rapid pointer moves across all three frames left every hero transform sample byte-identical; no hero pointer listener/tween remains |
| Hero idle motion | Main frame bounds stayed fixed while its image scale changed 1 → 1.025; back/front translated only on Y through 24px/20px ranges with 22s/18s round trips |
| Hero viewport / booking | Hero transform samples stayed identical offscreen and while booking was open, then continued from the held state without replaying the entrance |
| Header control removal | Header accessibility tree and DOM contain only the booking action; zero `.motion-toggle` elements remain |
| Skip after polish | Target receives focus and settles at ~104px below viewport top, clear of the sticky header |
| Automated checks | ESLint with zero warnings, TypeScript, production static build, all 9 booking tests pass |

The independent Impeccable review used `/root/design_critique` and `/root/technical_critique`. Assessment A finished before detector findings were released to the parent. Initial design score: **25/32**, with heuristics 7 and 9 not applicable to that assessment. CLI detector reported zero findings; live detector reported nine overlay groups, including inherited tiny labels and intentional clipped-caption false positives. No user-visible overlay is promised. Its temporary server and injected changes were removed.

Fixed from critique: reduced-motion visibility restoration; final ARIA/inert restoration after GSAP revert callbacks; hero pointer bounds after scroll; central gallery caption placement; translucent distant-photo overlaps; doubled desktop anchor offsets; small desktop hero photo label. Runtime measurement also caught small caption/counter width changes while styles change; both now reserve stable width. The confirmation round checked those fixes and the required viewport regressions.

## Measured performance and limits

Production local preview in the Codex Chromium browser, 1440×900, without CPU/network throttling: a recorded navigation had **CLS 0**, **LCP 244ms**, and one **85ms** long task during loading. A later pass detected CLS ~0.002 associated with changing caption/counter widths and programmatic repositioning; widths were fixed. The earlier 3-second gallery-scroll timing in `browser-qa.json` predates the autonomous gallery and is retained only as historical evidence. Current live checks verified idle advancement, normal-flow section geometry, manual Next, booking/offscreen suspension, reduced motion, mobile cleanup and zero runtime warnings/errors; they do not claim compositor FPS.

**Not verified:** Safari/Firefox, physical iPhone/Android/tablet hardware, low-end GPU/CPU or constrained network. A real hidden-tab transition could not be induced: opening/foregrounding another in-app tab still reported `document.visibilityState === 'visible'`. The visibility listener is implemented and source-reviewed, but a true browser-hidden transition remains a manual check.

## Deliverables

- `evidence/hero-motion-refine/sol-hero-standby-pointer.mp4`: 24.6-second browser recording of the refined hero with the page configured at 1440×900, including its one-time arrival, long idle drift/zoom and five rapid pointer moves across the composition. The host-native 1426×660 capture uses 71 timestamped browser frames; the recording is evidence of behavior, not a frame-rate claim.
- `sol-desktop-motion.mp4`: earlier ~28-second art-direction recording of the gallery and ribbons; its hero segment predates this refinement and is retained only as historical evidence.
- `final-hero-{1280,1440,1920}.png`, `final-gallery-{1280,1440,1920}.png`, `final-space-{1280,1440,1920}.png`.
- `final-mobile-{hero,gallery,space}-{375,430}.png`, `final-mobile-booking-430.png`.
- `mobile-comparison-{375,430}.png`: baseline and final mobile hero side by side.
- `browser-qa.json`, `assessment-a.md`, `assessment-b.md`, and the initial/final video frame records.

Early raw-CDP PNGs cropped the right edge at host display scaling; use the `final-*` native screenshot captures for handoff. Final screenshots wait for two animation frames after positioning. All temporary network blocks, media emulation, and viewport overrides are cleared after testing.
