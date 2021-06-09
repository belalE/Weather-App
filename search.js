const current_location_button = document.querySelector('#current_location');
const searchbar = document.querySelector('#searchbar');
const resultsList = document.querySelector('#search_results');


// Get Current Location Setup
function success(pos) {
    var crd = pos.coords;
    window.location.replace(`index.html?lat=${crd.latitude}&long=${crd.longitude}`);
}
function error(err) {
console.warn(`ERROR(${err.code}): ${err.message}`);
}
var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};


current_location_button.addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition(success, error, options);
});

// Searchbar Setup

function getSearchURL(text) {
    const API_key = 'CjYSjaHyv9CSWQrK7JOeBaLDkcK5ooqi';
    const url = `http://www.mapquestapi.com/search/v3/prediction?key=${API_key}&limit=5&collection=adminArea,&q=${text}`
    return url;
}


async function getData(url) { 
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

async function updateSearchResults() {
    const text = searchbar.value;
    if (text.length > 1) {
        const url = getSearchURL(text);
        const data = await getData(url);
        var htmlString = "";
        for (let i=0; i < data['results'].length; i++) {
            const result = data['results'][i];
            const position = result['place']['geometry']['coordinates']
            const linkUrl = `index.html?lat=${position[1]}&long=${position[0]}`
            const resultStr = `<li><a href=${linkUrl}>${result.displayString}</ a></li>`
            htmlString += resultStr;
        }
        resultsList.innerHTML = htmlString
    }
}

searchbar.addEventListener('keyup', updateSearchResults);