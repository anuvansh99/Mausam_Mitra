import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { capitals } from '../data/capitals';
import L from 'leaflet';
import MarkerPopUp from './MarkerPopUp.jsx';

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

  // Filter and adjust capitals for non-weather modes
  let capitalsToShow = capitals;
  if (mode !== 'weather') {
    capitalsToShow = capitals.filter(c => c.state !== "Chandigarh");
    const haryana = { state: "Haryana", city: "Chandigarh", lat: 30.7333, lon: 76.7794 };
    const punjab = { state: "Punjab", city: "Chandigarh", lat: 30.7333, lon: 76.7794 };
    const statesSet = new Set(capitalsToShow.map(c => c.state));
    if (!statesSet.has("Haryana")) capitalsToShow.push(haryana);
    if (!statesSet.has("Punjab")) capitalsToShow.push(punjab);
    capitalsToShow = capitalsToShow.sort((a, b) => a.state.localeCompare(b.state));
  }

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
        {capitalsToShow.map((city) => (
          <Marker
            key={city.state + city.city}
            position={[city.lat, city.lon]}
            icon={markerIcon}
          >
            <Popup>
              <MarkerPopUp
                mode={mode}
                city={city.city}
                state={city.state}
                isDark={isDark}
                markerColor={markerColor}
                navigate={navigate}
                weatherData={weatherMap[city.city]}
              />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
