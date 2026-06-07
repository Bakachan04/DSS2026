import re

file_path = "chunks/page-9dd69598f6d6d31d.js"

with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

# Let's search for image sources, button text, headers, and look at their surroundings
# to reconstruct the exact structure of sections.
print("File length:", len(content))

# Find references to specific images in the javascript file
matches = re.finditer(r'src[:\s]+["\']([^"\']+)["\']|["\'](/img/[^"\']+)["\']|["\'](/carousel/[^"\']+)["\']|["\'](/Merch.png)["\']', content)
print("\n--- Image tags context ---")
for m in matches:
    start = max(0, m.start() - 100)
    end = min(len(content), m.end() + 100)
    context = content[start:end].replace('\n', ' ')
    print(f"Match: {m.group(0)} | Context: ... {context} ...\n")
