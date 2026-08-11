#!/bin/bash
cd /home/chuakc/sunny/open-when/photos

# These files got lost. Re-copy from WhatsApp export or from the described files already in this folder.
# Check if the source IMG files exist here (you dumped everything in photos/ earlier)
[ -f IMG-20260623-WA0006.jpg ] && cp IMG-20260623-WA0006.jpg recital-dress.jpg && echo "recital-dress OK"
[ -f IMG-20260624-WA0024.jpg ] && cp IMG-20260624-WA0024.jpg spain-mallorca.jpg && echo "spain-mallorca OK"
[ -f IMG-20260625-WA0005.jpg ] && cp IMG-20260625-WA0005.jpg karaoke.jpg && echo "karaoke OK"
[ -f IMG-20260623-WA0000.jpg ] && cp IMG-20260623-WA0000.jpg cafe-dessert.jpg && echo "cafe-dessert OK"

echo "---"
ls recital-dress.jpg spain-mallorca.jpg karaoke.jpg cafe-dessert.jpg 2>&1
