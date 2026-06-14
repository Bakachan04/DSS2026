import re

with open("archive/dss_index.html", "r", encoding="utf-8") as f:
    content = f.read()

img_tags = re.findall(r'<img[^>]*>', content, re.IGNORECASE)
print("Found img tags count:", len(img_tags))
for idx, img in enumerate(img_tags):
    print(f"{idx}: {img}")
