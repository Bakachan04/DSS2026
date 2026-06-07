import os
import urllib.request

assets = [
    # Favicon
    ("https://dss2025.iiitd.edu.in/favicon.ico", "app/assets/icons/favicon.ico"),
    # Logos
    ("https://dss2025.iiitd.edu.in/img/Logo.png", "app/assets/logos/Logo.png"),
    ("https://dss2025.iiitd.edu.in/logos/Logo.png", "app/assets/logos/HCD_Logo.png"),
    # PDF
    ("https://dss2025.iiitd.edu.in/acc.pdf", "app/assets/pdfs/acc.pdf"),
    # Merch
    ("https://dss2025.iiitd.edu.in/Merch.png", "app/assets/images/Merch.png"),
    # Carousel (About, and Classroom photos)
    ("https://dss2025.iiitd.edu.in/carousel/10.jpg", "app/assets/images/carousel/10.jpg"),
    ("https://dss2025.iiitd.edu.in/carousel/1.jpg", "app/assets/images/carousel/1.jpg"),
    ("https://dss2025.iiitd.edu.in/carousel/4.jpg", "app/assets/images/carousel/4.jpg"),
    ("https://dss2025.iiitd.edu.in/carousel/2.jpg", "app/assets/images/carousel/2.jpg"),
    ("https://dss2025.iiitd.edu.in/carousel/3.jpg", "app/assets/images/carousel/3.jpg"),
    ("https://dss2025.iiitd.edu.in/carousel/8.jpg", "app/assets/images/carousel/8.jpg"),
    ("https://dss2025.iiitd.edu.in/carousel/5.jpg", "app/assets/images/carousel/5.jpg"),
    # Themes
    ("https://dss2025.iiitd.edu.in/img/4.jpg", "app/assets/images/themes/4.jpg"),
    ("https://dss2025.iiitd.edu.in/img/3.jpg", "app/assets/images/themes/3.jpg"),
    ("https://dss2025.iiitd.edu.in/img/1.jpg", "app/assets/images/themes/1.jpg"),
    ("https://dss2025.iiitd.edu.in/img/2.jpg", "app/assets/images/themes/2.jpg"),
    ("https://dss2025.iiitd.edu.in/carousel/11.jpg", "app/assets/images/themes/11.jpg"),
    # Speakers
    ("https://dss2025.iiitd.edu.in/img/Srinivasan-Venkataraman.png", "app/assets/images/speakers/Srinivasan-Venkataraman.png"),
    ("https://dss2025.iiitd.edu.in/img/CDAC.png", "app/assets/images/speakers/CDAC.png"),
    ("https://dss2025.iiitd.edu.in/img/Madhan_2024_2.jpg", "app/assets/images/speakers/Madhan_2024_2.jpg"),
    ("https://dss2025.iiitd.edu.in/img/manojSinha.jpeg", "app/assets/images/speakers/manojSinha.jpeg"),
    ("https://dss2025.iiitd.edu.in/img/gowdhamPrabhakar.jpeg", "app/assets/images/speakers/gowdhamPrabhakar.jpeg"),
    ("https://dss2025.iiitd.edu.in/img/aruneshSingh.jpeg", "app/assets/images/speakers/aruneshSingh.jpeg"),
    ("https://dss2025.iiitd.edu.in/img/Brijendra.png", "app/assets/images/speakers/Brijendra.png"),
    # Mentors
    ("https://dss2025.iiitd.edu.in/img/aman_samuel.jpg", "app/assets/images/mentors/aman_samuel.jpg"),
    ("https://dss2025.iiitd.edu.in/img/anmol_srivastav.jpg", "app/assets/images/mentors/anmol_srivastav.jpg"),
    ("https://dss2025.iiitd.edu.in/img/anoopsir.png", "app/assets/images/mentors/anoopsir.png"),
    ("https://dss2025.iiitd.edu.in/img/Jainendra.png", "app/assets/images/mentors/Jainendra.png"),
    ("https://dss2025.iiitd.edu.in/img/Kalpana.png", "app/assets/images/mentors/Kalpana.png"),
    ("https://dss2025.iiitd.edu.in/img/Pragma.png", "app/assets/images/mentors/Pragma.png"),
    ("https://dss2025.iiitd.edu.in/img/Rajiv.png", "app/assets/images/mentors/Rajiv.png"),
    ("https://dss2025.iiitd.edu.in/img/richa_gupta.jpg", "app/assets/images/mentors/richa_gupta.jpg"),
    ("https://dss2025.iiitd.edu.in/img/sonal.png", "app/assets/images/mentors/sonal.png")
]

# Set a browser-like User Agent to avoid blocks
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36'}

print("Starting download of production assets...")
success_count = 0
failed_assets = []

for url, local_path in assets:
    # Ensure local directory exists
    local_dir = os.path.dirname(local_path)
    os.makedirs(local_dir, exist_ok=True)
    
    print(f"Downloading {url} -> {local_path}...")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as response:
            with open(local_path, 'wb') as out_file:
                out_file.write(response.read())
        print("Success.")
        success_count += 1
    except Exception as e:
        print(f"FAILED: {e}")
        failed_assets.append((url, local_path))

print("\n--- Summary ---")
print(f"Successfully downloaded {success_count} / {len(assets)} assets.")
if failed_assets:
    print(f"Failed to download {len(failed_assets)} assets:")
    for url, path in failed_assets:
        print(f" - {url}")
else:
    print("All assets downloaded successfully.")
