import React from 'react';
import MapComponent from '../components/MapComponent';

const LandUsePage = () => (
  <div className="w-full h-full">
    <MapComponent mode="landcover" markerColor="yellow" />
  </div>
);

export default LandUsePage;
