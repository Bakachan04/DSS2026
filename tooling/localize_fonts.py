import os
import re
import urllib.request

def download_fonts():
    print("Starting Google Fonts localization...")
    
    font_dir = "app/assets/fonts"
    os.makedirs(font_dir, exist_ok=True)
    
    # URL for Inter (300, 400, 500, 600, 700, 800) and Krona One (400)
    api_url = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Krona+One&display=swap"
    
    # We must use a modern User-Agent so Google Fonts returns WOFF2 format (otherwise it returns old TTF/EOT)
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36'
    }
    
    try:
        req = urllib.request.Request(api_url, headers=headers)
        with urllib.request.urlopen(req) as response:
            css_content = response.read().decode('utf-8')
        print("Successfully fetched Google Fonts CSS metadata.")
    except Exception as e:
        print(f"ERROR: Failed to fetch fonts metadata: {e}")
        return False
        
    # We parse the font-face definitions. Each font-face has:
    # font-family, font-style, font-weight, src: url(...) format('woff2')
    # Let's extract the blocks.
    blocks = re.findall(r'@font-face\s*\{([^}]+)\}', css_content)
    print(f"Found {len(blocks)} font-face definitions.")
    
    local_css_rules = []
    downloaded_urls = {}
    
    for idx, block in enumerate(blocks):
        # Extract family
        family_match = re.search(r'font-family:\s*\'([^\']+)\'', block)
        weight_match = re.search(r'font-weight:\s*(\d+)', block)
        style_match = re.search(r'font-style:\s*(\w+)', block)
        url_match = re.search(r'src:\s*url\((https://[^\)]+)\)', block)
        
        # unicode-range if present
        unicode_match = re.search(r'unicode-range:\s*([^;]+)', block)
        
        if not (family_match and url_match):
            continue
            
        family = family_match.group(1)
        weight = weight_match.group(1) if weight_match else "400"
        style = style_match.group(1) if style_match else "normal"
        remote_url = url_match.group(1)
        unicode_range = unicode_match.group(1) if unicode_match else None
        
        # Determine descriptive local name
        clean_family = family.lower().replace(" ", "-")
        # Google fonts has multiple chunks for subset ranges. Let's make unique filename
        filename = f"{clean_family}-{weight}-{style}-{idx}.woff2"
        local_path = os.path.join(font_dir, filename)
        
        # Download the woff2 file
        if remote_url not in downloaded_urls:
            print(f"Downloading {family} ({weight}/{style}) -> {local_path}...")
            try:
                font_req = urllib.request.Request(remote_url, headers=headers)
                with urllib.request.urlopen(font_req) as font_resp:
                    with open(local_path, "wb") as f:
                        f.write(font_resp.read())
                downloaded_urls[remote_url] = filename
                print("Downloaded.")
            except Exception as e:
                print(f"FAILED to download font file: {e}")
                continue
        else:
            filename = downloaded_urls[remote_url]
            
        # Build local @font-face block
        # Relative path from app/styles/index.css to app/assets/fonts/filename is ../assets/fonts/filename
        local_url = f"../assets/fonts/{filename}"
        
        rule = "@font-face {\n"
        rule += f"  font-family: '{family}';\n"
        rule += f"  font-style: {style};\n"
        rule += f"  font-weight: {weight};\n"
        rule += "  font-display: swap;\n"
        rule += f"  src: url('{local_url}') format('woff2');\n"
        if unicode_range:
            rule += f"  unicode-range: {unicode_range};\n"
        rule += "}"
        local_css_rules.append(rule)
        
    if not local_css_rules:
        print("ERROR: No local font-face rules were compiled.")
        return False
        
    # Read existing index.css
    css_path = "app/styles/index.css"
    with open(css_path, "r", encoding="utf-8") as f:
        existing_css = f.read()
        
    # Remove the @import URL line at the top of the css
    # Match: @import url('https://fonts.googleapis.com/css2?...');
    updated_css = re.sub(r'@import\s+url\([\'"]https://fonts\.googleapis\.com/css2[^\)]+[\'"]\);', '', existing_css)
    
    # Prepend the local font-face declarations to the CSS
    fonts_css_block = "\n".join(local_css_rules) + "\n\n"
    updated_css = fonts_css_block + updated_css.lstrip()
    
    with open(css_path, "w", encoding="utf-8") as f:
        f.write(updated_css)
    print("Successfully localized Google Fonts inside index.css.")
    return True

if __name__ == "__main__":
    download_fonts()
