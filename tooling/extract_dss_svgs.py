import re

with open("archive/dss_index.html", "r", encoding="utf-8") as f:
    content = f.read()

svgs = re.findall(r'<svg[^>]*>.*?</svg>', content, re.DOTALL)
print("Found SVGs count:", len(svgs))

for idx, svg in enumerate(svgs):
    # Print the first 200 chars of each SVG
    print(f"\n--- SVG {idx} ---")
    print(svg[:300])
    if len(svg) > 300:
        print("...")
        print(svg[-100:])
