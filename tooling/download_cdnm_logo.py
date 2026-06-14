import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {'User-Agent': 'Mozilla/5.0'}

url = "https://cdnm.iiitd.ac.in/assets/images/logo-dark.jpeg"
dest = "app/assets/logos/cdnm_logo_official.jpeg"

print("Downloading CDNM Logo...")
try:
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, context=ctx) as resp:
        with open(dest, "wb") as f:
            f.write(resp.read())
    print("Success CDNM Logo!")
except Exception as e:
    print("Failed:", e)
