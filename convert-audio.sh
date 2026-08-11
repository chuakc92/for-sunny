#!/bin/bash
# Convert opus voice notes to m4a for iOS Safari compatibility
# Run from: /home/chuakc/sunny/open-when
# Requires: ffmpeg (install with: sudo apt install ffmpeg)

AUDIO=./audio
mkdir -p "$AUDIO"

# Map: PTT source filename -> target m4a filename
# FILL IN the correct PTT filenames after listening to them!
# The ones below are my BEST GUESSES based on chat context/dates.
# Listen and swap if wrong.

declare -A MAP
MAP[PTT-20260703-WA0048.opus]=miss-you-chinese.m4a   # Early July — likely your 我好想你
MAP[PTT-20260630-WA0006.opus]=good-morning.m4a       # Jun 30 — "오늘 아침에 눈뜨자마자 성희 생각났어"
MAP[PTT-20260705-WA0001.opus]=miss-you.m4a           # Jul 5 — another sweet message
MAP[PTT-20260708-WA0000.opus]=bedtime.m4a            # Jul 8 — your perfected "잘 자"
MAP[PTT-20260703-WA0049.opus]=something-new.m4a      # Jul 3 — follow-up voice note
MAP[PTT-20260703-WA0026.opus]=for-smile.m4a          # Jul 3 — "밤샘 힘내고, 졸리면 꼭 쉬어"
MAP[PTT-20260703-WA0050.opus]=with-you.m4a           # Jul 3 — another in the series

echo "Converting opus -> m4a..."
echo ""

FAIL=0
for SRC in "${!MAP[@]}"; do
    DST="${MAP[$SRC]}"
    INPUT="$AUDIO/$SRC"
    OUTPUT="$AUDIO/$DST"
    
    if [ ! -f "$INPUT" ]; then
        echo "  MISSING: $SRC (skipping)"
        FAIL=$((FAIL+1))
        continue
    fi
    
    ffmpeg -y -i "$INPUT" -c:a aac -b:a 128k -movflags +faststart "$OUTPUT" 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "  OK: $SRC -> $DST"
    else
        echo "  FAILED: $SRC -> $DST"
        FAIL=$((FAIL+1))
    fi
done

echo ""
echo "Done! Failures: $FAIL"
echo ""
echo "=== VERIFY THESE BY LISTENING ==="
echo "If a file is wrong, update the MAP above and re-run."
echo ""
echo "Target files needed in audio/:"
echo "  miss-you-chinese.m4a  — Your 我好想你 voice message"
echo "  good-morning.m4a      — A good morning greeting in Korean"
echo "  miss-you.m4a          — Another 'I miss you' message"
echo "  bedtime.m4a           — A goodnight/sleep well message"
echo "  something-new.m4a     — Something for her to guess"
echo "  for-smile.m4a         — Something to make her smile"
echo "  with-you.m4a          — The intimate final message"
echo ""
echo "Also make sure audio/xiang-jian-ni.mp3 exists (background music)."
