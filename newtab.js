const backgroundEl = document.getElementById("background");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

const weatherBackgrounds = {
  clear: "https://images.unsplash.com/photo-1472145246862-b24cf25c4a36?auto=format&fit=crop&w=2400&q=80",
  cloudy: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=2400&q=80",
  fog: "https://images.unsplash.com/photo-1487621167305-5d248087c724?auto=format&fit=crop&w=2400&q=80",
  rain: "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=2400&q=80",
  snow: "https://images.unsplash.com/photo-1483664852095-d6cc6870702d?auto=format&fit=crop&w=2400&q=80",
  thunder: "https://images.unsplash.com/photo-1461511669078-d46bf351cd6e?auto=format&fit=crop&w=2400&q=80",
  fallback: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=80",
};

function setBackground(url) {
  backgroundEl.style.backgroundImage = `url("${url}")`;
}

function getWeatherKey(code) {
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

  return "fallback";
}

async function fetchCurrentWeather(latitude, longitude) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=weather_code`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Weather fetch failed");
  }

  const data = await response.json();
  const weatherCode = data?.current?.weather_code;

  if (typeof weatherCode !== "number") {
    throw new Error("Invalid weather response");
  }

  return weatherCode;
}

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 7000,
      maximumAge: 15 * 60 * 1000,
    });
  });
}

async function initWeatherBackground() {
  try {
    const position = await getCurrentPosition();
    const { latitude, longitude } = position.coords;
    const weatherCode = await fetchCurrentWeather(latitude, longitude);
    const key = getWeatherKey(weatherCode);
    setBackground(weatherBackgrounds[key] || weatherBackgrounds.fallback);
  } catch {
    setBackground(weatherBackgrounds.fallback);
  }
}

function openSearch(query) {
  const trimmed = query.trim();
  if (!trimmed) {
    return;
  }

  const url = `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;
  window.location.href = url;
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  openSearch(searchInput.value);
});

window.addEventListener("load", () => {
  searchInput.focus();
  initWeatherBackground();
});
