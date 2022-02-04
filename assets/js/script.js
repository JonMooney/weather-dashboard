/* Weather Dashboard */

var apiKey = "6ae891b7ba18b6d2b520db77dde5fb53";
var searchForm = document.getElementById("search-form");
var historyEl = document.getElementById("search-history");
var cityName = "";

var cityList = [];

// API endpoint based on a city name, converts to lat/lon data
function getCoordinates(city){
    if(city === ""){return;}

    var apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=5&appid=" + apiKey;

    fetch(apiUrl)
    .then(function(response) {
        // request was successful
        if (response.ok) {
        response.json().then(function(data) {
            //Check to see if we have a valid response
            if(data.length === 0){
                document.getElementById("warning").style.display = "block";
                document.getElementById("main-content").style.visibility = "hidden";
                document.getElementById("city-search").value = "";
                document.getElementById("city-search").focus();
                return;
            }else{
                document.getElementById("warning").style.display = "none";
            }

            //Check for U.S City
            for(var a=0;a<data.length;a++){
                if(data[a].country === "US"){
                    document.getElementById("warning").style.display = "none";
                    cityName = data[a].name;
                    
                    storeCity(cityName);
                    
                    getCityData(data[a].lat, data[a].lon);
                    break;
                }else{
                    document.getElementById("warning").style.display = "block";
                    document.getElementById("main-content").style.visibility = "hidden";
                    document.getElementById("city-search").value = "";
                    document.getElementById("city-search").focus();
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

// API endpoint based on lat/lon data, print results to page
function getCityData(lat, lon){
    var date = new Date();
    var newDate = (date.getMonth()+1) + "-" + date.getDate() + "-" + date.getFullYear();
    var weekday = date.toLocaleDateString("en-US", {weekday: 'long'});

    // Use Open Weather API with lattitude and longitude values to pull weather data
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=hourly,minutely,alerts&appid=" + apiKey;

    fetch(apiUrl)
    .then(function(response) {
        // request was successful
        if (response.ok) {
        response.json().then(function(data) {

            // Load weather data for today
            document.getElementById("city").innerHTML = cityName;
            document.getElementById("todays-date").textContent = weekday + ", " + newDate;
            document.getElementById("icon").innerHTML = "<img src='https://openweathermap.org/img/wn/" + data.current.weather[0].icon + ".png'>"
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
            // End loading of weather data for today

            // Load weather data for 5-day forecast
            for(var a=0;a<5;a++){
                // New date object each iteration in order to get the weekday name
                date = new Date();
                date.setDate(date.getDate() + (a+1));
                weekday = date.toLocaleDateString("en-US", {weekday: 'long'});

                newDate = (date.getMonth()+1) + "-" + date.getDate() + "-" + date.getFullYear();
                document.getElementById("day" + a + "-date").innerHTML = weekday + "<br>" + newDate;
                document.getElementById("day" + a + "-symbol").innerHTML = "<img src='https://openweathermap.org/img/wn/" + data.daily[a].weather[0].icon + ".png'>"
                document.getElementById("day" + a + "-temp").textContent = data.daily[a].temp.max;
                document.getElementById("day" + a + "-wind").textContent = data.daily[a].wind_speed;
                document.getElementById("day" + a + "-humidity").textContent = data.daily[a].humidity;
            }

            // Show data in main content area (current day and 5-day forecast)
            document.getElementById("main-content").style.visibility = "visible";
        });
        } else {
            document.getElementById("warning").style.display = "block";
            console.log ("Bad response getting weather data");
        }
    })
    .catch(function(error) {
        document.getElementById("warning").style.display = "block";
        console.log ("Error in getting weather data");
    });   
}

// Write to history sidebar and localStorage
function storeCity(city){
    var historyEl = document.getElementById("search-history");
    alreadyAdded = false;

    // Check for duplicate city name, if present, exit function
    for(var a=0;a<cityList.length;a++){
        if(cityList[a] === city){
            alreadyAdded = true;
            return;
        }
    }

    //If no duplicate, continue adding to history and localStorage
    cityList.push(city);

    var cityItem = document.createElement("div");
    cityItem.className = "prev-city";
    cityItem.innerHTML = city + "<i class='bi bi-trash' title='Delete city'></i>"

    historyEl.appendChild(cityItem);

    localStorage.setItem("cityList", JSON.stringify(cityList));
}

// Pull in cities from localStorage (for sidebar)
function getCities(){
    
    var storedCities = JSON.parse(localStorage.getItem("cityList"));

    if(storedCities){
        for(var a=0;a<storedCities.length;a++){
            var cityItem = document.createElement("div");
            cityItem.className = "prev-city";
            cityItem.innerHTML = storedCities[a] + "<i class='bi bi-trash' title='Delete city'></i>"
            historyEl.appendChild(cityItem);
        }

        cityList = storedCities.slice();
    }
}

// Remove item from history sidebar and localStorage
function removeItem(city){
    for(var a=0;a<cityList.length;a++){
        if(cityList[a] === city){
            cityList.splice(a, 1);
            console.log(cityList);
            break;
        }
    }

    var historyEl = document.getElementsByClassName("prev-city");

    for(var a=0;a<historyEl.length;a++){
        if(historyEl[a].textContent.indexOf(city) != -1){
            historyEl[a].remove();
        }
    }

    localStorage.setItem("cityList", JSON.stringify(cityList));
}

getCities();

// Click event for history sidebar, cities, as well as trash icons
historyEl.addEventListener("click", function(event){
    document.getElementById("city-search").value = "";
    getCoordinates(event.target.textContent)
    
    // Clicked on trash icon
    if(event.target.classList.contains("bi")){
        removeItem(event.target.parentNode.textContent);
    }
});

// Click event for form submit
searchForm.addEventListener("submit", function(event){
    event.preventDefault();
    var city = document.getElementById("city-search").value;
    document.getElementById("city-search").value = "";
    getCoordinates(city);
});