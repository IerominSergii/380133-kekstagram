// Файл initialize-filters.js
'use strict';

(function () {
  // ---------- 4 Применение эффекта к изображению ----------

  var PIN_DEFAULT_POSITION = 20;// позиция ползунка по умолчанию
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
  var effects = {
    'effect-none': null,
    'effect-chrome': 'grayscale',
    'effect-sepia': 'sepia',
    'effect-marvin': 'invert',
    'effect-phobos': 'blur',
    'effect-heat': 'brightness',
  };

  // функция: задаю основной картинке CSS фильтр
  // в зависимости от выбранного эффекта и положения ползунка
  window.initializeFilters.setEffect = function (currentEffect, pinPositionInPersent) {
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

  var onEffectInputClick = function (evt) {
    var target = evt.target;

    // удаляю все предыдущие эффекты на основной картинке
    for (var key in effects) {
      if (previewPicture.classList.contains(key)) {
        previewPicture.classList.remove(key);
      }
    }

    // добавляю эффект по которому был клик (вытягиваю из
    //  data-атрибута соответсвующего input)
    previewPicture.classList.add(target.dataset.effect);

    // если фильтр не выбран, то ползунок - скрыт
    if (previewPicture.classList.contains('effect-none')) {
      effectLevelBlock.classList.add('hidden');
    } else {
      effectLevelBlock.classList.remove('hidden');
    }

    // обнуляю значение эффекта в CSS (чищу от предыдущих значений)
    previewPicture.style.filter = null;

    // перемещаю ползунок в начальное положение при открытии окна
    pin.style.left = PIN_DEFAULT_POSITION + '%';

    // задаю величине линии эффекта начальное значение 0%
    effectValue.style.width = PIN_DEFAULT_POSITION + '%';

    window.initializeFilters.setEffect(target.dataset.effect, pin.style.left);
  };

  window.initializeFilters = function (filtersBlock, applyFilter) {
    applyFilter(filtersBlock, onEffectInputClick);
  };
})();
