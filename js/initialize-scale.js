// Файл initialize-scale.js
'use strict';

(function () {
  // ---------- константы ----------
  var MIN_IMAGE_SCALE = 25;// минимальное значение масштаба изображения
  var MAX_IMAGE_SCALE = 100;// максимальное значение масштаба изображения
  var RESIZE_STEP = 25;// шаг изменения масштаба изображения

  // ---------- переменные ----------
  // форма кадрирования
  var uploadOverlay = document.querySelector('.upload-effect');

  // форма ввода масштаба input
  var resizeControl = uploadOverlay.querySelector('input');

  // значение масштаба по умолчанию — 100%
  resizeControl.setAttribute('value', '100%');

  // масштаб изображения. parseInt() - для того чтобы отсечь '%'
  var resizeValue = parseInt(resizeControl.value, 10);

  // кнопка увеличения масштаба изображения
  var resizeInc = uploadOverlay.querySelector('.upload-resize-controls-button-inc');

  // кнопка уменьшения масштаба изображения
  var resizeDec = uploadOverlay.querySelector('.upload-resize-controls-button-dec');

  // ---------- функции ----------
  // функция увеличения масштаба изображения
  var onResizeIncClick = function (evt) {

    if ((resizeValue + RESIZE_STEP) <= MAX_IMAGE_SCALE) {
      resizeValue = resizeValue + RESIZE_STEP;
    } else {
      resizeValue = MAX_IMAGE_SCALE;
    }
  };

  // функция уменьшения масштаба изображения
  var onResizeDecClick = function (evt) {

    if ((resizeValue - RESIZE_STEP) > MIN_IMAGE_SCALE) {
      resizeValue = resizeValue - RESIZE_STEP;
    } else {
      resizeValue = MIN_IMAGE_SCALE;
    }
  };

  // глобальная функция
  window.initializeScale = function (controlElement, changeScale) {
    controlElement.addEventListener('click', function (evt) {

      // добавляю шаг — RESIZE_STEP для формы ввода масштаба
      resizeControl.setAttribute('step', (RESIZE_STEP + '%'));

      // если клик на '-', то уменьшаю
      if (evt.target === resizeInc) {
        onResizeIncClick();
      }

      // если клик на '+', то увеличиваю
      if (evt.target === resizeDec) {
        onResizeDecClick();
      }

      // добавляю в input соответствующее значение value
      resizeControl.setAttribute('value', resizeValue + '%');

      // запускаю функцию, которая будет задана в параметре
      changeScale(resizeValue);
    });
  };
})();
