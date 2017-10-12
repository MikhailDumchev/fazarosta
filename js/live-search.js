function LiveSearch() {
    //Класс элемента, в котором отображаются результаты живого поиска;
    var searchContentClassName = "search-content";
    //Класс начального элемента;
    var initialContentClassName = "initial-content";
    //Класс контейнера, в котором содержатся все блоки, связанные с живым поиском;
    var baseModuleClassName = "base-module";
    //Класс активного блока (в котором отображаются результаты предыдущего поиска);
    var activeSearchContent = "active";
    //Ссылка на поле для ввода поисковых запросов;
    var element = new Object();
    //Ссылка на контейнер;
    var baseModule = new Object();
    //Ссылка на начальный элемент (который содержится в контейнере до начала поиска);
    var initialContent = new Object();
    //Ссылка на элемент с результатами живого поиска;
    var searchContent = new Object();
    //Длительность каждой анимации (вертикальной и плавного появления);
    var duration = 500;
    //Количество символов в строке, после ввода которого запускается живой поиск;
    var textLength = 4;
    //Задержка перед началом живого поиска;
    var delay = 1000;
    //Переменная служит индикатором для определения статуса живого поиска (уже запущен или ещё не начинался / окончен);
    var searchIndicator = false;
    //В переменной содержится ссылка на таймер;
    var timeIndicator = 0;
    //Ссылка на динамический загрузчик HTML-модулей;
    var commonLoaderObject = new CommonLoader();
    /**
     * Метод используется для поиска первого DOM-элемента с определённым классом;
     * */
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
    /**
     * Метод используется для очистки поискового запроса в поле для поиска;
     * */
    var clearTextField = function() {
        element.value = "";
    };
    /**
     * Метод используется для определения и сохранения текущей высоты DOM-элемента;
     * @param {HTMLElement} module Ссылка на DOM-элемент, высоту которого необходимо вычислить;
     * */
    var calculateHeight = function(module) {
        var moduleHeight = 0;
        if (module) {
            moduleHeight = module.clientHeight;
            module.style.height = moduleHeight + "px";
        }
        return moduleHeight;
    };
    /**
     * Метод используется для запуска анимации вертикального слайдинга;
     * */
    var slidingAnimation = function(reverseAction) {
        "use strict";
        //TODO: разобраться с очисткой атрибута style;
        var baseModuleHeight = 0;
        //Поиск добавленного блока с классом searchContentClassName;
        var additoryVariable = selectElementByClassName(searchContentClassName, baseModule);
        if (additoryVariable.status) {
            searchContent = additoryVariable.element;
            //Сохранение текущей высоты главного блока перед началом анимации;
            baseModuleHeight = calculateHeight(baseModule);
            //Если не указана необходимость обратного слайдинга (текущая итерация является первой);
            if (!reverseAction) {
                //Начальный блок перемещается вниз;
                if (window.getComputedStyle(initialContent, "").position !== "absolute") initialContent.style.position = "absolute";
                if (window.getComputedStyle(searchContent, "").position !== "absolute") searchContent.style.position = "absolute";
                verticalSlidingAnimationCall(initialContent, duration, 0, baseModuleHeight);
                window.setTimeout(function() {
                    verticalSlidingAnimationCall(searchContent, duration, -baseModuleHeight, 0);
                }.bind(this), duration / 2 + 10);
            } else {
                //Начальный блок перемещается вверх;
                if (window.getComputedStyle(searchContent, "").position !== "absolute") searchContent.style.position = "absolute";
                verticalSlidingAnimationCall(searchContent, duration, 0, -baseModuleHeight);
                window.setTimeout(function() {
                    verticalSlidingAnimationCall(initialContent, duration, baseModuleHeight, 0);
                }.bind(this), duration / 2 + 10);
            }
            window.setTimeout(function() {
                clearStyleAttribute(baseModule, ["height"]);
                clearStyleAttribute(searchContent, ["top", "position"]);
                if (!reverseAction) {
                    clearStyleAttribute(searchContent, ["top", "position"]);
                } else {
                    clearStyleAttribute(initialContent, ["top", "position"]);
                    baseModule.removeChild(searchContent);
                }
            }.bind(this), duration + duration / 2 + 20);
        } else console.error("Не был найден DOM-элемент с классом '" + searchContentClassName + "';");
    };
    /**
     * Метод используется для запуска анимации плавного появления;
     * */
    var opacityAnimation = function() {
        "use strict";
        //Поиск активного блока, в котором отображаются результаты живого поиска;
        var additoryVariable = selectElementByClassName(searchContentClassName + " " + activeSearchContent, baseModule);
        if (additoryVariable.status) {
            searchContent = additoryVariable.element;
            //Сохранение текущей высоты главного блока перед началом анимации;
            calculateHeight(baseModule);
            //Сокрытие текущего активного блока;
            opacityAnimationCall(searchContent, duration, 0);
            window.setTimeout(function() {
                baseModule.removeChild(searchContent);
                //Поиск нового добавленного блока с результатами живого поиска;
                additoryVariable = selectElementByClassName(searchContentClassName, baseModule);
                //Если новый блок был найден, поисковые результаты присутствуют;
                if (additoryVariable.status) {
                    searchContent = additoryVariable.element;
                    searchContent.style.opacity = 0;
                    //Показ нового добавленного блока;
                    opacityAnimationCall(searchContent, duration, 1);
                    window.setTimeout(function() {
                        clearStyleAttribute(baseModule, ["height"]);
                        clearStyleAttribute(searchContent, ["opacity"]);
                    }.bind(this), duration + 10);
                //В противном случае необходимо указать, что результаты отсутствуют;
                } else {
                    
                }
            }.bind(this), duration + 10);
        }
    };
    /**
     * Метод служит для запуска анимации;
     * @param {Boolean} reverseAction Индикатор, согласно которому определяется направление вертикального слайдинга (показ блока с результатами поиска или базового модуля);
     * */
    this.startAnimation = function(reverseAction) {
        "use strict";
        //Если при запуске анимации индикатор ещё не активен, это - первая итерация,
        //и необходимо запустить вертикальную анимацию и скрыть DOM-элемент с классом
        //initialContentClassName;
        if (!searchIndicator) {
            //Активация живого поиска;
            searchIndicator = true;
            slidingAnimation();
        //Если индикатор активен, значит поиск начался, но необходимо определить,
        //продолжается ли он (анимация плавного появления);
        } else {
            //Наличие параметра reverseAction указывает на необходимость запуска анимации
            //вертикального слайдинга (показ начального блока);
            if (reverseAction) {
                slidingAnimation(reverseAction);
                searchIndicator = false;
            } else opacityAnimation();
        }
    };
    /**
     * Инициализирующий метод;
     * @param {HTMLInputElement} value Ссылка на поле для ввода поисковых запросов;
     * */
    this.appendHandler = function(value) {
        "use strict";
        var additoryObject = new Object();
        if (value && value.nodeName === "INPUT") {
            //Поиск контейнера;
            additoryObject = selectElementByClassName(baseModuleClassName);
            if (additoryObject.status) {
                baseModule = additoryObject.element;
                //Поиск начального модуля;
                additoryObject = selectElementByClassName(initialContentClassName, baseModule);
                if (additoryObject.status) {
                    initialContent = additoryObject.element;
                    element = value;
                    clearTextField();
                    //Инициализация слушателя происходит только после проверки наличия всех необходимых DOM-элементов;
                    element.addEventListener("keyup", this, true);
                } else console.error("Не был найден DOM-элемент с классом '" + initialContentClassName + "';");
            } else console.error("Не найден DOM-элемент с классом '" + baseModuleClassName + "';");
        } else console.error("Необходимо указать ссылку на INPUT-элемент;");
    };
    /**
     * Метод-обработчик;
     * @param {Event} event Объект-событие;
     * */
    this.handleEvent = function(event) {
        "use strict";
        event = event || window.event;
        var additoryVariable = new Object();
        if (event.type === "keyup") {
            if (timeIndicator) window.clearTimeout(timeIndicator);
            timeIndicator = window.setTimeout(function() {
                //Если текущее количество символов больше, чем заданное, запускается анимация;
                if (element.value.length >= textLength) {
                    //Если на странице уже есть элемент с классом searchContentClassName, необходимо пометить его, как активный;
                    additoryVariable = selectElementByClassName(searchContentClassName, baseModule);
                    if (additoryVariable.status) addClassName(additoryVariable.element, activeSearchContent);
                    commonLoaderObject.makeRequest({"container": baseModule, "s": element.value, "callback": this});
                //В противном случае при условии, что живой поиск был активирован, необходимо вернуть начальный блок;
                } else {
                    if (searchIndicator) this.startAnimation(true);
                }
            }.bind(this), delay);
        }
    };
}