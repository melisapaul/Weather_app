import React from 'react';
import './weather.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
 
// Weather icon mapping
const getWeatherIcon = (condition) => {
  const icons = {
    Clear: '☀️',
    Clouds: '☁️',
    Rain: '🌧️',
    Drizzle: '🌦️',
    Thunderstorm: '⛈️',
    Snow: '❄️',
    Mist: '🌫️',
    Smoke: '🌫️',
    Haze: '🌫️',
    Dust: '🌫️',
    Fog: '🌫️',
    Sand: '🌫️',
    Ash: '🌫️',
    Squall: '💨',
    Tornado: '🌪️'
  };
  return icons[condition] || '🌤️';
};

export const Weather = () => {
    const [inputValue, setInputValue] = useState("Kolkata");
  const [weatherData, setWeatherData] = useState();
    const fetchweatherdata = async(city = inputValue) =>{
      try{
        const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
        
        if (!apiKey) {
          console.error("Missing API key. Please add VITE_WEATHER_API_KEY to your .env file");
          return;
        }

        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`)
        // Request metric units so the API returns Celsius directly
        const data = {
          temp: Math.round(response.data.main.temp),
          humidity: response.data.main.humidity,
          condition: response.data.weather[0].main, // like 'Clouds', 'Haze', etc.
          city: response.data.name,
        };
        setWeatherData(data);
        console.log(data);

      }catch(error){
       console.error("Error fetching weather data:", error);
     }
      }

    // Load Kolkata weather on component mount
    useEffect(() => {
      fetchweatherdata("Kolkata");
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleclick = () => {
      fetchweatherdata();
    }
  return (
    <div className="weathercard">
      <div className="top">
        <h1>Weather App</h1>
        <input
          type="text"
          placeholder="Search... city"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button onClick={handleclick}>Get Weather</button>
      </div>

      {weatherData && (
        <div className="bottom">
          <h1>{weatherData.city || inputValue || 'City Name'}</h1>
          <div className="temperature-section">
            <span className="weather-icon">{getWeatherIcon(weatherData.condition)}</span>
            <h2>{weatherData.temp}°C</h2>
          </div>

          <div className="info">
            <div className="condition">
              <h3>{weatherData.condition}</h3>
            </div>
            <div className="humidity">
              <p>Humidity: {weatherData.humidity}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
