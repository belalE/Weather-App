const location_title = document.querySelector('#location');
const current_temp = document.querySelector('#current_temp');
const current_percipitation = document.querySelector('#current_percipitation');
const current_conditions = document.querySelector('#current_conditions');
const current_thumbnail = document.querySelector('#current_thumbnail');

function parseURL() {
    let params = new URLSearchParams(location.search);
    const lat = params.get('lat');
    const long = params.get('long');
    console.log('lat: ', lat, ";long: ", long)
    return [lat, long]
}

function getURL(lat, lon, units) {
    const API_key = '6c9a9b853d0cf36a4fbaef401170b3d2';
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${API_key}&units=${units}`;
    console.log(url)
    return url;
}

async function getData(url) { 
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

async function handleData() {
    const position = parseURL()
    const url = getURL(position[0], position[1], 'imperial');
    const data = await getData(url);
    updateCurrentInfo(data)
    updateForecastInfo(data)
}

function updateCurrentInfo(data) {
    location_title.textContent = `${''} Weather`; // NEED TO UPDATE
    current_temp.textContent = `${Math.round(data.current.temp)}˚F`;
    current_conditions.textContent = data.current.weather[0].main;
    current_thumbnail.innerHTML = `<img src="/icons/${ data.current.weather[0].icon }.png">`;
    const rain = (data.current.rain != null) ? data.current.rain['1h'] : 0;
    current_percipitation.textContent = `${rain} mm of rain`
}

function updateForecastInfo(data) {
    for (i =1; i < 8; i++) {
        const temp = document.querySelector(`#day${i}_temp`);
        const conditions = document.querySelector(`#day${i}_conditions`);
        const precipitation = document.querySelector(`#day${i}_percipitation`);
        const thumbnail = document.querySelector(`#day${i}_thumbnail`);

        const day_data = data.daily[i]
        temp.textContent = `${Math.round(day_data.temp.day)}˚F`;
        conditions.textContent = day_data.weather[0].main;
        thumbnail.innerHTML = `<img src="/icons/${ day_data.weather[0].icon }.png">`;
        const rain = (day_data.rain != null) ? day_data.rain : 0;
        precipitation.textContent = `${rain} mm of rain`
    }
} 

handleData();