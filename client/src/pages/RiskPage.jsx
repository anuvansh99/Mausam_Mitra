import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { capitals } from '../data/capitals';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom red marker icon
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

const RiskPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-[60vh] md:h-screen w-full animate-fade-in-up transition-all duration-700">
      <MapContainer
        center={[22.9734, 78.6569]} // Center of India
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
            icon={redIcon}
          >
            <Popup>
              <span className="font-bold text-red-600 dark:text-red-300">{city.city}</span>
              <br />
              Capital of {city.state}
              <br />
              <button
                onClick={() => navigate(`/risk/${city.city}`)}
                className="mt-2 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Show Details
              </button>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default RiskPage;
