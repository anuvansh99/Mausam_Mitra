import React from 'react';
import MapComponent from '../components/MapComponent';

const InfraPage = () => (
  <div className="w-full h-full">
    <MapComponent mode="infrastructure" markerColor="violet" />
  </div>
);

export default InfraPage;
