function clearStyleAttribute(element, properties) {
    "use strict";
    var counter = 0;
    var pattern = /.?/;
    if (element.hasAttribute("style")) {
        for (counter = 0; counter < properties.length; counter++) {
            switch (properties[counter]) {
                case "position":
                    pattern = /\s*position:\s*[a-z\-]+;\s*/ig;
                    break;
                case "width":
                case "height":
                case "top":
                case "left":
                    pattern = "\\s*" + properties[counter] + ":\\s*\\-{0,1}[0-9]+(\\.[0-9]+)*(px|%);\\s*";
                    break;
                case "opacity":
                    pattern = /\s*opacity:\s*[0-9]+(\.[0-9]+)*;\s*/ig;
                    break;
                case "display":
                    pattern = /\s*display:\s*(block|none);\s*/ig;
                    break;
                case "margin":
                    pattern = /\s*margin(-top|-left|-right|-bottom):\s*(-)?[0-9]+(\.[0-9]+)*(px|%);\s*/ig;
                    break;
                case "z-index":
                    pattern = /\s*z-index:\s*[0-9]+;\s*/ig;
                    break;
                default:
                    break;
            }
            if (new RegExp(pattern).test(element.getAttribute("style")))
                element.setAttribute("style", element.getAttribute("style").replace(new RegExp(pattern), ""));
        }
        if (!element.getAttribute("style").length) element.removeAttribute("style");
    }
}
function addClassName(element, className) {
    "use strict";
    if (element.className.length) element.className = element.className + " ";
    if (!new RegExp(className).test(element.className)) element.className = element.className + className;
}
function clearClassName(element, className) {
    "use strict";
    element.className = element.className.replace(new RegExp(className), "");
    element.className = element.className.replace(/\s+$/ig, "");
    if (!element.className.length) element.removeAttribute("class");
}
function testClassName(element, className) {
    "use strict";
    if (new RegExp("\\b" + className + "\\b(?!-)").test(element.className)) return true;
    else return false;
}
/**
* Функция используется для определения позиции DOM-элемента относительно начала страницы;
* @param {HTMLElement} Element DOM-элемент, для которого необходимо определить вертикальный и горизонтальный отступ
* относительно начала документа;
* @author Илья Кантор;
*/
function calculateOffset(Element) {
    "use strict";
    //Получение ограничивающего прямоугольника элемента;
    var Rectangle = Element.getBoundingClientRect();
    //В переменных содержатся ссылки на DOM-элементы "body" и "html";
    var Body = document.body;
    var HTML = document.documentElement;
    //Определение текущей горизонтальной и вертикальной прокрутки документа;
    var scrollTop = window.pageYOffset || HTML.scrollTop || Body.scrollTop;
    var scrollLeft = window.pageXOffset || HTML.scrollLeft || Body.scrollLeft;
    //Получение сдвига DOM-элементов "body" и "html" относительно окна браузера;
    var clientTop = HTML.clientTop || Body.clientTop || 0;
    var clientLeft = HTML.clientLeft || Body.clientLeft || 0;
    //Получение координат элемента относительно начала страницы;
    var top  = Rectangle.top +  scrollTop - clientTop;
    var left = Rectangle.left + scrollLeft - clientLeft;
    return { "top": Math.round(top), "left": Math.round(left) };
}
function checkObject(value) {
    for (var key in value) {
        if (value.hasOwnProperty(key)) return true;
    }
    return false;
}