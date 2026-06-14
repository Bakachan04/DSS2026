import re

path = r"C:\Users\Adarsh Bhatt\.gemini\antigravity-ide\brain\71e183ca-73b2-4a90-8150-01fec35ec837\.system_generated\steps\1860\content.md"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

links = re.findall(r'https://upload.wikimedia.org/wikipedia/commons/[^\s\)\"\'>]+', content)
print("Found links:")
for l in set(links):
    print(l)
