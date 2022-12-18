Ly.Extra = {};

Ly.Extra.RandomString = function(__length = 6) {

    var _result = '';
    var _character = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var _character_length = _character.length;

    for(var i = 0; i < __length; i++ ) {
        _result += _character.charAt(Math.floor(Math.random() * _character_length));
    };

    return _result;

};


/**
    * Convert object into array
    * @param {*} _Object Object that will be converted into array
    * @returns `Array[Object]`
*/
Ly.Extra.Object2Array = function(__object = {}) {
    let _result = [];
    for(var _key in __object) {
        _result.push(__object[_key]);
    };
    return _result;
};

Ly.Regex = {
    Group: function(_regex = "", _match = "") {
        return (_match.match(_regex) || []).map(e => e.replace(_regex, '$1').trim());
    }
}