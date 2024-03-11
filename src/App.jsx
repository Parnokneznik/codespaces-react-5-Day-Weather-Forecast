import React, { useState } from 'react';
import './App.css';

const API_KEY = 'f2ec3bb93f6a5769697de8723b967323';

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [cityName, setCityName] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSearch = async () => {
    if (!isLoggedIn) {
      setError('Pro vyhledání města se prosím přihlaste');
      return;
    }
    
    if (!cityName) {
      setError('Zadej název města');
      return;
    }

    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}`);
      if (!response.ok) {
        throw new Error('Město nebylo nalezeno');
      }
      const data = await response.json();
      const dailyForecast = filterDailyForecast(data.list);
      setWeatherData({ city: data.city, list: dailyForecast });
      setError('');
    } catch (error) {
      setWeatherData(null);
      setError('Město nebylo nalezeno');
    }
  };

  const filterDailyForecast = (forecastList) => {
    const filteredForecast = forecastList.filter(item => {
      const date = new Date(item.dt_txt).getHours(); // Získá hodinu z datumu
      return date === 15;
    });
    return filteredForecast;
  };

  const handleLogin = () => {
    if (username === 'user' && password === 'pass') {
      setIsLoggedIn(true);
      setUsername('');
      setPassword('');
      setError('');
    } else {
      setError('Neplatné uživatelské jméno nebo heslo');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setWeatherData(null);
  };

  return (
    <div className="app">
      <header className="header">
        <h1 className="app-title">5-Day Weather Forecast</h1>
        {!isLoggedIn ? (
          <div className="login-form">
            <input type="text" placeholder="Uživatelské jméno" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Heslo" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Přihlásit se</button>
          </div>
        ) : (
          <button className="logout-btn" onClick={handleLogout}>Odhlásit se</button>
        )}
      </header>
      {isLoggedIn && (
        <div className="search-container">
          <input type="text" placeholder="Zadejte název města" value={cityName} onChange={(e) => setCityName(e.target.value)} />
          <button onClick={handleSearch}>Vyhledat</button>
          {error && <p className="error-message">{error}</p>}
        </div>
      )}
      {weatherData && (
        <div className="weather-info">
          <h2>{weatherData.city.name}</h2>
          <div className="forecast">
            {weatherData.list.map((item) => (
              <div key={item.dt} className="forecast-item">
                <p className="datum">{item.dt_txt}</p>
                <p className="teplota">{Math.round(item.main.temp - 273.15)}°C</p>
                <p className="popis">{item.weather[0].description}</p>
                <p className="vlhkost">Humidity: {item.main.humidity}%</p>
                <p className="rychlost větru">Wind Speed: {item.wind.speed} m/s</p>
                <img src={`http://openweathermap.org/img/w/${item.weather[0].icon}.png`} alt="weather icon" className="weather-icon" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
