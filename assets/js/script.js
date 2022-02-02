/* Weather Dashboard */

var apiKey = "6ae891b7ba18b6d2b520db77dde5fb53";
var searchForm = document.getElementById("search-form");
var cityName = "";


function getCoordinates(){
    var city = document.getElementById("city-search").value;
    
    // Use Open Weather API to convert City Name into Lattitude and Longitude
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=5&appid=" + apiKey;

    fetch(apiUrl)
    .then(function(response) {
        // request was successful
        if (response.ok) {
        response.json().then(function(data) {
            //Check for U.S City
            console.log(data);
            for(var a=0;a<data.length;a++){
                if(data[a].country === "US"){
                    cityName = data[a].name;
                    getCityData(data[a].lat, data[a].lon);
                    break;
                }
            }
        });
        } else {
            console.log ("Bad response getting weather data");
        }
    })
    .catch(function(error) {
        console.log ("Error in getting weather data");
    });   
}

function getCityData(lat, lon){

    // Use Open Weather API width lattitude and longitude values to pull weather data
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=hourly,minutely,alerts&appid=" + apiKey;

    fetch(apiUrl)
    .then(function(response) {
        // request was successful
        if (response.ok) {
        response.json().then(function(data) {
            console.log(data.current.temp);
            document.getElementById("city").textContent = cityName;
            document.getElementById("temp").textContent = data.current.temp;
            document.getElementById("wind").textContent = data.current.wind_speed;
            document.getElementById("humidity").textContent = data.current.humidity;
            // Implement UV Index Color
            if(data.current.humidity >= 0){
                document.getElementById("uv-index").className = "uv-low";
            }else if(data.current.humidity >=3){
                document.getElementById("uv-index").className = "uv-moderate";
            }else if(data.current.humidity >= 6){
                document.getElementById("uv-index").className = "uv-high";
            }else if(data.current.humidity >= 8){
                document.getElementById("uv-index").className = "uv-very-high";
            }else if(data.current.humidity >= 11){
                document.getElementById("uv-index").className = "uv-extreme";
            }
            document.getElementById("uv-index").textContent = data.current.uvi;
        });
        } else {
            console.log ("Bad response getting weather data");
        }
    })
    .catch(function(error) {
        console.log ("Error in getting weather data");
    });   


    //displayWeather();
}

function displayWeather(data){
    console.log(data);
}


searchForm.addEventListener("submit", function(event){
    event.preventDefault();
    getCoordinates();
});