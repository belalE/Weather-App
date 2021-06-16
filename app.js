const location_title = document.querySelector('#location');

//Get all current info
const current_temp = document.querySelector('#current_temp');
const current_percipitation = document.querySelector('#current_percipitation');
const current_conditions = document.querySelector('#current_conditions');
const current_thumbnail = document.querySelector('#current_thumbnail');
const current_feelslike = document.querySelector('#current_feels_like');
const current_sunrise = document.querySelector('#current_sunrise');
const current_uvi = document.querySelector('#current_uvi');
const current_windspeed = document.querySelector('#current_windspeed');
const current_humidity = document.querySelector('#current_humidity');
const current_sunset = document.querySelector('#current_sunset');
const current_visibility = document.querySelector('#current_visibility');
const current_pressure = document.querySelector('#current_pressure');


function parseURL() {
    let params = new URLSearchParams(location.search);
    const lat = params.get('lat');
    const long = params.get('long');
    if ((lat == null) || (long == null)) {
        window.location.replace("/home.html");
    }
    return [lat, long]
}

function getWeatherURL(lat, lon, units) {
    const API_key = '6c9a9b853d0cf36a4fbaef401170b3d2';
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${API_key}&units=${units}`;
    return url;
}

function getGeocodeURL(lat, lon) {
    const API_key = 'CjYSjaHyv9CSWQrK7JOeBaLDkcK5ooqi';
    const url = `https://open.mapquestapi.com/geocoding/v1/reverse?key=${API_key}&location=${lat},${lon}`
    return url;
}


async function getData(url) { 
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

async function handleData() {
    const position = parseURL()
    const weather_url = getWeatherURL(position[0], position[1], 'imperial');
    const geocode_url = getGeocodeURL(position[0],position[1]);
    const weather_data = await getData(weather_url);
    const geocode_data = await getData(geocode_url);

    //get location string
    const city_name = geocode_data['results'][0]['locations'][0]['adminArea5'];
    const state_name = geocode_data['results'][0]['locations'][0]['adminArea3'];
    const name_str = `${city_name}, ${state_name}`;

    //call update functions
    updateCurrentInfo(weather_data, name_str);
    updateForecastInfo(weather_data);
    updateHourlyInfo(weather_data);
    document.body.classList.remove('hidden');
}

function updateCurrentInfo(data, city_name) {
    const currentData = data.current
    location_title.textContent = `${city_name} Weather`;
    current_temp.textContent = `${Math.round(currentData.temp)}˚F`;
    current_conditions.textContent = currentData.weather[0].main;
    current_thumbnail.innerHTML = `<img src="/icons/${ currentData.weather[0].icon }.png">`;
    const rain = (currentData.rain) ? currentData.rain['1h'] : 0;
    current_percipitation.textContent = `${rain} mm of rain`;

    //Details
    current_feelslike.textContent = `${Math.round(currentData.feels_like)}˚F`;
    current_sunrise.textContent = getTime(currentData.sunrise);
    current_uvi.textContent = `${currentData.uvi} of 10`;
    current_windspeed.textContent = `${currentData.wind_speed} mph`;
    current_humidity.textContent = `${currentData.humidity}%`;
    current_sunset.textContent = getTime(currentData.sunset);
    
    current_visibility.textContent = `${Math.round(currentData.visibility/1609)} mi` ;
    current_pressure.textContent = `${currentData.pressure} hPa`;

}

function updateHourlyInfo(data) {
    for (let i =1; i < 7; i++) {
        const temp = document.querySelector(`#hour${i}_temp`);
        const conditions = document.querySelector(`#hour${i}_conditions`);
        const precipitation = document.querySelector(`#hour${i}_percipitation`);
        const thumbnail = document.querySelector(`#hour${i}_thumbnail`);
        const dateH3 = document.querySelector(`#hour${i}_date`);

        const hour_data = data.hourly[i]
        const temperature = `${Math.round(hour_data.temp)}˚F`;
        temp.textContent = temperature;
        conditions.textContent = hour_data.weather[0].main;
        thumbnail.innerHTML = `<img src="/icons/${ hour_data.weather[0].icon }.png">`;
        const rain = (hour_data.rain != null) ? hour_data.rain['1h'] : 0;
        precipitation.textContent = `${rain} mm of rain`
        // Get info from Unix timestamp
        dateH3.textContent = getHour(hour_data['dt'])
    }
} 

function updateForecastInfo(data) {
    for (let i =1; i < 7; i++) {
        const temp = document.querySelector(`#day${i}_temp`);
        const conditions = document.querySelector(`#day${i}_conditions`);
        const precipitation = document.querySelector(`#day${i}_percipitation`);
        const thumbnail = document.querySelector(`#day${i}_thumbnail`);
        const dateH3 = document.querySelector(`#day${i}_date`);

        const day_data = data.daily[i]
        temp.textContent = `${Math.round(day_data.temp.day)}˚F`;
        conditions.textContent = day_data.weather[0].main;
        thumbnail.innerHTML = `<img src="/icons/${ day_data.weather[0].icon }.png">`;
        const rain = (day_data.rain != null) ? day_data.rain : 0;
        precipitation.textContent = `${rain} mm of rain`
        // Get info from Unix timestamp
        const a = new Date(day_data['dt']*1000)
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var month = months[a.getMonth()];
        var date = a.getDate();
        var weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][a.getDay()]
        dateH3.textContent = `${weekday}, ${month} ${date}`
    }
} 

function getTime(unix) {
    const a = new Date(unix*1000);
    const hours = a.getHours();
    var minutes = a.getHours();
    if (minutes < 10) {
        minutes = '0' + minutes
    }
    if (hours > 12) {
        const time = `${hours-12}:${minutes} pm`;
            return time;

    } if (hours == 0) {
        const time = `${hours+12}:${minutes} am`;
        return time;
    } else  {
        const time = `${hours}:${minutes} am`;
        return time;
    }

} 

function getHour(unix) {
    const a = new Date(unix*1000);
    const hours = a.getHours();
    if (hours > 12) {
        const time = `${hours-12} pm`;
            return time;

    } if (hours == 0) {
        const time = `${hours+12} am`;
        return time;
    } else {
        const time = `${hours} am`;
        return time;
    }
}

// setTimeout(handleData(), 6000)
handleData();