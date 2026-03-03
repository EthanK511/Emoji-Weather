# Weather Focus Tab (Chrome Extension)

A minimal Chrome new-tab extension inspired by clean dashboard pages:

- Full-screen weather-based background
- One centered search bar
- No extra widgets

## How it works

- Uses browser geolocation to get your coordinates
- Fetches current weather code from Open-Meteo
- Picks a matching visual background (clear, cloudy, rain, snow, etc.)

## Install in Chrome

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select this folder: `/home/speedye/GitHub/Emoji-Weather`

Open a new tab to see it.

## Files used by the extension

- `manifest.json` – extension manifest and new tab override
- `newtab.html` – minimal page with only search UI
- `newtab.css` – full-screen styling
- `newtab.js` – weather fetch + background switching + search behavior
