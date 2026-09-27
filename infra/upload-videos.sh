#!/usr/bin/env bash
#
# Upload the lesson videos to the public Cloud Storage bucket.
# Run once from a checkout that still contains the MP4 files:
#
#   bash infra/upload-videos.sh <PROJECT_ID>
#
# Afterwards the files are removed from the repository and served from
# https://storage.googleapis.com/<PROJECT_ID>-videos/<filename>
set -euo pipefail

PROJECT_ID="${1:?usage: upload-videos.sh <PROJECT_ID>}"
BUCKET="gs://${PROJECT_ID}-videos"
SRC="$(cd "$(dirname "$0")/.." && pwd)/frontend/public/videos"

if ! ls "$SRC"/*.mp4 >/dev/null 2>&1; then
  echo "No MP4 files in $SRC (already moved?)"; exit 1
fi

gcloud storage cp "$SRC"/*.mp4 "$BUCKET/" --project "$PROJECT_ID" \
  --cache-control="public, max-age=86400"

echo
echo "Uploaded:"
gcloud storage ls -l "$BUCKET/" --project "$PROJECT_ID"
