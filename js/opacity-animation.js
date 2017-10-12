/**
 * Функция используется для анимированного изменения свойства "opacity" у выбранного DOM-элемента;
 * 
 * @param {object} element Ссылка на DOM-элемент, для которого необходимо применить анимацию;
 * @param {number} duration Длительность анимации в миллисекундах;
 * @param {number} finiteOpacity Значение свойства "opacity", которое должен иметь DOM-элемент после окончания анимации;
 * 
 * @author Mikhail Dumchev (michailo_dumchev@mail.ru);
 */
function opacityAnimationCall(element, duration, finiteOpacity) {
    "use strict";
    //Время начала анимации;
    var initialTime = new Date();
    //Элемент, для которого применяется анимация, не может иметь свойство "display: none";
    if (window.getComputedStyle(element, "").display === "none") element.style.display = "block";
    //Начальное значение свойства "opacity" элемента "Element";
    var initialOpacity = parseFloat(window.getComputedStyle(element, "").opacity);
    //Для корректной работы функции необходимо вынести текущее значение свойства "opacity" в inline-стили;
    element.style.opacity = initialOpacity;
    var indicator = window.setInterval(function() {
        //Текущий этап анимации (значение может меняться в промежутке от 0 до 1);
        var progress = (new Date() - initialTime) / duration;
        //Непосредственный "шаг" анимации;
        opacityAnimation(element, progress, initialOpacity, finiteOpacity);
        if (progress > 1) {
            window.clearInterval(indicator);
            element.style.opacity = finiteOpacity;
        }
    }, 15);
}
function opacityAnimation(element, progress, initialOpacity, finiteOpacity) {
    "use strict";
    if (initialOpacity > finiteOpacity) {
        if (element.style.opacity > finiteOpacity)
            element.style.opacity = initialOpacity - progress;
    } else {
        if (element.style.opacity < finiteOpacity)
            element.style.opacity = initialOpacity + progress;
    }
}