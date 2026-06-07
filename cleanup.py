import os
import shutil

temp_files = [
    "dss_index.html",
    "extract_assets.py",
    "extract_contexts.py",
    "extract_texts.py",
    "extract_speaker_bios.py",
    "extract_full_speaker_details.py",
    "extract_priyanka.py",
    "download_css.py",
    "extract_css_rules.py",
    "extract_hero_grid.py",
    "extract_hero_animation.py",
    "search_anim_calls.py",
    "extract_merch.py",
    "extracted_strings.txt",
    "dss_style.css",
    "cleanup.py"
]

temp_dirs = [
    "chunks"
]

print("Cleaning up temporary files...")
for file in temp_files:
    if os.path.exists(file):
        try:
            os.remove(file)
            print(f"Removed {file}")
        except Exception as e:
            print(f"Failed to remove {file}: {e}")

for d in temp_dirs:
    if os.path.exists(d):
        try:
            shutil.rmtree(d)
            print(f"Removed directory {d}")
        except Exception as e:
            print(f"Failed to remove directory {d}: {e}")

print("Cleanup done!")
