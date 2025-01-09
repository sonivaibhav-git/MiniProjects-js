// openweather api

const apiKey = "05de606e8c9df3827d2b49a517a097cd";
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const searchBox = document.querySelector("#name");
const searchBtn = document.querySelector(".search .btn");
const weather = document.querySelector(".weather");

async function checkWeather(city) {
  const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
  let data = await response.json();
  console.log(data);

  document.querySelector(".city").innerHTML = data.name;
  document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
  document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
  document.querySelector(".wind").innerHTML = data.wind.speed + "kmph";

  let icon = document.querySelector(".weather-icon");
  if (data.weather[0].main == "Clear") {
    icon.src = "images/clear.png";
  } else if (data.weather[0].main == "Clouds") {
    icon.src = "images/clouds.png";
  } else if (data.weather[0].main == "Mist" || "Haze") {
    icon.src = "images/mist.png";
  } else if (data.weather[0].main == "Drizzle") {
    icon.src = "images/drizzle.png";
  } else if (data.weather[0].main == "Rain") {
    icon.src = "images/rain.png";
  } else if (data.weather[0].main == "Snow") {
    icon.src = "images/snow.png";
  }
}
searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value);
  weather.style.display = "block";
});
