---
name: matt-erickson.io
description: The personal site of Matt Erickson (moontourist), an infrastructure engineer and creative technologist in Washington state.
colors:
  flaggul: "#fecc02"
  flaggbla: "#006aa7"
  isbla: "#4aa3df"
  fjallnatt: "#0a2f4f"
  glaciarvit: "#eef2f5"
  snodis: "#e1e8ee"
  rimfrost: "#c5d0da"
  tusch: "#0d1b2a"
  kolsvart: "#12161c"
  sno: "#ffffff"
  polarnatt: "#0b1420"
  midnatt: "#111c2b"
  skiffer: "#24324a"
  manljus: "#e8e4da"
  granskog: "#2e7d4f"
  granskog-ljus: "#4caf7a"
typography:
  display:
    fontFamily: "Times New Roman, Times, Liberation Serif, serif"
    fontSize: "clamp(4.5rem, 12vw, 8rem)"
    fontWeight: 700
    lineHeight: 0.85
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Times New Roman, Times, Liberation Serif, serif"
    fontSize: "clamp(2.25rem, 5vw, 3rem)"
    fontWeight: 700
    lineHeight: 0.85
    letterSpacing: "-0.03em"
  title:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "1.125rem"
    fontWeight: 500
    lineHeight: 1.55
  body:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  body-lead:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    letterSpacing: "0.15em"
rounded:
  none: "0px"
spacing:
  gutter: "24px"
  gutter-wide: "48px"
  panel: "24px"
  section: "56px"
components:
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.tusch}"
    rounded: "{rounded.none}"
    padding: "0 12px"
    height: "32px"
  badge-in-progress:
    backgroundColor: "{colors.flaggul}"
    textColor: "{colors.kolsvart}"
    rounded: "{rounded.none}"
    padding: "0 8px"
  poster-header:
    backgroundColor: "{colors.flaggul}"
    textColor: "{colors.kolsvart}"
    rounded: "{rounded.none}"
  poster-strip:
    backgroundColor: "{colors.fjallnatt}"
    textColor: "{colors.sno}"
    padding: "12px 24px"
  status-panel:
    backgroundColor: "{colors.snodis}"
    textColor: "{colors.tusch}"
    rounded: "{rounded.none}"
    padding: "{spacing.panel}"
---

# Design System: matt-erickson.io

## Overview

**Creative North Star: "The Cascade Field Station"**

The site is a remote research post in the Washington mountains, run by one person who keeps the systems up and makes things on the side. Arriving, you see the station's poster first: a full-width block of Swedish flag yellow carrying the operator's name in tall italic serif, a field of ASCII stars, registration crosshairs in the corners, the coordinates and elevation of a Cascade or Olympic peak, and that peak drawn in pixels. Below the poster the station goes quiet: a single left-aligned column of plain monospace text, thin frost-coloured rules, and one terminal readout reporting the operator's status.

The mood is technical and precise, playful but grown-up, and unmistakably Pacific Northwest. Precision comes from instrument language: coordinates, elevations, mono readouts, crosshairs, a barcode. The play comes from pixel art and ASCII drawn with care, never from jokes. The palette is the Swedish flag (Matt is Swedish American) laid over snow and night sky. Marathon's graphic poster style is the reference for the header; terminal culture for the status panel.

Confirmed rejections: gamer or RPG wording, Japanese text or subtitles, NES.css-style 8-bit chrome, a moon beside the mountain, and stripping the poster down for minimalism. An earlier pass that did that "lost its sparkle".

**Key Characteristics:**
- One loud poster block, then a calm single column.
- Square corners everywhere; flat surfaces separated by 1px rules.
- Two typefaces only: squashed italic Times for the name and section titles, JetBrains Mono for everything else.
- Pixel art built from text grids, rendered crisp, never blurred.
- A real place in every visit: a random Washington peak with true coordinates and elevation.

## Colors

The Swedish flag over a winter landscape: yellow and blue for identity, navy and frost for structure, snow and night for the two themes.

### Primary
- **Flaggul** (flag yellow): the poster header background, the yellow bar on section headings, the "In progress" badge, the logo's first stripe and the terminal cursor. It is the loudest thing on the page and appears in one large block only.
- **Flaggblå** (flag blue): links, the shell prompt's `matt@baker`, the logo's second stripe. In dark mode it is replaced by **Isblå** (ice blue), a lighter blue that stays readable on night backgrounds.

### Secondary
- **Fjällnatt** (mountain night, a deep navy): the strip under the poster, the mountain's rock, the logo's third stripe. It anchors the yellow and holds the peak name, elevation and barcode.

### Tertiary
- **Granskog** (spruce forest): the status light beside "Nominal" only. Dark mode uses **Granskog ljus**, its lighter form.

### Neutral
- **Glaciärvit** (glacier white): the light-mode page background. A cool white, deliberately not cream.
- **Snödis** (snow haze): light-mode panel fill, used by the status panel.
- **Rimfrost** (hoarfrost): every 1px rule and border in light mode.
- **Tusch** (India ink): light-mode text.
- **Kolsvart** (coal black): text on Flaggul, in the poster and on badges.
- **Snö** (snow): the pixel mountains' snow, the logo's pixel moon, text on Fjällnatt.
- **Polarnatt** (polar night): the dark-mode page background.
- **Midnatt** (midnight): dark-mode panel fill.
- **Skiffer** (slate): dark-mode rules and borders.
- **Månljus** (moonlight): dark-mode text, a warm off-white.

### Named Rules
**The One Flag Rule.** Flaggul fills exactly one large area per page, the poster. Everywhere else it appears only as thin bars, small badges or the cursor.

**The Two Skies Rule.** Light and dark themes share the flag colours unchanged except for the blue, which lightens to Isblå at night. The poster stays yellow in both themes.

## Typography

**Display Font:** Times New Roman (with Times, Liberation Serif, serif)
**Body Font:** JetBrains Mono (with ui-monospace, monospace)
**Label/Mono Font:** JetBrains Mono, the same family as body

**Character:** A tall, squashed bold italic serif in the style of Evangelion's title cards, shouting over a calm monospace that matches Matt's own terminal. The contrast between them is the whole type system.

### Hierarchy
- **Display** (700 italic, 4.5rem rising to 8rem from 640px, line-height 0.85, uppercase): the name in the poster only. Squashed horizontally to 70% from the left edge so the letters read tall.
- **Headline** (700 italic, 2.25rem rising to 3rem, line-height 0.85, uppercase): section titles, with the same 70% squash and a 4px Flaggul bar on the left.
- **Title** (500, 1.125rem): project names, set in mono because they are repo names.
- **Body lead** (400, 1.125rem, line-height 1.625): the one-line introduction in the poster and the About paragraph. Keep to about 42rem wide.
- **Body** (400, 1rem, line-height 1.5): project descriptions, skill details, footer.
- **Label** (400, 0.75rem, 0.15em tracking, uppercase, 75% opacity, the `.readout` class): data readouts only, such as coordinates, the peak strip and status panel field names.

### Named Rules
**The Readout Rule.** Uppercase tracked labels label data: a coordinate, an elevation, a status field. They never sit above headings or paragraphs as decoration.

**The Two Voices Rule.** Serif is for the name and section titles; mono is for everything else. No third family.

## Layout

A left-aligned single column with a maximum width of 56rem (896px), inset by a 24px gutter on phones and 48px from 768px up. On wide screens the right side of the page stays open on purpose. The poster header and the nav run full width; everything else sits in the column.

Sections are separated by a 1px top rule and 56px of padding above and below. Text blocks inside cap at 42rem. Skills use a two-column term/description grid from 640px and stack below it. The status panel grid is two columns on phones and three from 640px. The pixel peak sits at the bottom right of the poster, up to 36rem wide, resting on the navy strip.

Breakpoints are Tailwind's defaults; the ones in use are 640px and 768px.

## Elevation & Depth

Flat. There are no shadows anywhere. Depth comes from tonal layering (page background, slightly darker panel fill, 1px rules) and from the poster's colour block against the page. The ASCII starfield sits behind the poster text at 40% opacity as atmosphere, not depth.

### Named Rules
**The No-Shadow Rule.** Nothing casts a shadow. If something needs to stand apart, give it a panel fill or a rule.

## Shapes

Square corners throughout, radius 0 on every component. The one exception is the notch: the status panel has its top-right and bottom-left corners clipped at 45° by 18px, after Marathon's UI frames. Pixel art is built from squares on a grid and drawn crisp. The logo is three parallelograms slanted like the Toyota TRD decal, in Flaggul, Flaggblå and Fjällnatt, with a white pixel crescent moon on top.

### Named Rules
**The Square Rule.** No rounded corners. Clip a corner instead of rounding it, and only on terminal-style panels.

## Components

### Buttons
Ghost buttons only, quiet and textual.
- **Shape:** square (0px)
- **Ghost:** transparent background, text in the page's text colour, 32px tall with 12px side padding. Used for the nav links and the theme toggle.
- **Hover / Focus:** DaisyUI's ghost hover fill and its visible focus outline.
- **Labels:** sentence case words ("Email", "Dark"), no brackets or arrows.

### Chips
- **Style:** the "In progress" badge, Flaggul with Kolsvart text, square, small.
- **State:** shown only when the project list mixes finished and unfinished work; if every project has the same status the badge is hidden, because it would carry no information.

### Cards / Containers
There are no cards. Projects are a plain list separated by 1px rules. The only container is the status panel.
- **Corner Style:** square, with the notch clip on the status panel
- **Background:** Snödis in light mode, Midnatt in dark mode
- **Shadow Strategy:** none, see Elevation & Depth
- **Border:** 1px Rimfrost or Skiffer
- **Internal Padding:** 24px per cell, 12px by 20px for prompt rows

### Navigation
A full-width bar with a bottom rule. On the left, the stripe logo (40px) and the "moontourist" wordmark; below 640px the wordmark is visually hidden but still read by screen readers. On the right, the Email, LinkedIn and GitHub ghost buttons and the theme toggle; below 640px only Email and the toggle stay (links marked `phone` in `src/data.ts`). The toggle is an on/off switch labelled "Dark" with a small square that fills when dark mode is on (`aria-pressed`). On touch screens every nav button and footer link is at least 44px tall. The footer repeats every link, Instagram included, as plain links. The barcode in the poster strip is hidden below 640px.

### Poster Header (signature component)
The page's one loud moment. Full-width Flaggul block containing:
- the ASCII starfield (`.`, `+`, `*`, about 2.5% density, regenerated on each load) at 40% opacity;
- thin crosshairs in all four corners;
- the peak's coordinates as a label;
- the display name and a one-sentence introduction;
- the pixel peak, rock in Fjällnatt and snow in Snö;
- the Fjällnatt strip with the peak's name, elevation in metres and feet, and a barcode generated from the peak's name.

The peak is chosen at random from `src/peaks.ts` on every visit. Each grid is 12 rows tall so every mountain sits on the same baseline.

### Terminal Status Panel (signature component)
The only place terminal styling appears. A notched panel opening with a prompt line (`matt@baker:~$ status --all`), then a grid of readouts with centred label-style field names and mono values (System, Operator, Region, Current build, Next deploy, a live Pacific-time clock), closing on an empty prompt with a blinking Flaggul block cursor. The cursor blinks every 1.1s in hard steps and stops for visitors who prefer reduced motion. It is the page's only ambient motion.

### Section Heading
A squashed italic serif title with a 4px Flaggul bar on its left and 16px padding. No numbers, no labels above it.

## Do's and Don'ts

### Do:
- **Do** keep every corner square (0px); use the 18px notch only on terminal-style panels.
- **Do** confine Flaggul to the poster block plus thin accents (heading bars, badges, cursor).
- **Do** set the name and section titles in bold italic Times, squashed to 70% width, and everything else in JetBrains Mono.
- **Do** draw new pixel art as text grids (`#` rock, `*` snow) rendered with crisp edges, and keep peak grids 12 rows tall.
- **Do** use real data in readouts: true coordinates, true elevations, a live clock.
- **Do** keep terminal styling inside the status panel, and respect reduced motion for anything that moves.

### Don't:
- **Don't** use gamer or RPG wording (guild, quest, character, stats, equipment, level).
- **Don't** add Japanese text or subtitles.
- **Don't** use rounded corners, drop shadows, gradients or 8-bit UI kits like NES.css.
- **Don't** put a moon beside the mountain; the moon belongs only in the logo.
- **Don't** add numbered section markers or uppercase labels above headings.
- **Don't** use cream page backgrounds; light mode is cool Glaciärvit (#eef2f5).
- **Don't** strip the poster, stars or pixel art in the name of minimalism.
