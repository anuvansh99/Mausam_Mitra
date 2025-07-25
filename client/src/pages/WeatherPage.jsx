import React from 'react';
import MapComponent from '../components/MapComponent';

const WeatherPage = () => (
  <div className="w-full h-full">
    <MapComponent mode="weather" markerColor="blue" />
  </div>
);

export default WeatherPage;
