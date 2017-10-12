function CommonLoader() {
    this.makeRequest = function(incomingObject) {
        "use strict";
        var XHR = new XMLHttpRequest();
        var handlerAddress = "http://partner.fazarosta.com/wp-admin/admin-ajax.php";
        var container = incomingObject.container;
        var data = "";
        //Обработка объекта в зависимости от наличия в нём определённых свойств;
        if (incomingObject.page) {
            data = "page=" + encodeURIComponent(incomingObject.page);
            handlerAddress += "?action=get_posts_html";
        }
        if (incomingObject.module) {
            data = "module=" + encodeURIComponent(incomingObject.module);
            handlerAddress += "?action=get_posts_sidebar";
        }
        if (incomingObject.s) {
            data = "s=" + encodeURIComponent(incomingObject.s);
            handlerAddress += "?action=get_post_search";
        }
        XHR.onreadystatechange = function() {
            var response = new Object();
            if (XHR.readyState === 4) {
                if (XHR.status === 200) {
                    response = JSON.parse(XHR.responseText);
                    if (response.success) {
                        //Добавление содержимого в указанный контейнер (основной или дополнительный);
                        if (response.data.html) container.insertAdjacentHTML("beforeend", response.data.html);
                        if (incomingObject.callback) {
                            incomingObject.callback.startAnimation();
                        }
                    } else console.error("К сожалению, возникла ошибка при непосредственном формировании HTML-разметки;");
                } else console.error("К сожалению, возникла ошибка при получении AJAX-ответа;");
            }
        };
        XHR.open("POST", handlerAddress, true);
        XHR.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        XHR.send(data);
    }
}