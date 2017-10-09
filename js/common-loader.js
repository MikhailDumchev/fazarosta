function CommonLoader() {
    var handlerAddress = "http://fazarosta.com/add/";
    this.makeRequest = function(incomingObject) {
        "use strict";
        var XHR = new XMLHttpRequest();
        var container = incomingObject.container;
        var data = "";
        //Обработка объекта в зависимости от наличия в нём определённых свойств;
        if (incomingObject.page) data = "page=" + encodeURIComponent(incomingObject.page);
        if (incomingObject.module) data = "module=" + encodeURIComponent(incomingObject.module);
        XHR.onreadystatechange = function() {
            var response = new Object();
            if (XHR.readyState === 4) {
                if (XHR.status === 200) {
                    response = JSON.parse(XHR.responseText);
                    if (response.status) {
                        //Добавление содержимого в указанный контейнер (основной или дополнительный);
                        container.innerHTML += response.content;
                    } else console.error("К сожалению, возникла ошибка при непосредственном формировании HTML-разметки;");
                } else console.error("К сожалению, возникла ошибка при получении AJAX-ответа;");
            }
        };
        XHR.open("POST", handlerAddress, true);
        XHR.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        XHR.send(data);
    };
}