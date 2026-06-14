import urllib.request
import re
import ssl

# Ignore SSL verification issues just in case
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

urls = [
    ("HCD", "https://hcd.iiitd.ac.in/"),
    ("CDNM", "https://cdnm.iiitd.ac.in/"),
    ("DSS", "https://dss.iiitd.edu.in/")
]

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9'
}

for name, url in urls:
    print(f"\n--- Fetching {name} ({url}) ---")
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            html = resp.read().decode('utf-8')
        # Find img tags
        imgs = re.findall(r'<img[^>]*>', html, re.IGNORECASE)
        print(f"Found {len(imgs)} img tags.")
        for idx, img in enumerate(imgs):
            if "logo" in img.lower() or "brand" in img.lower() or "iiit" in img.lower() or "cdnm" in img.lower() or "hcd" in img.lower():
                print(f"[{idx}] {img}")
    except Exception as e:
        print(f"Failed to fetch {name}: {e}")
