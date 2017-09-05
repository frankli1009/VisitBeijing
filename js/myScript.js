/* ===============================================================================

THIS IS THE SCRIPT FILE FOR PORTFOLIO PROJECT OF VISIT_BEIJING CREATED BY Frank Li
   
=============================================================================== */

// Attraction images rollover functional data
var attractionImages = {
    figureCount: 8, // count of the figures involved in the rollover control
    imageCount: 0,  // total count of the images
    imgIds: [],     // id of figure image element
    imgIndexes: [], // current image index of the figure to be processing
    imgCounts: [],  // count of image of each figure
    imgFileNameRoots: [], // file name root of each figure
    images: [],     // all the Image objects
    imagesStartIndexes: [], // start index of image object of each figure
    rollOverInt: null,  // interval to roll over the images
    mouseoverImgId: "", // pause rolling over when mouse is over the image element 
    
    /* PURPOSE: cache the images to this.images array
       PARAMETERS:
       curIndex: the index of the Img in attraction Imgs.
    */
    initFigureImages: function(curIndex) {
        if(curIndex < 0 || curIndex >= this.figureCount) {
            console.error("Error in initFigureImages: curIndex("+curIndex+") out of bounds(0, "+this.figureCount+")");
            for(var i=0; i<this.imgCounts[curIndex]; i++) {
                var imageIndex = this.imagesStartIndexes[curIndex] + i;
                this.images[imageIndex] = null;
            }
            return;
        }
        
        for(var i=0; i<this.imgCounts[curIndex]; i++) {
            var sImageSrc = "../images/attraction/"+ attractionImages.imgFileNameRoots[curIndex] + 
                (i > 0 ? i : "") + ".jpg";

            var imageIndex = this.imagesStartIndexes[curIndex] + i;

            this.images[imageIndex] = new Image();
            this.images[imageIndex].src = sImageSrc;
        }
    },
    
    /* PURPOSE: roll over the image of Img
       PARAMETERS:
       imgId: id of the Img to process. It can be "" when 0 <= curIndex < this.figureCount
       curIndex: the index of the Img in attraction Imgs. Directly use it when > -1, otherwise get the real index by imgId
    */
    nextImage: function(imgId, curIndex) {
        //get the current image index
        var i = curIndex;
        if(i<0) { // when curIndex < 0, get cur index by imgId
            for(var j=0; j<this.figureCount; j++) {
                if(this.imgIds[j] === imgId) {
                    i = j;
                    break;
                }
            }
        }
        if(i<0) {
            console.error("Error in nextImage: can not find the Img with id="+imgId);
            return;
        }
        
        this.imgIndexes[i]++;
        if(this.imgIndexes[i] === this.imgCounts[i]) this.imgIndexes[i] = 0;

        var sImageSrc = "../images/attraction/"+ this.imgFileNameRoots[i] + 
            (this.imgIndexes[i] > 0 ? this.imgIndexes[i] : "") +
            ".jpg";

        var imageIndex = this.imagesStartIndexes[i] + this.imgIndexes[i];

        if(this.images[imageIndex] === null) {
            this.images[imageIndex] = new Image();
            this.images[imageIndex].src = sImageSrc;
        }

        $("#"+this.imgIds[i]).attr("src", sImageSrc);
    },
    
    /* PURPOSE: init the variables of attractionImages and start the rollover interval */
    
    init: function() {
        for(var i=0; i<this.figureCount; i++) {
            this.imgIndexes[i] = 0; // add one before each use
            this.imagesStartIndexes[i] = this.imageCount; 
            
            switch(i) {
                case 0:
                    this.imgIds[i] = "imgtempleofheaven";
                    this.imgCounts[i] = 4;
                    this.imgFileNameRoots[i] = "thetempleofheaven"; 
                    break;
                case 1:
                    this.imgIds[i] = "imgpalacemuseum";
                    this.imgCounts[i] = 3;
                    this.imgFileNameRoots[i] = "thepalacemuseum"; 
                    break;
                case 2:
                    this.imgIds[i] = "imggreatwall";
                    this.imgCounts[i] = 3;
                    this.imgFileNameRoots[i] = "badalinggreatwall"; 
                    break;
                case 3:
                    this.imgIds[i] = "imgsummerpalace";
                    this.imgCounts[i] = 3;
                    this.imgFileNameRoots[i] = "thesummerpalace"; 
                    break;
                case 4:
                    this.imgIds[i] = "imggongsmansion";
                    this.imgCounts[i] = 3;
                    this.imgFileNameRoots[i] = "princegongsmansion"; 
                    break;
                case 5:
                    this.imgIds[i] = "imgmuseum";
                    this.imgCounts[i] = 4;
                    this.imgFileNameRoots[i] = "nationalmuseum"; 
                    break;
                case 6:
                    this.imgIds[i] = "imgstadium";
                    this.imgCounts[i] = 4;
                    this.imgFileNameRoots[i] = "nationalstadium"; 
                    break;
                case 7:
                    this.imgIds[i] = "imguniversity";
                    this.imgCounts[i] = 5;
                    this.imgFileNameRoots[i] = "tsinghuauniversity"; 
                    break;
            }
            
            this.initFigureImages(i);
            this.imageCount += this.imgCounts[i];
        }
        
        this.rollOverInt = setInterval(function(){
            for(var i=0; i<attractionImages.figureCount; i++) {
                // skip the rolling over on the image when mouse over it
                if(attractionImages.mouseoverImgId === attractionImages.imgIds[i]) continue;
                
                attractionImages.nextImage("", i);
            }
            
        }, 3000);
    }
}

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
    
    // parallax of #home 
    parallaxHome();
    // auto highlight nav menu when scrolling
    highligthNavMenu();
    $(window).trigger("scroll");
    
    // toggle navBtn
    $(".navBtn").on("click", function() {
        $("#mainMenu").slideToggle();
    });
    
    $("#mainMenu li").on("click", function(){
        if ( $(window).width() < 1024 ) {
            $(".navBtn").click();
        }
    });
    
    // start the wow animation
    new WOW().init();
    
    // start the rolling over on attraction images
    attractionImages.init();
    
    // pause rolling over when mouse over
    $("#attractions img").on("mouseover", function() {
        //console.log("mouseover "+this.id);
        attractionImages.mouseoverImgId = this.id;
    });
    
    // recover rolling over when mouse out
    $("#attractions img").on("mouseout", function() {
        //console.log("mouseout "+this.id);
        attractionImages.mouseoverImgId = "";
    });
    
    // do a rollover every time clicked
    $("#attractions img").on("click", function() {
        //console.log("click "+this.id);
        attractionImages.nextImage(this.id, -1);
    });
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

// highlight navMenu when scroll to relative part
function highligthNavMenu() {
    // Cache selectors
    var lastId, 
        topMenu = $("#mainMenu"), 
        topMenuHeight = topMenu.outerHeight()+230,
        // All list items
        menuItems = topMenu.find("a"),
        // Anchors corresponding to menu items
        scrollItems = menuItems.map(function(){
            var item = $($(this).attr("href"));
            if (item.length) { return item; }
        });

    // Bind click handler to menu items
    // so we can get a fancy scroll animation
    menuItems.click(function(e){
        var href = $(this).attr("href"),
        offsetTop = href === "#" ? 0 : $(href).offset().top-topMenuHeight+1;
        $('html, body').stop().animate({ 
            scrollTop: offsetTop
        }, 850);
        e.preventDefault();
    });

    // Bind to scroll
    $(window).scroll(function(){
        console.log($(".navBtn").is(":visible"));
        if($(".navBtn").is(":visible")) {
            console.log("navBtn");
            menuItems.parent().removeClass("active");
            return;
        }
        // Get container scroll position
        var fromTop = $(this).scrollTop()+topMenuHeight;

        // Get id of current scroll item
        var cur = scrollItems.map(function(){
            if ($(this).offset().top < fromTop)
            return this;
        });
        // Get the id of the current element
        cur = cur[cur.length-1];
        var id = cur && cur.length ? cur[0].id : "";

        if (lastId !== id) {
            lastId = id;
            // Set/remove active class
            menuItems
                .parent().removeClass("active")
                .end().filter("[href=#"+id+"]").parent().addClass("active");
        }                   
    });
}

// parallax home

function parallaxHome() {
    // parallax of #home 
    var parallaxHome = document.querySelectorAll("#home"), speed =0.3;
    
    window.onscroll = function() {
        parallaxHome.forEach(function(elP) {
            var windowYOffset = -window.pageYOffset, elPBackgroundPos = "50%" + (windowYOffset * speed) + "px";
            //console.log("windowYOffset: "+windowYOffset+", pos: "+elPBackgroundPos);
            elP.style.backgroundPosition = elPBackgroundPos;
        });    
    };
};

