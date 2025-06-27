import React from 'react';
import MapComponent from '../components/MapComponent';

const WeatherPage = ({ mode }) => (
  <div className="w-full h-full">
    <MapComponent mode="weather" />
  </div>
);

export default WeatherPage;
