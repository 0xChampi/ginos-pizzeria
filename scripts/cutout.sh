#!/usr/bin/env bash
# cutout.sh — cleanly cut a subject out of a flat white/cream background,
# preserving enclosed white bodies (bread, tins, plates) that a naive
# background-remover (or removebg-preview) leaves a ~50%-opaque haze around.
#
# The trick: flood-fill transparency from all four CORNERS only, so white that
# is *connected to the edge* (the background) is removed, but white *enclosed*
# by ink outlines (the subject's body) survives. Then trim the empty border.
#
# Usage:
#   ./cutout.sh in.png [out.png] [fuzz%]
#   ./cutout.sh loaf.png loaf-cut.png 12
#   for f in *.png; do ./cutout.sh "$f" "${f%.png}-cut.png"; done
#
# Requires ImageMagick (magick). Verify after: a corner should be fully
# transparent and the center still opaque.

set -euo pipefail
IN="${1:?usage: cutout.sh in.png [out.png] [fuzz%]}"
OUT="${2:-${IN%.*}-cut.png}"
FUZZ="${3:-12}"

magick "$IN" -alpha set -bordercolor white -border 1 \
  -fuzz "${FUZZ}%" -fill none -draw "alpha 0,0 floodfill" \
  -fuzz "${FUZZ}%" -fill none -draw "alpha 0,%[fx:h-1] floodfill" \
  -fuzz "${FUZZ}%" -fill none -draw "alpha %[fx:w-1],0 floodfill" \
  -fuzz "${FUZZ}%" -fill none -draw "alpha %[fx:w-1],%[fx:h-1] floodfill" \
  -shave 1x1 -trim +repage "$OUT"

# Report so the caller can sanity-check.
corner="$(magick "$OUT" -format '%[pixel:p{1,1}]' info: 2>/dev/null || echo '?')"
size="$(magick identify -format '%wx%h' "$OUT" 2>/dev/null || echo '?')"
echo "✓ $OUT  (corner=$corner, trimmed=$size)"
echo "  if the subject has a white body, eyeball it — floodfill can rarely leak through a broken outline."
