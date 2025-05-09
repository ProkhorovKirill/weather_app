import { useState } from 'react'
import './App.css'
import { getCoordinates, getWeather } from './components/api_requests';
import ShowWeather from './components/Weather'

const API_KEY = import.meta.env.VITE_API_KEY;

export interface Weather {
  main: {
      temp: number,
      feels_like: number,

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

/* getCoordinates(city, API_KEY)
      .then((coords) => {if (coords) return getWeather(coords[0].lat, coords[0].lon, API_KEY)})
      .then((data) => {console.log(data); setWeather(data)})
      .catch((e) => {console.log(e); setError(true)}) */

function App() {

  const [city, setCity] = useState<string>('');
  const [weather, setWeather] = useState<Weather | ''>();
  const [anotherWeather, setAnotherWeather] = useState<Weather[]>()
  const [errorText, setErrorText] = useState<string>('');

  async function handleClickWeather(){
      if (city.trim()) {
        const coords = await getCoordinates(city, API_KEY);
        console.log(coords)
        if (coords.length > 0){
          console.log(coords.length)
          const weatherData: Weather = await getWeather(coords[0].lat, coords[0].lon, API_KEY);
          setWeather(weatherData);
          setErrorText('');
          console.log(weatherData);
          for (let i = 1; i < coords.length; i++){
            const anotherWeatherData: Weather = await getWeather(coords[i].lat, coords[i].lon, API_KEY);
            if (anotherWeather){
                const isDuplicate = anotherWeather.some(item => item.id === anotherWeatherData.id);
                if (!isDuplicate) { 
                  setAnotherWeather([...anotherWeather, anotherWeatherData]);
                }
            } else {
              setAnotherWeather([anotherWeatherData])
            }
          }
        } else {
          setWeather('');
          setAnotherWeather([]);
          setErrorText('Город не найден. Попробуйте другой.')
        }
      } else {
        setErrorText('Введите город.')
      }
  }

  function handleChangeCity(e: React.ChangeEvent<HTMLInputElement>){
    setCity(e.target.value)
  }

  return (
    <>
    <form action="GET">
      <input type="text" value={city} onChange={handleChangeCity}/>
      <button type='submit' onClick={(e) => {e.preventDefault(); handleClickWeather()}}>Узнать погоду</button>
    </form>
    {errorText}


    {weather && <ShowWeather weatherObject={weather}/>}

    {anotherWeather && anotherWeather?.length > 0 ? <p>Если был найден не Ваш город, вот еще несколько вариантов:</p> : ''}

    <div>
      {anotherWeather?.map((i) => {
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