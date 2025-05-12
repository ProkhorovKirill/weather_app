export async function getCoordinates(city: string, api_key: string){
    const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city},0&limit=5&appid=${api_key}`);
    const coords = await response.json();
    return coords
}

export async function getWeather(lat: number, lon: number, api_key: string){
    const responseWeather = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`);
    const weatherData = await responseWeather.json();
    return weatherData
}