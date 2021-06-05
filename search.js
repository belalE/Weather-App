const current_location_button = document.querySelector('#current_location');

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


current_location_button.onclick = function() {
    navigator.geolocation.getCurrentPosition(success, error, options);
}