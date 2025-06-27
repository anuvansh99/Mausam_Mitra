import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import WeatherPage from './pages/WeatherPage';
import WeatherDetails from './components/WeatherDetails';
import DemographicsPage from './pages/DemographicsPage';
import DemographicDetails from './components/DemographicDetails';
import LandUsePage from './pages/LandUsePage';
import LandDetails from './components/LandDetails';
import InfraPage from './pages/InfraPage';
import InfraDetails from './components/InfraDetails';
import PastEventPage from './pages/PastEventPage';
import PastEventDetails from './components/PastEventDetails';

// Mapping from mode to markerColor
const modeToColor = {
  weather: 'blue',
  demographics: 'orange', // Use 'orange' instead of 'pink' for compatibility
  landcover: 'yellow',
  infrastructure: 'violet',
  pastevents: 'red',
};

function App() {
  const [mode, setMode] = useState('weather');
  const markerColor = modeToColor[mode] || 'blue';

  return (
    <BrowserRouter>
      <div className="flex flex-col md:flex-row-reverse h-screen w-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-500">
        <Navbar mode={mode} setMode={setMode} />
        <div className="flex-1 flex flex-col items-center justify-center relative overflow-auto">
          <Routes>
            <Route path="/" element={<Home mode={mode} />} />
            <Route path="/weather" element={<WeatherPage mode={mode} markerColor="blue" />} />
            <Route path="/weather/:city" element={<WeatherDetails />} />
            <Route path="/demographics" element={<DemographicsPage mode={mode} markerColor="orange" />} />
            <Route path="/demographics/:city" element={<DemographicDetails />} />
            <Route path="/landcover" element={<LandUsePage mode={mode} markerColor="yellow" />} />
            <Route path="/landcover/:city" element={<LandDetails />} />
            <Route path="/infrastructure" element={<InfraPage mode={mode} markerColor="violet" />} />
            <Route path="/infrastructure/:city" element={<InfraDetails />} />
            <Route path="/pastevents" element={<PastEventPage mode={mode} markerColor="red" />} />
            <Route path="/pastevents/:city" element={<PastEventDetails />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
