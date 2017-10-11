/**
 * Функция используется для анимированного перемещения DOM-элемента в течение заданного промежутка времени;
 * @param {object} element DOM-элемент, для которого применяется анимация;
 * @param {number} duration Длительность анимации (нужно использовать положительное число);
 * @param {number} initialOffset
 * @param {number} finitePosition Отступ, который должен иметь DOM-элемента, для которого применяется анимация, относительно
 * своего родителя после окончания анимации (может быть как положительным, так и отрицательным целым или десятичным числом); 
 */
function verticalSlidingAnimationCall(element, duration, initialOffset, finitePosition) {
    "use strict";
    //Время начала анимации;
    var initialTime = new Date();
    element.style.top = initialOffset + "px";
    //Элемент, для которого применяется анимация, не может иметь свойство "display: none";
    if (window.getComputedStyle(element, "").display === "none") element.style.display = "block";
    var indicator = window.setInterval(function() {
        //Текущий этап анимации (значение может меняться в промежутке от 0 до 1);
        var progress = (new Date() - initialTime) / duration;
        //Непосредственный "шаг" анимации;
        verticalSlidingAnimation(element, progress, initialOffset, finitePosition);
        if (progress > 1) {
            window.clearInterval(indicator);
            element.style.top = finitePosition + "px";
        }
    }, 15);
}
/**
 * Функция используется для вычисления текущей позиции DOM-элемента в горизонтальной плоскости при текущем значении переменной progress;
 * @param {object} element DOM-элемент, для которого применяется анимация;
 * @param {number} progress Текущий этап анимации (изменяется в пределах от 0 до 1);
 * @param {number} initialOffset Начальное значение отступа DOM-элемента, для которого применяется анимация, в горизонтальной
 * плоскости относительно родителя этого элемента (может быть как положительным, так и отрицательным целым или десятичным числом);
 * @param {number} finitePosition Отступ, который должен иметь DOM-элемента, для которого применяется анимация, относительно
 * своего родителя после окончания анимации (может быть как положительным, так и отрицательным целым или десятичным числом); 
 */
function verticalSlidingAnimation(element, progress, initialOffset, finitePosition) {
    "use strict";
    //Если внутренние элементы слайдера должны перемещаться вправо;
    if (initialOffset < finitePosition) {
        //Если текущее значение отступа в горизонтальной плоскости меньше, чем максимально возможное;
        if (parseFloat(element.style.top) < finitePosition)
            element.style.top = initialOffset + (finitePosition - initialOffset) * progress + "px";
    //Если внутренние элементы слайдера должны перемещаться влево;
    } else {
        //Если текущее значение отступа в горизонтальной плоскости больше, чем минимально возможное;
        if (parseFloat(element.style.top) > finitePosition)
            element.style.top = initialOffset + (finitePosition - initialOffset) * progress + "px";
    }
}