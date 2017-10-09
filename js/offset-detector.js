function OffsetDetector() {
    //Задержка перед показом формы подписки;
    var delay = 200000;
    //Временной индикатор, который указывает на необходимость показа формы подписки;
    var timeIndicator = false;
    //Значение отступа, который служит индикатором, для главного контента (статьи);
    var mainOffset = 1000;
    //Значение отступа, который служит индикатором, для бокового контента (форма);
    var additoryOffset = 2000;
    //В переменной содержится ссылка на главный контейнер (для добавления статей);
    var container = new Object();
    //В переменной содержится ссылка на дополнительный контейнер (для добавления боковых блоков)
    var additoryContainer = new Object();
    var targetNodeName = "article";
    //Ссылка на динамический загрузчик HTML-модулей;
    var commonLoaderObject = new CommonLoader();
    //Количество статей на станице;
    var articlesAmount = 10;
    //Номер текущей страницы;
    var currentPage = 0;
    //Номер текущего бокового блока (0 - форма подписки);
    var currentModule = 1;
    var changeSideModule = function() {
        "use strict";
        
    };
    var checkContainer = function(value) {
        "use strict";
        var indicator = false;
        if (value.toString !== "[object Object]") indicator = true;
        return indicator;
    };
    this.setMainContainer = function(value) {
        "use strict";
        if (value) {
            container = value;
            //Определение номера текущей страницы;
            currentPage = Math.ceil(container.getElementsByTagName(targetNodeName).length / articlesAmount);
            window.addEventListener("scroll", this, false);
        } else console.error("Не был указан HTML-контейнер;");
    };
    this.setAdditoryContainer = function(value) {
        "use strict";
        if (value) {
            additoryContainer = value;
            window.setTimeout(function() {
                timeIndicator = true;
            }.bind(this), delay);
        } else console.error("Не был указан HTML-контейнер;");
    };
    this.handleEvent = function(event) {
        "use strict";
        event = event || window.event;
        var currentScrolling = 0;
        var documentHeight = document.body.offsetHeight;
        var screenHeight = document.documentElement.clientHeight;
        if (event.type === "scroll") {
            currentScrolling = window.pageYOffset || document.documentElement.scrollTop;
            //Если позиция нижней части экрана ниже, чем заданное значение, происходит добавление новых статей;
            if (currentScrolling + screenHeight >= documentHeight - mainOffset) {
                commonLoaderObject.makeRequest({"container": container, "page": currentPage});
                currentPage++;
            }
            if (currentScrolling + screenHeight >= 1000 * currentModule) {
                //Дополнительная проверка в случае, если не был указан дополнительный контейнер;
                if (checkContainer(additoryContainer)) {
                    //Добавление обычного бокового модуля;
                    if (!timeIndicator) {
                        commonLoaderObject.makeRequest({"container": additoryContainer, "module": currentModule});
                        currentModule++;
                    //Добавление формы подписки;
                    } else {
                        commonLoaderObject.makeRequest({"container": additoryContainer, "module": 0});
                    }
                }
            }
        }
    };
}