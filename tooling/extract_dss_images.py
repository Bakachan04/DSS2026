import re

with open("archive/dss_index.html", "r", encoding="utf-8") as f:
    content = f.read()

# Look for image paths: ending in png, svg, jpg, jpeg, webp
paths = set(re.findall(r'"([^"]+\.(?:png|svg|jpg|jpeg|webp))"', content))
print("Images found in dss_index.html:")
for p in sorted(paths):
    print(p)
