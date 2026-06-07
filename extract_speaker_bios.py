import re

file_path = "chunks/page-9dd69598f6d6d31d.js"

with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

speakers = [
    "Priyanka Jain",
    "Madhan Kumar",
    "Manoj Sinha",
    "Gowdham Prabhakar",
    "Arunesh",
    "Bijendra"
]

print("--- Speaker Bios Context ---")
for s in speakers:
    match = re.search(s, content)
    if match:
        start = max(0, match.start() - 100)
        end = min(len(content), match.end() + 1000)
        print(f"=== {s} ===")
        print(content[start:end])
        print("\n" + "="*40 + "\n")
