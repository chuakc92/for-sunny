# For Sunny ☀️ — Open When...

## What You Need To Provide

### 📸 Photos (put in `/photos/` folder)
All photos should be JPG format, ideally compressed for mobile (under 500KB each).

| Filename | What to use |
|----------|-------------|
| `blue-pond-her.jpg` | Her Blue Pond photo from Japan (IMG-20260617-WA0004 or WA0006) |
| `blue-pond-me.jpg` | Your Blue Pond photo (IMG-20260617-WA0007) |
| `farm-tomita-her.jpg` | Her at Farm Tomita / lavender field (IMG-20260617-WA0001 or WA0003) |
| `violin-headshot.jpg` | Her violin headshot (IMG-20260621-WA0000 or IMG-20260623-WA0006) |
| `recital-dress.jpg` | Her in the red recital dress (IMG-20260629-WA0000) |
| `spain-mallorca.jpg` | Her in Mallorca, Spain (IMG-20260624-WA0024 or WA0026) |
| `ballet.jpg` | Her ballet photo in pink (IMG-20260726-WA0056) |
| `ice-skating.jpg` | Her ice skating at Central Park (from her profile or video screenshot) |
| `karaoke.jpg` | The coin karaoke booth photos (IMG-20260625-WA0002 or WA0004) |
| `cafe-dessert.jpg` | The lavender ice cream cafe (IMG-20260623-WA0000) |
| `world-cup.jpg` | Your video/photo from the Korean bar World Cup viewing |
| `tulips.jpg` | The tulips from the grocery store (IMG-20260615-WA0000) |
| `prada-marfa.jpg` | You at Prada Marfa with the suitcase (IMG-20260624-WA0005) |
| `somi-somi.jpg` | Somi Somi dessert photos (IMG-20260618-WA0023 or WA0024) |
| `hair-styling.jpg` | Screenshot from your hair styling video (VID-20260628-WA0040) |
| `buldak.jpg` | The spicy tteokbokki she told you to try (IMG-20260623-WA0010) |
| `cat.jpg` | Her cat photo (IMG-20260623-WA0009) |
| `stickers.jpg` | Screenshot of the sticker exchange (STK-20260726 files) |

### 🎧 Audio (put in `/audio/` folder)
Record these as .m4a files (iPhone native format, best compatibility).
You can use Voice Memos on your phone and AirDrop them.

| Filename | What to record |
|----------|----------------|
| `miss-you-chinese.m4a` | 我好想你 — the voice message she loved |
| `good-morning.m4a` | A soft "Good morning, 자기야" in English + Chinese |
| `miss-you.m4a` | A longer "I miss you" message in Chinese |
| `bedtime.m4a` | The soft bedtime Chinese message (like your PTT-20260726-WA0054) |
| `something-new.m4a` | A new Chinese/Korean phrase for her to guess (e.g. 你很漂亮 or 나 행복해) |
| `for-smile.m4a` | A silly one — try saying something in Korean badly |

### Tips for audio:
- Keep each clip under 30 seconds
- .m4a works best on iPhone (AAC codec)
- .mp3 also works as fallback
- Record in a quiet space, speak softly

## How to Deploy

### Option 1: GitHub Pages (free, works offline)
1. Create a GitHub repo
2. Push all files
3. Go to Settings > Pages > Deploy from branch (main)
4. Send her the URL

### Option 2: Netlify (free, drag & drop)
1. Go to netlify.com
2. Drag the entire `open-when` folder onto the deploy area
3. Get your URL, send it to her

### Option 3: Local file (works in airplane mode)
1. Compress the folder as a zip
2. Send it to her phone
3. She opens index.html in Safari
4. Note: Audio may not work without a server

## iPhone-Specific Notes
- Tested for Safari iOS compatibility
- Uses -webkit prefixes where needed
- Safe area insets for notch/Dynamic Island
- Touch-optimized (44px tap targets, no hover states)
- Audio uses HTML5 Audio API (works on iOS 15+)
- No autoplay (iOS blocks it) — all audio is user-initiated
- Works in airplane mode once loaded (no external dependencies except Google Fonts on first load)

## Offline Support
The Google Fonts are the only external dependency. If you want it to work 100% offline:
1. Download Nunito and Caveat font files
2. Put them in a `/fonts/` folder  
3. Replace the Google Fonts link with local @font-face declarations

## Reset Progress
To reset all opened envelopes (for testing), open browser console and run:
```
localStorage.removeItem('openedEnvelopes');
location.reload();
```
