// Файл initialize-filters.js
'use strict';

(function () {
  // ---------- 4 Применение эффекта к изображению ----------
  // ---------- константа ----------
  // название CSS класса - это название фильтра без префикса 'upload-'
  var PREFIX = 'upload-';
  var PIN_DEFAULT_POSITION = 20;// позиция ползунка по умолчанию

  // функция броса эффекта на значения по умолчанию
  window.setPinDefaultPos = function (picture, pinElement, filterValue) {
    // обнуляю значение эффекта в CSS (чищу от предыдущих значений)
    picture.style.filter = null;

    // перемещаю ползунок в начальное положение при открытии окна
    pinElement.style.left = PIN_DEFAULT_POSITION + '%';

    // задаю величине линии эффекта начальное значение 0%
    filterValue.style.width = PIN_DEFAULT_POSITION + '%';
  };

  // ---------- переменные ----------
  // основная картинка в форме загрузки .upload-form-preview
  var previewPicture = document.querySelector('.effect-image-preview');

  // блок эффектов
  var effectsBlock = document.querySelector('.upload-effect-controls');

  // блок уровня эффекта
  var effectLevelBlock = effectsBlock.querySelector('.upload-effect-level');

  // ползунок изменения эффекта картинки
  var pin = effectsBlock.querySelector('.upload-effect-level-pin');

  // линия эффекта картинки
  var effectValue = effectsBlock.querySelector('.upload-effect-level-val');

  // прячу блок уровня эффекта (по-умолчанию)
  effectLevelBlock.classList.add('hidden');

  // объект эффектов
  window.effects = {
    'effect-none': null,
    'effect-chrome': 'grayscale',
    'effect-sepia': 'sepia',
    'effect-marvin': 'invert',
    'effect-phobos': 'blur',
    'effect-heat': 'brightness',
  };

  // функция: задаю основной картинке CSS фильтр
  // в зависимости от выбранного эффекта и положения ползунка
  window.setEffect = function (currentEffect, pinPositionInPersent) {
    // позиция ползунка - избавляюсь от знака '%' в конце
    var effectLevel = parseFloat(pinPositionInPersent);

    // в зависимости от эффекта добавляю значение filter в CSS
    switch (currentEffect) {
      case 'effect-chrome':
        previewPicture.style.filter = 'grayscale(' + effectLevel / 100 + ')';
        break;
      case 'effect-sepia':
        previewPicture.style.filter = 'sepia(' + effectLevel / 100 + ')';
        break;
      case 'effect-marvin':
        previewPicture.style.filter = 'invert(' + effectLevel + '%)';
        break;
      case 'effect-phobos':
        previewPicture.style.filter = 'blur(' + (effectLevel * 3 / 100) + 'px)';
        break;
      case 'effect-heat':
        previewPicture.style.filter = 'brightness(' + (effectLevel * 3 / 100) + ')';
        break;
    }
  };

  window.initializeFilters = function (filtersBlock, applyFilter) {
    var onEffectInputClick = function (evt) {
      var target = evt.target;

      // если фильтр не выбран, то ползунок - скрыт
      if (previewPicture.classList.contains('effect-none')) {
        effectLevelBlock.classList.add('hidden');
      } else {
        effectLevelBlock.classList.remove('hidden');
      }

      window.setPinDefaultPos(previewPicture, pin, effectValue);

      window.setEffect(target.dataset.effect, pin.style.left);

      applyFilter(target.dataset.effect);
    };

    // коллекция input форм с эффектами
    var effectInputs = filtersBlock.querySelectorAll('input');

    // переключателям эффекта добавляю data-атрибут с названием эффекта
    for (var i = 0; i < effectInputs.length; i++) {
      var efFilterClassName = effectInputs[i].getAttribute('id');
      var efFilterName = efFilterClassName.substring(PREFIX.length);
      effectInputs[i].dataset.effect = efFilterName;

      // по клику добавляю соответствующий эффект основной картинке
      effectInputs[i].addEventListener('click', onEffectInputClick);
    }
  };
})();
