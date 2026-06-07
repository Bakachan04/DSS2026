import re

file_path = "chunks/page-9dd69598f6d6d31d.js"

with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

# Let's search for "CDAC.png", "Madhan_2024_2.jpg", "manojSinha.jpeg", "gowdhamPrabhakar.jpeg", "aruneshSingh.jpeg", "Brijendra.png"
keys = ["CDAC.png", "Madhan_2024_2.jpg", "manojSinha.jpeg", "gowdhamPrabhakar.jpeg", "aruneshSingh.jpeg", "Brijendra.png"]

print("--- Speaker Details ---")
for k in keys:
    match = re.search(k, content)
    if match:
        start = max(0, match.start() - 100)
        end = min(len(content), match.end() + 1200)
        print(f"=== KEY: {k} ===")
        print(content[start:end])
        print("\n" + "="*40 + "\n")
