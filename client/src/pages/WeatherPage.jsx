import React from 'react';
import MapComponent from '../components/MapComponent';

const WeatherPage = ({ mode = 'weather' }) => {
  // The mode prop ensures MapComponent shows weather markers
  return (
    <div className="w-full h-full">
      <MapComponent mode={mode} />
    </div>
  );
};

export default WeatherPage;
