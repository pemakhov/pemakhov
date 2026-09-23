# Pip — robot design specification

Rev H · approved appearance · 2026-09-23

Pip is the robot character for the home-page animation. This file is the
reference: it describes the approved appearance precisely enough to redraw it by
hand, rebuild it as vector layers, or regenerate it as a 3D render. Working
drafts live in `design/robot.pen`; approved images in `design/images/`.

Colour tokens referenced here are the ones in `design-tokens.md`. Pip's own
palette is deliberately small so it can stand on any themed route.

## The canonical images

| View | File | Use |
|---|---|---|
| Three-quarter, left | `design/images/generated-1790151608328.png` | **the reference.** Hips clear, belly clean |
| Front wave | `design/images/generated-1790151643693.png` | working pose for the site |
| Neutral stand, front | `design/images/generated-1790151966950.png` | cleanest read of the silhouette |

If a new render disagrees with the three-quarter view, the three-quarter view
wins.

**Two written requirements are ahead of these images.** The renders that showed
them were deleted during a canvas cleanup, so the text is now the only record:

- **Dark graphite feet** (see Feet below). Every surviving render has white
  shoes.
- **A completely clean belly** in the front views. The surviving neutral still
  carries a faint low line; only the deleted set was fully clean.

Both were achieved once and are reproducible from the prompt below — the render
set simply no longer demonstrates them. Regenerate before treating any of these
three as a final asset.

## Silhouette and proportions

Pip is a small desk-sized prototype, not an adult android. The head does the
charm; the body stays modest.

- **Head ≈ ⅓ of total height.** This is the single most important ratio. As soon
  as the head drops to a quarter or less, Pip stops being Pip and becomes a
  generic humanoid.
- Total height ≈ 2.8–3.3 head diameters.
- Torso: a small egg, roughly 1.2 head diameters tall, narrower than the head.
- Arms and legs: short and stocky, upper and lower segments about equal.
- Stance: feet about one head diameter apart, weight even, upright.

## Construction rules

These four rules are what took several revisions to get right. They are the
difference between "robot prototype" and "cartoon in a swimsuit".

### 1. The chest is smooth

A clean glossy egg. **No access panel, no rectangular plate, no screws, no
hatch, no vents.** One tiny flush amber indicator light is the only marking.

### 2. The torso is one continuous form — no belly line, ever

The body is **one smooth ovoid**, like a polished pebble: a single closed
surface of uniform curvature that curves round and under at the bottom. The
front is one unbroken glossy reflection from the neck ring to the very bottom,
with no horizontal line, seam, groove, ridge, crease, edge, step or shading
break. Any parting line lives on the **sides**, the **top** at the shoulders,
and the **underside**.

This took five rerolls to get right, so the wording matters:

- **Forbidding the seam does not work.** "No line across the belly", then "not
  even a faint one" — the generator drew it anyway, every time.
- **The phrase that caused it** was describing the torso as *"ending at the hip
  line with a rounded, closed, flat underside"*. "Ends" and "flat underside"
  imply a bottom edge, so one got drawn. Deleting that phrase fixed it
  instantly.
- **Describe the form, not the seam:** one ovoid, one moulded piece, no lower
  dome, no cap, no bowl, no lip, no rim, no band. With nothing to butt against,
  a seam has nowhere to appear.

An earlier attempt to force *every* parting line vertical was rejected: chasing
it cost the proportions and shrank the feet. Change one clause at a time.

### 3. The torso ends at the hip line, and nothing covers the hips

The torso shell stops short with a rounded, closed underside. Each leg hangs
from its own **fully exposed dark-grey hip actuator** — a big machined cylinder
standing proud at the bottom outside corner of the torso, exactly as the
shoulders are. Between the legs is open space, so you can see under the body.

**No white panel, skirt, flap, fairing or shell lip overlaps a hip cylinder.**
The full round face and body of each one is visible from the front, as bare as
the shoulders.

Balance this against attachment: describing the hips as "floating free with
background space around them" did clear the plastic, but the legs then looked
detached, like discs hovering beside the body. The wording that works says the
actuator is **bolted to the side of the torso with the thigh hanging directly
from it** — clearly supported — *and* that no plastic covers it.

There is no crotch, no V-shaped seam, no groin line, no belt and no
underwear-shaped panel. Any of those make the lower body read as clothing, which
is the failure mode this rule exists to prevent.

### 4. Plastic never covers a joint

Every joint is a visible mechanism. The shoe collar stops **below** the ankle
actuator, leaving the cylinder exposed above it. The same applies at knees,
elbows, wrists and shoulders: shells end where the actuator begins.

This is about where the shell *stops*, not about making parts small — see the
feet below.

## Parts

### Head

- Perfectly round, glossy white **bezel ring** around a round **black glass
  screen** that fills most of the face.
- The screen is the face. Nothing is sculpted: eyes and mouth are emitted pixels.
- **Eyes:** two vertical amber ovals (`--glow` `#ffb454`), softly glowing,
  spaced about ⅔ of the screen width apart, slightly above centre.
- **Mouth:** one tiny amber dash, centred, low on the screen.
- **Ear discs:** small round actuator caps on both sides at eye height. They
  read as hearing and as hardware at the same time.
- **Neck:** short, segmented, dark — a visible mechanical joint, not a taper.

### Torso

Smooth white egg. One tiny flush amber indicator light on the chest, and
nothing else: no access panel, no plate, no screws, no hatch, no vents.

### Arms and legs

Short white shell segments — upper arm, forearm, thigh, shin — each with vertical
seams and an inset servo housing, separated by exposed actuators.

### Joints

Every joint is the same family of part: a dark-grey cylindrical actuator with a
machined aluminium ring, an output hub and a circle of small screws. Nine
locations, mirrored: shoulder, elbow, wrist, hip, knee, ankle, plus the neck.

### Hands

Functional, not mittens. Each hand has:

- a palm,
- **three fingers of two segments each**,
- an **opposable thumb**,
- a visible pin joint at every knuckle,
- grey grip pads on the fingertips.

### Feet

Generous rounded shoe shells in **dark graphite grey, almost charcoal** — never
white. They read as moulded rubber boots with near-black soles, and the contrast
against the white body is the point: the feet ground the figure. Proper shoes
with real length extending past the ankle, roughly one head radius long, with
the ankle actuator visible above them.

They must not be small, stubby, flat slippers or little pads. A revision with
low-profile feet made Pip look like it was standing on stumps and was rejected.
Asking hard for an "exposed ankle" is what shrinks them, so if that clause is
ever tightened, check the feet in the same pass.

## Materials and colour

| Element | Finish | Value |
|---|---|---|
| Shell | glossy white, mirror-polished | `#ffffff` |
| Joints | dark grey machined metal | ≈ `#3a414c` |
| Joint rings | brushed aluminium | ≈ `#8a93a0` |
| Screen | black glass, slight reflection | `--screen` `#1c2129` |
| Eyes, mouth, chest light | emitted amber | `--glow` `#ffb454` |
| **Shoes** | dark graphite rubber | ≈ `#4a4f55` |
| Soles | near-black rubber | ≈ `#2b2e33` |
| Grip pads | matte grey rubber | ≈ `#b3bcc7` |

Amber is the only chroma on the robot. Keep it that way: it is what makes the
eyes the first thing anyone looks at.

**Colourways.** The shell colour can change per route. Six were rendered and
reviewed — white, graphite `--ink`, blueprint navy `#10243f`, red `--accent`,
amber `--glow` and a sage green-grey; that board has since been removed from the
canvas. White is the approved default, graphite read strongest on a light
ground, and navy is the obvious fit for `/ai` since it is that theme's own
background. Note that a fully red Pip spends the whole accent
budget §5.4 keeps scarce — think before shipping it on Home.

## Render setup

Soft studio three-point lighting, soft contact shadow under the feet, plain
light-grey seamless background, whole body in frame with margin, camera at chest
height, no perspective distortion. Stylised high-end 3D, Pixar-quality but
engineered.

## Reproducing the renders

Pen's `Generate(nodeId, "ai", prompt)` produced the approved images. The prompt
is a pose line plus the body block below; keep the body block verbatim, because
each clause in it fixes a specific failure that appeared in an earlier draft.

Pose lines:

- **Wave:** `Front view, right hand raised in a friendly wave with fingers spread.`
- **Three-quarter:** `Three-quarter view from the left, one hand slightly raised with fingers mid-gesture as if explaining something, head tilted a little.`
- **Neutral:** `Front view, symmetrical neutral rest pose, both arms relaxed at the sides, fingers relaxed.`

Body block — keep verbatim. This exact text produced both approved sets. Every
clause in it fixes a specific failure from an earlier draft, and rewriting it to
"improve" one detail has twice broken two others:

> A cute but credible robot prototype named Pip, full body, standing, whole body visible with margin. Human-like proportions with an oversized perfectly round head: glossy white bezel ring around a round black glass screen showing two glowing amber vertical oval eyes and a tiny amber dash mouth; small round ear discs that are actuator caps. Short segmented neck. TORSO SHAPE: the body is ONE continuous smooth ovoid form, like a single polished white pebble or a river stone — one closed surface with uniform gentle curvature that simply curves round and under at the bottom. The entire torso is a SINGLE moulded piece: there is no upper part and no lower part, no lower dome, no belly cap, no bowl, no lip, no rim, no collar and no band anywhere on it. Consequently the front of the body shows NO horizontal line, NO seam, NO joint line, NO groove, NO ridge, NO crease, NO edge, NO step and NO tonal or shading break of any kind — the glossy specular reflection runs unbroken all the way from the neck ring down to the very bottom of the form. Perfectly smooth white belly. Any parting line exists only along the SIDES of the body, across the TOP at the shoulders and on the UNDERSIDE. The two legs hang from two large visible dark-grey cylindrical hip actuators mounted on the left and right sides at the bottom of the torso, clearly separate mechanical parts. There is absolutely NO crotch, NO V-shaped seam, NO groin line, NO inner-thigh seam, NO underwear or swimsuit-shaped panel, NO belt, NO waist seam, and NO colour change on the white shell. Open space between the legs. The chest is completely smooth glossy white with NO access panel, NO plate, NO screws — only one tiny flush amber indicator light. Every joint is a real dark-grey cylindrical actuator with a machined aluminium ring and a circle of small screws: shoulders, elbows, wrists, hips, knees, ankles. Upper arms, forearms, thighs and shins are separate white shell segments with panel seams and visible servo housings, mechanically plausible. Functional robotic hands: a palm with three articulated fingers of two segments each and an opposable thumb, visible knuckle pin joints, grey finger pads. FEET: the shoes are DARK GRAPHITE GREY, almost charcoal — definitely NOT white, clearly darker than the white body, like dark grey moulded rubber boots with near-black soles; generous rounded shoe shells with a visible ankle actuator above them. Glossy white plastic body, glass, brushed aluminium on the joints, dark grey feet, soft studio three-point lighting, soft contact shadow, plain light grey seamless background, stylised high-end 3D render, Pixar-quality but engineered. Clean product render of the robot alone: absolutely no text, no labels, no annotations, no captions, no callout lines, no diagram, no watermark anywhere in the image.

### Known drift — check every render against this list

Generators reintroduce these. Reject the image and regenerate if you see:

1. **Proportions stretching** — head shrinks, legs lengthen, Pip turns into a
   tall slender android. Most common failure.
2. **A V-shaped groin line**, which reads as underwear. Rule 3.
3. **A rectangular chest panel with screws.** Rule 1.
4. **Plastic creeping back over the hip cylinders**, so the legs look moulded
   into the body. Rule 3.
5. **Hips detaching** — the opposite failure: cylinders floating beside the
   body with no visible attachment.
6. **Stubby feet** — low slipper-like pads instead of proper shoes.
7. **White shoes.** They must be dark graphite.
8. Faceted or angular torso instead of a smooth ovoid.
9. **The render turning into a labelled diagram** with garbled callout text. It
   happened once on the three-quarter view; the trailing "no text, no labels, no
   annotations" clause in the prompt is there to prevent it.

Failures 1 and 5 both arrived as *side effects* of tightening other clauses, not
from the body block above. Prefer regenerating with the block unchanged over
rewriting it.

## Building Pip as vector layers

The animation needs vector, not renders. `design/robot.pen` Draft 04 holds a
front elevation built this way, and it is the pattern to follow.

- **Every part is its own named layer** — `Upper arm L`, `J3 elbow`, `Hand R
  finger 2 distal` — so the rig can address it.
- **Limb segments are capsules**: a rounded frame of width `length + 2r`, height
  `2r`, corner radius `r`, rotated about its top-left corner to point from joint
  A to joint B. A pose is then a list of angles, which is exactly what
  `kinematics.ts` is for.
- **An actuator is four concentric circles**: housing, ring, hub, plus a
  six-bolt circle. Drawing all nine joints the same way is what makes the
  machine read as one design.
- Keep the amber elements — eyes, mouth, chest light — as separate layers with
  no stroke, so expressions can be swapped without touching the body.

### Note for Pen

Pen's canvas renders `frame` nodes reliably; `rectangle`, `ellipse` and `path`
nodes did not render at all during this work. Build everything from frames.
Screenshots also lag one call behind — export to PNG and read the file to check
work.

## Internals

Shown as 3D exploded renders in Draft 14 of `design/robot.pen`. Pip is notionally
a desk-sized prototype, so the component choices are the ones such a machine
would actually use. A line-drawn exploded assembly with a numbered parts list
was also made and later removed from the canvas; the component list and the
placement rules below are the surviving record of it.

| Exploded render | File |
|---|---|
| Full body | `design/images/generated-1790154283874.png` |
| Head detail | `design/images/generated-1790154284117.png` |
| Torso detail | `design/images/generated-1790154284148.png` |

The exploded renders come from the Rev H look block plus an exploded-view style
block: parts separated along straight assembly axes, evenly spaced, with faint
dashed guide lines, studio lighting and a plain grey background. The "no text,
no labels" clause matters here — exploded views invite the generator to add
garbled callout labels.

**Head** — round display (the face) with its driver board directly behind; a
wide RGB camera behind the glass above the eyes; a depth/ToF sensor in one ear
disc; a MEMS microphone in each ear; neck pan and tilt servos below.

**Torso** — compute module with heatsink high and rearward; radio and antenna
at the top, clear of the metal; IMU on the centre line; BMS below the compute;
two Li-ion pouch cells at the very bottom; speaker behind the chest indicator;
fan drawing up from an underside vent.

**Limbs** — shoulder and hip use the same actuator family (BLDC + cycloidal
gear + encoder) at different sizes; elbow and knee one size down; wrist and
ankle small servos. The hand is **tendon-driven**: four servos sit in the
forearm and pull the fingers, which is why the fingers can be slim.

The arrangement is an argument, and it should survive into any later drawing:

- **Mass goes low.** The battery is the heaviest item, so it sits at the bottom
  of the torso, right above the hips. A top-heavy biped falls over.
- **Heat goes high and back.** Compute and heatsink are as far from the cells as
  the body allows; the fan pulls air up past the fins and out the top.
- **The IMU sits at the centre of mass**, on the centre line, where it measures
  the body rather than a limb's vibration.
- **Motors live at the joints they drive**, except the fingers — tendons let the
  hand stay small while the servos sit in the forearm.

## Screen faces

Twelve expressions are drawn as vectors in `design/robot.pen`, Draft 12. They
share one black screen and one amber; nothing but the pixels changes, so a
switch costs a state change and no movement.

| Face | When |
|---|---|
| Neutral | default — two vertical ovals and a dash |
| Blink | every few seconds, two frames, keeps Pip alive |
| Happy | arced eyes and a smile; rare enough to mean something |
| Wink | a successful action |
| Surprised | new content arriving |
| Sleepy | idle after no interaction |
| Focused | working, mid-task |
| Curious | asymmetric eyes; pairs with a head tilt |
| Thinking | eyes up and away, three dots trailing |
| Loading | dim eyes, three pulsing dots |
| Error | X eyes, flat mouth — the only failure face |
| Glitch | torn scanline offset, for the §10 incident beat |

Construction: eyes and mouth are rounded pills, arcs are two short capsules
meeting at a point, and a lid is a screen-coloured box laid over an eye. Keep
every amber element a separate unstroked layer so expressions swap without
touching the body.

Restraint is the point. Neutral and blink carry almost all the running time;
the rest are punctuation. A face that pulls a new expression every few seconds
becomes a mascot, which §3 explicitly rules out.

## Still open

- **Side elevation** to complete the turnaround.
- **Rig map**: joint list with rotation limits, ready for `kinematics.ts`.
- **Where Pip appears on the site.** §3.3 caps Home at three interactive
  moments, and R12 says the recurring motif is the *mechanism*. Pip is a
  character, so decide deliberately whether it is the motif, a guide beside it,
  or a one-off at the contact section — the spec warns against a page of
  mascots.
