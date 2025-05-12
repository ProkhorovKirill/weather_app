import {Weather} from '../../App';
import './weather.css'

interface ShowWeatherProps {
    weatherObject: Weather;
  } 

export default function ShowWeather( {weatherObject} : ShowWeatherProps ){

    function formatTime(time: number) : string | undefined {
        if (time) {
            const date = new Date(time * 1000);
            return date.toLocaleString();
        }
    }

    return (
        <div className='weather_block'>
            <ul className='weather_block_list'>
                <li className='weather_block_list_item'>Район: {weatherObject.name}, {weatherObject.sys.country}</li>
                <li className='weather_block_list_item'>Температура: {Math.round(weatherObject.main.temp - 273.15)} {String.fromCharCode(176)}C, ощущается как {Math.round(weatherObject.main.feels_like - 273.15)} {String.fromCharCode(176)}C</li>
                <li className='weather_block_list_item'>Восход: {formatTime(weatherObject.sys.sunrise)}</li>
                <li className='weather_block_list_item'>Закат: {formatTime(weatherObject.sys.sunset)}</li>
                <li className='weather_block_list_item'>Погода: {weatherObject.weather[0].main}, {weatherObject.weather[0].description}</li>
                <li className='weather_block_list_item'>Ветер: {Math.round(weatherObject.wind.speed)} м/с</li>
                <li className='weather_block_list_item'>Влажность: {weatherObject.main.humidity} %</li>
                <li className='weather_block_list_item'>Давление: {weatherObject.main.pressure} гПа / {Math.round(weatherObject.main.pressure/1.33)} мм.рт.ст.</li>
            </ul>
        </div>
    )
}