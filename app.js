const form = document.getElementById("weather-form");
const cityInput = document.getElementById("city");
const unitInput = document.getElementById("unit");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");
const emojiEl = document.getElementById("emoji");
const locationEl = document.getElementById("location");
const conditionEl = document.getElementById("condition");
const tempEl = document.getElementById("temp");

const weatherMap = {
  0: { text: "Clear sky", emoji: "☀️" },
  1: { text: "Mainly clear", emoji: "🌤️" },
  2: { text: "Partly cloudy", emoji: "⛅" },
  3: { text: "Overcast", emoji: "☁️" },
  45: { text: "Fog", emoji: "🌫️" },
  48: { text: "Depositing rime fog", emoji: "🌫️" },
  51: { text: "Light drizzle", emoji: "🌦️" },
  53: { text: "Moderate drizzle", emoji: "🌦️" },
  55: { text: "Dense drizzle", emoji: "🌧️" },
  56: { text: "Freezing drizzle", emoji: "🌨️" },
  57: { text: "Dense freezing drizzle", emoji: "🌨️" },
  61: { text: "Slight rain", emoji: "🌦️" },
  63: { text: "Moderate rain", emoji: "🌧️" },
  65: { text: "Heavy rain", emoji: "🌧️" },
  66: { text: "Light freezing rain", emoji: "🌨️" },
  67: { text: "Heavy freezing rain", emoji: "🌨️" },
  71: { text: "Slight snow", emoji: "🌨️" },
  73: { text: "Moderate snow", emoji: "❄️" },
  75: { text: "Heavy snow", emoji: "❄️" },
  77: { text: "Snow grains", emoji: "❄️" },
  80: { text: "Rain showers", emoji: "🌦️" },
  81: { text: "Rain showers", emoji: "🌧️" },
  82: { text: "Violent rain showers", emoji: "⛈️" },
  85: { text: "Snow showers", emoji: "🌨️" },
  86: { text: "Heavy snow showers", emoji: "❄️" },
  95: { text: "Thunderstorm", emoji: "⛈️" },
  96: { text: "Thunderstorm with hail", emoji: "⛈️" },
  99: { text: "Thunderstorm with heavy hail", emoji: "⛈️" },
};

function getWeatherInfo(code) {
  return weatherMap[code] || { text: "Unknown weather", emoji: "🌈" };
}

async function geocodeCity(city) {
  const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    city
  )}&count=1&language=en&format=json`;

  const response = await fetch(geocodeUrl);
  if (!response.ok) {
    throw new Error("Could not fetch location data.");
  }

  const data = await response.json();
  const place = data.results?.[0];
  if (!place) {
    throw new Error("City not found. Try a different name.");
  }

  return {
    name: place.name,
    region: place.admin1 || place.admin2 || "",
    country: place.country,
    latitude: place.latitude,
    longitude: place.longitude,
  };
}

async function fetchWeather(latitude, longitude, unit) {
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&temperature_unit=${unit}`;

  const response = await fetch(weatherUrl);
  if (!response.ok) {
    throw new Error("Could not fetch weather data.");
  }

  const data = await response.json();
  if (!data.current) {
    throw new Error("Weather data unavailable for this location.");
  }

  return data.current;
}

function setStatus(message) {
  statusEl.textContent = message;
}

function renderWeather(location, current, unit) {
  const info = getWeatherInfo(current.weather_code);
  const unitLabel = unit === "fahrenheit" ? "°F" : "°C";
  const locationParts = [location.name, location.region, location.country].filter(Boolean);

  emojiEl.textContent = info.emoji;
  locationEl.textContent = locationParts.join(", ");
  conditionEl.textContent = info.text;
  tempEl.textContent = `${Math.round(current.temperature_2m)}${unitLabel}`;
  resultEl.classList.remove("hidden");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();
  const unit = unitInput.value;

  if (!city) {
    setStatus("Please enter a city name.");
    resultEl.classList.add("hidden");
    return;
  }

  try {
    setStatus("Looking up city...");
    resultEl.classList.add("hidden");

    const location = await geocodeCity(city);

    setStatus("Fetching live weather...");
    const current = await fetchWeather(location.latitude, location.longitude, unit);

    renderWeather(location, current, unit);
    setStatus("Updated.");
  } catch (error) {
    resultEl.classList.add("hidden");
    setStatus(error.message || "Something went wrong.");
  }
});
