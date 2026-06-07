import urllib.request

url = "https://dss2025.iiitd.edu.in/_next/static/css/a70e8e47043da6a8.css"
try:
    urllib.request.urlretrieve(url, "dss_style.css")
    print("CSS file downloaded successfully!")
except Exception as e:
    print("Failed to download CSS:", e)
