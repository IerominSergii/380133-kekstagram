// Файл form.js
'use strict';

(function () {
  // ---------- константы ----------
  var COMMENT_MIN_LENGTH = 30;// минимальная длина комментария — 30 символов
  var COMMENT_MAX_LENGTH = 100;// максимальная длина комментария — 100 символов

  // ---------- переменные ----------
  // общая форма
  var uploadForm = document.querySelector('.upload-form');

  // форма загрузки изображения <div class="upload-image">
  var uploadImage = uploadForm.querySelector('.upload-image');

  // форма загрузки файла input id="upload-file"
  var uploadFileInput = uploadImage.querySelector('#upload-file');

  // форма кадрирования
  var uploadOverlay = uploadForm.querySelector('.upload-overlay');

  // крестик .upload-form-cancel
  var uploadCloseButton = uploadOverlay.querySelector('.upload-form-cancel');

  // кнопка Отправить
  var submitButton = uploadOverlay.querySelector('.upload-form-submit');

  // форма ввода комментария
  var uploadComment = uploadOverlay.querySelector('.upload-form-description');

  // основная картинка в форме загрузки .upload-form-preview
  var previewPicture = document.querySelector('.effect-image-preview');

  // блок эффектов
  var effectsBlock = uploadOverlay.querySelector('.upload-effect-controls');

  // ползунок изменения эффекта картинки
  var pin = effectsBlock.querySelector('.upload-effect-level-pin');

  // линия эффекта картинки
  var effectValue = effectsBlock.querySelector('.upload-effect-level-val');

  // ---------- функции ----------
  // функция закрытия uploadImage
  var closeUploadImage = function () {
    uploadImage.classList.add('hidden');
    uploadFileInput.addEventListener('change', onUploadFileChange);
  };

  // функция открытия uploadImage
  var openUploadImage = function () {
    uploadImage.classList.remove('hidden');
    uploadCloseButton.addEventListener('click', onCloseButtonClick);
  };

  // функция открытия uploadOverlay
  var openUploadOverlay = function () {
    uploadOverlay.classList.remove('hidden');
    uploadFileInput.removeEventListener('change', onUploadFileChange);
    document.addEventListener('keydown', pressEscToCloseOverlay);
    uploadCloseButton.addEventListener('keydown', pressEnterToCloseOverlay);
    submitButton.addEventListener('keydown', onSubmitButtonEnterPress);

    // вешаю обработчик клика на кнопку отправки формы
    submitButton.addEventListener('click', validateFormCustom);

    // вешаю обработчик - убираю красную рамку пока в поле вводятся комментарии
    // поле валидно по-умолчанию
    uploadComment.addEventListener('click', becameValidDefault);

    // вешаю обработчик - убрать красную рамку по нажатию на кнопку Отправить
    // если комменты валидны
    submitButton.addEventListener('click', becameValidAfterSubmitClick);

    // вешаю обработчик очистки формы
    uploadForm.addEventListener('submit', resetForm);

    // перемещаю ползунок в положение по умолчанию при открытии окна
    pin.style.left = PIN_DEFAULT_POSITION + '%';

    // задаю величине линии эффекта значение по умолчанию
    effectValue.style.width = PIN_DEFAULT_POSITION + '%';
  };

  // функция закрытия uploadOverlay
  var closeUploadOverlay = function () {
    uploadOverlay.classList.add('hidden');
    uploadCloseButton.removeEventListener('click', onCloseButtonClick);
    document.removeEventListener('keydown', pressEscToCloseOverlay);
    uploadFileInput.addEventListener('change', onUploadFileChange);
    uploadCloseButton.removeEventListener('keydown', pressEnterToCloseOverlay);
    submitButton.removeEventListener('keydown', onSubmitButtonEnterPress);

    // снимаю обработчик клика на кнопку отправки формы
    submitButton.removeEventListener('click', validateFormCustom);

    // снимаю обработчик - убираю красную рамку пока в поле вводятся комментарии
    // поле валидно по-умолчанию
    uploadComment.removeEventListener('click', becameValidDefault);

    // снимаю обработчик - убрать красную рамку по нажатию на кнопку Отправить
    // если комменты валидны
    submitButton.removeEventListener('click', becameValidAfterSubmitClick);

    // снимаю обработчик очистки формы
    uploadForm.removeEventListener('submit', resetForm);
  };

  // функция по изменению значния поля загрузки фото
  var onUploadFileChange = function (evt) {
    evt.preventDefault();
    closeUploadImage();
    openUploadOverlay();
  };

  // функция по клику на кнопку закрытия
  var onCloseButtonClick = function () {
    closeUploadOverlay();
    openUploadImage();
  };

  // закрытие формы кадрирования uploadOverlay по нажатию ESC
  var pressEscToCloseOverlay = function (evt) {
    if (evt.keyCode === window.data.ESC_KEYCODE && evt.target !== uploadComment) {
      // нажата клавиша ESC?
      // если фокус находится на форме ввода комментария, то форма не закрывается
      evt.preventDefault();
      closeUploadOverlay();
      openUploadImage();
    }
  };

  // функция закрытия формы кадрирования uploadOverlay по нажатию ENTER
  var pressEnterToCloseOverlay = function (evt) {
    evt.preventDefault();
    if (evt.keyCode === window.data.ENTER_KEYCODE) {
      closeUploadOverlay();
    }
  };

  // функция генерации клика
  var doClick = new Event('click');

  // функция генерации клика на нажатию ENTER на кнопке Отправить
  var onSubmitButtonEnterPress = function (evt) {
    if (evt.keyCode === window.data.ENTER_KEYCODE) {
      submitButton.dispatchEvent(doClick);
    }
  };

  // ---------- добавление атрибутов ----------
  // добавление tabindex на крестик в галерее
  uploadCloseButton.setAttribute('tabindex', '0');

  // добавление tabindex на кнопку Отправить
  submitButton.setAttribute('tabindex', '0');

  // форма ввода комментария - обязательное поле
  uploadComment.setAttribute('required', 'required');

  // минимальная длина комментария — 30 символов
  uploadComment.setAttribute('minlength', COMMENT_MIN_LENGTH);

  // максимальная длина комментария — 100 символов
  uploadComment.setAttribute('maxlength', COMMENT_MAX_LENGTH);

  // ---------- обработчики событий ----------
  // событие - изменение значения поля загрузки фотографии #upload-file
  uploadFileInput.addEventListener('change', onUploadFileChange);

  // событие - нажатие на кнопку .upload-form-cancel
  uploadCloseButton.addEventListener('click', onCloseButtonClick);

  // закрытие формы кадрирования uploadOverlay по нажатию ENTER
  // если фокус на крестике .upload-form-cancel
  uploadCloseButton.addEventListener('keydown', pressEnterToCloseOverlay);








  // ---------- переменные ----------
  // основная картинка в форме загрузки .upload-form-preview
  // var previewPicture = document.querySelector('.effect-image-preview');

  // форма кадрирования
  // var uploadOverlay = document.querySelector('.upload-effect');

  // блок эффектов
  // var effectsBlock = uploadOverlay.querySelector('.upload-effect-controls');

  // линия уровня эффекта, на которой расположен ползунок
  // var effectLevelLine = effectsBlock.querySelector('.upload-effect-level-line');

  // ползунок изменения эффекта картинки
  // var pin = effectLevelLine.querySelector('.upload-effect-level-pin');

  // линия эффекта картинки
  // var effectValue = effectLevelLine.querySelector('.upload-effect-level-val');

  // ---------- константа ----------
  // позиция ползунка по умолчанию
  var PIN_DEFAULT_POSITION = 20;

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





  // !!!!!!! @fix
  var

  window.initializeFilters(effectsBlock, setEffect);

  // ---------- Изменение масштаба изображения ----------
  var scaleElement = document.querySelector('.upload-resize-controls');

  // изменение масштаба
  var adjustScale = function (scaleValue) {
    previewPicture.style.transform = ('scale(' + (parseInt(scaleValue, 10) / 100) + ')');
  };

  window.initializeScale(scaleElement, adjustScale);

  // ---------- 6 Хэш-теги ----------
  // ---------- константы ----------
  // максимальное количество хэш-тегов
  var HASHTAG_MAX_AMOUNT = 5;

  // максимальная длина хэш-тега
  var HASHTAG_MAX_LENGTH = 20;

  // стиль невалидной формы
  var INVALID_FORM = '3px solid red';

  // ---------- переменные ----------
  // поле ввода хэш-тегов
  var inputHashtag = document.querySelector('.upload-form-hashtags');

  // ---------- функции ----------
  // функция, которая удаляет повторяющиеся хэш-теги
  var deleteRepeatedHashtag = function (enteredHashtags) {
    var hashtagsWithoutRepetitions = {};

    for (var j = 0; j < enteredHashtags.length; j++) {
      var str = enteredHashtags[j].toLowerCase();
      hashtagsWithoutRepetitions[str] = true; // запомнить строку в виде свойства объекта
    }

    // массив названий свойств объекта
    var uniqueHashtags = Object.keys(hashtagsWithoutRepetitions);

    // передаю в форму хэш-теги без повторений
    inputHashtag.value = uniqueHashtags.join(' ');
  };

  // массив хэш-тегов из input
  var hashtags = function (input) {
    return input.value.split(' ');
  };

  // проверка на наличие решетки в начале хэш-тега
  var isHashtag = function (elem) {
    return elem[0] === '#' ? true : false;
  };

  // проверка! разделены ли хэш-теги пробелами
  // проверку начинаю со второй позиции [1] (т.к. первая - это #),
  // elem.indexOf('#', 1) === -1 означает, что второго '#' - нет
  var didHashtagsSeparete = function (elem) {
    return elem.indexOf('#', 1) === -1 ? true : false;
  };

  // проверка! не более HASHTAG_MAX_AMOUNT хэш-тегов
  var checkHashtagAmount = function (arr) {
    return arr.length <= HASHTAG_MAX_AMOUNT;
  };

  // проверка! максимальная длина хэш-тега - HASHTAG_MAX_LENGTH
  var checkHashtagLength = function (elem) {
    return elem.length <= HASHTAG_MAX_LENGTH;
  };

  // проверка на валидность
  var checkValidity = function (input, hashtagsArr) {
    // массив сообщений об ошибках
    var invalidities = [];

    // input.value !== '' если форма пустая - идем дальше
    if (!hashtagsArr.every(isHashtag) && input.value !== '') {
      invalidities.push('- Хэш-тег должен начинаться с символа \'#\'');
    }

    if (!hashtagsArr.every(didHashtagsSeparete)) {
      invalidities.push('- Хэш-теги должны быть разделены пробелами');
    }

    if (!hashtagsArr.every(checkHashtagLength)) {
      invalidities.push('- Максимальная длина одного хэш-тега ' + HASHTAG_MAX_LENGTH + ' символов');
    }

    if (!checkHashtagAmount(hashtagsArr)) {
      invalidities.push('- Нельзя указать больше ' + HASHTAG_MAX_AMOUNT + ' хэш-тегов');
    }

    // если форма валидна функция checkValidity вернет массив сообщений об ошибках
    // иначе вернет false
    return invalidities.length > 0 ? invalidities : false;
  };

  // общий текст сообщений об ошибках
  var getInvalidities = function (arr) {
    return arr.join('; \n');
  };

  // функция, которая показывает, что форма невалидна
  var showInvalid = function (elem) {
    elem.style.border = INVALID_FORM;
  };

  // функция, которая убирает у формы невалидный вид
  var hideInvalid = function (elem) {
    elem.style.border = 'none';
  };

  // делаю форму комментарие валидной по-умолчанию
  var becameValidDefault = function () {
    // убираю красную рамку на поле ввода комментария - если она есть
    if (uploadComment.style.border === INVALID_FORM) {
      hideInvalid(uploadComment);
    }
  };

  // удаляю красную рамку по нажатию на кнопку Отправить
  // если комменты валидны
  var becameValidAfterSubmitClick = function () {
    if (uploadComment.validity.valid) {
      hideInvalid(uploadComment);
    }
  };

  // функция очистки формы после сабмита
  var resetForm = function () {
    if (uploadForm.validity.valid) {
      uploadForm.reset();
    }
  };

  // функция валидации формы (хэш-тегов) - нестандартный валидации
  var validateFormCustom = function () {

    // запуск функции - удалаяем хэш-теги - дубликаты
    deleteRepeatedHashtag(inputHashtag.value.split(' '));

    // если форма не валидна, то
    if (checkValidity(inputHashtag, hashtags(inputHashtag))) {

      // массив сообщений об ошибках
      var inputCustomValidation = checkValidity(inputHashtag, hashtags(inputHashtag));

      // общий текст сообщений об ошибках
      var customValidityMessage = getInvalidities(inputCustomValidation);

      // специальное сообщение об ошибке
      inputHashtag.setCustomValidity(customValidityMessage);

      // выделяю неверное поле красной рамкой
      inputHashtag.style.border = INVALID_FORM;

      // вешаю обработчик - после клика на кнопку Отправить
      // если поле невалидно - добавь красную рамку
      uploadComment.addEventListener('invalid', showInvalid(uploadComment));
    } else {
      // сброс значения обработчика валидации, если это значение стало корректно
      inputHashtag.setCustomValidity('');

      // убираю красную рамку в поле
      inputHashtag.style.border = 'none';

      // снимаю обработчик добавления красной рамки
      uploadComment.removeEventListener('invalid', showInvalid(uploadComment));
    }
  };

  // ---------- добавление атрибутов ----------
  uploadForm.setAttribute('action', 'https://1510.dump.academy/kekstagram');
  uploadForm.setAttribute('method', 'post');
  uploadForm.setAttribute('enctype', 'multipart/form-data');
})();
