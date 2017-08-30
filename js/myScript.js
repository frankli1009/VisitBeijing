/* ===============================================================================

THIS IS THE SCRIPT FILE FOR PORTFOLIO PROJECT OF VISIT_BEIJING CREATED BY Frank Li
   
=============================================================================== */

// Ready event method on document object

$(function() {
    
    // Get today's weather forecast data by using OpenWeather API
    // every 3 hours: api.openweathermap.org/data/2.5/forecast?id={city id}&units=metric&APPID={APP_KEY}
    // daily: api.openweathermap.org/data/2.5/forecast/daily?id={city id}&units=metric&APPID={APP_KEY}
    
    $.getJSON("http://api.openweathermap.org/data/2.5/forecast/daily?id=2038349&units=metric&APPID=82c31a0ba4bed68c984fc02175d96529")
    .done(function(data) {
        if(parseInt(data.cod) === 200) {
            addWeatherInfoEls(data);
        } else {
            $("#weatherToday").text("Sorry, we cannot load today's weather.");
            console.warn("OpenWeather API return Cod: "+data.cod);
        }
    }).fail(function(){
        $("#weatherToday").text("Sorry, we cannot load today's weather.");
        console.warn("OpenWeather API failed");
    });
    
    var parallaxHome = document.querySelectorAll("#home"), speed =0.3;
    
    window.onscroll = function() {
        parallaxHome.forEach(function(elP) {
            var windowYOffset = -window.pageYOffset, elPBackgroundPos = "50%" + (windowYOffset * speed) + "px";
            //console.log("windowYOffset: "+windowYOffset+", pos: "+elPBackgroundPos);
            elP.style.backgroundPosition = elPBackgroundPos;
        });    
    };
    
    $(".navBtn").on("click", function() {
        $("#mainMenu").slideToggle();
    });
    
    $("#mainMenu li").on("click", function(){
        if ( $(window).width() < 1024 ) {
            $(".navBtn").click();
        }
    });
    
    new WOW().init();
});

// Add a function to Date to return its date string in format "dd/mm/yyyy"

Date.prototype.ddmmyyyy = function() {
  var mm = this.getMonth() + 1; // getMonth() is zero-based
  var dd = this.getDate();

  return [(dd>9 ? '' : '0') + dd,
          (mm>9 ? '' : '0') + mm,
          this.getFullYear()
         ].join('/');
};

// Add weather info elements to div "weatherToday"

function addWeatherInfoEls(data) {
    
    // Get open weather list index due to the date difference between Beijing and London
    var indexToday = (isSameDayInBeijing() ? 0 : 1);
    
    var today = new Date(data.list[indexToday].dt *1000);
    $("#today").text(today.ddmmyyyy());

    //weather image
    $weatherImg = $("<img>");
    $weatherImg.attr("src", "http://openweathermap.org/img/w/"+data.list[indexToday].weather[0].icon+".png");
    $weatherImg.addClass("floatleft weatherimg");
    
    //high temperature
    $weatherHigh = $("<span>");
    $weatherHigh.text(Math.round(data.list[indexToday].temp.max));
    $weatherHigh.addClass("hightemp");
    
    $weatherCommon = $("<span>");
    $weatherCommon.html("&#8451;");
    $weatherCommon.text($weatherCommon.text()+" / ");
    
    //low temperature
    $weatherLow = $("<span>");
    $weatherLow.text(Math.round(data.list[indexToday].temp.min));
    $weatherLow.addClass("lowtemp");
    
    //humidity
    $weatherHumidity = $("<span>");
    $weatherHumidity.html("&#8451;");
    $weatherHumidity.text($weatherHumidity.text()+", Humidity: "+data.list[indexToday].humidity+"%");
    
    //weather description
    $weatherDesc = $("<span>");
    $weatherDesc.text(data.list[indexToday].weather[0].description);
    $weatherDesc.addClass("textBold");
    
    $weatherP = $("<p>");
    $weatherP.append($weatherImg).append($weatherHigh).append($weatherCommon).append($weatherLow);
    $weatherP.append($weatherHumidity);
    $weatherP.append($("<br>")).append($weatherDesc);
    $("#weatherToday").append($weatherP);
}

// Check whether Beijing Time is on the same date as London

function isSameDayInBeijing() {
    var d = new Date();
	var lt = d.getTime(); // get local time
	var to = d.getTimezoneOffset() * 60000; // get local time zone offset and change it to unit "ms"
	var utc = lt + to; // get utc time
    var toBeijing = 8; // Beijing is in the +8 time zone and has no energy saving time
	var tbj = utc + 3600000 * toBeijing;
	var dBeijing = new Date(tbj);
    return d.getDate() === dBeijing.getDate();
}