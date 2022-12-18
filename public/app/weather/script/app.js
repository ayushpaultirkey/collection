const Weather = {};

Weather.Data = {};
Weather.WMOCode = {
    0: { icon: "wi-day-sunny", image: "/public/image/pexels-skitterphoto-3768.jpg" },

    1: { icon: "wi-day-sunny", image: "/public/image/pexels-skitterphoto-3768.jpg" },
    2: { icon: "wi-day-cloudy", image: "/public/image/pexels-magda-ehlers-2114014.jpg" },
    3: { icon: "wi-cloudy", image: "/public/image/pexels-magda-ehlers-2114014.jpg" },
    
    45: { icon: "wi-fog", image: "/public/image/pexels-johannes-plenio-1146709.jpg" },
    48: { icon: "wi-fog", image: "/public/image/pexels-johannes-plenio-1146709.jpg" },
    
    51: { icon: "wi-sprinkle", image: "/public/image/pexels-hiếu-hoàng-641584.jpg" },
    53: { icon: "wi-showers", image: "/public/image/pexels-nina-mace-photography-1523548.jpg" },
    55: { icon: "wi-sleet", image: "/public/image/pexels-peter-fazekas-1089455.jpg" },

    56: { icon: "wi-showers", image: "/public/image/pexels-hiếu-hoàng-641584.jpg" },
    57: { icon: "wi-sleet", image: "/public/image/pexels-nina-mace-photography-1523548.jpg" },
    
    61: { icon: "wi-rain", image: "/public/image/pexels-revac-films-photography-325676.jpg" },
    63: { icon: "wi-rain-mix", image: "/public/image/pexels-revac-films-photography-325676.jpg" },
    65: { icon: "wi-rain-wind", image: "/public/image/pexels-revac-films-photography-325676.jpg" },

    66: { icon: "wi-rain", image: "/public/image/pexels-revac-films-photography-325676.jpg" },
    67: { icon: "wi-rain-wind", image: "/public/image/pexels-revac-films-photography-325676.jpg" },

    71: { icon: "wi-snow", image: "/public/image/pexels-simon-berger-698275.jpg" },
    73: { icon: "wi-snow-wind", image: "/public/image/pexels-simon-berger-698275.jpg" },
    75: { icon: "wi-snowflake-cold", image: "/public/image/pexels-simon-berger-698275.jpg" },
    77: { icon: "wi-snow", image: "/public/image/pexels-simon-berger-698275.jpg" },

    80: { icon: "wi-rain", image: "/public/image/pexels-revac-films-photography-325676.jpg" },
    81: { icon: "wi-rain-mix", image: "/public/image/pexels-revac-films-photography-325676.jpg" },
    82: { icon: "wi-rain-wind", image: "/public/image/pexels-revac-films-photography-325676.jpg" },

    85: { icon: "wi-snow", image: "/public/image/pexels-simon-berger-698275.jpg" },
    86: { icon: "wi-snow-wind", image: "/public/image/pexels-simon-berger-698275.jpg" },

    95: { icon: "wi-thunderstorm", image: "/public/image/pexels-andre-furtado-1162251.jpg" },
    96: { icon: "wi-thunderstorm", image: "/public/image/pexels-andre-furtado-1162251.jpg" },
    99: { icon: "wi-thunderstorm", image: "/public/image/pexels-andre-furtado-1162251.jpg" },
};

Weather.SetIcon = function(_wmoCode) {

    let _code = Weather.Data.current_weather.weathercode;

    if(typeof Weather.WMOCode[_code] !== "undefined") {
        Ly.Element("#WeatherIcon").AddClass(Weather.WMOCode[_code].icon);
        Ly.Element(".app").Style({ "background-image": `url(${Weather.WMOCode[_code].image})` });
    };

}

Weather.SetTemparature = function() {

    let _data = Weather.Data.current_weather.temperature;

    Ly.Element("#WeatherTemperature").Html(`${Math.floor(_data)}&deg;C`);
    this.SetDate();

}

Weather.SetDate = function() {

    let _dateElement = Ly.Element("#WeatherDate");
    let _timeElement = Ly.Element("#WeatherTime");

    let _date = new Date().toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric" });
    let _time = new Date().toLocaleTimeString('en-us', { hour: "2-digit", minute: "2-digit" });

    setInterval(() => {

        _date = new Date().toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric" });
        _time = new Date().toLocaleTimeString('en-us', { hour: "2-digit", minute: "2-digit" });

        _dateElement.Html(_date);
        _timeElement.Html(_time);

    }, 1000 * 60)
    
    _dateElement.Html(_date);
    _timeElement.Html(_time);

}


Weather.GetLocation = function() {

    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (_position) => {

            let _lat = _position.coords.latitude;
            let _lon = _position.coords.longitude;

            let _data = await Ly.Http.Get(`https://api.open-meteo.com/v1/forecast?latitude=${_lat}&longitude=${_lon}&hourly=temperature_2m&timezone=auto&current_weather=true`);
            if(_data !== null) {
                Weather.Data = JSON.parse(_data);
                Weather.Init();
            };

        }, () => {
            alert("GPS not found");
        });
    }
    else {
        alert("Unable to get location");
    }

}

Weather.Init = function() {

    this.SetTemparature();
    this.SetIcon();
    this.Graph();

}

Weather.ToggleNavigation = function() {

    let _element = Ly.Element(".app-navigation > div");
    let _right = _element.Style("right");
    
    if(_right == "0%") {

        Ly.Animate(".app-navigation > div", {
            from: { "background-color": "rgba(255,255,255,0.7)" },
            to: { "background-color": "rgba(255,255,255,0)" }
        });
        setTimeout(() => {
            _element.Style({ "right": "-100%" });
        }, 150);

    }
    else {

        _element.Style({ "right": "0%" });
        setTimeout(() => {
            Ly.Animate(".app-navigation > div", {
                from: { "background-color": "rgba(255,255,255,0)" },
                to: { "background-color": "rgba(255,255,255,0.7)" }
            });
        }, 150);

    };

};

Weather.Graph = function() {

    let _dailyTime = Weather.Data.hourly.time;
    let _dailyTemperature = Weather.Data.hourly.temperature_2m;
    let _dailyResult = [];

    let _index = 0;
    let _run = true;

    while(_run) {
        if(typeof(_dailyTime[_index]) !== "undefined") {
            let _date = new Date(_dailyTime[_index]).toLocaleDateString('en-us', { weekday: "short", day: "2-digit" });
            _dailyResult.push({ label: _date, y: Math.floor(_dailyTemperature[_index]) });
            _index += 24;
        }
        else {
            _run = false;
        };
    };

    let _charOption = {
        animationEnabled: true,
        backgroundColor: "transparent",
        toolTip:{
            fontColor: "black"
        },
        axisX: {
            tickColor: "black",
            lineColor: "black",
            fontColor: "black"
        },
        axisY: {
            gridColor: "transparent",
            labelFontSize: 15,
            tickColor: "black",
            lineColor: "black",
            fontColor: "black"
        }
    }

    var _dailyChart = new CanvasJS.Chart("WeatherDailyCanvas", Object.assign(_charOption, {
        data: [{        
            color: "rgba(0,0,0,0.3)",
            type: "area",
            dataPoints: _dailyResult
        }]
    }));
    _dailyChart.render();

    let _hourlyTime = Weather.Data.hourly.time;
    let _hourlyTemperature = Weather.Data.hourly.temperature_2m;
    let _hourlyResult = [];

    for(var i = 0; i <= 24; i += 2) {
        let _time = new Date(_hourlyTime[i]).toLocaleTimeString('en-us', { hour: "2-digit", hour12: true });
        _hourlyResult.push({ label: _time, y: Math.floor(_hourlyTemperature[i]) });
    }

    var _hourlyChart = new CanvasJS.Chart("WeatherHourlyCanvas", Object.assign(_charOption, {
        data: [{        
            color: "rgba(0,0,0,0.3)",
            type: "area",
            dataPoints: _hourlyResult
        }]
    }));
    _hourlyChart.render();


}