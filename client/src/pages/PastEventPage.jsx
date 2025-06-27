import React from 'react';
import MapComponent from '../components/MapComponent';

const PastEventPage = () => (
  <div className="w-full h-full">
    <MapComponent mode="pastevents" markerColor="red" />
  </div>
);

export default PastEventPage;
