#!/usr/bin/env python3
"""Download English transcripts (no timestamps) for a YouTube playlist.

Run:
  uv run --with yt-dlp --with youtube-transcript-api \
      python tools/download_transcripts.py \
      "https://youtu.be/JuoVZkPBiKk?list=PLoROMvodv4rMqXOcazWaTUHhq-yembLCV"

Output: one .txt per video in data/cs336/transcripts/, named NN_title.txt
"""
import re
import subprocess
import sys
from pathlib import Path

from youtube_transcript_api import YouTubeTranscriptApi  # type: ignore
from youtube_transcript_api._errors import (  # type: ignore
    NoTranscriptFound,
    TranscriptsDisabled,
)

OUT_DIR = Path(__file__).resolve().parent.parent / "data" / "cs336" / "transcripts"


def playlist_items(url: str) -> list[tuple[str, str]]:
    """Return [(video_id, title), ...] in playlist order via yt-dlp CLI."""
    out = subprocess.run(
        ["yt-dlp", "--flat-playlist", "--print", "%(id)s\t%(title)s", url],
        capture_output=True, text=True, check=True,
    ).stdout
    items = []
    for line in out.splitlines():
        if "\t" in line:
            vid, title = line.split("\t", 1)
            items.append((vid.strip(), title.strip()))
    return items


def fetch_text(video_id: str) -> str:
    """Plain transcript text, no timestamps. Handles old + new API shapes."""
    try:  # youtube-transcript-api >= 1.0 (instance API)
        snippets = YouTubeTranscriptApi().fetch(video_id, languages=["en"])
        parts = [s.text for s in snippets]
    except TypeError:  # older static API
        parts = [c["text"] for c in
                 YouTubeTranscriptApi.get_transcript(video_id, languages=["en"])]
    return "\n".join(p.strip() for p in parts if p.strip())


def slug(name: str) -> str:
    return re.sub(r"[^\w\-]+", "_", name).strip("_")[:80]


def main() -> None:
    if len(sys.argv) < 2:
        sys.exit("usage: download_transcripts.py <playlist_or_video_url>")
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    items = playlist_items(sys.argv[1])
    print(f"{len(items)} videos -> {OUT_DIR}")
    for i, (vid, title) in enumerate(items, 1):
        dest = OUT_DIR / f"{i:02d}_{slug(title)}.txt"
        if dest.exists():
            print(f"  skip {dest.name}")
            continue
        try:
            dest.write_text(fetch_text(vid), encoding="utf-8")
            print(f"  ok   {dest.name}")
        except (NoTranscriptFound, TranscriptsDisabled) as e:
            print(f"  MISS {vid} ({title}): {type(e).__name__}")


if __name__ == "__main__":
    main()
