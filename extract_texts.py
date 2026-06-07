import re

file_path = "chunks/page-9dd69598f6d6d31d.js"

with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

# Find strings in double/single quotes or template literals that are likely content
# We will look for strings containing letters and spaces that are longer than 15 chars
strings = re.findall(r'["\'`]([A-Za-z0-9\s\.,!\-\/\(\)\?\'’:\&©\*]{15,})["\'`]', content)

print("Found", len(strings), "strings")

with open("extracted_strings.txt", "w", encoding="utf-8") as out:
    for s in strings:
        out.write(s.strip() + "\n")

print("Saved to extracted_strings.txt")
