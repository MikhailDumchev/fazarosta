function ModalWindow() {
    var callerClassName = "modal-window-caller";
    var modalWindowClassName = "modal-window";
    var closingButtonClassName = "closing-button";
    var messageBoxClassName = "modal-window-message";
    //Длительность анимации;
    var duration = 500;
    function searchContainer(element, attributeTitle, attributeValue) {
        "use strict";
        var indicator = false;
        while (!indicator && element.nodeName !== "BODY") {
            switch (attributeTitle) {
                case "class":
                    if (testClassName(element, attributeValue)) indicator = true;
                    break;
                case "id":
                    if (element.id === attributeValue) indicator = true;
                    break;
                default: break;
            }
            if (!indicator) element = element.parentNode;
        }
        return {"status": indicator, "element": element};
    }
    //В переменной содержится ссылка на DOM-элемент, который выполняет роль модального окна;
    var modalWindow = new Object();
    this.setModalWindow = function(value) {
        "use strict";
        if (value) {
            if (testClassName(value, modalWindowClassName)) modalWindow = value;
            else console.error("HTML-элемент должен иметь класс '" + modalWindowClassName + "';");
        } else console.error("Необходимо передать ссылку на HTML-элемент;");
    };
    //В переменной содержится ссылка на DOM-элемент, который выполняет роль заднего фона;
    var background = document.getElementById("background");
    this.initializeModalWindow = function() {
        "use strict";
        var counter = 0;
        for (counter = 0; counter < document.getElementsByClassName(callerClassName).length; counter++)
            document.getElementsByClassName(callerClassName)[counter].addEventListener("click", this, true);
    };
    this.showModalWindow = function(message) {
        "use strict";
        var messageBox = new Object();
        if (!modalWindow.hasAttribute("data-animation-indicator")) {
            //Установка атрибута-заглушки на время выполнения анимации;
            modalWindow.setAttribute("data-animation-indicator", true);
            //Добавление класса "active-modal-window" к DOM-элементу, который выполняет роль модального окна. Этот класс
            //необходим для определения текущего активного модального окна;
            addClassName(modalWindow, "active");
            addClassName(background, "active");
            //Если указан текст, который должен быть выведен в модальном окне;
            if (message) {
                 if (modalWindow.getElementsByClassName(messageBoxClassName).length) {
                    messageBox = modalWindow.getElementsByClassName(messageBoxClassName)[0];
                    messageBox.innerHTML = message;
                }
            }
            modalWindow.style.marginLeft = - modalWindow.clientWidth / 2 + "px";
            modalWindow.style.marginTop = - modalWindow.clientHeight / 2 + "px";
            opacityAnimationCall(background, duration, 1);
            window.setTimeout(function() {
                opacityAnimationCall(modalWindow, duration, 1);
                window.setTimeout(function() {
                    document.body.setAttribute("modal-window-indicator", true);
                    document.addEventListener("click", this, true);
                    if (modalWindow.hasAttribute("data-animation-indicator")) modalWindow.removeAttribute("data-animation-indicator");
                }.bind(this), duration + 50);
            }.bind(this), duration + 50);
        }
    };
    this.closeModalWindow = function() {
        "use strict";
        //Если пользователь нажал на кнопку закрытия модального окна;
        if (!modalWindow.hasAttribute("data-animation-indicator")) {
            //Установка атрибута-заглушки на время выполнения анимации;
            modalWindow.setAttribute("data-animation-indicator", true);
            opacityAnimationCall(modalWindow, duration, 0);
            window.setTimeout(function() {
                opacityAnimationCall(background, duration, 0);
                window.setTimeout(function() {
                    //Удаление атрибута-заглушки, который указывает, что в данный момент для выбранного DOM-элемента
                    //выполняется анимация;
                    if (modalWindow.hasAttribute("data-animation-indicator")) modalWindow.removeAttribute("data-animation-indicator");
                    clearStyleAttribute(background, ["opacity"]);
                    clearStyleAttribute(modalWindow, ["opacity", "margin"]);
                    clearClassName(background, "active");
                    clearClassName(modalWindow, "active");
                    document.removeEventListener("click", this, true);
                    if (document.body.hasAttribute("modal-window-indicator")) document.body.removeAttribute("modal-window-indicator");
                }.bind(this), duration + 50);
            }.bind(this), duration + 50);
        }
    };
    this.handleEvent = function(event) {
        "use strict";
        event = event || window.event;
        //В переменной хранится ссылка на DOM-элемент, на который нажал пользователь;
        var element = event.target;
        var searchingResult = new Object();
        if (event.type === "click") {
            //Если в данный момент модальное окно не активно;
            if (!document.body.hasAttribute("modal-window-indicator")) {
                //Если пользователь нажал на кнопку, которая отвечает за вызов модального окна;
                if (testClassName(element, callerClassName)) {
                    if (element.hasAttribute("data-reference")) {
                        modalWindow = document.getElementById(element.getAttribute("data-reference"));
                        this.showModalWindow();
                    }
                }
            } else {
                //Если пользователь нажал на кнопку закрытия модального окна;
                if (testClassName(element, closingButtonClassName)) this.closeModalWindow();
                else {
                    searchingResult = searchContainer(element, "class", modalWindowClassName);
                    //Если пользователь нажал не на область активного модального окна;
                    if (!searchingResult.status) {
                        this.closeModalWindow();
                    }
                }
            }
        }
    };
}