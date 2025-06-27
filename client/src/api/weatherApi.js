// src/api/weatherApi.js

/**
 * Fetches current weather and hourly forecast for a given latitude/longitude using Open-Meteo.
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} Weather data object
 */
export async function getWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,weathercode&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,weathercode&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch weather data');
  return res.json();
}

/**
 * Fetches daily weather forecast for a given latitude/longitude using Open-Meteo.
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} Daily forecast data
 */
export async function getDailyForecast(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch daily forecast');
  return res.json();
}
