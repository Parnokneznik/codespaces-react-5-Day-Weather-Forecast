import React, { useState, useEffect } from 'react';
import './App.css';

const cities = [
  { name: 'New York', id: '5128581' },
  { name: 'London', id: '2643743' },
  { name: 'Tokyo', id: '1850147' },
  { name: 'Sydney', id: '2147714' },
  { name: 'Paris', id: '2988507' }
];

const API_KEY = 'f2ec3bb93f6a5769697de8723b967323';

const App = () => {
  const [weatherData, setWeatherData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const promises = cities.map(city =>
        fetch(`https://api.openweathermap.org/data/2.5/forecast?id=${city.id}&appid=${API_KEY}`)
          .then(response => response.json())
          .then(data => {
            console.log('Data for city:', city.name, data);
            return {
              name: city.name,
              id: city.id,
              forecasts: data.list
                .filter((item, index) => index % 8 === 0) 
                .map(item => ({
                  date: item.dt_txt,
                  temperature: Math.round(item.main.temp - 273.15), 
                  description: item.weather[0].description,
                  icon: item.weather[0].icon,
                  humidity: item.main.humidity,
                  windSpeed: item.wind.speed
                }))
            };
          })
      );
      const results = await Promise.all(promises);
      console.log('All data:', results);
      setWeatherData(results);
    };

    fetchData();
  }, []);

  const handleCityClick = async (cityId) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=${API_KEY}`);
    const data = await response.json();
    console.log('Data after click:', data);
    const newWeatherData = weatherData.map(city => {
      if (city.id === cityId) {
        return {
          ...city,
          forecasts: data.list
            .filter((item, index) => index % 8 === 0) 
            .map(item => ({
              date: item.dt_txt,
              temperature: Math.round(item.main.temp - 273.15),
              description: item.weather[0].description,
              icon: item.weather[0].icon,
              humidity: item.main.humidity,
              windSpeed: item.wind.speed
            }))
        };
      }
      return city;
    });
    setWeatherData(newWeatherData);
  };

  return (
    <div className="App">
      <h1 className="app-title">5-Day Weather Forecast</h1>
      <div className="weather-container">
        {weatherData.map(city => (
          <div key={city.id} className="city" onClick={() => handleCityClick(city.id)}>
            <h2 className="city-name">{city.name}</h2>
            <div className="forecast">
              {city.forecasts && city.forecasts.map(forecast => (
                <div key={forecast.date} className="forecast-item">
                  <p className="date">{forecast.date}</p>
                  <p className="temperature">{forecast.temperature}°C</p>
                  <p className="description">{forecast.description}</p>
                  <p className="humidity">Humidity: {forecast.humidity}%</p>
                  <p className="wind-speed">Wind Speed: {forecast.windSpeed} m/s</p>
                  <img src={`http://openweathermap.org/img/w/${forecast.icon}.png`} alt="weather icon" className="weather-icon" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
