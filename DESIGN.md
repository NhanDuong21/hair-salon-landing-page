---
name: Sol. Hair Studio
description: A calm Vietnamese salon concept in white, green and dark ink.
colors:
  paper: "#fff"
  soft: "#f6f7f5"
  ink: "#202622"
  muted: "#626a63"
  accent: "#2f6b57"
  accent-hover: "#235341"
  line: "#dde2dc"
  selected: "#edf4ef"
  row-hover: "#edf2ed"
  text-selection-bg: "#d6e8dc"
  text-selection-ink: "#173f30"
typography:
  display:
    fontFamily: "Noto Serif, serif"
    fontSize: "clamp(44px, 4.4vw, 62px)"
    fontWeight: 400
    lineHeight: 1.17
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Noto Serif, serif"
    fontSize: "clamp(32px, 3.05vw, 44px)"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Be Vietnam Pro, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "Be Vietnam Pro, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.5
rounded:
  image: "4px"
  control: "6px"
  dialog: "12px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "20px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "13px 23px"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
  icon-button:
    rounded: "{rounded.control}"
    size: "44px"
  service-option:
    rounded: "{rounded.control}"
    padding: "14px 15px"
  choice-selected:
    backgroundColor: "{colors.selected}"
    rounded: "{rounded.control}"
    padding: "10px"
---

# Design System: Sol. Hair Studio

## Overview

**Creative North Star: "Salon consultation lookbook"**

White space, restrained green and Vietnamese serif headlines give the salon an approachable, unhurried character. Flat controls and aligned service information keep decisions clear beside the photography.

The approved Sol identity stays consistent through warmer, closely framed stock photographs, direct functional headings and concise concept disclosures. Green italic emphasis carries the hero and space invitation; service, team, visit and booking headings tell visitors what they can find or do.

**Key Characteristics:**

- White and soft neutral surfaces with dark ink.
- Serif headlines paired with compact, readable sans text.
- Quiet dividers, restrained curves and visible control states.

## Colors

### Primary

**accent** is the muted salon green for booking actions, selected borders and limited italic emphasis; **accent-hover** deepens primary buttons on hover. **selected** is the pale green radio-selection surface. **row-hover** is the quieter tint shared by service-row hover and keyboard focus within the row. Text selection uses **text-selection-bg** and **text-selection-ink**; it is distinct from a selected booking choice.

### Neutral

**paper** is the main background; **soft** separates sections and notices. **ink** carries headings and decision data, **muted** supports descriptions, and **line** separates rows and surfaces. The frontmatter records the effective source values from `app/globals.css`, including its later responsive and readability overrides.

## Typography

Noto Serif supplies headings, the Sol wordmark and italic emphasis; Be Vietnam Pro supplies body copy, prices and controls. Both include Vietnamese glyphs. Headings remain regular weight; prices use tabular numerals.

- **Display:** the frontmatter desktop hero scale becomes 44px below 900px, then `clamp(43px, 10.5vw, 56px)` with 1.16 line-height below 768px.
- **Headline:** section headings use the frontmatter scale and become 32px below 768px. The final invitation uses 32px desktop and 30px mobile; booking headings use 29px desktop and 25px mobile.
- **Body and decisions:** page body is 14px; mobile descriptive copy and FAQ text use 13px. Service descriptions, duration and selection actions stay 14px, with 15px prices. Team roles and selection actions use 14px desktop and 13px mobile; team descriptions use 12px.
- **Labels and disclosures:** primary actions use 13px, with 12px mobile dialog actions. Illustration notices, pricing caveats and booking disclaimers use 12px. Gallery captions sit below images; mobile titles use 14px and supporting captions 12px. Booking option names/prices use 13px desktop and 12px mobile.

**The Readable Disclosure Rule.** Keep illustration notices, pricing caveats and booking disclaimers at least 12px. Service descriptions, duration and selection actions stay 14px, with 15px prices. Small ornamental brand labels are not a body-text scale.

## Layout

The desktop container caps at 1200px with at least 56px side space; at 1100px and below it uses 36px, and below 768px it uses 20px. Main section padding steps from 96px to 72px below 900px and 56px below 768px. The visit section is deliberately shorter: 64px on desktop, 72px at tablet widths and 44px on mobile; the final invitation uses 56px desktop and 40px mobile.

Desktop uses paired image/text columns, a three-column team and a staggered three-column inspiration gallery. The six service rows preserve aligned description, duration, price and selection columns. Below 768px the hero, space and visit sections stack; the hero action precedes the image, service descriptions occupy their own row, and duration, price and selection remain together. The gallery becomes one full-width bob image above two equal-width images, with every caption beneath its image. Below 600px team members become portrait/text rows. Mobile captions wrap rather than shrink.

Photography keeps the client's hair and styling gesture prominent in the hero, gives the three stock portraits similar head-and-shoulders distance and warm neutral light, and uses a bright washing-chair corner for the space image. Use the exported WebP framing and responsive object positions recorded in `public/images/refine-assets.json`: hero 50% 60% desktop / 48% 57% mobile; space 50% 50% / 52% 50%; An 50% 30% / 58% 15%; Linh 50% 40% / 48% 28%; Minh 50% 10% / 50% 5%. These positions refer to the cropped exports. The three hairstyle reference images remain the approved set; no blanket color filter is applied.

## Elevation & Depth

Page surfaces stay flat, separated by neutral fills and fine rules. Only the booking dialog has a soft shadow (`0 24px 100px #14231b33`) and dark translucent backdrop (`#18282088`). Service rows remain stationary while their background tints. Motion uses CSS and native Web Animations without a new motion dependency, persistent loops or hidden-by-default page content.

## Shapes

Images use small corners, with a single larger curved corner on the hero (100px upper left; 75px mobile) and space photograph (80px upper right; 60px mobile). Controls use the shared control radius. The desktop dialog is rounded; below 768px it becomes a bottom sheet with 14px upper corners and safe-area padding. Fine rules and native radio circles carry structure without extra card decoration.

## Components

- **Buttons:** solid green primary action, green text actions and transparent icon controls. Primary buttons have a 48px minimum height; compact header, mobile-bar, service, team and icon controls retain 44px targets. Hover deepens or tints the surface. Primary color transitions take 150ms; control transforms and choice/row feedback take 160ms. Fine-pointer hover moves action arrows 3px, and press feedback scales controls to .98. Visible focus uses a 2px green outline with a 5px offset.
- **Navigation and mobile booking:** white sticky header with a fine bottom rule; desktop links underline on hover. Below 900px the header shows the Sol logo and accessible menu toggle, with its booking button hidden. The fixed booking bar appears only after the hero booking button has left the top viewing area. It hides when the final invitation approaches, the menu opens or the dialog opens, and hidden controls are inert. Its entrance takes 220ms with a 160ms fade and safe-area padding. Escape closes the menu and returns focus; choosing a link focuses its destination.
- **Service and time choices:** native radio inputs in bordered labels; selected choices have pale green fill and a green border. Focus outlines the full label at a 3px offset. Unavailable times are disabled, muted and struck through, with a text explanation. The page service table retains six rows with price and duration always visible; hover/focus tint does not move the row.
- **Photography:** the hero settles from scale 1.02 to 1 over 650ms while text and CTA stay immediately readable. Its image label fades from .75 opacity over 300ms. Only the three team portraits and three gallery figures reveal on scroll: once each, 380ms from .78 opacity and 10px below, with 35ms stagger steps. The default source state is visible.
- **Booking:** one native modal dialog shares the page's service and stylist presets. Its three steps retain selections when going back; changing service, person or date clears the time. Reopening starts a fresh session with only the new entry button's preset. Each step focuses its heading. The frame keeps a consistent height capped at 850px and the viewport minus 48px (12px on mobile); the content scrolls independently between the fixed header/progress and footer. Date choices always place the weekday above DD/MM. The review shows the estimated start–end time and keeps “Từ” for starting prices. The dialog enters over 240ms, closes over 160ms and changes steps over 180ms. The inert background, explicit Tab boundary and Escape/backdrop/close actions preserve keyboard context. Opener focus returns after the dialog closes and the page/bar become interactive again; focused page controls are kept clear of sticky surfaces. The final screen visibly says no appointment was created.
- **FAQ:** native details/summary rows use fine separators and a plus/minus indicator. Browsers supporting `interpolate-size: allow-keywords` animate answer block size over 240ms and opacity over 180ms; native instant disclosure remains the fallback.
- **Reduced motion:** remove the hero settle, photo reveals, arrow/press transforms, dialog/step entrance and FAQ animation; use automatic scrolling. The mobile bar and dialog close retain brief 80ms opacity feedback. Color, selected, disabled, focus and open/closed states remain visible and usable.

## Do's and Don'ts

- **Do** keep Vietnamese text, prices and demo disclosures readable beside imagery.
- **Do** preserve the Sol name and the supplied icon; `assets/brand/sol-original.png` is the source and `app/icon.png` is its 128px favicon derivative.
- **Do** keep visible selection, unavailable and keyboard-focus states.
- **Don't** introduce dark mode, cream-dominant surfaces, gradients or glass effects.
- **Don't** present stock portraits, style images or sample booking states as evidence of real staff, work or reservations.
