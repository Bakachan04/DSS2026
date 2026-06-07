with open("chunks/page-9dd69598f6d6d31d.js", "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

import re
match = re.search("CDAC.png", content)
if match:
    start = max(0, match.start() - 100)
    end = min(len(content), match.end() + 1500)
    print(content[start:end])
