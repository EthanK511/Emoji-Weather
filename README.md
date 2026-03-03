# Weather Emoji App

A tiny web app that fetches **live weather data** and shows a matching **emoji**.

## Features

- Search weather by city name
- Choose temperature unit: Celsius or Fahrenheit
- Uses Open-Meteo Geocoding + Forecast APIs (no API key needed)
- Shows city with state/region (when available) and country
- Maps weather conditions to friendly emojis

## Run locally

You can run this with any static server.

### Option 1: Python

```bash
cd /home/speedye/GitHub/Emoji-Weather
python3 -m http.server 8080
```

Open: http://localhost:8080

### Option 2: VS Code Live Server

Open `index.html` with Live Server.

## Files

- `index.html` – UI
- `styles.css` – styling
- `app.js` – API calls + emoji mapping
