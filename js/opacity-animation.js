/**
 * Функция используется для анимированного изменения свойства "opacity" у выбранного DOM-элемента;
 * 
 * @param {object} Element Ссылка на DOM-элемент, для которого необходимо применить анимацию;
 * @param {number} duration Длительность анимации в миллисекундах;
 * @param {number} finiteOpacity Значение свойства "opacity", которое должен иметь DOM-элемент после окончания анимации;
 * 
 * @author Mikhail Dumchev (michailo_dumchev@mail.ru);
 */
function opacityAnimationCall(Element, duration, finiteOpacity) {
    "use strict";
    //Время начала анимации;
    var initialTime = new Date();
    //Начальное значение свойства "opacity" элемента "Element";
    var initialOpacity = parseFloat(window.getComputedStyle(Element, "").opacity);
    //Для корректной работы функции необходимо вынести текущее значение свойства "opacity" в inline-стили;
    Element.style.opacity = initialOpacity;
    var indicator = window.setInterval(function() {
        //Текущий этап анимации (значение может меняться в промежутке от 0 до 1);
        var progress = (new Date() - initialTime) / duration;
        //Непосредственный "шаг" анимации;
        opacityAnimation(Element, progress, initialOpacity, finiteOpacity);
        if (progress > 1) {
            window.clearInterval(indicator);
            Element.style.opacity = finiteOpacity;
        }
    }, 15);
}
function opacityAnimation(Element, progress, initialOpacity, finiteOpacity) {
    "use strict";
    if (initialOpacity > finiteOpacity) {
        if (Element.style.opacity > finiteOpacity)
            Element.style.opacity = initialOpacity - progress;
    } else {
        if (Element.style.opacity < finiteOpacity)
            Element.style.opacity = initialOpacity + progress;
    }
}