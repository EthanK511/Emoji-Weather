const form = document.getElementById("weather-form");
const cityInput = document.getElementById("city");
const unitInput = document.getElementById("unit");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");
const emojiEl = document.getElementById("emoji");
const locationEl = document.getElementById("location");
const conditionEl = document.getElementById("condition");
const tempEl = document.getElementById("temp");
const weatherBgEl = document.getElementById("weather-bg");
let lastWeatherData = null;

const weatherBackgroundGifs = {
  clear: "https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif",
  cloudy: "https://media.giphy.com/media/xT0xeJpnrWC4XWblEk/giphy.gif",
  fog: "https://media.giphy.com/media/l0Iy0ZURatgztvYxq/giphy.gif",
  rain: "https://media.giphy.com/media/26BRuo6sLetdllPAQ/giphy.gif",
  snow: "https://media.giphy.com/media/l3vR85PnGsBwu1PFK/giphy.gif",
  thunder: "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif",
  default: "https://media.giphy.com/media/l0HlPwMAzh13pcZ20/giphy.gif",
};

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

function getWeatherBackgroundKey(code) {
  if (code === 0 || code === 1) {
    return "clear";
  }

  if (code === 2 || code === 3) {
    return "cloudy";
  }

  if (code === 45 || code === 48) {
    return "fog";
  }

  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return "snow";
  }

  if ([95, 96, 99].includes(code)) {
    return "thunder";
  }

  if (
    [
      51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82,
    ].includes(code)
  ) {
    return "rain";
  }

  return "default";
}

function updateWeatherBackground(code) {
  const key = getWeatherBackgroundKey(code);
  const gifUrl = weatherBackgroundGifs[key] || weatherBackgroundGifs.default;

  weatherBgEl.style.backgroundImage = `linear-gradient(rgb(2 6 23 / 0.45), rgb(2 6 23 / 0.45)), url("${gifUrl}")`;
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

async function fetchWeather(latitude, longitude) {
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&temperature_unit=celsius`;

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

function getDisplayTemperature(celsiusValue, unit) {
  if (unit === "fahrenheit") {
    return (celsiusValue * 9) / 5 + 32;
  }

  return celsiusValue;
}

function renderWeather(location, weatherData, unit) {
  const info = getWeatherInfo(weatherData.weatherCode);
  const unitLabel = unit === "fahrenheit" ? "°F" : "°C";
  const locationParts = [location.name, location.region, location.country].filter(Boolean);
  const displayTemp = getDisplayTemperature(weatherData.temperatureCelsius, unit);

  updateWeatherBackground(weatherData.weatherCode);
  emojiEl.textContent = info.emoji;
  locationEl.textContent = locationParts.join(", ");
  conditionEl.textContent = info.text;
  tempEl.textContent = `${Math.round(displayTemp)}${unitLabel}`;
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
    const current = await fetchWeather(location.latitude, location.longitude);

    lastWeatherData = {
      location,
      weatherData: {
        temperatureCelsius: current.temperature_2m,
        weatherCode: current.weather_code,
      },
    };

    renderWeather(lastWeatherData.location, lastWeatherData.weatherData, unit);
    setStatus("Updated.");
  } catch (error) {
    resultEl.classList.add("hidden");
    setStatus(error.message || "Something went wrong.");
  }
});

unitInput.addEventListener("change", () => {
  if (!lastWeatherData) {
    return;
  }

  renderWeather(lastWeatherData.location, lastWeatherData.weatherData, unitInput.value);
  setStatus("Unit updated.");
});
