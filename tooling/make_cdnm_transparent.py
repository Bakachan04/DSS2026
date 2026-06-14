from PIL import Image

src_path = "app/assets/logos/cdnm_logo_official.jpeg"
dest_path = "app/assets/logos/cdnm_logo_official.png"

try:
    img = Image.open(src_path).convert("RGBA")
    data = img.getdata()
    
    new_data = []
    for item in data:
        # If the pixel is close to white (RGB > 240), make it transparent
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            new_data.append((255, 255, 255, 0))
        else:
            # We can also convert non-white dark pixels to match current text color?
            # Actually, let's just make it transparent first.
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(dest_path, "PNG")
    print("Successfully converted CDNM logo to transparent PNG!")
except Exception as e:
    print("Error:", e)
