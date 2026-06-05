import React from 'react'
import './Weather.css'
import cloudy from '../assets/cloudy.jpg'
import clear from '../assets/clear.jpg'
import rainy from '../assets/rainy.jpg'
import drizzle from '../assets/drizzle.png'
import windy from '../assets/windy.png'
import humidity from '../assets/humidity.png'
import windspeed from '../assets/windspeed.png'

const Weather = () => {
    return (
        <div className='weather'>
            <div className='search-bar'>
                <input type='text' placeholder='Search' />
                <button>Search</button>
            </div>
            <img src={cloudy} alt='Cloudy' className='weather-image' />
            <p classname='temperature'>16°C</p>
            <p classname='location'>Nairobi</p>
            <div className='weather-data'>
                <div className='data-item'>
                    <img src={humidity} alt='Humidity' className='data-icon' />
                    <p>Humidity: 80%</p>
                </div>
                <div className='data-item'>
                    <img src={windspeed} alt='Wind Speed' className='data-icon' />
                    <p>Wind Speed: 10 km/h</p>
                </div>
            </div>


        </div>
    )
}

export default Weather
