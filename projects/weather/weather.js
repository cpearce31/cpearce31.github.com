$( document ).ready(function() {
  var userCity = "";
  var userCoords = [];
  $.getJSON('http://ipinfo.io', function(data){
    userCity = data["city"];
    userCoords = data["loc"].split(",");
    $(".yourCity").html(userCity);
    if (userCity === '') {
      $(".yourCity").html("Location failed.")
    }
      var weatherRequestStr = "http://api.openweathermap.org/data/2.5/weather?lat=" + userCoords[0] + "&lon=" + userCoords[1] + "&APPID=f680e9cf200ee4b0c38e74f68b2d4760&units=imperial";
      console.log(weatherRequestStr);
      $.getJSON(weatherRequestStr, function(json) {
        console.log(json);
        $(".temp").html(Math.floor(json["main"]["temp"]) + '&deg;F');
        $("#wIcon").attr("src", "http://openweathermap.org/img/w/" + json["weather"][0]["icon"] + ".png");
        $("#wIcon").attr("alt", json["weather"][0]["description"]);
        $("#wIcon").attr("title", json["weather"][0]["description"]);
        $(".wind").html("Wind: " + Math.floor(json["wind"]["speed"]) + "mph");
        $(".humidity").html("Humidity: " + Math.floor(json["main"]["humidity"]) + "%");

        $("#metric").change(function() {
          $(".temp").html(Math.floor(json["main"]["temp"] * (5/9) - 32) + "&degC");
          $(".wind").html("Wind: " + Math.floor(json["wind"]["speed"] * 1.61) + "kph");
        });
        $("#imperial").change(function() {
          $(".temp").html(Math.floor(json["main"]["temp"]) + '&deg;F');
          $(".wind").html("Wind: " + Math.floor(json["wind"]["speed"]) + "mph");
        });


      })
    })
});
