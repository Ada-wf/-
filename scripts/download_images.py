import urllib.request
import os
import sys
import struct
import zlib

DEST = r"D:\求职城市网\public\images\careers"
os.makedirs(DEST, exist_ok=True)

images = {
    "ai-engineer": "https://s.coze.cn/image/0tyF3AyaMYg/",
    "data-scientist": "https://s.coze.cn/image/2n1iEO0yEgg/",
    "doctor": "https://s.coze.cn/image/kQHMkmhtR8A/",
    "lawyer": "https://s.coze.cn/image/2G-_xlR1FUc/",
    "product-manager": "https://s.coze.cn/image/49FjpJ3UFF0/",
    "software-engineer": "https://s.coze.cn/image/_KQKIinL0AE/",
    "teacher": "https://s.coze.cn/image/Qd66tQPeK5g/",
}

try:
    from PIL import Image
    import io
    HAS_PIL = True
    print("Pillow available, will convert to WebP")
except ImportError:
    HAS_PIL = False
    print("Pillow not available, will try pip install or save as jpg")
    try:
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow", "-q"])
        from PIL import Image
        import io
        HAS_PIL = True
        print("Pillow installed successfully")
    except Exception as e:
        print(f"Could not install Pillow: {e}")

for name, url in images.items():
    print(f"Downloading {name}...")
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = resp.read()
        
        if HAS_PIL:
            img = Image.open(io.BytesIO(data))
            dest_path = os.path.join(DEST, f"{name}.webp")
            img.save(dest_path, "WEBP", quality=85)
        else:
            dest_path = os.path.join(DEST, f"{name}.jpg")
            with open(dest_path, "wb") as f:
                f.write(data)
        
        size_kb = os.path.getsize(dest_path) / 1024
        print(f"  -> {dest_path} ({size_kb:.1f} KB)")
    except Exception as e:
        print(f"  ERROR: {e}")

print("\nAll images processed!")
