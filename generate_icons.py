import subprocess
import os

icons = {
    "drive": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
      <defs>
        <linearGradient id="g_green" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#00E676"/>
          <stop offset="100%" stop-color="#00A843"/>
        </linearGradient>
        <linearGradient id="g_yellow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFEB3B"/>
          <stop offset="100%" stop-color="#FBC02D"/>
        </linearGradient>
        <linearGradient id="g_blue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#2979FF"/>
          <stop offset="100%" stop-color="#1565C0"/>
        </linearGradient>
      </defs>
      <!-- Google Drive Triangle -->
      <g transform="translate(256, 256) scale(1.1)">
        <!-- Green Top Segment -->
        <path d="M -70 -130 L 70 -130 Q 120 -130 95 -85 L 15 55 Q -10 100 -60 100 L -120 100 L -70 -130 Z" fill="url(#g_green)"/>
        <!-- Yellow Right Segment -->
        <path d="M 60 -90 L 150 65 Q 175 110 135 150 Q 95 180 40 180 L -100 180 L 10 0 Z" fill="url(#g_yellow)"/>
        <!-- Blue Left Segment -->
        <path d="M -130 -80 L -30 100 L -130 180 Q -175 180 -185 130 Q -195 80 -160 20 Z" fill="url(#g_blue)"/>
      </g>
    </svg>''',

    "gmail": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
      <g transform="translate(32, 72) scale(18.5)">
        <path fill="#4285F4" d="M20 18h-3V9.25L12 13 7 9.25V18H4V6c0-1.1.9-2 2-2h1.5L12 8.5 16.5 4H18c1.1 0 2 .9 2 2v12z"/>
        <path fill="#34A853" d="M17 18h3c1.1 0 2-.9 2-2V6l-3 2.5v11.5z"/>
        <path fill="#EA4335" d="M4 6v12h3V8.5L4 6z"/>
        <path fill="#EA4335" d="M20 6l-8 6.25L4 6h2.5L12 10.25 17.5 6H20z"/>
        <path fill="#FBBC04" d="M17 8.5V6l3 2.25V18h-3V8.5z"/>
      </g>
    </svg>''',

    "docs": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
      <g transform="translate(96, 46)">
        <!-- Main sheet -->
        <path fill="#2684FC" d="M 0 40 C 0 18 18 0 40 0 L 220 0 L 320 100 L 320 380 C 320 402 302 420 280 420 L 40 420 C 18 420 0 402 0 380 Z"/>
        <!-- Folded Corner -->
        <path fill="#0066DA" opacity="0.25" d="M 220 0 L 320 100 L 220 100 Z"/>
        <path fill="#A0C3FF" d="M 220 0 L 320 100 L 240 100 C 229 100 220 91 220 80 Z"/>
        <!-- Lines -->
        <rect x="65" y="200" width="190" height="36" rx="18" fill="#FFFFFF"/>
        <rect x="65" y="265" width="140" height="36" rx="18" fill="#FFFFFF"/>
      </g>
    </svg>''',

    "sheets": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
      <g transform="translate(96, 46)">
        <!-- Main sheet -->
        <path fill="#0F9D58" d="M 0 40 C 0 18 18 0 40 0 L 220 0 L 320 100 L 320 380 C 320 402 302 420 280 420 L 40 420 C 18 420 0 402 0 380 Z"/>
        <!-- Folded Corner -->
        <path fill="#00832D" opacity="0.25" d="M 220 0 L 320 100 L 220 100 Z"/>
        <path fill="#87CEAC" d="M 220 0 L 320 100 L 240 100 C 229 100 220 91 220 80 Z"/>
        <!-- Spreadsheet Grid -->
        <rect x="65" y="175" width="190" height="160" rx="14" fill="#FFFFFF"/>
        <rect x="80" y="190" width="72" height="58" rx="6" fill="#0F9D58"/>
        <rect x="164" y="190" width="76" height="58" rx="6" fill="#0F9D58"/>
        <rect x="80" y="260" width="72" height="58" rx="6" fill="#0F9D58"/>
        <rect x="164" y="260" width="76" height="58" rx="6" fill="#0F9D58"/>
      </g>
    </svg>''',

    "calendar": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
      <g transform="translate(66, 66)">
        <!-- Base Tile -->
        <rect x="0" y="0" width="380" height="380" rx="80" fill="#2684FC"/>
        <!-- Light blue top banner -->
        <path d="M 0 80 C 0 35 35 0 80 0 L 300 0 C 345 0 380 35 380 80 L 380 115 L 0 115 Z" fill="#82B1FF"/>
        <!-- Number 31 -->
        <text x="190" y="305" text-anchor="middle" fill="#FFFFFF" font-size="200" font-weight="900" font-family="system-ui, -apple-system, sans-serif" letter-spacing="-6">31</text>
      </g>
    </svg>''',

    "tasks": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
      <g transform="translate(56, 56)">
        <!-- Blue circle -->
        <circle cx="200" cy="200" r="200" fill="#2684FC"/>
        <!-- Bottom arc shadow -->
        <path d="M 12 210 C 24 300 95 380 200 380 C 305 380 376 300 388 210 C 364 280 295 345 200 345 C 105 345 36 280 12 210 Z" fill="#82B1FF"/>
        <!-- Checkmark -->
        <path fill="none" stroke="#FFFFFF" stroke-width="48" stroke-linecap="round" stroke-linejoin="round" d="M 105 200 L 170 265 L 295 135"/>
      </g>
    </svg>''',

    "notion": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
      <g transform="translate(66, 66)">
        <!-- Notion 3D Box -->
        <!-- Outer black box body -->
        <path fill="#000000" d="M 40 50 L 330 20 L 360 70 L 360 330 L 70 360 L 40 310 Z"/>
        <!-- Top Face -->
        <path fill="#FFFFFF" stroke="#000000" stroke-width="18" stroke-linejoin="round" d="M 40 50 L 330 20 L 280 80 L 40 80 Z"/>
        <!-- Front White Face -->
        <rect x="70" y="80" width="260" height="260" rx="14" fill="#FFFFFF" stroke="#000000" stroke-width="22"/>
        <!-- Letter N -->
        <text x="200" y="270" text-anchor="middle" fill="#000000" font-size="220" font-weight="900" font-family="Georgia, serif">N</text>
      </g>
    </svg>'''
}

os.makedirs("public/icons", exist_ok=True)

for name, svg_content in icons.items():
    svg_path = f"public/icons/{name}.svg"
    png_path = f"public/icons/{name}.png"
    
    with open(svg_path, "w") as f:
        f.write(svg_content)
        
    cmd = ["ffmpeg", "-i", svg_path, "-s", "512x512", png_path, "-y"]
    subprocess.run(cmd, check=True)
    print(f"Generated {png_path}")

print("All icons successfully generated!")
