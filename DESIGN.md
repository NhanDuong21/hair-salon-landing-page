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

**Key Characteristics:**
- White and soft neutral surfaces with dark ink.
- Serif headlines paired with compact, readable sans text.
- Quiet dividers, restrained curves and visible control states.

## Colors

Primary: **accent** is the muted salon green for booking actions, selected states and italic emphasis; **accent-hover** deepens it on hover. **selected** is the pale green selection surface.

Neutral: **paper** is the main background; **soft** separates sections and notices. **ink** carries headings and decision data, **muted** supports descriptions, and **line** separates rows and surfaces. The frontmatter records the source values from `app/globals.css`.

## Typography

Noto Serif supplies headings, the Sol wordmark and italic emphasis; Be Vietnam Pro supplies body copy, prices and controls. Both include Vietnamese glyphs. Headings remain regular weight; prices use tabular numerals.

**The Readable Disclosure Rule.** Keep illustration notices, pricing caveats and booking disclaimers at least 12px. Service descriptions, duration and actions use 13px; service prices use 14px. Small ornamental brand labels are not a body-text scale.

## Layout

The desktop container caps at 1200px with 56px side space; below 1100px it uses 36px, and below 768px it uses 20px. Section padding steps from 96px to 72px below 900px and 56px below 768px.

Desktop uses paired image/text columns and three-column image groups. Below 768px the hero, space and visit sections stack; the hero action precedes the image, service descriptions occupy their own row, and duration, price and selection remain together. Below 600px team members become portrait/text rows and the inspiration group uses two columns with a wider final row. Mobile captions wrap rather than shrink.

## Elevation & Depth

Page surfaces stay flat, separated by neutral fills and fine rules. Only the booking dialog has a soft shadow and dark translucent backdrop. Control feedback uses short color transitions; reduced motion disables transitions and smooth scrolling.

## Shapes

Images use small corners, with a single larger curved corner on the hero and space photographs. Controls use the shared control radius. The desktop dialog is rounded; below 768px it becomes a bottom sheet with rounded upper corners and safe-area padding.

## Components

- **Buttons:** solid green primary action, green text actions and transparent icon controls. Primary buttons have a 48px minimum height; compact navigation, service and icon controls retain 44px targets. Hover deepens or tints the surface. Visible focus uses a 2px green outline with a 5px offset.
- **Navigation:** white sticky header with a fine bottom rule; desktop links underline on hover. Below 900px a labeled menu toggle exposes stacked links. Escape closes the menu and returns focus; choosing a link focuses its destination.
- **Service and time choices:** native radio inputs in bordered labels; selected choices have pale green fill and a green border. Focus outlines the full label. Unavailable times are disabled, muted and struck through, with a text explanation. The page service rows keep price and duration visible.
- **Booking:** one native modal dialog shares the page's service and stylist presets. Its three steps retain selections when going back; each step focuses its heading. The inert background, explicit Tab boundary, Escape/backdrop/close actions and return to the opener preserve keyboard context. The final screen visibly says no appointment was created. The mobile booking bar hides while the dialog is open.
- **FAQ:** native details/summary rows use fine separators and a simple plus/minus indicator; answers expand in place.

## Do's and Don'ts

- **Do** keep Vietnamese text, prices and demo disclosures readable beside imagery.
- **Do** preserve the Sol name and the supplied icon; `assets/brand/sol-original.png` is the source and `app/icon.png` is its 128px favicon derivative.
- **Do** keep visible selection, unavailable and keyboard-focus states.
- **Don't** introduce dark mode, cream-dominant surfaces, gradients or glass effects.
- **Don't** present stock portraits, style images or sample booking states as evidence of real staff, work or reservations.
