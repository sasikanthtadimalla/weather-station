require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("home", {
    weatherImage: "",
    weatherCity: "",
    weatherTempC: "",
    weatherTempF: "",
    weatherDesc: ""
  });
});

app.post("/", function(req, res) {
  const city = req.body.city.charAt(0).toUpperCase() + req.body.city.slice(1);
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + process.env.API_KEY + "&units=metric";
  https.get(url, function(response) {
    response.on("data", function(data) {
      const weatherData = JSON.parse(data);
      const responseCode = weatherData.cod;
      console.log(responseCode);
      if (responseCode === 200) {
        const temperatureC = weatherData.main.temp;
        const temperatureF = ((temperatureC * 9 / 5) + 32).toFixed(2);
        const description = weatherData.weather[0].description.charAt(0).toUpperCase() + weatherData.weather[0].description.slice(1);
        const icon = weatherData.weather[0].icon;
        const iconUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
        const country = weatherData.sys.country;
        const place = city + ", " + country;
        res.render("home", {
          weatherImage: iconUrl,
          weatherCity: place,
          weatherTempC: temperatureC + " °C",
          weatherTempF: temperatureF + " °F",
          weatherDesc: description
        });
      } else {
        res.sendFile(__dirname + "/public/notFound.html");
      }
    });
  });
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Express server initiated on port 3000. ");
});
