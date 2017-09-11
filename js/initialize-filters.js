// Файл initialize-filters.js
'use strict';

(function () {
  // ---------- константа ----------
  // название CSS класса - это название фильтра без префикса 'upload-'
  var PREFIX = 'upload-';

  // позиция ползунка по умолчанию
  var PIN_DEFAULT_POSITION = 20;

  // ---------- переменные ----------
  // основная картинка в форме загрузки .upload-form-preview
  var previewPicture = document.querySelector('.effect-image-preview');

  // форма кадрирования
  var uploadOverlay = document.querySelector('.upload-effect');

  // блок эффектов
  var effectsBlock = uploadOverlay.querySelector('.upload-effect-controls');

  // ползунок изменения эффекта картинки
  var pin = effectsBlock.querySelector('.upload-effect-level-pin');

  // линия эффекта картинки
  var effectValue = effectsBlock.querySelector('.upload-effect-level-val');

  // объект эффектов
  var effects = {
    'effect-none': null,
    'effect-chrome': 'grayscale',
    'effect-sepia': 'sepia',
    'effect-marvin': 'invert',
    'effect-phobos': 'blur',
    'effect-heat': 'brightness',
  };

  // блок уровня эффекта
  var effectLevelBlock = effectsBlock.querySelector('.upload-effect-level');

  // прячу блок уровня эффекта (по-умолчанию)
  effectLevelBlock.classList.add('hidden');

  // перемещаю ползунок в положение по умолчанию при открытии окна
  pin.style.left = PIN_DEFAULT_POSITION + '%';

  // задаю величине линии эффекта значение по умолчанию
  effectValue.style.width = PIN_DEFAULT_POSITION + '%';

  // функция: задаю основной картинке CSS фильтр
  // в зависимости от выбранного эффекта и положения ползунка
  var setLevelEffect = function (currentEffect, pinElement) {

    // обнуляю значение эффекта в CSS (чищу от предыдущих значений)
    previewPicture.style.filter = null;

    // перемещаю ползунок в начальное положение при открытии окна
    pin.style.left = PIN_DEFAULT_POSITION + '%';

    // задаю величине линии эффекта начальное значение 0%
    effectValue.style.width = PIN_DEFAULT_POSITION + '%';

    // положение ползунка
    var pinPositionInPersent = pinElement.style.left;

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

  // по клику добавляю соответствующий эффект основной картинке
  var setEffect = function (evt) {
    var target = evt.target;

    // удаляю все предыдущие эффекты на основной картинке
    for (var key in effects) {
      if (previewPicture.classList.contains(key)) {
        previewPicture.classList.remove(key);
      }
    }

    // добавляю эффект по которому был клик (вытягиваю из
    // data-атрибута соответсвующего input)
    previewPicture.classList.add(target.dataset.effect);

    // если фильтр не выбран, то ползунок - скрыт
    if (previewPicture.classList.contains('effect-none')) {
      effectLevelBlock.classList.add('hidden');
    } else {
      effectLevelBlock.classList.remove('hidden');
    }

    // задаю эффект и его уровень в зависимости от положение ползунка
    setLevelEffect(target.dataset.effect, pin);
  };

  // переключателям эффекта добавляю data-атрибут с названием эффекта
  // и вешаю обработчик события на клик на каждый input в блоке - setEffect
  var addEffectOnClick = function (filtersBlock) {
    var effectInputs = filtersBlock.querySelectorAll('input');
    for (var i = 0; i < effectInputs.length; i++) {
      var efFilterClassName = effectInputs[i].getAttribute('id');
      var efFilterName = efFilterClassName.substring(PREFIX.length);
      effectInputs[i].dataset.effect = efFilterName;

      effectInputs[i].addEventListener('click', setEffect);
    }
  };

  window.initializeFilters = function (filterElement, doFilter) {
    filterElement.addEventListener('click', function () {
      addEffectOnClick(filterElement);
    });

    doFilter(newFilter, cssValue);
  };
})();
