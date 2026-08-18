#!/bin/zsh
# Cut the WTKR oven-load beat and slow it 2x for the ATF film.
# Source stays gitignored under public/refs/; the encode is the site asset.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/public/refs/story.mp4"
OUT="$ROOT/public/video"
mkdir -p "$OUT"
ffmpeg -y -ss 97.0 -to 108.5 -i "$SRC" \
  -an \
  -vf "setpts=2.0*PTS,scale=1280:720:flags=lanczos,format=yuv420p" \
  -c:v libx264 -crf 26 -preset slow -movflags +faststart \
  "$OUT/oven-load.mp4"
ffmpeg -y -ss 100.4 -i "$SRC" -frames:v 1 -update 1 -q:v 3 "$OUT/oven-load-poster.jpg"
ls -lh "$OUT"
