function lazyLoader() {
    //TODO: Добавить картинку-заглушку (для тех блоков, в которых нет изображений)
    //TODO: Добавить определение текущей высоты экрана;
    //Длительность анимированного появления изображений;
    var duration = 1000;
    //Название атрибута, в котором хранится ссылка;
    var srcAttributeTitle = "data-src";
    //Название атрибута, в котором хранится альтернативное название изображения;
    var altAttributeTitle = "data-alt";
    //Ссылка на контейнер;
    var container = new Object();
    //Класс целевого HTML-элемента;
    var targetClassName = "additory-module";
    //Массив ссылок на целевые HTML-элементы (контейнеры для img);
    var targetsArray = new Array();
    /**
     * Метод используется для добавления IMG к допустимому целевому HTML-элементу;
     * @param {Number} counter Номер целевого HTML-элемента в созданном ранее массиве
     * @author Mikhail Dumchev (mikhail_dumchev@ukr.net);
     * */
    var addImage = function(counter) {
        "use strict";
        var image = document.createElement("img");
        if (targetsArray[counter].hasAttribute(altAttributeTitle)) image.alt = targetsArray[counter].getAttribute(altAttributeTitle);
        else image.alt = "Изображение";
        image.src = targetsArray[counter].getAttribute(srcAttributeTitle);
        image.style.opacity = 0;
        targetsArray[counter].appendChild(image);
        //Удаление дополнительных атрибутов;
        targetsArray[counter].removeAttribute(srcAttributeTitle);
        targetsArray[counter].removeAttribute(altAttributeTitle);
        opacityAnimationCall(image, duration, 1);
        window.setTimeout(function() {
            clearStyleAttribute(image, ["opacity"]);
        }.bind(this), duration + 20);
    };
    /**
     * Инициализирующий метод;
     * @param {HTMLElement} value Ссылка на HTML-элемент, в котором содержатся изображения с отложенной загрузкой;
     * @author Mikhail Dumchev (mikhail_dumchev@ukr.net);
     * */
    this.execute = function(value) {
        "use strict";
        var counter = 0;
        var additoryVariable = 0;
        if (value) {
            container = value;
            //Сохранение элементов в целевой массив в том случае, если у них есть необходимый атрибут;
            for (counter = 0; counter < container.getElementsByClassName(targetClassName).length; counter++) {
                additoryVariable = container.getElementsByClassName(targetClassName)[counter];
                if (additoryVariable.hasAttribute(srcAttributeTitle) && additoryVariable.getAttribute(srcAttributeTitle)) {
                    targetsArray.push(additoryVariable);
                }
            }
            if (targetsArray.length) {
                //Динамическое добавление HTML-элементов;
               for (counter = 0; counter < targetsArray.length; counter++) addImage(counter);
               //Очистка массива;
               targetsArray = new Array();
            } else console.error("Не было найдено ни одного целевого HTML-элемента, который удовлетворяет необходимые условия;");
        } else console.error("Необходимо указать ссылку на HTML-элемент;");
    };
}