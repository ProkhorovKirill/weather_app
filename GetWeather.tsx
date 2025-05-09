import { useState, useEffect } from "react";
import './getWeather.css'
import React from "react";
// type NoU = number | undefined;

interface Weather {
    main: {
        temp: number,
        feels_like: number,

    },
    name: string,
    sys: {
        sunrise: number,
        sunset: number
    },
    weather: [{
        main: string,
        description: string
    }],
    wind: {
        speed: number
    },
    country: string
}

/* http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=6ad7768cdb95efb2544d6909c45b48ed */
// const response = await fetch('http://api.openweathermap.org/data/2.5/weather?lat=55.75&lon=37.61&appid=6ad7768cdb95efb2544d6909c45b48ed');

const GetWeather = () => {

    const [weather, setWeatherMain] = useState<Weather | boolean>();
    const [weatherDop, setWeatherDop] = useState<Weather | boolean>();
    const [City, setCity] = useState<string>('');
    const [inputValue, setInputValue] = useState<string>();
    //const [state, setState] = useState<boolean>(false)
    // const [lon, setLon] = useState<NoU>(37.61)
    // const [lat, setLat] = useState<NoU>(55.75)

    useEffect(() => {
    
        async function getCoord(){
            if (City) {
                try {
                    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${City},0&limit=2&appid=6ad7768cdb95efb2544d6909c45b48ed`);
                    const coords = await response.json();
                    console.log(coords)
                    console.log(coords[0]?.lat, coords[0]?.lon)
                    
                    if (coords[0]?.lat && coords[0]?.lon) {
                        const responseWeather = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${coords[0].lat}&lon=${coords[0].lon}&appid=6ad7768cdb95efb2544d6909c45b48ed`);
                        const weatherData = await responseWeather.json();
                        setWeatherMain(weatherData)
                        //setState(false)
                    } else {
                        //setState(!state)
                        setWeatherMain(false)
                        setWeatherDop(false)
                    }

                    if (coords[1]?.lat && coords[1]?.lon) {
                        const responseWeather = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${coords[1].lat}&lon=${coords[1].lon}&appid=6ad7768cdb95efb2544d6909c45b48ed`);
                        const weatherData = await responseWeather.json();
                        setWeatherDop(weatherData)
                    }
                } catch (e) {
                    console.log(e)
                }
            }
            
        }

        getCoord();

    }, [City]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>){
        setInputValue(e.target.value);
    }
    
    function handleClick(){
        if (inputValue)  setCity(inputValue);
    }

    function normTime(time: number) : string | undefined{
        if (time) {
            const date = new Date(time * 1000);
            return date.toLocaleString()
        }
    }

    return (
        <div>
            <input type="text" onChange={handleChange} value={inputValue}/>
            <button onClick={handleClick}>Get the weather</button>
            {/* <div>{weather || inputValue ? '' : 'City was not found'}</div> */}
            
            {typeof weather === 'object' && <div>
                <p>District: {weather && weather.name}</p>
                <p>Sunrise: {normTime(weather?.sys.sunrise)}</p> 
                <p>Sunset: {normTime(weather?.sys.sunset)}</p>
                <p>Temperature: {Math.round(weather?.main.temp - 273.15)}, feels like {Math.round(weather?.main.feels_like - 273.15)}</p>
                <p>Weather: {weather?.weather[0].main}, {weather?.weather[0].description}</p>
                <p>Wind's speed: {Math.round(weather?.wind.speed)} m/s</p>
            </div>}
            
            {typeof weatherDop === 'object' && 
                <div>
                    <p>Maybe you wanted another city?</p>
                    <p>District: {weather && weatherDop.name}</p>
                    <p>Sunrise: {normTime(weatherDop?.sys.sunrise)}</p> 
                    <p>Sunset: {normTime(weatherDop?.sys.sunset)}</p>
                    <p>Temperature: {Math.round(weatherDop?.main.temp - 273.15)}, feels like {Math.round(weatherDop?.main.feels_like - 273.15)}</p>
                    <p>Weather: {weatherDop?.weather[0].main}, {weatherDop?.weather[0].description}</p>
                    <p>Wind's speed: {Math.round(weatherDop?.wind.speed)} m/s</p>
                </div>}
        </div>
    )
}

export default GetWeather;
