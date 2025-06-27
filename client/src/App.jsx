import React from 'react';
import MapComponent from './components/MapComponent';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="flex flex-col md:flex-row-reverse h-screen w-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-500">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <MapComponent />
      </div>
    </div>
  );
}

export default App;
