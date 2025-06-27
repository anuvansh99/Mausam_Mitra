import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { capitals } from '../data/capitals';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar
} from 'recharts';

// ... (weatherIcons and getWeatherIcon as before)

const weatherIcons = {
  0: "☀️", // Clear sky
  1: "🌤️", 2: "⛅", 3: "☁️", // Mainly clear, partly cloudy, overcast
  45: "🌫️", 48: "🌫️", // Fog
  51: "🌦️", 53: "🌦️", 55: "🌦️", // Drizzle
  61: "🌧️", 63: "🌧️", 65: "🌧️", // Rain
  71: "❄️", 73: "❄️", 75: "❄️", // Snow
  80: "🌦️", 81: "🌦️", 82: "🌦️", // Rain showers
  95: "⛈️", 96: "⛈️", 99: "⛈️", // Thunderstorm
};
function getWeatherIcon(code) {
  return weatherIcons[code] || "❓";
}

const WeatherDetails = () => {
  const { city } = useParams();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDark, setIsDark] = useState(
    () => document.documentElement.classList.contains('dark')
  );

  // Listen for dark mode changes (if toggled)
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    async function fetchWeather() {
      const cityObj = capitals.find(
        (c) => c.city.toLowerCase() === city.toLowerCase()
      );
      if (!cityObj) {
        setError('Coordinates not found for this city');
        setLoading(false);
        return;
      }
      const { lat, lon } = cityObj;
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,weathercode&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=auto`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
        const data = await response.json();
        setWeatherData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, [city]);

  if (loading) return <div className="p-4">Loading weather data for {city}...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  const current = weatherData?.current;
  const daily = weatherData?.daily;

  if (!current || !daily) {
    return <div className="p-4 text-yellow-600">No weather data available for {city}.</div>;
  }

  // Prepare data for charts
  const chartData = daily.time.map((date, idx) => ({
    date,
    max: daily.temperature_2m_max[idx],
    min: daily.temperature_2m_min[idx],
    precipitation: daily.precipitation_sum[idx],
    weathercode: daily.weathercode[idx],
    icon: getWeatherIcon(daily.weathercode[idx]),
  }));

  // Set axis and label colors based on theme
  const axisColor = isDark ? '#e5e7eb' : '#374151'; // Tailwind gray-200 or gray-700
  const gridColor = isDark ? '#374151' : '#e5e7eb'; // grid lines

  return (
    <div
      className="p-6 max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md text-gray-900 dark:text-gray-100"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backdropFilter: 'blur(2px)'
      }}
    >
      <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-4">
        <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
          Weather Details for {city}
          <span className="text-4xl">{getWeatherIcon(current.weathercode)}</span>
        </h1>
        <section className="mb-6 flex items-center gap-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1116/1116453.png"
            alt="weather"
            className="w-20 h-20"
          />
          <div>
            <h2 className="text-xl font-semibold mb-2">Current Weather</h2>
            <p>Temperature: <span className="font-bold">{current.temperature_2m}°C</span></p>
            <p>Wind Speed: <span className="font-bold">{current.wind_speed_10m} km/h</span></p>
            <p>Weather: <span className="font-bold">{getWeatherIcon(current.weathercode)}</span></p>
          </div>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">7-Day Forecast</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke={axisColor} tick={{ fill: axisColor }} />
              <YAxis yAxisId="left" stroke={axisColor} tick={{ fill: axisColor }} label={{ value: '°C', angle: -90, position: 'insideLeft', fill: axisColor }} />
              <YAxis yAxisId="right" orientation="right" stroke={axisColor} tick={{ fill: axisColor }} label={{ value: 'mm', angle: 90, position: 'insideRight', fill: axisColor }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1f2937' : '#fff',
                  color: isDark ? '#e5e7eb' : '#374151',
                  borderColor: axisColor
                }}
                labelStyle={{ color: axisColor }}
              />
              <Legend wrapperStyle={{ color: axisColor }} />
              <Line yAxisId="left" type="monotone" dataKey="max" name="Max Temp" stroke="#f87171" strokeWidth={2} />
              <Line yAxisId="left" type="monotone" dataKey="min" name="Min Temp" stroke="#60a5fa" strokeWidth={2} />
              <Bar yAxisId="right" dataKey="precipitation" name="Precipitation" fill="#38bdf8" barSize={15} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex justify-between mt-4">
            {chartData.map((d, idx) => (
              <span key={idx} className="flex flex-col items-center text-lg">
                <span>{d.icon}</span>
                <span className="text-xs" style={{ color: axisColor }}>{d.date.slice(5)}</span>
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default WeatherDetails;
