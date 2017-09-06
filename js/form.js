// Сообщи о начале работы с module5-task2
// Файл form.js
'use strict';

(function () {
  // ---------- константы ----------
  var COMMENT_MIN_LENGTH = 30;// минимальная длина комментария — 30 символов
  var COMMENT_MAX_LENGTH = 100;// максимальная длина комментария — 100 символов
  var RESIZE_CONTROL_STEP = '25%';// шаг — 25% для формы ввода масштаба

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

  // форма ввода масштаба
  var resizeControl = uploadOverlay.querySelector('.upload-resize-controls-value');

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
    effectsBlock.addEventListener('click', onFilterClick);// вешаю событие с блока эффектов
    resizeInc.addEventListener('click', onResizeIncClick);// вешаю клик по кнопке "+"
    resizeDec.addEventListener('click', onResizeDecClick);// вешаю клик по кнопке "-"
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
  };

  // функция закрытия uploadOverlay
  var closeUploadOverlay = function () {
    uploadOverlay.classList.add('hidden');
    uploadCloseButton.removeEventListener('click', onCloseButtonClick);
    document.removeEventListener('keydown', pressEscToCloseOverlay);
    uploadFileInput.addEventListener('change', onUploadFileChange);
    uploadCloseButton.removeEventListener('keydown', pressEnterToCloseOverlay);
    submitButton.removeEventListener('keydown', onSubmitButtonEnterPress);
    effectsBlock.removeEventListener('click', onFilterClick);// снимаю событие на блок эффектов
    resizeInc.removeEventListener('click', onResizeIncClick);// снимаю клик по кнопке "+"
    resizeDec.removeEventListener('click', onResizeDecClick);// снимаю клик по кнопке "-"
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

  // шаг — 25% для формы ввода масштаба
  resizeControl.setAttribute('step', RESIZE_CONTROL_STEP);

  // ---------- обработчики событий ----------
  // событие - изменение значения поля загрузки фотографии #upload-file
  uploadFileInput.addEventListener('change', onUploadFileChange);

  // событие - нажатие на кнопку .upload-form-cancel
  uploadCloseButton.addEventListener('click', onCloseButtonClick);

  // закрытие формы кадрирования uploadOverlay по нажатию ENTER
  // если фокус на крестике .upload-form-cancel
  uploadCloseButton.addEventListener('keydown', pressEnterToCloseOverlay);

  // ---------- 4 Применение эффекта к изображению ----------
  // ---------- константа ----------
  // название CSS класса - это название фильтра без префикса 'upload-'
  var PREFIX = 'upload-';

  // ---------- переменные ----------
  // основная картинка в форме загрузки .upload-form-preview
  var previewPicture = document.querySelector('.effect-image-preview');

  // блок эффектов
  var effectsBlock = uploadOverlay.querySelector('.upload-effect-controls');

  // коллекция input форм с эффектами
  var effectInputs = effectsBlock.querySelectorAll('input');

  // ---------- функции ----------
  // функция 'поимки' клика на блоке эффектов и
  // применение эффекта к изображению (через делегирование)
  var onFilterClick = function (evt) {
    var target = evt.target;

    for (var k = 0; k < effectInputs.length; k++) {
      // название CSS класса - это id фильтра без префикса upload-
      var filterClassName = effectInputs[k].getAttribute('id');
      var filterName = filterClassName.substring(PREFIX.length);

      // если уже есть фильтр - то убираю его
      if (previewPicture.classList.contains(filterName)) {
        previewPicture.classList.remove(filterName);
      }

      // поиск события-клика на конкретном фильтре
      if (target === effectInputs[k]) {
        // ограничиваю "всплытие" формой с эффектами
        while (target !== effectsBlock) {
          previewPicture.classList.add(filterName);
          break;
        }

        // поднимаюсь выше по DOM-дереву
        target = target.parentElement;
      }
    }
  };

  // ---------- 5 Изменение масштаба изображения ----------
  // ---------- константы ----------
  // минимальное значение масштаба изображения
  var MIN_IMAGE_SCALE = 25;

  // максимальное значение масштаба изображения
  var MAX_IMAGE_SCALE = 100;

  // шаг изменения масштаба изображения
  var RESIZE_STEP = 25;

  // ---------- добавление атрибутов ----------
  // значение масштаба по умолчанию — 100%
  resizeControl.setAttribute('value', '100%');

  // ---------- переменные ----------
  // кнопка увеличения масштаба изображения
  var resizeInc = document.querySelector('.upload-resize-controls-button-inc');

  // кнопка уменьшения масштаба изображения
  var resizeDec = document.querySelector('.upload-resize-controls-button-dec');

  // масштаб изображения. parseInt() - для того чтобы отсечь '%'
  var resizeValue = parseInt(resizeControl.value, 10);

  // ---------- функции ----------
  // изменение масштаба
  var zoomPicture = function (image, scaleValue) {
    var scaleRightFormat = ('scale(' + (parseInt(scaleValue, 10) / 100) + ')');
    image.style.transform = scaleRightFormat;
  };

  // функция увеличения масштаба изображения
  var onResizeIncClick = function (evt) {
    evt.preventDefault();

    if ((resizeValue + RESIZE_STEP) <= MAX_IMAGE_SCALE) {
      resizeValue = resizeValue + RESIZE_STEP;
    } else {
      resizeValue = MAX_IMAGE_SCALE;
    }

    resizeControl.setAttribute('value', resizeValue + '%');
    zoomPicture(previewPicture, resizeControl.value);
  };

  // функция уменьшения масштаба изображения
  var onResizeDecClick = function (evt) {
    evt.preventDefault();

    if ((resizeValue - RESIZE_STEP) > MIN_IMAGE_SCALE) {
      resizeValue = resizeValue - RESIZE_STEP;
    } else {
      resizeValue = MIN_IMAGE_SCALE;
    }

    resizeControl.setAttribute('value', resizeValue + '%');
    zoomPicture(previewPicture, resizeControl.value);
  };

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
