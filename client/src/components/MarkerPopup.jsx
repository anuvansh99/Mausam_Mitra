import React from 'react';

// Weather icon and description helpers
const weatherIcons = {
  0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️",
  45: "🌫️", 48: "🌫️",
  51: "🌦️", 53: "🌦️", 55: "🌦️",
  61: "🌧️", 63: "🌧️", 65: "🌧️",
  71: "❄️", 73: "❄️", 75: "❄️",
  80: "🌦️", 81: "🌦️", 82: "🌦️",
  95: "⛈️", 96: "⛈️", 99: "⛈️",
};
const weatherDescriptions = {
  0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Fog", 48: "Depositing rime fog",
  51: "Light drizzle", 53: "Moderate drizzle", 55: "Dense drizzle",
  61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
  71: "Slight snow", 73: "Moderate snow", 75: "Heavy snow",
  80: "Slight rain showers", 81: "Moderate rain showers", 82: "Violent rain showers",
  95: "Thunderstorm", 96: "Thunderstorm with hail", 99: "Thunderstorm with heavy hail",
};
function getWeatherIcon(code) {
  return weatherIcons[code] || "❓";
}
function getWeatherDesc(code) {
  return weatherDescriptions[code] || "Unknown";
}

const MarkerPopUp = ({
  mode,
  city,
  state,
  isDark,
  markerColor,
  navigate,
  weatherData,
}) => {
  // Land use mode: special button style for visibility
  const isLandUse = mode === 'landuse';
  const landUseBtnClass = "mt-2 px-2 py-1 rounded font-semibold shadow border border-green-400 bg-green-200 text-black hover:bg-green-100 transition-colors duration-200";

  return (
    <div
      className={`flex flex-col items-center min-w-[180px] rounded-lg p-2
        ${isDark ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}
        shadow-md transition-colors duration-300`}
    >
      {mode === 'weather' ? (
        <>
          <span className="font-bold text-lg mb-1">{city}</span>
          <span className="text-xs mb-2 text-gray-500">Capital of {state}</span>
          {weatherData ? (
            <div className="flex flex-col items-center">
              <span className="text-3xl">
                {getWeatherIcon(weatherData.weathercode)}
              </span>
              <span className="font-semibold text-xl">
                {weatherData.temperature_2m}°C
              </span>
              <span className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                {getWeatherDesc(weatherData.weathercode)}
              </span>
            </div>
          ) : (
            <span className="text-xs text-gray-400 mb-2">Weather data not available</span>
          )}
          <button
            onClick={() => navigate(`/${mode}/${city}`)}
            className="mt-2 px-2 py-1 rounded text-white"
            style={{ backgroundColor: markerColor }}
          >
            Show Details
          </button>
        </>
      ) : (
        // All other modes: show state name and view details button
        <>
          <span className="font-bold text-lg mb-2">{state}</span>
          <button
            onClick={() => navigate(`/${mode}/${state}`)}
            className={isLandUse ? landUseBtnClass : "mt-2 px-2 py-1 rounded text-white"}
            style={isLandUse ? undefined : { backgroundColor: markerColor }}
          >
            View Details
          </button>
        </>
      )}
    </div>
  );
};

export default MarkerPopUp;
