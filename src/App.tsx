import { useState } from 'react'
import './App.css'
import { getCoordinates, getWeather } from './components/api_requests';
import ShowWeather from './components/Weather/Weather'

const API_KEY = import.meta.env.VITE_API_KEY;

export interface Weather {
  main: {
      temp: number,
      feels_like: number,
      humidity: number,
      pressure: number,
  },
  name: string,
  sys: {
      sunrise: number,
      sunset: number,
      country: string
  },
  weather: [{
      main: string,
      description: string
  }],
  wind: {
      speed: number
  },
  id: number
}

function App() {

  const [city, setCity] = useState<string>('');
  const [weather, setWeather] = useState<Weather | ''>();
  const [anotherWeather, setAnotherWeather] = useState<Weather[]>()
  const [errorText, setErrorText] = useState<string>('');

  async function handleClickWeather(){
      if (city.trim()) {
        const coords = await getCoordinates(city, API_KEY);
        if (coords.length > 0){
          const weatherData: Weather = await getWeather(coords[0].lat, coords[0].lon, API_KEY);
          setWeather(weatherData);
          setErrorText('');
          setAnotherWeather([]);
          for (let i = 1; i < coords.length; i++) {
          const anotherWeatherData = await getWeather(coords[i].lat, coords[i].lon, API_KEY);
  
          setAnotherWeather(prevWeather => {
            if (!prevWeather) {
              return [anotherWeatherData];
            }
            const isDuplicate = prevWeather.some(item => item.id === anotherWeatherData.id);
            if (!isDuplicate) {
              return [...prevWeather, anotherWeatherData];
            }
            return prevWeather;
            });
          }
        } else {
          setWeather('');
          setAnotherWeather([]);
          setErrorText('Город не найден. Попробуйте другой.');
        }
      } else {
        setErrorText('Введите город.');
      }
  }

  function handleChangeCity(e: React.ChangeEvent<HTMLInputElement>){
    setCity(e.target.value)
  }

  return (
    <>

    <h1 className='weather_title'>Прогноз погоды</h1>
    <p className='weather_title_description'>Узнайте текущую погоду в любом городе</p>

    <form action="#" className='form_weather'>
      <input type="text" value={city} onChange={handleChangeCity} className='form_weather_input' placeholder='Введите название города'/>
      <button type='submit' onClick={(e) => {e.preventDefault(); handleClickWeather()}}className='form_weather_button'>Узнать погоду</button>
    </form>

    <div className="content-wrapper">
      <p className={errorText ? 'error_text' : ''}>{errorText}</p>
      {!errorText && weather && <ShowWeather weatherObject={weather}/>}
      {!errorText && anotherWeather && anotherWeather?.length > 0 ? <h4 className='another-weather-title'>Если был найден не Ваш город, вот еще несколько вариантов:</h4> : ''}
    </div>

    <div className='another_weather'>
      {!errorText && anotherWeather?.map((i) => {
        return (
          <div key={i.id}>
            <ShowWeather weatherObject={i}/>
          </div>
        )
      })}
    </div>
    
    </>
  )
}

export default App