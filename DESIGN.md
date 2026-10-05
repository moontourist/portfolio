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
    backgroundColor: "{colors.polarnatt}"
    textColor: "{colors.manljus}"
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

The site is a remote research post in the Washington mountains, run by one person who keeps the systems up and makes things on the side. Arriving, you see the station's window first: a full-width live view of a real Cascade or Olympic peak, drawn in pixels from elevation data, under the sky it has right now. The light follows the sun at that peak (daylight, golden hour, sunset glow, blue hour, night), the stars are the real ones behind it, and the clouds are the live cloud cover. Over that view sit the operator's name in tall italic flag-yellow serif, the peak's coordinates and readouts, and registration crosshairs in the corners. Below it the station goes quiet: a single left-aligned column of plain monospace text, thin frost-coloured rules, and one terminal readout reporting the operator's status.

The mood is technical and precise, playful but grown-up, and unmistakably Pacific Northwest. Precision comes from instrument language: coordinates, elevations, mono readouts, crosshairs, a barcode. The play comes from pixel art and ASCII drawn with care, never from jokes. The palette works in two layers: a fixed brand layer in the Swedish flag's blue and yellow (Matt is Swedish American), and a living world layer that takes whatever light the mountain has. Marathon's graphic poster style is the reference for the header; terminal culture for the status panel.

Confirmed rejections: gamer or RPG wording, Japanese text or subtitles, NES.css-style 8-bit chrome, a moon beside the mountain, and stripping the poster down for minimalism. An earlier pass that did that "lost its sparkle".

**Key Characteristics:**
- One live, real-world poster, then a calm single column.
- Square corners everywhere; flat surfaces separated by 1px rules.
- Two typefaces only: squashed italic Times for the name and section titles, JetBrains Mono for everything else.
- Pixel art built from text grids, rendered crisp, never blurred.
- A real place and a real moment in every visit: a random Washington peak with true terrain, coordinates, elevation, stars, light and weather.

## Colors

Two layers. The brand layer is the Swedish flag: yellow and blue for identity, navy and frost for structure. The world layer (sky, mountains, snow, clouds) is a set of palettes in `src/daylight.ts`, blended by the sun's real altitude at the peak: night navy, indigo blue hour with lavender snow, purple ranges and pink alpenglow at sunset, warm golden hour, blue daylight over green-grey forest.

### Primary
- **Flaggul** (flag yellow): your name in the poster, the yellow bar on section headings, the "In progress" badge, the logo's first stripe and the terminal cursor. It stays the same at every hour.
- **Flaggblå** (flag blue): links, the shell prompt's `matt@baker`, the logo's second stripe. In dark mode it is replaced by **Isblå** (ice blue), a lighter blue that stays readable on night backgrounds.

### Secondary
- **Fjällnatt** (mountain night, a deep navy): the logo's third stripe, and the family the night sky palette is built from.

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
**The Fixed Flag, Living Sky Rule.** Flag blue and yellow belong to the brand layer (logo, name, section bars, links, badges, cursor) and are never tinted by the time of day. Everything in the scene (sky, terrain, snow, clouds, the strip) follows the real light. Text over the sky must stay readable at every sun angle; check new palette stops against the contrast minimums.

**The Two Themes Rule.** The site's light and dark themes share the flag colours unchanged except for the blue, which lightens to Isblå in dark mode. The poster ignores the site theme and shows the mountain's real light.

## Typography

**Display Font:** Times New Roman (with Times, Liberation Serif, serif)
**Body Font:** JetBrains Mono (with ui-monospace, monospace)
**Label/Mono Font:** JetBrains Mono, the same family as body

**Character:** A tall, squashed bold italic serif in the style of Evangelion's title cards, shouting over a calm monospace that matches Matt's own terminal. The contrast between them is the whole type system. The serif is the editorial, artsy voice; infra and PNW are carried by the monospace, the readouts and the live mountains. Alternatives were compared side by side (WPA poster, park-sign slab, condensed signage, Barlow Condensed, Chakra Petch, JetBrains Mono, upright and less-squashed Times) and Matt chose to keep this one.

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

Below the full-width poster sits the station's desk, in two tracks from 1024px: the **log** on the left (About, then Crafts) and the **console**, a 22–26rem rail on the right (Projects, then the Status panel), aligned under the strip's peak counter and separated by a single vertical rule. Phones get one column in the same order, with a horizontal rule before the console. Gutters match the poster (24px, 48px from 768px). Sections are separated by space, not rules: 64px between groups (96px from 1024px), 24px from heading to content. Text stays under about 42rem; from 1536px Crafts becomes two columns. The status panel is terminal-style rows (label left, value right) at every size.

The mountain scene spans the poster's full width at its own proportions (about 18.2% of the width, 9–26rem tall), so wide screens never crop the summit; phones crop the sides and keep the peak in view, with the bottom crosshairs hidden. The poster's bottom padding follows the scene height so text never overlaps it.

## Elevation & Depth

Flat. There are no shadows anywhere. On the page, depth comes from tonal layering (page background, slightly darker panel fill, 1px rules). In the poster it comes from the scene itself: near foothills darkest, the peak's own range a step lighter, distant ranges lighter again like haze, plus sunlit and shadowed faces from hillshading. The sky is the one gradient on the site: its top colour holds behind the text, then blends to the horizon colour behind the mountains.

### Named Rules
**The No-Shadow Rule.** Nothing casts a shadow. If something needs to stand apart, give it a panel fill or a rule.

## Shapes

Square corners throughout, radius 0 on every component. The one exception is the notch: the status panel has its top-right and bottom-left corners clipped at 45° by 18px, after Marathon's UI frames. Pixel art is built from squares on a grid and drawn crisp. The logo is three parallelograms slanted like the Toyota TRD decal, in Flaggul, Flaggblå and Fjällnatt, with a white pixel crescent moon on top.

### Named Rules
**The Text Sky, Pixel Earth Rule.** Everything in the sky is drawn in text characters (ASCII stars, rain and cloud lines); the land is pixel art generated from terrain data. Matt chose this split: pixel-art clouds were tried and rejected because they broke the programmer voice of the sky.

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
The page's one loud moment: a live window onto a real Washington peak. Layers, back to front:
- the sky gradient, coloured by the sun's real altitude at the peak (`src/daylight.ts`), checked every minute;
- the real stars behind the peak at this moment (Hipparcos catalogue, `src/sky.ts`), as `*` `+` `.` by brightness, fading out in daylight; about 40% twinkle;
- the sun as a small pixel disc when it's in view;
- live cloud cover from Open-Meteo as ASCII cloud banks (`-` high, `~` mid, `=` low), tinted by the light; heavy cover also greys the sky. The clouds are a small fluid simulation (`src/fluid.ts`, Stable Fluids on the character grid): the breeze is part of the airflow and the pointer is a solid body in it, so clouds bend and curl around the cursor as it passes, without clearing a hole (Matt preferred no gap: more whimsical); they relax back to the live pattern within a few seconds. Still for reduced motion; paused off-screen;
- the mountain scene, generated from real elevation data (`tools/skyline.py`, `src/peaks.ts`): a view from a lookout with hillshading and three depth tones, drawn as text grids;
- thin crosshairs, the coordinates, the light readout ("Real sky  Golden hour 18:05 PT  looking north"), the cloud readout ("Cloud 84%  live via Open-Meteo"), the display name and the introduction;
- the strip with the peak's name, elevation, a "Next peak" button and a peak counter ("Peak 3 / 8") so visitors know there are more.

Poster text carries a thin outline in the sky's own colour (`.halo`), invisible on open sky, so it stays legible when clouds pass behind. `?clouds=low,mid,high` previews any weather.

Scrolling adds depth parallax: the scene is drawn as three layers (far ranges; the peak's own range with its snow; near foothills), each back layer filled solid beneath, and as the poster scrolls away the stars, clouds and far ranges drift slowest, the peak's range a little faster, the foothills with the page (`DRIFT` in `src/main.ts`).

First load is the one authored sequence: ASCII rain falls and lands as the starfield, the mountain draws in from the ground up, then the rest of the page fades in (about 4 seconds; skipped for reduced motion, with a 6-second failsafe). "Next peak" redraws the scene without the rain. `?peak=` picks a mountain and `?at=` previews any moment.

### Terminal Status Panel (signature component)
The only place terminal styling appears. A notched panel opening with a prompt line (`matt@baker:~$ status --all`), then a grid of readouts with centred label-style field names and mono values (System, Operator, Region, Current build, Next deploy, a live Pacific-time clock), closing on an empty prompt with a blinking Flaggul block cursor. The prompt lines are hidden from screen readers. The readouts are System, Current build, Next deploy, Last deploy (build date) and Commit (both filled in at build time by `vite.config.ts`), and Local time. Readouts must report something the rest of the page doesn't. The first time the panel scrolls into view, `status --all` types out and the readouts print one per beat; the text is in the page throughout, only its appearance is staged. The clipped corners get a 1px diagonal line so the border stays continuous. The cursor blinks every 1.1s in hard steps and stops for visitors who prefer reduced motion. Outside the poster, it is the page's only ambient motion.

### Crafts List (signature component)
One row per craft (Infrastructure, Code, Audio, Photography, Games): a 40px pixel icon drawn on a 12×12 grid in the text colour with Flaggul accents, the craft name in semibold mono and one plain line in Matt's own words, plus an optional text link (Photography links to Instagram). It replaces a skills list on purpose: every craft gets equal standing. On hover or keyboard focus an icon lifts 2px and its yellow pixels blink twice.

### Program Still
Real output from one of Matt's programs, shown as a bordered `pre` in Snödis or Midnatt with a static Flaggul block cursor and a readout caption ("Excerpt of real output"). Used for cardatro under Games. It is the one allowed exception to keeping terminal styling inside the status panel, because it shows real work rather than decoration. The cursor here does not blink; the status panel keeps the page's only motion.

### Section Heading
A squashed italic serif title with a 4px Flaggul bar on its left and 16px padding. No numbers, no labels above it.

## Do's and Don'ts

### Do:
- **Do** keep every corner square (0px); use the 18px notch only on terminal-style panels.
- **Do** keep flag blue and yellow fixed (logo, name, heading bars, links, badges, cursor) and let only the scene follow the light.
- **Do** set the name and section titles in bold italic Times, squashed to 70% width, and everything else in JetBrains Mono.
- **Do** generate mountain scenes from real elevation data with `tools/skyline.py` rather than drawing them by hand, keep heights near true (at most 1.3×), and keep every scene the same number of rows.
- **Do** use real data everywhere it appears real: true coordinates, elevations, terrain, stars, sun position, cloud cover and time.
- **Do** draw craft icons as 12×12 text grids in `src/art.ts` (`#` in the text colour, `+` in Flaggul), matching the peaks.
- **Do** keep terminal styling inside the status panel, and respect reduced motion for anything that moves.

### Don't:
- **Don't** use gamer or RPG wording (guild, quest, character, stats, equipment, level).
- **Don't** add Japanese text or subtitles.
- **Don't** use rounded corners, drop shadows, decorative gradients (the sky is the only one) or 8-bit UI kits like NES.css.
- **Don't** put a moon beside the mountain; the moon belongs only in the logo.
- **Don't** add numbered section markers or uppercase labels above headings.
- **Don't** use cream page backgrounds; light mode is cool Glaciärvit (#eef2f5).
- **Don't** strip the poster, stars or pixel art in the name of minimalism.
- **Don't** tint the flag colours with the time of day, or fake the sky: no invented stars, weather or light.
- **Don't** draw sky elements as pixel art; the sky stays text (see The Text Sky, Pixel Earth Rule).
