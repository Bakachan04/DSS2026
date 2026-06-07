import re

with open("dss_style.css", "r", encoding="utf-8") as f:
    css = f.read()

print("CSS length:", len(css))

# Look for font-face declarations
font_faces = re.findall(r'@font-face\s*\{[^}]*\}', css)
print("\n--- Font Faces ---")
for ff in font_faces[:5]:
    print(ff)

# Look for background grid or pattern images
bg_patterns = re.findall(r'background-image:[^;}]+', css)
print("\n--- Background Patterns (first 10) ---")
for bp in bg_patterns[:10]:
    print(bp)

# Look for custom animations/keyframes
keyframes = re.findall(r'@keyframes\s+\w+\s*\{[^}]*\}', css)
print("\n--- Keyframes ---")
for kf in keyframes[:5]:
    print(kf)
