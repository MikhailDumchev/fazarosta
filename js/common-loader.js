function CommonLoader() {
    var handlerAddress = "http://fazarosta.com/add/";
    this.makeRequest = function(value) {
        "use strict";
        var XHR = new XMLHttpRequest();
        var data = "page=" + encodeURIComponent(value);
        XHR.onreadystatechange = function() {
            if (XHR.readyState === 4) {
                
            }
        };
        XHR.open("POST", handlerAddress, true);
        XHR.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        XHR.send(data);
    };
}