import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import WeatherPage from './pages/WeatherPage';
import RiskPage from './pages/RiskPage';
import WeatherDetails from './components/WeatherDetails';
import RiskDetails from './components/RiskDetails';

function App() {
  const [mode, setMode] = useState('weather');

  return (
    <BrowserRouter>
      <div className="flex flex-col md:flex-row-reverse h-screen w-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-500">
        <Navbar mode={mode} setMode={setMode} />
        <div className="flex-1 flex flex-col items-center justify-center relative overflow-auto">
          <Routes>
            <Route path="/" element={<Home mode={mode} />} />
            <Route path="/weather" element={<WeatherPage mode={mode} />} />
            <Route path="/risk" element={<RiskPage mode={mode} />} />
            <Route path="/weather/:city" element={<WeatherDetails />} />
            <Route path="/risk/:city" element={<RiskDetails />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
