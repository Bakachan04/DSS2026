import urllib.request
import re
import os

base_url = "https://dss2025.iiitd.edu.in"

chunks = [
    "/_next/static/chunks/webpack-3e91caff0090f0dd.js",
    "/_next/static/chunks/fd9d1056-cb725ee83a80b6d0.js",
    "/_next/static/chunks/472-87742524cc39e459.js",
    "/_next/static/chunks/main-app-41cc9268719e1500.js",
    "/_next/static/chunks/8e1d74a4-bdc5c52a4d352202.js",
    "/_next/static/chunks/413-461caa3f13e58ee8.js",
    "/_next/static/chunks/609-e07c15e2abfb2f3c.js",
    "/_next/static/chunks/app/layout-2504acdd203d8faf.js",
    "/_next/static/chunks/app/loading-4974128347ecd6b3.js",
    "/_next/static/chunks/128-a9dd06dd24b4c04a.js",
    "/_next/static/chunks/app/page-9dd69598f6d6d31d.js"
]

os.makedirs("chunks", exist_ok=True)

print("Downloading chunks...")
for chunk in chunks:
    chunk_name = chunk.split("/")[-1]
    url = base_url + chunk
    try:
        urllib.request.urlretrieve(url, f"chunks/{chunk_name}")
        print(f"Downloaded {chunk_name}")
    except Exception as e:
        print(f"Failed to download {chunk}: {e}")

# Read and extract assets and texts
image_paths = set()
strings = []

for file in os.listdir("chunks"):
    if file.endswith(".js"):
        with open(f"chunks/{file}", "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
            # find all relative image paths like /img/... or /assets/... or .png / .jpg / .svg / .webp
            imgs = re.findall(r'["\'](/img/[^"\']+)["\']', content)
            image_paths.update(imgs)
            imgs2 = re.findall(r'["\'](/assets/[^"\']+)["\']', content)
            image_paths.update(imgs2)
            # find static next images or imports
            imgs3 = re.findall(r'["\']([^"\']+\.(?:png|jpg|jpeg|gif|svg|webp))["\']', content)
            image_paths.update(imgs3)

print("\n--- Extracted Image Paths ---")
for img in sorted(list(image_paths)):
    print(img)
