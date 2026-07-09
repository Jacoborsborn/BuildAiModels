#!/usr/bin/env python3
"""
Generates assets/brand/og-image.png (1200x630) for link previews.

Social platforms (WhatsApp, iMessage, X, LinkedIn, Slack) want a wide
1200x630 image; the square favicon gets rejected or cropped, which is why
previews showed no logo. Study Hall palette, BAM mark on the right.

Run once, or again after a rebrand:
  python3 scripts/gen-og-image.py
"""
from PIL import Image, ImageDraw, ImageFont
import os

ROOT = os.path.join(os.path.dirname(__file__), "..")
BRAND = os.path.join(ROOT, "assets", "brand")

W, H = 1200, 630
BG = "#FAF9F3"      # --bg
INK = "#262B36"     # --ink
MUTED = "#7A8194"   # --muted
YELLOW = "#F0C64A"  # --yellow
LINE = "#E8E6DD"    # --line

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

def font(name, size):
    return ImageFont.truetype(f"/System/Library/Fonts/Supplemental/{name}.ttf", size)

f_badge = font("Arial Bold", 26)
f_title = font("Arial Black", 58)
f_sub = font("Arial", 28)
f_dom = font("Arial Bold", 26)

# top + bottom accent rules
d.rectangle([0, 0, W, 10], fill=YELLOW)
d.rectangle([0, H - 10, W, H], fill=YELLOW)

LX = 84  # left margin

# badge pill
badge = "BUILDAIMODELS"
bw = d.textlength(badge, font=f_badge)
d.rounded_rectangle([LX, 96, LX + bw + 44, 148], radius=26, fill=YELLOW)
d.text((LX + 22, 108), badge, font=f_badge, fill=INK)

# title
d.text((LX, 216), "The Web Design", font=f_title, fill=INK)
d.text((LX, 290), "Agency Starter Kit", font=f_title, fill=INK)

# subline
d.text((LX, 412), "14 modules · one-time payment · module 00 free", font=f_sub, fill=MUTED)

# domain
d.text((LX, 496), "buildaimodels.co.uk", font=f_dom, fill=INK)

# BAM mark on a card, right side (the mark PNG has its own off-white tile,
# so frame it deliberately instead of letting the edge show)
CARD = 320
cx, cy = W - CARD - 84, (H - CARD) // 2
d.rounded_rectangle([cx, cy, cx + CARD, cy + CARD], radius=32, fill="#FFFEFB", outline=LINE, width=2)
mark = Image.open(os.path.join(BRAND, "bam-mark-master.png")).convert("RGBA")
mark.thumbnail((230, 230), Image.LANCZOS)
img.paste(mark, (cx + (CARD - mark.width) // 2, cy + (CARD - mark.height) // 2), mark)

out = os.path.join(BRAND, "og-image.png")
img.save(out, optimize=True)
print(f"✓ {out} written ({os.path.getsize(out) // 1024} KB)")
