---
name: Download and Establish Course Resources
description: Standardized workflow for downloading YouTube transcripts, cleaning VTT files, and scraping course materials from websites.
---

# Download and Establish Course Resources

This skill outlines the standard operating procedure for initializing a new course in the `data/` directory by downloading its transcripts and supplementary materials.

## 1. Directory Structure Setup
When starting a new course (e.g., `<course_id>`), first create the standard directory structure:
- `data/<course_id>/transcripts/`: For raw and cleaned video transcripts.
- `data/<course_id>/reference/`: For course slides, readings, and papers.
- `data/<course_id>/assignments/`: For homework PDFs and starter code.

## 2. Downloading and Cleaning Transcripts
When given a YouTube playlist link:
1. Download English subtitles using `yt-dlp`:
   ```bash
   mkdir -p data/<course_id>/transcripts
   uvx yt-dlp --write-auto-subs --write-subs --skip-download --sub-langs en -o "data/<course_id>/transcripts/%(title)s [%(id)s].%(ext)s" "<playlist_url>"
   ```
2. Clean the `.vtt` files and convert them to `.txt` using the existing script:
   ```bash
   uv run python clean_vtt.py data/<course_id>/transcripts data/<course_id>/transcripts
   rm -f data/<course_id>/transcripts/*.vtt
   ```

## 3. Scraping Course Websites (OCW, Course Homepages)
When given a course website URL to extract important data (PDFs, ZIPs, arXiv papers):
1. Write a custom Python script in the `tools/` folder (e.g., `tools/download_<course_id>.py`).
2. The script should use `requests` and `BeautifulSoup` to find links ending in `.pdf`, `.zip`, `.mov`, or containing `arxiv.org/abs/` (which should be converted to `/pdf/`).
3. Download these files into the appropriate directories (`reference/` for slides/papers, `assignments/` for homework/code).
4. Run the script using `uv run --with beautifulsoup4 --with requests python tools/download_<course_id>.py`.

## 4. Automation Reminders
- Always run downloads as background tasks because large downloads or playlists take time.
- Verify the downloaded files after the tasks complete.
