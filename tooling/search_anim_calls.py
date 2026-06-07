with open("chunks/page-9dd69598f6d6d31d.js", "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

# Let's find HeroSection definition and print it entirely, including any helper functions inside or outside
import re
match = re.search(r'let\s*HeroSection\s*=\s*\(\)\s*=>\s*\{', content)
if match:
    # Print the next 4000 characters
    print(content[match.start():match.start()+4000])
