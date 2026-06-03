# Samurai Raster Layers Spec

This folder is for the non-SVG character pipeline on the homepage.

## Required files

- `samurai-base.webp`
- `samurai-hair.webp`
- `samurai-arm-katana.webp`

## Canvas and alignment

- Size: `480x620` (exact)
- Background: transparent
- Character anchor: feet near bottom center (for stable stage alignment)
- Keep all layers registered to the same canvas origin

## Layer responsibilities

- `samurai-base.webp`: body, clothes, face, anything static
- `samurai-hair.webp`: hair and ponytail parts that should sit above body
- `samurai-arm-katana.webp`: arm + katana only (for swing animation)

## Style goals

- Anime style, cold tone, sharp silhouette
- 30 degree side view with partial face visible
- High collar and torn hem details
- Thin katana handle and clean blade highlight

## Export tips

- Prefer WebP (quality 92+)
- Avoid anti-aliased fringe on transparent edges
- Keep color profile as sRGB
