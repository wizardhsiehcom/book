import os
import re

def clean_vtt(input_dir, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    for filename in os.listdir(input_dir):
        if not filename.endswith('.vtt'):
            continue
        
        filepath = os.path.join(input_dir, filename)
        # Create a new filename with .txt instead of .en.vtt or .vtt
        out_filename = filename.replace('.en.vtt', '.txt').replace('.vtt', '.txt')
        out_filepath = os.path.join(output_dir, out_filename)
        
        with open(filepath, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            
        cleaned_lines = []
        for line in lines:
            line = line.strip()
            # Skip empty lines, WEBVTT headers, Kind, Language, and timestamp lines
            if not line or line.startswith('WEBVTT') or line.startswith('Kind:') or line.startswith('Language:') or '-->' in line:
                continue
            
            # Remove styling/alignment tags like <c.color> or <00:00:00.000>
            line = re.sub(r'<[^>]+>', '', line)
            
            # YT auto-subs often have duplicate identical consecutive lines
            if not cleaned_lines or line != cleaned_lines[-1]:
                cleaned_lines.append(line)
                
        # Further clean YT auto-subs duplication (where cues shift line by line)
        # Often line 1 and line 2 of the previous cue match the new cue.
        final_lines = []
        for line in cleaned_lines:
            if not final_lines:
                final_lines.append(line)
                continue
                
            # If the current line is completely contained at the end of the previous line (or vice versa), skip it
            if line in final_lines[-1] or final_lines[-1] in line:
                if len(line) > len(final_lines[-1]):
                    final_lines[-1] = line
                continue
                
            final_lines.append(line)
            
        with open(out_filepath, 'w', encoding='utf-8') as f:
            f.write(' '.join(final_lines))

import sys

if __name__ == "__main__":
    if len(sys.argv) > 2:
        input_dir = sys.argv[1]
        output_dir = sys.argv[2]
        clean_vtt(input_dir, output_dir)
        print(f"VTT cleaning done for {input_dir}")
    else:
        print("Usage: python clean_vtt.py <input_dir> <output_dir>")
