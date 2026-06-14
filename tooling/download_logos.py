import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {'User-Agent': 'Mozilla/5.0'}

# Download IIITD Insignia SVG
url_iiitd = "https://upload.wikimedia.org/wikipedia/commons/e/e8/IIIT-Delhi_Insignia.svg"
dest_iiitd = "app/assets/logos/iiitd_insignia.svg"

# Download HCD Official Logo PNG
url_hcd = "https://hcd.iiitd.ac.in/logo-with-text-large-solid.png"
dest_hcd = "app/assets/logos/hcd_logo_official.png"

print("Downloading IIITD Insignia...")
try:
    req = urllib.request.Request(url_iiitd, headers=headers)
    with urllib.request.urlopen(req, context=ctx) as resp:
        with open(dest_iiitd, "wb") as f:
            f.write(resp.read())
    print("Success IIITD SVG!")
except Exception as e:
    print("Failed IIITD SVG:", e)

print("\nDownloading HCD PNG...")
try:
    req = urllib.request.Request(url_hcd, headers=headers)
    with urllib.request.urlopen(req, context=ctx) as resp:
        with open(dest_hcd, "wb") as f:
            f.write(resp.read())
    print("Success HCD PNG!")
except Exception as e:
    print("Failed HCD PNG:", e)
