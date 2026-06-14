with open("archive/dss_index.html", "r", encoding="utf-8") as f:
    content = f.read()

import re
# Let's find matches and print context
queries = ["iiit", "hcd", "cdnm", "design summer school", "center for design"]
for q in queries:
    matches = list(re.finditer(re.escape(q), content, re.IGNORECASE))
    print(f"\nQuery '{q}' found {len(matches)} times:")
    for idx, m in enumerate(matches[:5]):
        pos = m.start()
        surr = content[max(0, pos-100):pos+200]
        # Clean up text
        surr_clean = surr.replace('\n', ' ').strip()
        print(f"  [{idx}] ...{surr_clean}...")
