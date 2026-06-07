with open("chunks/page-9dd69598f6d6d31d.js", "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

import re
match = re.search(r'let\s*\[e,\s*t\]\s*=\s*\(0,\s*m\.H\)\(\)', content)
if match:
    start = max(0, match.start() - 500)
    end = min(len(content), match.end() + 2500)
    print("=== Hero animation context ===")
    print(content[start:end])
else:
    print("Animation hook invocation not found via strict regex.")
