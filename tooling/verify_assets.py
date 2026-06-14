import os
import re

def verify():
    print("Running verification checks...")
    
    html_path = "app/index.html"
    if not os.path.exists(html_path):
        print("ERROR: app/index.html not found.")
        return False
        
    with open(html_path, "r", encoding="utf-8") as f:
        html = f.read()
        
    # Check for any remaining reference to dss2025.iiitd.edu.in
    remote_matches = re.findall(r'https://dss2025\.iiitd\.edu\.in[^\s"\'<>]*', html)
    if remote_matches:
        print("ERROR: Remaining references to remote dss2025 domain:")
        for match in remote_matches:
            print(f" - {match}")
        return False
    else:
        print("SUCCESS: No remote asset URL references to dss2025 remain.")
        
    # Extract asset references
    # Look for src="..." or href="..." referencing assets/... styles/... scripts/...
    srcs = re.findall(r'src=["\'](assets/[^"\']+|scripts/[^"\']+)["\']', html)
    hrefs = re.findall(r'href=["\'](assets/[^"\']+|styles/[^"\']+)["\']', html)
    
    all_refs = sorted(list(set(srcs + hrefs)))
    print(f"Found {len(all_refs)} local file references inside app/index.html.")
    
    missing_files = []
    for ref in all_refs:
        # Strip query parameters (e.g. ?v=1.2) for path check
        clean_ref = ref.split('?')[0]
        local_path = os.path.join("app", clean_ref)
        if not os.path.exists(local_path):
            missing_files.append(local_path)
            
    if missing_files:
        print("ERROR: The following referenced local assets are missing from the folder:")
        for mf in missing_files:
            print(f" - {mf}")
        return False
    else:
        print("SUCCESS: All referenced local assets are present in the app/ folder structure.")
        return True

if __name__ == "__main__":
    verify()
