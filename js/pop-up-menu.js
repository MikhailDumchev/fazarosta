function PopUpMenu() {
    //Идентификатор DOM-элемента, который выполняет роль выпадающего меню;
    var menuId = "pop-up-menu";
    //Идентификатор DOM-элемента, который выполняет роль вызывающей кнопки;
    var callButtonId = "menu-caller";
    //Класс, который используется для деактивации скроллинга главной части страницы;
    var disableClassName = "disabled";
    //Класс, который используется для добавления эффекта размытости главной части страницы;
    var fuzzyClassName = "fuzzy";
    //Класс главной части страницы;
    var mainPartClassName = "main-part";
    //Класс шапки страницы;
    var headerClassName = "upper-menu";
    //Ссылка на DOM-элемент, который выполняет роль главной части страницы;
    var mainPart = new Object();
    //Ссылка на DOM-элемент, который выполняет роль шапки страницы;
    var header = new Object();
    //Ссылка на документ;
    var body = document.body;
    var headerInternalModule = new Object();
    var menu = document.getElementById(menuId);
    var callButton = document.getElementById(callButtonId);
    //Длительность всех видов анимации;
    var duration = 300;
    //Индикатор текущего состояния (активное или неактивное) выпадающего меню;
    var indicator = false;
    var indicatorTitle = "data-menu-indicator";
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
    var disableScroll = function() {
        "use strict";
        //Определение ширины вертикального ползунка;
        var scrollBarWidth = window.innerWidth - body.clientWidth;
        if (header.children.length) {
            //TODO: Решить проблему с перекрытием ползунка прокрутки fixed-шапкой;
            //Перемещение шапки относительно страницы (избежать перекрытия ею вертикальной полосы прокрутки);
            header.style.left = -scrollBarWidth + "px";
            body.style.paddingRight = scrollBarWidth + "px";
            //Перемещение внутреннего содержимого шапки (избежать горизонтальное смещение содержимого);
            headerInternalModule = header.children[0];
            headerInternalModule.style.position = "relative";
            headerInternalModule.style.left = scrollBarWidth / 2 + "px";
            //Деактивация скроллинга главного содержимого страницы;
            addClassName(body, disableClassName);
        }
    };
    var enableScroll = function() {
        "use strict";
        clearStyleAttribute(header, ["left"]);
        clearStyleAttribute(body, ["padding"]);
        clearStyleAttribute(header.children[0], ["position", "left"]);
        clearClassName(body, disableClassName);
    };
    var startAnimation = function(reverseAction) {
        "use strict";
        //Определение высоты экрана пользователя для задания начальной
        //позиции меню (применяется во время анимации вертикального слайдинга);
        var menuHeight = document.documentElement.clientHeight;
        //Если не указана необходимость обратного слайдинга (выпадающее меню ещё неактивно);
        if (!reverseAction) {
            disableScroll();
            //Начало анимации (плавное появление и вертикальный слайдинг);
            if (window.getComputedStyle(menu, "").opacity) menu.style.opacity = 0;
            opacityAnimationCall(menu, duration, 1);
            verticalSlidingAnimationCall(menu, duration, -menuHeight, 0);
            window.setTimeout(function() {
                //Добавление эффекта размытия для главной части страницы;
                addClassName(mainPart, fuzzyClassName);
                clearStyleAttribute(menu, ["top", "opacity"]);
                //Удаление атрибута-заглушки после завершения анимации;
                body.removeAttribute(indicatorTitle);
            }.bind(this), duration + 10);
        } else {
            clearClassName(mainPart, fuzzyClassName);
            verticalSlidingAnimationCall(menu, duration, 0, -menuHeight);
            opacityAnimationCall(menu, duration, 0);
            window.setTimeout(function() {
                enableScroll();
                //Удаление атрибута-заглушки после завершения анимации;
                body.removeAttribute(indicatorTitle);
            }.bind(this), duration + 10);
        }
    };
    this.appendHandler = function() {
        "use strict";
        var additoryObject = new Object();
        //Если был найден DOM-элемент с идентификатором menuId;
        if (menu) {
            if (callButton) {
                //Поиск главного содержимого страницы;
                additoryObject = selectElementByClassName(mainPartClassName);
                if (additoryObject.status) {
                    //Сохранение ссылки на главное содержимое;
                    mainPart = additoryObject.element;
                    additoryObject = selectElementByClassName(headerClassName);
                    if (additoryObject.status) {
                        //Сохранение ссылки на шапку страницы;
                        header = additoryObject.element;
                        //Происходит добавления слушателей события "click";
                        callButton.addEventListener("click", this, true);
                    } else console.error("Не был найден DOM-элемент с классом '" + headerClassName + "';");
                } else console.error("Не был найден DOM-элемент с классом '" + mainPartClassName + "';");
            } else console.error("Не был найден DOM-элемент с id '" + callButtonId + "';");
        } else console.error("Не был найден DOM-элемент с id '" + menuId + "';");
    };
    this.handleEvent = function(event) {
        "use strict";
        event = event || window.event;
        if (event.type === "click") {
            if (!body.hasAttribute(indicatorTitle)) {
                //Добавление атрибута-заглушки, который свидетельствует об активности
                //анимации появления выпадающего меню в данный момент;
                body.setAttribute(indicatorTitle, true);
                //Если индикатор неактивен, выпадающее меню ещё не было активировано;
                if (!indicator) {
                    startAnimation();
                    indicator = true;
                } else {
                    startAnimation(indicator);
                    indicator = false;
                }
            }
        }
    };
}