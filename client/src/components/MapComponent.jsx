import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { capitals } from '../data/capitals';
import L from 'leaflet';

// Marker icons for different colors (all available in the Leaflet color markers set)
const markerIcons = {
  blue: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    shadowSize: [41, 41],
  }),
  red: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    shadowSize: [41, 41],
  }),
  green: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    shadowSize: [41, 41],
  }),
  yellow: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    shadowSize: [41, 41],
  }),
  violet: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    shadowSize: [41, 41],
  }),
  orange: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    shadowSize: [41, 41],
  }),
  grey: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    shadowSize: [41, 41],
  }),
  black: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-black.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    shadowSize: [41, 41],
  }),
  default: new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    shadowSize: [41, 41],
  }),
};

// Weather code to icon mapping (Open-Meteo codes)
const weatherIcons = {
  0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️",
  45: "🌫️", 48: "🌫️",
  51: "🌦️", 53: "🌦️", 55: "🌦️",
  61: "🌧️", 63: "🌧️", 65: "🌧️",
  71: "❄️", 73: "❄️", 75: "❄️",
  80: "🌦️", 81: "🌦️", 82: "🌦️",
  95: "⛈️", 96: "⛈️", 99: "⛈️",
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

const MapComponent = ({ mode = 'weather', markerColor = 'blue' }) => {
  const navigate = useNavigate();
  const [weatherMap, setWeatherMap] = useState({});
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  // Listen for dark mode changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

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

  // Choose tile layer based on dark mode
  const tileLayerUrl = isDark
    ? "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const tileLayerAttribution = isDark
    ? '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    : '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  // Pick icon based on markerColor prop, fallback to default if not found
  const markerIcon = markerIcons[markerColor] || markerIcons.default;

  return (
    <div className="h-[60vh] md:h-screen w-full animate-fade-in-up transition-all duration-700">
      <MapContainer
        center={[22.9734, 78.6569]}
        zoom={5}
        className="h-full w-full rounded-xl shadow-2xl overflow-hidden"
      >
        <TileLayer
          url={tileLayerUrl}
          attribution={tileLayerAttribution}
        />
        {capitals.map((city) => (
          <Marker
            key={city.city}
            position={[city.lat, city.lon]}
            icon={markerIcon}
          >
            <Popup>
              <div className={`flex flex-col items-center min-w-[180px] rounded-lg p-2
                ${isDark ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}
                shadow-md transition-colors duration-300`}
              >
                <span className="font-bold text-lg mb-1">{city.city}</span>
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
                  className={`mt-2 px-2 py-1 rounded text-white`}
                  style={{ backgroundColor: markerColor }}
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
