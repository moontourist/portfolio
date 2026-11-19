---
name: matt-erickson.io
description: The personal site of Matt Erickson (moontourist), an infrastructure engineer and creative technologist in Washington state.
colors:
  flaggul: "#d8a657"
  flaggbla: "#45707a"
  isbla: "#7daea3"
  fjallnatt: "#0a2f4f"
  cream: "#fbf1c7"
  sand: "#f2e5bc"
  tan: "#ddccab"
  bark: "#4f3829"
  charcoal: "#282828"
  sno: "#ffffff"
  ash: "#32302f"
  slate: "#45403d"
  parchment: "#d4be98"
  olive: "#6c782e"
  green: "#a9b665"
typography:
  display:
    fontFamily: "JetBrainsMono NFM, JetBrains Mono, ui-monospace, Menlo, monospace"
    fontSize: "clamp(3.75rem, 12vw, 8rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "JetBrainsMono NFM, JetBrains Mono, ui-monospace, Menlo, monospace"
    fontSize: "clamp(2.25rem, 5vw, 3rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.04em"
  title:
    fontFamily: "JetBrainsMono NFM, JetBrains Mono, ui-monospace, Menlo, monospace"
    fontSize: "1.125rem"
    fontWeight: 800
    lineHeight: 1.55
  body:
    fontFamily: "JetBrainsMono NFM, JetBrains Mono, ui-monospace, Menlo, monospace"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  body-lead:
    fontFamily: "JetBrainsMono NFM, JetBrains Mono, ui-monospace, Menlo, monospace"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "JetBrainsMono NFM, JetBrains Mono, ui-monospace, Menlo, monospace"
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
    textColor: "{colors.bark}"
    rounded: "{rounded.none}"
    padding: "0 12px"
    height: "32px"
  badge-in-progress:
    backgroundColor: "{colors.flaggul}"
    textColor: "{colors.charcoal}"
    rounded: "{rounded.none}"
    padding: "0 8px"
  poster-header:
    backgroundColor: "{colors.charcoal}"
    textColor: "{colors.manljus}"
    rounded: "{rounded.none}"
  poster-strip:
    backgroundColor: "{colors.fjallnatt}"
    textColor: "{colors.sno}"
    padding: "12px 24px"
  status-panel:
    backgroundColor: "{colors.snodis}"
    textColor: "{colors.bark}"
    rounded: "{rounded.none}"
    padding: "{spacing.panel}"
---

# Design System: matt-erickson.io

## Overview

**Creative North Star: "The Cascade Field Station"**

The site is a remote research post in the Washington mountains, run by one person who keeps the systems up and makes things on the side. Arriving, you see the station's window first: a full-width live view of a real Cascade or Olympic peak, drawn in pixels from elevation data, under the sky it has right now. The light follows the sun at that peak (daylight, golden hour, sunset glow, blue hour, night), the stars are the real ones behind it, and the clouds are the live cloud cover. Over that view sit the operator's name in tall flag-yellow JetBrains Mono ExtraBold, the peak's coordinates and readouts, and registration crosshairs in the corners. Below it the station goes quiet: a single left-aligned column of plain monospace text, thin frost-coloured rules, and one terminal readout reporting the operator's status.

The mood is technical and precise, playful but grown-up, and unmistakably Pacific Northwest. Precision comes from instrument language: coordinates, elevations, mono readouts, crosshairs, a barcode. The play comes from pixel art and ASCII drawn with care, never from jokes. The palette works in two layers: a fixed brand layer in the Swedish flag's yellow and blue (Matt is Swedish American), taken from Gruvbox Material, the palette his apps use, and a living world layer that takes whatever light the mountain has. Marathon's graphic poster style is the reference for the header; terminal culture for the status panel.

Confirmed rejections: gamer or RPG wording, Japanese text or subtitles, NES.css-style 8-bit chrome, a moon beside the mountain, and stripping the poster down for minimalism. An earlier pass that did that "lost its sparkle".

**Key Characteristics:**
- One live, real-world poster, then a calm single column.
- Square corners everywhere; flat surfaces separated by 1px rules.
- One typeface, as in all of Matt's apps: JetBrains Mono, ExtraBold for the name and titles, Regular for everything else.
- Pixel art built from text grids, rendered crisp, never blurred.
- A real place and a real moment in every visit: a random Washington peak with true terrain, coordinates, elevation, stars, light and weather.

## Colors

Two layers. The brand layer is the Swedish flag (Matt is Swedish American), drawn from Gruvbox Material, the palette his apps use (tascii's panel, thunk's editor): Gruvbox yellow and blue for identity, cream and charcoal for structure. The world layer (sky, mountains, snow, clouds) is a set of palettes in `src/daylight.ts`, blended by the sun's real altitude at the peak: night navy, indigo blue hour with lavender snow, purple ranges and pink alpenglow at sunset, warm golden hour, blue daylight over green-grey forest.

### Primary
- **Flaggul** (flag yellow, Gruvbox Material yellow): your name in the poster, the bar on section headings, the "In progress" badge, the logo's sunlit faces, craft icon accents and the terminal cursor. It stays the same at every hour and in both themes.
- **Flaggblå** (flag blue, Gruvbox Material light blue): links and the shell prompt's `matt@baker` in light mode. In dark mode it is replaced by **Isblå** (ice blue, Gruvbox Material dark blue), the lighter blue thunk and tascii use, which stays readable on charcoal.

### Secondary
- **Fjällnatt** (mountain night, a deep navy): the family the night sky palette is built from. World layer only.

### Tertiary
- **Olive** (light) and **Green** (dark): the status light beside "Nominal" only.

### Neutral
- **Cream**: the light-mode page background, Gruvbox Material's light bg.
- **Sand**: light-mode panel fill, used by the status panel.
- **Tan**: every 1px rule and border in light mode.
- **Bark**: light-mode text, a dark warm brown.
- **Charcoal**: the dark-mode page background, and text on Flaggul in the poster and on badges.
- **Snö** (snow): the pixel mountains' snow and text on Fjällnatt.
- **Ash**: dark-mode panel fill.
- **Slate**: dark-mode rules and borders.
- **Parchment**: dark-mode text, the warm off-white of Gruvbox Material.

### Named Rules
**The Fixed Flag, Living Sky Rule.** Flag yellow and blue belong to the brand layer (logo, name, section bars, links, badges, cursor) and are never tinted by the time of day. Everything in the scene (sky, terrain, snow, clouds, the strip) follows the real light. Text over the sky must stay readable at every sun angle; check new palette stops against the contrast minimums. Flaggul over the bright daytime sky is the tightest case, about 3.2:1, fine only because the name is display-size.

**The Two Themes Rule.** The light and dark themes are Gruvbox Material light and dark. Flaggul stays the same in both; Flaggblå lightens to Isblå in dark mode. The poster ignores the site theme and shows the mountain's real light.

## Typography

**Font:** JetBrains Mono, everywhere (JetBrainsMono NFM, JetBrains Mono, ui-monospace, Menlo, monospace). The Nerd Font Mono build is used when installed, as in tascii, thunk and wave; otherwise the Google Fonts copy (Regular and ExtraBold only).

**Character:** The same type as Matt's apps: one monospace in two weights. ExtraBold, pulled tight (-0.04em), sets the name and titles the way the thunk, wave and seethe logos set theirs; Regular carries everything else. No italics, no serif, no squash. (The site used squashed italic Times until November 2026; it was dropped to match the apps.)

### Hierarchy
- **Display** (800, 3.75rem rising to 6rem from 640px and 8rem from 1024px, line-height 1, -0.04em): the name in the poster only.
- **Headline** (800, 2.25rem rising to 3rem, line-height 1, -0.04em): section titles, with a 4px Flaggul bar on the left.
- **Title** (800, 1.125rem): project names, craft names and the name in the top bar.
- **Body lead** (400, 1.125rem, line-height 1.625): the one-line introduction in the poster and the About paragraph. Keep to about 42rem wide.
- **Body** (400, 1rem, line-height 1.5): project descriptions, skill details, footer.
- **Label** (400, 0.75rem, 0.15em tracking, uppercase, 75% opacity, the `.readout` class): data readouts only, such as coordinates, the peak strip and status panel field names.

### Named Rules
**The Readout Rule.** Uppercase tracked labels label data: a coordinate, an elevation, a status field. They never sit above headings or paragraphs as decoration.

**The One Voice Rule.** JetBrains Mono only, in Regular (400) and ExtraBold (800). No second family and no in-between weights, matching tascii, thunk, wave and seethe.

## Layout

Below the full-width poster sits the station's desk, in two tracks from 1024px: the **log** on the left (About, then Crafts) and the **console**, a 22–26rem rail on the right (Projects, then the Status panel), aligned under the strip's peak counter and separated by a single vertical rule. The four sections sit on a 2×2 grid so Crafts and Status headings line up, and Status stays in view (sticky) while the longer Crafts list scrolls past. Phones get one column in the same order, with a horizontal rule before the console. Gutters match the poster (24px, 48px from 768px). Sections are separated by space, not rules: 64px between groups (96px from 1024px), 24px from heading to content. Text stays under about 42rem; from 1536px Crafts becomes two columns. The status panel is terminal-style rows (label left, value right) at every size.

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

Hover answers (mouse only; each reuses a motion the site already has, and reduced motion keeps them still):
- **Links:** the underline is a 1px background, so a hover re-traces it left to right in six hard steps, like the mountain's skyline. Footer links draw theirs in the same way.
- **Logo:** the snowcaps redraw from the summits down.
- **Labels:** sentence case words ("Email", "Dark"), no brackets or arrows.

### Chips
- **Style:** the "In progress" badge, Flaggul with Charcoal text, square, small.
- **State:** shown only when the project list mixes finished and unfinished work; if every project has the same status the badge is hidden, because it would carry no information.

### Cards / Containers
There are no cards. Projects are a plain list separated by 1px rules. The only container is the status panel.
- **Corner Style:** square, with the notch clip on the status panel
- **Background:** Sand in light mode, Ash in dark mode
- **Shadow Strategy:** none, see Elevation & Depth
- **Border:** 1px Tan or Slate
- **Internal Padding:** 24px per cell, 12px by 20px for prompt rows

### Navigation
A full-width bar with a bottom rule. On the left, the logo (36px) and "Matt Erickson". The logo is an M whose top edge is a ridgeline, higher summit first, drawn on a 28px pixel grid and lit like the poster's mountains (sun from the left): flag yellow on the sunlit faces, deeper yellow (`#b47109`) in shadow, a ragged snowcap (cream in dark mode, the poster's blue-grey snow shade in light mode); colours are `--logo-*` in `style.css`. The favicon is a 16px cut of the same M in the two yellows, no snow. On the right, the Email, LinkedIn and GitHub ghost buttons and the theme toggle; below 640px only Email and the toggle stay (links marked `phone` in `src/data.ts`). The toggle is an on/off switch labelled "Dark" with a small square that fills when dark mode is on (`aria-pressed`). On touch screens every nav button and footer link is at least 44px tall. The footer repeats every link, Instagram included, as plain links. The barcode in the poster strip is hidden below 640px.

### Poster Header (signature component)
The page's one loud moment: a live window onto a real Washington peak. Layers, back to front:
- the sky gradient, coloured by the sun's real altitude at the peak (`src/daylight.ts`), checked every minute;
- the real stars behind the peak at this moment (Hipparcos catalogue, `src/sky.ts`), as `*` `+` `.` by brightness, fading out in daylight; about 40% twinkle;
- the sun as a small pixel disc when it's in view;
- at night, shooting stars (rare; more often within two days of a real meteor-shower peak, which the readout names) and, when NOAA's planetary Kp index says they'd be visible from the peak's latitude and the view faces north, ASCII northern-lights curtains (green base, teal, violet tips) that shimmer slowly like the stars (each cell on its own 3–7 s rhythm) and reshape at about cloud pace, all behind the clouds;
- live cloud cover from Open-Meteo as ASCII cloud banks (`-` high, `~` mid, `=` low), tinted by the light; heavy cover also greys the sky. The clouds are a small fluid simulation (`src/fluid.ts`, Stable Fluids on the character grid): the breeze is the real wind across the view (`src/effects.ts`) and is part of the airflow and the pointer is a solid body in it, so clouds bend and curl around the cursor as it passes, without clearing a hole (Matt preferred no gap: more whimsical); they relax back to the live pattern within a few seconds. Still for reduced motion; paused off-screen;
- the mountain scene, generated from real elevation data (`tools/skyline.py`, `src/peaks.ts`): a view from a lookout with hillshading and three depth tones, drawn as text grids. Live visibility from Open-Meteo hazes the depths: under about 40 km the far ranges fade (never below 30%, so the peak never vanishes), under about 30 km the peak's own range a little;
- low cloud in front of the lower slopes: the same cloud field, split at a deck line 45% down the scene, so rows below it draw over the mountain at 60% opacity and the summit always stays clear. The poster doesn't grow for it;
- thin crosshairs, the light readout ("Real sky  Golden hour 18:05 PT  looking north"), the cloud readout ("Cloud 84%  wind 22 km/h NW  vis 6 km  via Open-Meteo"; vis only under 30 km), the display name and the introduction. From 768px the two readout lines sit right-aligned in the top-right corner so the name stands alone on the left; phones keep them above the name;
- the strip with the peak's name, elevation, coordinates, a "Next peak" button and a peak counter ("Peak 3 / 8") so visitors know there are more.

Poster text carries a thin outline in the sky's own colour (`.halo`), invisible on open sky, so it stays legible when clouds pass behind. The small readouts get a solid patch of sky-top colour instead, since an outline can't fill the gaps in their letter-spaced text. Rain and snow appear in the weather readout but are not drawn: from a lookout miles away you can't see falling drops, and drawn rain was tried and rejected. Previews: `?clouds=low,mid,high`, `?rain=mm`, `?snow=cm` (readout only), `?wind=kmh,fromDegrees`, `?kp=7` (aurora night), `?meteors=1` (shower night), `?vis=km` (haze).

Scrolling adds depth parallax: the scene is drawn as three layers (far ranges; the peak's own range with its snow; near foothills), each back layer filled solid beneath, and as the poster scrolls away the stars, clouds and far ranges drift slowest, the peak's range a little faster, the foothills with the page (`DRIFT` in `src/main.ts`).

First load is the one authored sequence: ASCII rain falls and lands as the starfield, a line traces the peak's real skyline left to right like a plotter and the terrain rises in under it by depth (far ranges, then the peak's range, then foothills) as the line fades, then the rest of the page fades in (about 4 seconds; skipped for reduced motion, with a 6-second failsafe). "Next peak" redraws the scene without the rain. `?peak=` picks a mountain and `?at=` previews any moment.

### Terminal Status Panel (signature component)
The only place terminal styling appears. A notched panel opening with a prompt line (`matt@baker:~$ status --all`), then a grid of readouts with centred label-style field names and mono values (System, Operator, Region, Current build, Next deploy, a live Pacific-time clock), closing on an empty prompt with a blinking Flaggul block cursor. The prompt lines are hidden from screen readers. The readouts are System, Current build, Next deploy, Last deploy (build date) and Commit (both filled in at build time by `vite.config.ts`), and Local time. Readouts must report something the rest of the page doesn't. The first time the panel scrolls into view, `status --all` types out and the readouts print one per beat; the text is in the page throughout, only its appearance is staged. The clipped corners get a 1px diagonal line so the border stays continuous. The cursor blinks every 1.1s in hard steps and stops for visitors who prefer reduced motion. Outside the poster, it is the page's only ambient motion.

### Crafts List (signature component)
One row per craft (Infrastructure, Code, Audio, Photography, Games): a 40px pixel icon drawn on a 12×12 grid in the text colour with Flaggul accents, the craft name in ExtraBold mono and one plain line in Matt's own words, plus an optional text link (Photography links to Instagram). It replaces a skills list on purpose: every craft gets equal standing. On hover or keyboard focus an icon lifts 2px and its yellow pixels blink twice.

### Program Still
Real output from one of Matt's programs, shown as a bordered `pre` in Sand or Ash with a static Flaggul block cursor and a readout caption ("Excerpt of real output"). Used for cardatro under Games. It is the one allowed exception to keeping terminal styling inside the status panel, because it shows real work rather than decoration. The cursor here does not blink; the status panel keeps the page's only motion.

### Section Heading
A JetBrains Mono ExtraBold title with a 4px Flaggul bar on its left and 16px padding. No numbers, no labels above it.

## Do's and Don'ts

### Do:
- **Do** keep every corner square (0px); use the 18px notch only on terminal-style panels.
- **Do** keep flag yellow and blue fixed (logo, name, heading bars, links, badges, cursor) and let only the scene follow the light.
- **Do** set everything in JetBrains Mono: ExtraBold for the name and titles, Regular for the rest.
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
- **Don't** bring in colours from outside Gruvbox Material; the flag yellow and blue are Gruvbox's own, so the site matches Matt's apps.
- **Don't** strip the poster, stars or pixel art in the name of minimalism.
- **Don't** tint the brand colours with the time of day, or fake the sky: no invented stars, weather or light.
- **Don't** draw sky elements as pixel art; the sky stays text (see The Text Sky, Pixel Earth Rule).
