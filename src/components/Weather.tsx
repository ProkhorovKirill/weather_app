import {Weather} from '../App';

interface ShowWeatherProps {
    weatherObject: Weather;
  } 

export default function ShowWeather( {weatherObject} : ShowWeatherProps ){

    function formatTime(time: number) : string | undefined{
        if (time) {
            const date = new Date(time * 1000);
            return date.toLocaleString()
        }
    }

    return (
        <div>
            <p>Район: {weatherObject.name}, {weatherObject.sys.country}</p>
            <p>Восход: {formatTime(weatherObject.sys.sunrise)}</p>
            <p>Закат: {formatTime(weatherObject.sys.sunset)}</p>
            <p>Температура: {Math.round(weatherObject.main.temp - 273.15)} {String.fromCharCode(176)}C, ощущается как {Math.round(weatherObject.main.feels_like - 273.15)} {String.fromCharCode(176)}C</p>
            <p>Погода: {weatherObject.weather[0].main}, {weatherObject.weather[0].description}</p>
            <p>Ветер: {Math.round(weatherObject.wind.speed)} м/с</p>
        </div>
    )
}