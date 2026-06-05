import React, { useState } from 'react'
import './Weather.css'

import humidity from '../assets/humidity.png'
import windspeed from '../assets/windspeed.png'

const Weather = () => {
    const [city, setCity] = useState('')
    const [weather, setWeather] = useState(null)

    const search = async () => {
        if (!city.trim()) return

        try {
            const API_KEY = import.meta.env.VITE_WEATHER_API_KEY

            if (!API_KEY) {
                alert('API key is missing')
                return
            }

            const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=yes&alerts=no`

            const response = await fetch(url)

            let data
            try {
                data = await response.json()
            } catch (err) {
                alert("Invalid API response")
                return
            }

            if (!response.ok || data.error) {
                alert(data?.error?.message || "Failed to fetch weather")
                return
            }

            // ✅ THIS is where setWeather belongs
            setWeather(data)

        } catch (error) {
            console.error('Error fetching weather:', error)
            alert('Failed to fetch weather data')
        }
    }

    return (
        <div className='weather'>
            <div className='search-bar'>

                <input
                    type='text'
                    placeholder='Search city...'
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />

                <button onClick={search}>
                    Search
                </button>
            </div>

            <img
                src={
                    weather
                        ? `https:${weather.current.condition.icon}`
                        : 'https://cdn.weatherapi.com/weather/64x64/day/116.png'
                }
                alt='weather'
                className='weather-image'
            />

            <p className='temperature'>
                {weather ? `${weather.current.temp_c}°C` : '16°C'}
            </p>

            <p className='location'>
                {weather ? weather.location.name : 'Nairobi'}, {weather ? weather.location.country : 'Kenya'}
            </p>

            <p className='condition'>
                {weather ? weather.current.condition.text : ''}
            </p>

            <div className='weather-data'>
                <div className='col'>
                    <img src={humidity} alt='humidity' />
                    <span>
                        Humidity: {weather ? `${weather.current.humidity}%` : '--'}
                    </span>
                </div>

                <div className='col'>
                    <img src={windspeed} alt='wind' />
                    <span>
                        Wind Speed: {weather ? `${weather.current.wind_kph} km/h` : '--'}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Weather