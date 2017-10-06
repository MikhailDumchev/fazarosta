function OffsetDetector() {
    var container = new Object();
    var targetNodeName = "article";
    //Ссылка на динамический загрузчик HTML-модулей;
    var commonLoaderObject = new CommonLoader();
    //Текущее количество статей на станице;
    var currentAmount = 0;
    this.start = function(value) {
        "use strict";
        if (value) {
            container = value;
            currentAmount = container.getElementsByTagName(targetNodeName).length;
        }
        window.addEventListener("scroll", this, false);
    };
    this.handleEvent = function(event) {
        "use strict";
        event = event || window.event;
        var currentScrolling = 0;
        var documentHeight = document.body.offsetHeight;
        var screenHeight = document.documentElement.clientHeight;
        if (event.type === "scroll") {
            currentScrolling = window.pageYOffset || document.documentElement.scrollTop;
            if (currentScrolling + screenHeight >= documentHeight - 1000) {
                commonLoaderObject.makeRequest(currentAmount);
            }
        }
    };
}