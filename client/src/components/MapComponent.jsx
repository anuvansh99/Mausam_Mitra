import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = () => (
  <div className="h-[60vh] md:h-screen w-full animate-fade-in-up transition-all duration-700">
    <MapContainer
      center={[28.6139, 77.2090]} // New Delhi
      zoom={6}
      className="h-full w-full rounded-xl shadow-2xl overflow-hidden"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[28.6139, 77.2090]}>
        <Popup>
          <span className="font-bold text-blue-700 dark:text-blue-300">New Delhi</span>
          <br />
          A pretty CSS popup.<br />Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  </div>
);

export default MapComponent;
