function LiveSearch() {
    var searchContentClassName = "search-content";
    var initialContentClassName = "initial-content";
    var baseModuleClassName = "base-module";
    var element = new Object();
    var baseModule = new Object();
    var initialContent = new Object();
    var searchContent = new Object();
    var duration = 500;
    var textLength = 3;
    var delay = 2000;
    //Ссылка на динамический загрузчик HTML-модулей;
    var commonLoaderObject = new CommonLoader();
    var selectElementByClassName = function(className, container, indicator) {
        "use strict";
        var counter = 1;
        var additoryObject = new Object();
        var result = new Object();
        //Если пользователь явно не указал контейнер, поиск будет проводиться по всему документу;
        if (!container) container = document;
        additoryObject = container.getElementsByClassName(className);
        //Удаление лишних DOM-элементов;
        if (indicator && additoryObject.length > 1) {
            for (counter; counter < additoryObject.length; counter++)
                additoryObject[counter].parentNode.removeChild(additoryObject[counter]);
        }
        //Формирование ответа;
        if (!additoryObject.length) result = {"status": false};
        else result = {"status": true, "element": additoryObject[0]};
        return result;
    }.bind(this);
    this.appendHandler = function(value) {
        "use strict";
        var additoryObject = new Object();
        if (value && value.nodeName === "INPUT") {
            additoryObject = selectElementByClassName(baseModuleClassName);
            if (additoryObject.status) {
                baseModule = additoryObject.element;
                additoryObject = selectElementByClassName(initialContentClassName, baseModule);
                if (additoryObject.status) {
                    initialContent = additoryObject.element;
                    element = value;
                    element.addEventListener("keypress", this, true);
                } else console.error("Не был найден DOM-элемент с классом '" + initialContentClassName + "';");
            } else console.error("Не найден DOM-элемент с классом '" + baseModuleClassName + "';");
        } else console.error("Необходимо указать ссылку на INPUT-элемент;");
    };
    this.startAnimation = function() {
        "use strict";
        var additoryVariable = new Object();
        //Сохранение текущей высоты главного блока перед началом анимации;
        var baseModuleHeight = baseModule.clientHeight;
        baseModule.style.height = baseModuleHeight + "px";
        if (window.getComputedStyle(initialContent, "").position !== "absolute") initialContent.style.position = "absolute";
        //Поиск добавленного блока с классом searchContentClassName;
        additoryVariable = selectElementByClassName(searchContentClassName, baseModule);
        if (additoryVariable.status) {
            searchContent = additoryVariable.element;
            verticalSlidingAnimationCall(initialContent, duration, 0, baseModuleHeight);
            verticalSlidingAnimationCall(searchContent, duration, -baseModuleHeight, 0);
            //TODO: Доделать реализацию анимации;
        } else console.error("Не найден DOM-элемент с классом '" + searchContentClassName + "';");
    };
    this.handleEvent = function(event) {
        "use strict";
        event = event || window.event;
        if (event.type === "keypress") {
            if (element.value.length >= textLength) {
                commonLoaderObject.makeRequest({"container": baseModule, "search": element.value, "callback": this});
            }
        }
    };
}