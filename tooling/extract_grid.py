with open("chunks/page-9dd69598f6d6d31d.js", "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

import re
# Let's search for "grid" or "svg" or "svg" patterns or background patterns in page JS
matches = re.finditer(r'<svg[^>]*>|background|grid-cols|grid-rows', content)
print("Found matches:")
count = 0
for m in matches:
    count += 1
    if count > 20:
        break
    start = max(0, m.start() - 50)
    end = min(len(content), m.end() + 50)
    print(content[start:end].replace('\n', ' '))
