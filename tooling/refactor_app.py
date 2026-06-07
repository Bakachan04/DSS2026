import os
import shutil
import re

def main():
    print("Refactoring production frontend files...")
    
    # 1. Copy index.css to app/styles/index.css
    shutil.copy2("index.css", "app/styles/index.css")
    print("Copied index.css -> app/styles/index.css")
    
    # 2. Copy index.js to app/scripts/index.js
    shutil.copy2("index.js", "app/scripts/index.js")
    print("Copied index.js -> app/scripts/index.js")
    
    # 3. Read index.html and perform replacements
    with open("index.html", "r", encoding="utf-8") as f:
        html = f.read()
    
    # CSS and JS links
    html = html.replace('href="index.css"', 'href="styles/index.css"')
    html = html.replace('src="index.js"', 'src="scripts/index.js"')
    
    # Favicon
    html = html.replace('https://dss2025.iiitd.edu.in/favicon.ico', 'assets/icons/favicon.ico')
    
    # Logos
    html = html.replace('https://dss2025.iiitd.edu.in/img/Logo.png', 'assets/logos/Logo.png')
    html = html.replace('https://dss2025.iiitd.edu.in/logos/Logo.png', 'assets/logos/HCD_Logo.png')
    
    # PDF
    html = html.replace('https://dss2025.iiitd.edu.in/acc.pdf', 'assets/pdfs/acc.pdf')
    
    # Merch
    html = html.replace('https://dss2025.iiitd.edu.in/Merch.png', 'assets/images/Merch.png')
    
    # Carousel 10 (About)
    html = html.replace('https://dss2025.iiitd.edu.in/carousel/10.jpg', 'assets/images/carousel/10.jpg')
    
    # Theme card Carousel 11
    html = html.replace('https://dss2025.iiitd.edu.in/carousel/11.jpg', 'assets/images/themes/11.jpg')
    
    # Theme cards img/4.jpg etc.
    html = html.replace('https://dss2025.iiitd.edu.in/img/4.jpg', 'assets/images/themes/4.jpg')
    html = html.replace('https://dss2025.iiitd.edu.in/img/3.jpg', 'assets/images/themes/3.jpg')
    html = html.replace('https://dss2025.iiitd.edu.in/img/1.jpg', 'assets/images/themes/1.jpg')
    html = html.replace('https://dss2025.iiitd.edu.in/img/2.jpg', 'assets/images/themes/2.jpg')
    
    # Marquee photos carousel/1.jpg etc.
    html = html.replace('https://dss2025.iiitd.edu.in/carousel/1.jpg', 'assets/images/carousel/1.jpg')
    html = html.replace('https://dss2025.iiitd.edu.in/carousel/4.jpg', 'assets/images/carousel/4.jpg')
    html = html.replace('https://dss2025.iiitd.edu.in/carousel/2.jpg', 'assets/images/carousel/2.jpg')
    html = html.replace('https://dss2025.iiitd.edu.in/carousel/3.jpg', 'assets/images/carousel/3.jpg')
    html = html.replace('https://dss2025.iiitd.edu.in/carousel/8.jpg', 'assets/images/carousel/8.jpg')
    html = html.replace('https://dss2025.iiitd.edu.in/carousel/5.jpg', 'assets/images/carousel/5.jpg')
    
    # Keynote and guest speakers
    html = html.replace('https://dss2025.iiitd.edu.in/img/Srinivasan-Venkataraman.png', 'assets/images/speakers/Srinivasan-Venkataraman.png')
    html = html.replace('https://dss2025.iiitd.edu.in/img/CDAC.png', 'assets/images/speakers/CDAC.png')
    html = html.replace('https://dss2025.iiitd.edu.in/img/Madhan_2024_2.jpg', 'assets/images/speakers/Madhan_2024_2.jpg')
    html = html.replace('https://dss2025.iiitd.edu.in/img/manojSinha.jpeg', 'assets/images/speakers/manojSinha.jpeg')
    html = html.replace('https://dss2025.iiitd.edu.in/img/gowdhamPrabhakar.jpeg', 'assets/images/speakers/gowdhamPrabhakar.jpeg')
    html = html.replace('https://dss2025.iiitd.edu.in/img/aruneshSingh.jpeg', 'assets/images/speakers/aruneshSingh.jpeg')
    html = html.replace('https://dss2025.iiitd.edu.in/img/Brijendra.png', 'assets/images/speakers/Brijendra.png')
    
    # Mentors - map remaining dss2025.iiitd.edu.in/img/ -> assets/images/mentors/
    # Using regex to catch any remaining img URLs
    html = re.sub(r'https://dss2025\.iiitd\.edu\.in/img/([\w-]+\.(?:jpg|jpeg|png|gif|svg))', r'assets/images/mentors/\1', html)
    
    # Verify no references to dss2025.iiitd.edu.in remain in links/images (exclude direct href external links to profile pages or registration forms)
    # The registration forms are docs.google.com, social links are linkedin/facebook/twitter, IIT Delhi profile links etc.
    # Let's search if any asset references still have iiitd.edu.in
    asset_refs = re.findall(r'src=["\'](https://dss2025\.iiitd\.edu\.in[^"\']+)["\']', html)
    href_refs = re.findall(r'href=["\'](https://dss2025\.iiitd\.edu\.in[^"\']+\.(?:pdf|ico|css|png|jpg|jpeg))["\']', html)
    
    if asset_refs or href_refs:
        print("WARNING: Some remote assets were not replaced:")
        for ref in asset_refs + href_refs:
            print(f" - {ref}")
    else:
        print("Success: All remote asset URL structures have been fully localized in index.html.")
        
    with open("app/index.html", "w", encoding="utf-8") as f:
        f.write(html)
    print("Wrote app/index.html")

if __name__ == "__main__":
    main()
