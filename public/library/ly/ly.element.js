Ly.Select = function(__element = "", __window = window) {
    
    let _element = (__element instanceof __window.Element) ? __element : __window.document.querySelector(__element);

    return _element;

}

Ly.SelectAll = function(__element = "", __window = window) {
    
    let _element = (__element instanceof __window.Element) ? __element : __window.document.querySelectorAll(__element);

    return _element;

}


Ly.Element = function(__element = "", __window = window) {

    //
    let _element = Ly.Select(__element, __window);

    //
    return {
        e: _element,
        style: _element.style,

        Style: function(_property = null) {
            if(_property instanceof Object) {
                for(var _key in _property) {
                    _element.style[_key] = _property[_key];
                }
            }
            else {
                return _element.style[_property];
            };
        },

        HasClass: function(_class) {
            return _element.classList.contains(_class);
        },
        AddClass: function(_class) {
            return _element.classList.add(_class);
        },
        RemoveClass: function(_class) {
            return _element.classList.remove(_class);
        },

        Append: function(_child) {
            _element.appendChild(_child);
        },
        BuildTemplate: function(_template = "") {

            const _match = _template.matchAll(/({{.*?}}).*?=>.*?{(.*?)};/gms);

            for (const _key of _match) {
                _template = _template.replace(_key[0], "").replaceAll(_key[1], _key[2]);
            };
            
            return _template.trim();
        },
        AppendTemplate: function(_template = "", _object = {}, _position = "beforeend") {
            this.AppendHtml(this.CreateTemplate(this.BuildTemplate(_template), _object), _position);
        },
        CreateTemplate: function(_template = "", _object = {}) {
            for(var _key in _object) {
                _template = _template.replace(new RegExp(_key, 'g'), _object[_key]);
            };
            return _template;
        },

        Html: function(_string = null) {
            if(_string == null) {
                return _element.innerHTML;
            }
            else {
                _element.innerHTML = _string;
            };
        },
        AppendHtml: function(_string = null, _position = "beforeend") {
            if(_string !== null) {
                _element.insertAdjacentHTML("beforeend", _string);
            };
        },

        Text: function(_string = null) {
            if(_string == null) {
                return _element.innerText;
            }
            else {
                _element.innerText = _string;
            };
        },
        AppendText: function(_string = null, _position = "beforeend") {
            if(_string !== null) {
                _element.insertAdjacentText("beforeend", _string);
            };
        },
        
        Value: function(_string = null) {
            if(_string == null) {
                return _element.value;
            }
            else {
                _element.value = _string;
            };
        },
        AppendValue: function(_string = null) {
            if(_string !== null) {
                _element.value = _string;
            };
        },


        Child: function() {
            return _element.children;
        },
        Parent: function() {
            return _element.parentElement;
        },
        PreviousSibling: function() {
            return _element.previousElementSibling;
        },
        NextSibling: function() {
            return _element.nextElementSibling;
        },


        RemoveAttribute: function(_attribute = "") {
            return _element.removeAttribute(_attribute);
        },
        HasAttribute: function(_attribute = "") {
            return _element.hasAttribute(_attribute);
        },
        Attribute: function(_attribute = null) {
            if(_attribute == null) {
                return _element.getAttribute(_attribute);
            }
            else {
                for(_key in _attribute) {
                    _element.setAttribute(_key, _attribute[_key]);
                };
            };
        },

        Animate: function(_property) {
            Ly.Animate(_element, _property);
        },

        AddEvent: function(_name = null, _function = null) {
            _element.addEventListener(_name, _function);
        },
        RemoveEvent: function(_name = null, _function = null) {
            _element.removeEventListener(_name, _function);
        },

        Remove: function() {
            _element.remove();
        }

    }

};

Ly.CreateElement = function(_name = "", _property = {}, _element = null) {

    let _node = document.createElement(_name);

    for(_key in _property) {
        if(_key == "attribute") {
            for(_attribute in _property.attribute) {
                _node.setAttribute(_attribute, _property.attribute[_attribute]);
            }
        }
        else {
            _node[_key] = _property[_key];
        };
    };

    if(_element !== null) {
        Ly.Element(_element).Append(_node);
    }
    else {
        return _node;
    };

};


Ly.Animate = function(__element, _property = {}) {

    let _element = Ly.Select(__element);

    if(typeof(_property.transition) !== "undefined") {
        _element.style.transition = _property.transition;
    }
    else {
        _element.style.transition = "0.3s";
    };

    if(typeof(_property.begin) !== "undefined") {
        _property.begin(_element);
    };

    setTimeout(() => {
        for(var _key in _property.from) {
            _element.style[_key] = _property.from[_key];
        };
    
        for(var _key in _property.to) {
            _element.style[_key] = _property.to[_key];
        };
    }, 1);

    _element.ontransitionend = () => {
        if(typeof(_property.complete) !== "undefined") {
            _property.complete(_element);
        };
    }; 

};


Ly.Stop = function(_event) {
    _event.preventDefault();
    _event.stopPropagation();
};