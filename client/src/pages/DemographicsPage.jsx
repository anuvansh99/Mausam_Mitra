import React from 'react';
import MapComponent from '../components/MapComponent';

const DemographicsPage = () => (
  <div className="w-full h-full">
    <MapComponent mode="demographics" markerColor="orange" />
  </div>
);

export default DemographicsPage;
