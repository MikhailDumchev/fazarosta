/**
 * Класс отвечает за AJAX-отправку сообщений на сервер с возможностью последующего отображения модального окна;
 */
function Sender() {
    //В переменной содержится ссылка на объект класса "ModalWindow";
    var modalWindowObject = new Object();
    /*
     * Метод используется для задания HTML-элемента в качестве модального окна;
     * @param {HTMLElement} value Ссылка на DOM-элемент;
     */
    this.setModalWindow = function(value) {
        "use strict";
        if (value) {
            try {
                //Инициализация модального окна;
                modalWindowObject = new ModalWindow();
                modalWindowObject.setModalWindow(value);
            } catch (error) {
                console.error("Необходимо добавить скрипт 'modal-window.js';");
            }
        }
    };
    //Класс DOM-элементов, для которых добавляются обработчики события;
    var requestCallerClassName = "request-caller";
    //Адрес обработчика (полный путь для совместимости с "AdBlock");
    var handlerAddress = "http://fazarosta.com/add/index.php";
    //В переменной содержится ссылка на объект класса "Validation";
    var validationObject = new Object();
    //Ссылка на DOM-элемент, при нажатии на который вызывается модальное окно;
    this.button = new Object();
    //Название индикатора-заглушки, который препятствует отправке формы;
    var indicator = "data-indicator";
    this.getIndicator = function() {
        return indicator;
    };
    this.setIndicator = function(value) {
        indicator = value;
    };
    //Метод используется для очистки значений во всех текстовых полях формы;
    var clearTextFields = function() {
        "use strict";
        var counter = 0;
        var additoryObject = new Object();
        for (counter = 0; counter < this.container.elements.length; counter++) {
            additoryObject = this.container.elements[counter];
            switch (additoryObject.type) {
                case "submit":
                case "hidden":
                case "radio":
                case "checkbox":
                    break;
                default:
                    if (additoryObject.value.length) additoryObject.value = "";
                    break;
            }
        }
    }.bind(this);
    /*
     * Метод инициализирует возможность AJAX-отправки данных (инициализация переменных и добавление слушателей событий);
     * @param {HTMLElement} value Ссылка на DOM-элемент
     * */
    this.appendHandler = function(element) {
        "use strict";
        var additoryObject = new Object();
        if (element && testClassName(element, requestCallerClassName)) {
            additoryObject = element;
            //Поиск формы, к которой относится кнопка;
            while (additoryObject.nodeName !== "BODY" && additoryObject.nodeName !== "FORM")
                additoryObject = additoryObject.parentNode;
            //Если была найдена форма;
            if (additoryObject.nodeName === "FORM") {
                this.container = additoryObject;
                this.button = element;
                this.button.addEventListener("click", this, false);
                try {
                    validationObject = new Validation();
                    validationObject.setForm(this.container);
                } catch (error) {
                    if (error instanceof  ReferenceError) {
                        this.button.removeEventListener("click", this, false);
                        console.error("Не подключен скрипт 'validation.js';");
                    }
                }
            }
        } else console.error("DOM-элемент должен иметь класс '" + requestCallerClassName + "';");
    };
    this.handleEvent = function(event) {
        "use strict";
        event = event || window.event;
        var XHR = new XMLHttpRequest();
        var additoryObject = new Object();
        //Объект, который используется для сохранения в localStorage введённых пользователем данных;
        var localStorageObject = new Object();
        var data = new Object();
        var requestBody = "";
        var counter = 0;
        XHR.onreadystatechange = function() {
            if (XHR.readyState === 4) {
                if (XHR.status === 200) {
                    //Вызов модального окна;
                    if (checkObject(modalWindowObject)) {
                        modalWindowObject.showModalWindow("Ваша заявка успешно принята!");
                    }
                    //Заполнение localStorage на основании имён и значений текстовых полей;
                    for (counter = 0; counter < this.container.elements.length; counter++) {
                        additoryObject = this.container.elements[counter];
                        if (additoryObject.type !== "submit") {
                            switch (additoryObject.type) {
                                case "text":
                                case "email":
                                case "tel":
                                    localStorageObject[additoryObject.name] = additoryObject.value;
                                    break;
                                case "radio":
                                    if (additoryObject.checked) {
                                        localStorageObject[additoryObject.name] = additoryObject.value;
                                    }
                                    break;
                                default: break;
                            }
                            if (additoryObject.nodeName === "TEXTAREA") {
                                localStorageObject[additoryObject.name] = additoryObject.value;
                            }
                        }
                    }
                } else {
                    //Вызов модального окна;
                    if (checkObject(modalWindowObject)) {
                        modalWindowObject.showModalWindow("При отправке Ваших данных возникла ошибка;");
                    }
                }
                //Очистка введённых пользователем данных;
                clearTextFields();
                //Удаление индикатора-заглушки;
                document.body.removeAttribute(indicator);
            }
        }.bind(this);
        if (event.type === "click") {
            if (!document.body.hasAttribute(indicator) && validationObject.validateForm()) {
                //Установка индикатора-заглушки;
                document.body.setAttribute(indicator, true);
                //Если используется POST-запросы (или на обработчик необходимо отправлять файлы); 
                if (this.container.getAttribute("method") === "POST") {
                    data = new FormData(this.container);
                    data.append("ajax_indicator", true);
                    XHR.open(this.container.getAttribute("method"), handlerAddress, true);
                    XHR.send(data);
                //Если используется GET-запросы;
                } else {
                    //Формирование тела запроса;
                    for (counter = 0; counter < this.container.elements.length; counter++) {
                        additoryObject = this.container.elements[counter];
                        if (additoryObject.type !== "submit") {
                            switch (additoryObject.type) {
                                case "text":
                                case "email":
                                case "tel":
                                case "hidden":
                                    requestBody = requestBody + additoryObject.name + "=" + additoryObject.value;
                                    if (counter < this.container.elements.length - 2) requestBody = requestBody + "&";
                                    break;
                                case "radio":
                                    if (additoryObject.checked) {
                                        requestBody = requestBody + additoryObject.name + "=" + additoryObject.value;
                                        if (counter < this.container.elements.length - 2) requestBody = requestBody + "&";
                                    }
                                    break;
                                default: break;
                            }
                            if (additoryObject.nodeName === "TEXTAREA") {
                                requestBody = requestBody + additoryObject.name + "=" + additoryObject.value;
                                if (counter < this.container.elements.length - 2) requestBody = requestBody + "&";
                            }
                        }
                    }
                    XHR.open(this.container.getAttribute("method"), handlerAddress + "?" + requestBody + "&ajax_indicator=true", true);
                    XHR.send();
                }
            }
        }
    };
}