Ly.Http = {};


Ly.Http.ObjectSerialize = function(__object = {}) {
    return Object.keys(__object).map(function(__key) {
        return __key + "=" + __object[__key];
    }).join("&");
};


Ly.Http.Get = async function(__url = "", __data = null) {
    return new Promise(function(__response) {
        
        var _xhttp = new XMLHttpRequest();
        _xhttp.onload = function() {

            __response((this.status >= 200 && this.status < 300) ? _xhttp.response : null);

        };
        _xhttp.onerror = function() {

            __response(null);

        };
        
        let _data_string = "";
        if(typeof(__data) !== "undefined" && __data !== null) {
            _data_string = "?" + Ly.Http.ObjectSerialize(__data);
        };
        
        _xhttp.open("GET", __url + _data_string);
        _xhttp.send();

    });
};

Ly.Http.GetJson = async function(__url = "", __data = null) {
    return Ly.Http.Get(__url, __data).then((_data) => { return (_data == null) ? null : JSON.parse(_data); });
};



Ly.Http.PostFetch = async function(__url = "", __data = {}, __header = null) {

    return new Promise(async function(__response) {

        let _http = {
            method: "POST",
            body: JSON.stringify(__data)
        };

        if(__header !== null) {
            _http["headers"] = __header;
        };

        fetch(__url, _http)
        .then((res) => {
            __response(res.text());
        })
        .catch(() => {
            __response(null);
        });

    });

};

Ly.Http.Post = async function(__url = "", __data = null, __header = {}) {

    return new Promise(function(__response) {
        
        var _xhttp = new XMLHttpRequest();
        _xhttp.onload = function() {
            __response((this.status >= 200 && this.status < 300) ? _xhttp.response : null);
        };
        _xhttp.onerror = function() {
            __response(null);
        };

        _xhttp.open("POST", __url);
        for(var _header in __header) {
            _xhttp.setRequestHeader(_header, __header[_header]);
        };

        var _data_string = "";
        if(typeof __data !== "undefined" && __data !== null) {
            _data_string = Ly.Http.ObjectSerialize(__data);
        };

        _xhttp.send(_data_string);

    });
};