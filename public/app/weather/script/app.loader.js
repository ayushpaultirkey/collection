class $loader {
    constructor() {
        this.item = [];
        this.index = 0;
    };

    async start() {

        if(this.index < (this.item.length)) {
            
            let _item = this.item[this.index];

            if(_item.type == "script") {
                const _script = document.createElement("script");
                _script.src = _item.path;
                _script.onload = () => {
                    this.next();
                };
                document.body.appendChild(_script);
            }
            else if(_item.type == "style") {
                const _style = document.createElement("link");
                _style.href = _item.path;
                _style.type = "text/css";
                _style.rel = "stylesheet";
                _style.media = "screen";
                _style.onload = () => {
                    this.next();
                };
                document.head.appendChild(_style);
            }
            else if(_item.type == "request") {
                let _data = await Ly.Http.Get(_item.path);
                await this.next(_data);
            }
            else if(_item.type == "function") {
                _item.perform();
            }
            else if(_item.type == "image") {
                let _image = new Image();
                _image.src = _item.path;
                _image.onload = () => {
                    this.next(_item.path);
                };
            };

        }
        else {
            this.oncomplete();
        };
    };

    async next(_data = null) {
        if(typeof(this.item[this.index].onload) !== "undefined") {
            this.item[this.index].onload(_data);
        };
        this.onupdate(this.item[this.index]);
        this.index++;
        await this.start();
    };

    onupdate(_item) { };
    oncomplete() { };
};

const LoaderText = document.querySelector(".app-loader > label");
const LoaderProgress = document.querySelector(".app-progress");
const Loader = new $loader();

Loader.item = [

    { path: "/public/app/weather/style/app.css", type: "style" },
    { path: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css", type: "style" },
    { path: "https://cdnjs.cloudflare.com/ajax/libs/weather-icons/2.0.12/css/weather-icons.min.css", type: "style" },
    { path: "https://cdnjs.cloudflare.com/ajax/libs/weather-icons/2.0.12/css/weather-icons-wind.min.css", type: "style" },

    { path: "https://canvasjs.com/assets/script/canvasjs.min.js", type: "script" },

    { path: "https://code.jquery.com/jquery-3.2.1.min.js", type: "script" },
    { path: "https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.5.0/semantic.min.css", type: "style" },
    { path: "https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.5.0/semantic.min.js", type: "script" },

    { path: "/public/library/ly/ly.js", type: "script" },
    { path: "/public/library/ly/ly.http.js", type: "script" },
    { path: "/public/library/ly/ly.element.js", type: "script" },
    { path: "/public/library/ly/ly.extra.js", type: "script" },
    { path: "/public/library/ly/ly.css", type: "style" },

    { path: "/public/app/weather/script/app.js", type: "script" },

    { path: "/public/app/weather/template/app.html", type: "request", onload:
        function(_data) {
            Ly.Element(".app").AppendHtml(_data)
        }
    },
    { path: "/public/app/weather/template/app.navigation.html", type: "request", onload:
        function(_data) {
            Ly.Element(".app-weather").AppendHtml(_data);
        }
    },

    { type: "function", perform:
        function() {

            if(navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(async (_position) => {
        
                    let _lat = _position.coords.latitude;
                    let _lon = _position.coords.longitude;
        
                    let _data = await Ly.Http.Get(`https://api.open-meteo.com/v1/forecast?latitude=${_lat}&longitude=${_lon}&hourly=temperature_2m&timezone=auto&current_weather=true`);
                    if(_data !== null) {
                        Weather.Data = JSON.parse(_data);
                        Loader.next();
                    };
        
                }, async () => {
                    alert("GPS not found");

                    let _data = await Ly.Http.Get(`https://api.open-meteo.com/v1/forecast?latitude=23.25&longitude=77.375&hourly=temperature_2m&timezone=auto&current_weather=true`);
                    if(_data !== null) {
                        Weather.Data = JSON.parse(_data);
                        Loader.next();
                    };

                });
            }
            else {
                alert("Unable to get location");
            }
        }
    },

];
Loader.onupdate = function() {
    let _percentage = Math.floor(((this.index + 1) / this.item.length) * 100);
    LoaderText.innerText = `Loading ${_percentage}%`;
    LoaderProgress.style.width = `${_percentage}%`;
};
Loader.oncomplete = function() {

    setTimeout(() => {
        Ly.Animate(".app-loader", {
            from: { opacity: 1 },
            to: { opacity: 0 },
            complete: function(_element) {
                Ly.Element(_element).Style({ "display": "none" });
            }
        });
    }, 5);

    Weather.Init();

};
Loader.start();