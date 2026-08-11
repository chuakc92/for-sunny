#!/bin/bash
# Run from: /home/chuakc/sunny/open-when
# This copies WhatsApp exports into properly named files for the app.
# Source: the photos/ folder already has the raw WhatsApp images in it.

PHOTOS=./photos
SRC="$PHOTOS"  # images are already in photos/

# Clean copies (source already in photos/ folder)
cp "$SRC/IMG-20260617-WA0006.jpg" "$PHOTOS/blue-pond-her.jpg" 2>/dev/null
cp "$SRC/IMG-20260615-WA0017.jpg" "$PHOTOS/blue-pond-me.jpg" 2>/dev/null
cp "$SRC/IMG-20260621-WA0000.jpg" "$PHOTOS/violin-headshot.jpg" 2>/dev/null
cp "$SRC/IMG-20260623-WA0006.jpg" "$PHOTOS/recital-dress.jpg" 2>/dev/null
cp "$SRC/IMG-20260624-WA0024.jpg" "$PHOTOS/spain-mallorca.jpg" 2>/dev/null
cp "$SRC/IMG-20260625-WA0005.jpg" "$PHOTOS/karaoke.jpg" 2>/dev/null
cp "$SRC/IMG-20260623-WA0000.jpg" "$PHOTOS/cafe-dessert.jpg" 2>/dev/null
cp "$SRC/IMG-20260624-WA0005.jpg" "$PHOTOS/prada-marfa.jpg" 2>/dev/null
cp "$SRC/IMG-20260623-WA0009.jpg" "$PHOTOS/cat.jpg" 2>/dev/null
cp "$SRC/IMG-20260623-WA0008.jpg" "$PHOTOS/ice-skating.jpg" 2>/dev/null  # VERIFY: is this actually ice skating?

echo "=== DONE: 10 photos renamed ==="
echo ""
echo "=== STILL NEED FROM YOU (not in WhatsApp export): ==="
echo "  photos/farm-tomita-her.jpg   - Her at the lavender field"
echo "  photos/ballet.jpg            - Her ballet in pink"
echo "  photos/ice-skating.jpg       - VERIFY the current file or replace"
echo "  photos/world-cup.jpg         - World Cup night (your bar photo?)"
echo "  photos/tulips.jpg            - Tulips at grocery store you sent her"
echo "  photos/somi-somi.jpg         - Somi Somi dessert night"
echo "  photos/hair-styling.jpg      - Midnight hair styling"
echo "  photos/buldak.jpg            - Spicy tteokbokki/buldak challenge"
echo "  photos/stickers.jpg          - Sticker war collage (Jul 26)"
