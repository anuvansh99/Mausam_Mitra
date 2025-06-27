import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { capitals } from '../data/capitals';
import L from 'leaflet';

// Default (blue) marker
const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

// Red marker for risks
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

// Weather code to icon mapping (Open-Meteo codes)
const weatherIcons = {
  0: "☀️", // Clear sky
  1: "🌤️", 2: "⛅", 3: "☁️", // Mainly clear, partly cloudy, overcast
  45: "🌫️", 48: "🌫️", // Fog
  51: "🌦️", 53: "🌦️", 55: "🌦️", // Drizzle
  61: "🌧️", 63: "🌧️", 65: "🌧️", // Rain
  71: "❄️", 73: "❄️", 75: "❄️", // Snow
  80: "🌦️", 81: "🌦️", 82: "🌦️", // Rain showers
  95: "⛈️", 96: "⛈️", 99: "⛈️", // Thunderstorm
};
const weatherDescriptions = {
  0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Fog", 48: "Depositing rime fog",
  51: "Light drizzle", 53: "Moderate drizzle", 55: "Dense drizzle",
  61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
  71: "Slight snow", 73: "Moderate snow", 75: "Heavy snow",
  80: "Slight rain showers", 81: "Moderate rain showers", 82: "Violent rain showers",
  95: "Thunderstorm", 96: "Thunderstorm with hail", 99: "Thunderstorm with heavy hail",
};
function getWeatherIcon(code) {
  return weatherIcons[code] || "❓";
}
function getWeatherDesc(code) {
  return weatherDescriptions[code] || "Unknown";
}

const MapComponent = ({ mode = 'weather' }) => {
  const navigate = useNavigate();
  const [weatherMap, setWeatherMap] = useState({});

  // Fetch weather for all capitals in weather mode
  useEffect(() => {
    if (mode !== 'weather') return;
    const fetchAllWeather = async () => {
      const results = {};
      await Promise.all(
        capitals.map(async (city) => {
          try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,weathercode&timezone=auto`;
            const res = await fetch(url);
            if (!res.ok) return;
            const data = await res.json();
            results[city.city] = data.current || null;
          } catch {
            results[city.city] = null;
          }
        })
      );
      setWeatherMap(results);
    };
    fetchAllWeather();
  }, [mode]);

  return (
    <div className="h-[60vh] md:h-screen w-full animate-fade-in-up transition-all duration-700">
      <MapContainer
        center={[22.9734, 78.6569]}
        zoom={5}
        className="h-full w-full rounded-xl shadow-2xl overflow-hidden"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {capitals.map((city) => (
          <Marker
            key={city.city}
            position={[city.lat, city.lon]}
            icon={mode === 'risk' ? redIcon : defaultIcon}
          >
            <Popup>
              <div className="flex flex-col items-center min-w-[180px]">
                <span className={`font-bold text-lg mb-1 ${mode === 'risk' ? 'text-red-600 dark:text-red-300' : 'text-blue-700 dark:text-blue-300'}`}>
                  {city.city}
                </span>
                <span className="text-xs mb-2 text-gray-500">Capital of {city.state}</span>
                {mode === 'weather' ? (
                  weatherMap[city.city] ? (
                    <div className="flex flex-col items-center">
                      <span className="text-3xl">
                        {getWeatherIcon(weatherMap[city.city].weathercode)}
                      </span>
                      <span className="font-semibold text-xl">
                        {weatherMap[city.city].temperature_2m}°C
                      </span>
                      <span className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        {getWeatherDesc(weatherMap[city.city].weathercode)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400 mb-2">Weather data not available</span>
                  )
                ) : null}
                <button
                  onClick={() => navigate(`/${mode}/${city.city}`)}
                  className={`mt-2 px-2 py-1 rounded text-white ${
                    mode === 'risk'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  Show Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
