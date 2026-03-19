#!/bin/bash
# Compress hero video: trim to 60s, 1080p, ~5MB target
# Run: ./scripts/compress-hero-video.sh
# Requires: ffmpeg (brew install ffmpeg)

set -e
cd "$(dirname "$0")/.."
SRC="public/video/hero-leaves.mp4"
OUT="public/video/hero-leaves-compressed.mp4"
BACKUP="public/video/hero-leaves-original.mp4"

if ! command -v ffmpeg &>/dev/null; then
  echo "ffmpeg not found. Install with: brew install ffmpeg"
  exit 1
fi

if [ ! -f "$SRC" ]; then
  echo "Source video not found: $SRC"
  exit 1
fi

echo "Compressing video (trim to 60s, 1080p, ~2M bitrate)..."
mv "$SRC" "$BACKUP"
ffmpeg -y -i "$BACKUP" -t 60 -vf "scale=1920:1080" -c:v libx264 -crf 28 -preset medium -c:a aac -b:a 128k -movflags +faststart "$OUT"
mv "$OUT" "$SRC"
echo "Done. Original backed up to hero-leaves-original.mp4"
echo "New size: $(ls -lh "$SRC" | awk '{print $5}')"
