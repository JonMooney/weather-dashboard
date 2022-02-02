/* Weather Dashboard */

var apiKey = "6ae891b7ba18b6d2b520db77dde5fb53";
var searchForm = document.getElementById("search-form");


function getCoordinates(){
    var city = document.getElementById("city-search").value;

    console.log(city);
    
    // Use Open Weather API to convert City Name into Lattitude and Longitude
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=5&appid=" + apiKey;

    // https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude=hourly,minutely,alerts&appid={API key}


    fetch(apiUrl)
    .then(function(response) {
        // request was successful
        if (response.ok) {
        response.json().then(function(data) {
            getCityData(lat,long);
        });
        } else {
            console.log ("Bad response getting weather data");
        }
    })
    .catch(function(error) {
        console.log ("Error in getting Weather data");
    });   
}

function getCityData(){

}

function displayWeather(data){
    console.log(data);
}

//getWeather();

searchForm.addEventListener("submit", function(event){
    event.preventDefault();
    getCoordinates();
});