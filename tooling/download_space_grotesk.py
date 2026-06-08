import os
import re
import urllib.request

def download_space_grotesk():
    print("Downloading Space Grotesk font...")
    font_dir = "app/assets/fonts"
    os.makedirs(font_dir, exist_ok=True)
    
    api_url = "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36'
    }
    
    try:
        req = urllib.request.Request(api_url, headers=headers)
        with urllib.request.urlopen(req) as response:
            css_content = response.read().decode('utf-8')
    except Exception as e:
        print(f"Error fetching font metadata: {e}")
        return
        
    blocks = re.findall(r'@font-face\s*\{([^}]+)\}', css_content)
    local_rules = []
    downloaded = {}
    
    for idx, block in enumerate(blocks):
        family_match = re.search(r'font-family:\s*\'([^\']+)\'', block)
        weight_match = re.search(r'font-weight:\s*(\d+)', block)
        style_match = re.search(r'font-style:\s*(\w+)', block)
        url_match = re.search(r'src:\s*url\((https://[^\)]+)\)', block)
        unicode_match = re.search(r'unicode-range:\s*([^;]+)', block)
        
        if not (family_match and url_match):
            continue
            
        family = family_match.group(1)
        weight = weight_match.group(1) if weight_match else "400"
        style = style_match.group(1) if style_match else "normal"
        remote_url = url_match.group(1)
        unicode_range = unicode_match.group(1) if unicode_match else None
        
        clean_family = family.lower().replace(" ", "-")
        filename = f"{clean_family}-{weight}-{style}-{idx}.woff2"
        local_path = os.path.join(font_dir, filename)
        
        if remote_url not in downloaded:
            print(f"Downloading {filename}...")
            try:
                font_req = urllib.request.Request(remote_url, headers=headers)
                with urllib.request.urlopen(font_req) as font_resp:
                    with open(local_path, "wb") as f:
                        f.write(font_resp.read())
                downloaded[remote_url] = filename
            except Exception as e:
                print(f"Failed to download: {e}")
                continue
        else:
            filename = downloaded[remote_url]
            
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
        local_rules.append(rule)
        
    if local_rules:
        css_path = "app/styles/index.css"
        with open(css_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Prepend the new rules to the top of index.css
        new_rules_str = "\n".join(local_rules) + "\n\n"
        with open(css_path, "w", encoding="utf-8") as f:
            f.write(new_rules_str + content)
        print("Space Grotesk localized and added to index.css successfully!")

if __name__ == '__main__':
    download_space_grotesk()
