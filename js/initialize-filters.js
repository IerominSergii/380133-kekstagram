// Файл initialize-filters.js
'use strict';

(function () {
  // название CSS класса - это название фильтра без префикса 'upload-'
  var PREFIX = 'upload-';

  window.initializeFilters = function (effectElement, doFilter) {
    // переключателям эффекта добавляю data-атрибут с названием эффекта
    // и вешаю обработчик события на клик на каждый input в блоке
    var effectInputs = effectElement.querySelectorAll('input');
    for (var i = 0; i < effectInputs.length; i++) {
      var efFilterClassName = effectInputs[i].getAttribute('id');
      var efFilterName = efFilterClassName.substring(PREFIX.length);
      effectInputs[i].dataset.effect = efFilterName;

      effectInputs[i].addEventListener('click', doFilter);
    }

    // ---------- pin move ----------
    // функция нахождения позиции pin.style.left в пиксельном выражении в
    // интервале между areaMin (pinStartPosition) и areaMax (pinEndPosition)
    var convertToPx = function (pinStyleLeft, areaMin, areaMax) {
      return (parseInt(pinStyleLeft, 10) * (areaMax - areaMin)) / 100;
    };

    // обработчик нажатия кнопки мыши на ползунке
    pin.addEventListener('mousedown', function (evt) {
      evt.preventDefault();

      // запоминаю координату X точки, с которой начинаю перемещение ползунка
      var startCoordX = evt.clientX;

      var areaStart = startCoordX;// начало линии уровня эффекта

      // если ползунок находится не на начальной позиции,
      // то от areaStart отнимаю положение ползунка в 'px'
      if (parseInt(pin.style.left, 10)) {
        areaStart = startCoordX - convertToPx(pin.style.left, 0, 456);
      }

      var areaEnd = areaStart + 456;// конец линии уровня эффекта

      // при движении мыши:
      // - обновляю смещение относительно первоначальной точки
      // - меняю положение ползунка и линии уровня эффекта
      var onMouseMove = function (moveEvt) {
        moveEvt.preventDefault();

        var moveEvtX = moveEvt.clientX;// текущее положение указателя мыши

        var shiftX;// смещение указателя мыши

        var pinPositionInPx = null;// позиция ползунка в пикселях

        // начальное значение позиции ползунка - начало линии уровня эффекта
        var pinStartPosition = effectLevelLine.clientLeft;

        // конечное значение позиции ползунка - конец линии уровня эффекта
        var pinEndPosition = effectLevelLine.offsetWidth;

        // функция нахождения позиции offSetLeft в процентном выражении в
        // интервале между areaMin (pinStartPosition) и areaMax (pinEndPosition)
        var convertToPercent = function (offSetLeft, areaMin, areaMax) {
          return offSetLeft * 100 / (areaMax - areaMin);
        };

        // определяю смещение указателя мыши
        if (moveEvtX < areaStart) {

          // ограничиваю смещение, если указатель 'ушел' левее линии
          shiftX = startCoordX - areaStart;
        } else if (moveEvtX > areaEnd) {

          // ограничиваю смещение, если указатель 'ушел' правее линии
          shiftX = startCoordX - areaEnd;
        } else {

          // определяю смещение от начальной позиции минус текущая позиция
          shiftX = startCoordX - moveEvtX;
        }

        // позиция pin
        if ((pin.offsetLeft - shiftX) < pinStartPosition) {

          // ограничиваю смещение ползунка влево началом линии
          pinPositionInPx = pinStartPosition;
        } else if ((pin.offsetLeft - shiftX) > pinEndPosition) {

          // ограничиваю смещение ползунка вправо концом линии
          pinPositionInPx = pinEndPosition;
        } else {

          // меняю позицию ползунка
          pinPositionInPx = (pin.offsetLeft - shiftX);
        }

        // обновляю первоначальную точку
        if (moveEvtX < areaStart) {

          // если левее - то на позиции 0%
          startCoordX = areaStart;
        } else if (moveEvtX > areaEnd) {

          // если правее - то на позиции 100%
          startCoordX = areaEnd;
        } else {

          // обновляю первоначальную точку на текущую позицию от 0% до 100%
          startCoordX = moveEvtX;
        }

        // перевожу значения px в % и задаю это значение в CSS left
        pin.style.left = convertToPercent(pinPositionInPx, pinStartPosition, pinEndPosition) + '%';

        // задаю ширину линии эффекта в соответствии с положением ползунка
        effectValue.style.width = pin.style.left;

        // задаю значение фильтра в зависимости от выбранного
        // эффекта и положения ползунка
        for (var key in effects) {
          if (previewPicture.classList.contains(key)) {
            var activeEffect = key;
          }
        }

        // задаю основной картинке эффект
        // меняю его значение в зависимости от положение ползунка
        setEffect(activeEffect, pin.style.left);
      };

      // при отпускании кнопки мыши перестаю слушать события движения мыши
      var onMouseUp = function (upEvt) {
        upEvt.preventDefault();

        // удаляю обработчики событий при отпускании кпонки мыши
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      // при нажатии на кнопку мыши начинаю слушать события движения мыши
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  };
})();
