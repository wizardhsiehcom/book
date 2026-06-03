# Anime Character Production Prompt (Layered Raster)

Use this brief to generate or draw the homepage foreground character.

## Output format

- 3 files, transparent background, exact size: 480x620
- sRGB color profile
- WebP preferred (quality 92-98), PNG accepted

Files:
- samurai-base.webp
- samurai-hair.webp
- samurai-arm-katana.webp

## Visual direction

- Female samurai, 30-degree side/back pose
- Chibi proportion (about two heads tall)
- Cold and sharp anime style
- High collar, torn coat hem, long ponytail
- Thin katana handle and clean steel highlight
- Mood: calm, dangerous, restrained

## Layer split rules

### samurai-base.webp
Include:
- torso, coat, visible face part, neck, static cloth details
Exclude:
- hair strands that should overlap in front
- arm and katana that will be animated

### samurai-hair.webp
Include:
- all hair and ponytail volumes that sit over body
- hair accessory if anchored to hair
Exclude:
- face, torso, katana, sleeves

### samurai-arm-katana.webp
Include:
- one arm + sleeve + hand + katana as a single piece
- keep pivot roughly around shoulder region
Exclude:
- body and hair

## Composition constraints

- Feet/hem near bottom center to stabilize positioning
- Character should occupy 76%-84% of canvas height
- Keep silhouette readable at small size (144px wide on mobile)

## Negative constraints

- no watermark, no text
- no background scene
- no soft airbrush blur over edges
- no extra weapon or floating particles

## Recommended generation prompt

"Original anime-style chibi female samurai, 30-degree side-back pose, partial face visible, high collar coat, torn coat hem, long ponytail, thin katana hilt, cold blue-gray palette, sharp silhouette, clean cel shading, transparent background, high detail linework, original character design"
