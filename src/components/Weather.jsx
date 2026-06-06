import React, { useState } from 'react'
import './Weather.css'

import humidity from '../assets/humidity.png'
import windspeed from '../assets/windspeed.png'

const Weather = () => {
    const [city, setCity] = useState('')
    const [weather, setWeather] = useState(null)
    const [loading, setLoading] = useState(false)

    const search = async () => {
        if (!city.trim()) return

        setLoading(true)
        setWeather(null)

        try {
            const API_KEY = import.meta.env.VITE_WEATHER_API_KEY

            if (!API_KEY) {
                alert('API key is missing. Add VITE_WEATHER_API_KEY to your .env file.')
                return
            }

            // Step 1: Geocode city name → lat/lon (free, no key needed)
            const geoRes = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`,
                { headers: { 'Accept-Language': 'en' } }
            )
            const geoData = await geoRes.json()

            if (!geoData.length) {
                alert('City not found. Try a more specific name e.g. "Nairobi, Kenya".')
                return
            }

            const { lat, lon, display_name } = geoData[0]

            // Step 2: Fetch weather from weather-ai.co
            const weatherRes = await fetch(
                `https://api.weather-ai.co/v1/weather?lat=${lat}&lon=${lon}&days=1&ai=false&units=metric`,
                {
                    headers: {
                        Authorization: `Bearer ${API_KEY}`
                    }
                }
            )

            let data
            try {
                data = await weatherRes.json()
            } catch {
                alert('Could not parse API response.')
                return
            }

            // Useful during development — remove once confirmed working
            console.log('weather-ai.co response:', data)

            if (!weatherRes.ok) {
                alert(data?.message || data?.error || `Error ${weatherRes.status}`)
                return
            }

            // Attach resolved city name for display
            data._city = display_name.split(',').slice(0, 2).join(',').trim()

            setWeather(data)

        } catch (error) {
            console.error('Error fetching weather:', error)
            alert('Network error. Check your connection and try again.')
        } finally {
            setLoading(false)
        }
    }
    const current = weather?.current || weather?.current_conditions || weather?.current_weather || null
    const humidityValue = current?.humidity || current?.humidity_percent || current?.humidity_percentage || null
    return (
        <div className='weather'>
            <div className='search-bar'>
                <input
                    type='text'
                    placeholder='Search city...'
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && search()}
                />
                <button onClick={search} disabled={loading}>
                    {loading ? '...' : 'Search'}
                </button>
            </div>

            <img
                src={
                    current?.condition?.icon
                        ? `https:${current.condition.icon}`
                        : 'https://cdn.weatherapi.com/weather/64x64/day/116.png'
                }
                alt='weather'
                className='weather-image'
            />

            <p className='temperature'>
                {current ? `${current.temperature}°C` : '16°C'}
            </p>

            <p className='location'>
                {weather ? weather._city : 'Nairobi, Kenya'}
            </p>

            <p className='condition'>
                condition: {current?.condition?.text ?? current?.description ?? current?.weathercode ?? ''}
            </p>

            <div className='weather-data'>
                <div className='col'>
                    <img src={humidity} alt='humidity' />
                    <span>
                        humidity: {current ? `${current.humidity}%` : '--'}
                    </span>
                </div>

                <div className='col'>
                    <img src={windspeed} alt='wind' />
                    <span>
                        Wind Speed: {current ? `${current.wind_speed} km/h` : '--'}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Weather