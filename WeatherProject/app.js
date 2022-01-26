const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
   
    res.sendFile(__dirname + "/index.html");

    // JSON stringify >< JSON parse
    var server = {
        port: 3000,
        status: "running",
        description: "Server is up and running"
    }
    
    console.log(JSON.stringify(server));

    //res.send("Server is up and running");
});

app.post("/", function (req, res) {
    
    const apiKey = "ff8d52393cc1b950360d8f3b231792f5";
    const unit = "metric";
    const query = req.body.cityName;
    const url = "https://api.openweathermap.org/data/2.5/weather?appid=" + apiKey + "&q=" + query +"&units=" + unit;

    https.get(url, function (response) {
        console.log(response.statusCode);

        response.on("data", function (data) {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const imageURL = "http://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png";

            res.setHeader("Content-type", "text/html");
            res.write("The weather is currently " + weatherDescription);
            res.write("<h1> The temperature in " + query  + " is " + temp + " degress Celcius.</h1>");
            res.write("<img src=" + imageURL + ">");
            res.send();
        });
    });

});

app.listen(3000, function() {
    console.log("App started on port 3000");
});