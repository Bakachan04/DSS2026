import os
import re

def harden():
    print("Starting frontend security hardening and iframe replacement...")
    
    html_path = "app/index.html"
    if not os.path.exists(html_path):
        print("ERROR: app/index.html not found.")
        return
        
    with open(html_path, "r", encoding="utf-8") as f:
        html = f.read()
        
    # 1. Replace Google Maps iframe with static image and external map link
    iframe_block = '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.7957355134567!2d77.27060127529043!3d28.5458587880118!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce3e564daac1d%3A0x2c582e340e7bc556!2sIndraprastha%20Institute%20of%20Information%20Technology%20Delhi!5e0!3m2!1sen!2sin!4v1743186565396!5m2!1sen!2sin" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
    
    static_map_replacement = """<a href="https://www.google.com/maps/place/Indraprastha+Institute+of+Information+Technology+Delhi/@28.5458588,77.2706013,17z/data=!3m1!4b1!4m6!3m5!1s0x390ce3e564daac1d:0x2c582e340e7bc556!8m2!3d28.5458588!4d77.2731762!16s%2Fm%2F04zqqy6?entry=ttu" target="_blank" rel="noopener noreferrer">
          <img src="assets/images/map-static.png" alt="IIIT Delhi Map Location" style="width: 100%; height: 100%; object-fit: cover; border: 0; display: block;" />
        </a>"""
        
    if iframe_block in html:
        html = html.replace(iframe_block, static_map_replacement)
        print("Replaced Google Maps iframe embed with a static local map image preview link.")
    else:
        print("WARNING: Target maps iframe block not found in HTML. Check if already modified.")
        
    # 2. Add rel="noopener noreferrer" to all target="_blank" anchors that do not have it
    # We find all <a> tags with target="_blank"
    # Matches patterns like <a ... target="_blank" ...> or similar
    # Using a regex to locate all anchors with target="_blank"
    
    def add_rel(match):
        anchor_content = match.group(0)
        # Check if rel is already present
        if 'rel=' in anchor_content:
            return anchor_content
        # Add rel="noopener noreferrer"
        # We can append it just before the closing tag or right after target="_blank"
        if 'target="_blank"' in anchor_content:
            return anchor_content.replace('target="_blank"', 'target="_blank" rel="noopener noreferrer"')
        elif "target='_blank'" in anchor_content:
            return anchor_content.replace("target='_blank'", "target='_blank' rel='noopener noreferrer'")
        return anchor_content

    # Regex to match <a> tags
    html, count = re.subn(r'<a\b[^>]*\btarget=["\']_blank["\'][^>]*>', add_rel, html)
    print(f"Audited external links and added rel='noopener noreferrer' to {count} anchors.")
    
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html)
    print("Saved app/index.html securely.")

if __name__ == "__main__":
    harden()
