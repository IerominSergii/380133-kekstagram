'use strict';
var similarPictureTemplate = document.querySelector('#picture-template');
var picturesList = document.querySelector('.pictures');

// функция генерации случайных чисел от min до max
var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

// функция генерации случайных данных в зависимости от длины массива
// max - это значение свойства length массива
var randomProperty = function (max) {
  return Math.floor(Math.random() * max);
};

// массив комментариев
var comments = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. ' +
  'В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё ' +
  'получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на ' +
  'кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их ' +
  'избивают. Как можно было поймать такой неудачный момент?!',
];

var picturesAmount = 25; // количество картинок
var likesMin = 15; // минимальное количество лайков
var likesMax = 200; // максимальное количество лайков

// функция создания массива из 25 картинок - объектов
var createPictures = function (commentsArray, likesMinimum, likesMaximum, picturesNumber) {
  var picturesArray = [];
  for (var i = 1; i <= picturesNumber; i++) { // на каждом этапе создаю объект и задаю свойства
    var object = {};
    object.url = 'photos/' + i + '.jpg';
    object.likes = getRandomInt(likesMinimum, likesMaximum);
    object.comments = comments[randomProperty(comments.length)]; // один комментарий
    object.commentsCount = 1;
    object.tabindex = 0;
    if (Math.round(Math.random())) { // добавление второго комментария с вероятностью 50%
      object.comments += '<br>' + comments[randomProperty(comments.length)];
      object.commentsCount = 2;
    }

    picturesArray.push(object);
  }

  return picturesArray;
};

// создаю массив из картинок
var pictures = createPictures(comments, likesMin, likesMax, picturesAmount);

// массив комментариев
var commentEndings = ['комментарий', 'комментария', 'комментариев'];

// функция изменения слова 'комментариев' (каррирование)
var changeCommentEnding = function (count, titles) {
  if (count % 10 === 1 && count % 100 !== 11) {
    return titles[0];
  } else if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) {
    return titles[1];
  } else {
    return titles[2];
  }
};

// функция создания DOM-элементов на основе #picture-template
var renderPicture = function (shot) {
  var pictureElement = similarPictureTemplate.content.cloneNode(true);
  pictureElement.querySelector('img').setAttribute('src', shot.url);
  pictureElement.querySelector('.picture-likes').textContent = shot.likes;
  pictureElement.querySelector('.picture-comments').textContent = shot.commentsCount;
  pictureElement.querySelector('.picture').setAttribute('tabindex', shot.tabindex);

  return pictureElement;
};

// функция заполнения блока DOM-элементами на основе массива JS-объектов
var fragment = document.createDocumentFragment();
for (var i = 0; i < pictures.length; i++) {
  fragment.appendChild(renderPicture(pictures[i]));
}

// форма кадрирования изображения upload-overlay
var cropForm = document.querySelector('.upload-overlay');

// "нахожу" элемент .gallery-overlay, в который потом добавлю картинку
var galleryElement = document.querySelector('.gallery-overlay');

// контейнер для надписи 'комментариев' в галерее
var galleryCommentText = galleryElement.querySelector('.gallery-overlay-controls-comments');

// константы
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;
var COMMENT_MIN_LENGTH = 30;// минимальная длина комментария — 30 символов
var COMMENT_MAX_LENGTH = 100;// максимальная длина комментария — 100 символов
var RESIZE_CONTROL_STEP = '25%';// шаг — 25% для формы ввода масштаба

// Показ/скрытие картинки в галерее
var galleryCloseCross = galleryElement.querySelector('.gallery-overlay-close');

// добавление tabindex на крестик в галерее
galleryCloseCross.setAttribute('tabindex', '0');

// ---------- обработчики событий ----------
// функция закрытия галереи
var galleryClose = function () {
  galleryElement.classList.add('hidden');
  picturesList.addEventListener('click', onPictureClick);
  picturesList.addEventListener('keydown', onCrossEnterPress);
  galleryCloseCross.removeEventListener('click', onCrossClick);
  galleryCloseCross.removeEventListener('keydown', onCrossEnterPress);
  document.removeEventListener('keydown', onGalleryEscPress);
  picturesList.addEventListener('keydown', onPictureEnterPress);
};

// функция открытия галереи
var galleryOpen = function () {
  galleryElement.classList.remove('hidden');
  picturesList.removeEventListener('click', onPictureClick);
  picturesList.removeEventListener('keydown', onCrossEnterPress);
  galleryCloseCross.addEventListener('click', onCrossClick);
  galleryCloseCross.addEventListener('keydown', onCrossEnterPress);
  document.addEventListener('keydown', onGalleryEscPress);
  picturesList.removeEventListener('keydown', onPictureEnterPress);
};

// функция добавления картинки в галерею
var setPictureToGallery = function (pict) {
  var pictureSource = pict.querySelector('img').getAttribute('src');
  var pictureLikes = pict.querySelector('.picture-likes').textContent;
  var pictureComments = pict.querySelector('.picture-comments').textContent;

  galleryElement.querySelector('.gallery-overlay-image').setAttribute('src', pictureSource);
  galleryElement.querySelector('.likes-count').textContent = pictureLikes;
  galleryElement.querySelector('.comments-count').textContent = pictureComments;

  // удаляю слово 'комментариев'
  galleryCommentText.textContent = galleryCommentText.textContent.slice(0, -12);

  // добавляю соответствующее количеству комментариев слово
  galleryCommentText.textContent += changeCommentEnding(pictureComments, commentEndings);
};

// функция клика на картинке
var onPictureClick = function (evt) {
  evt.preventDefault();
  var targetClick = evt.target;

  while (targetClick !== picturesList) {
    if (targetClick.classList.contains('picture')) {
      setPictureToGallery(targetClick);
      galleryOpen();
      break;
    }

    targetClick = targetClick.parentElement;
  }
};

// функция ЗАКРЫТИЯ галереи по КЛИКУ по крестике
var onCrossClick = function () {
  galleryClose();
};

// функция ЗАКРЫТИЯ галереи по нажатию ENTER на КРЕСТИКЕ
var onCrossEnterPress = function (evt) {
  var keyCode = evt.keyCode;
  var targetClick = evt.target;
  if (keyCode === ENTER_KEYCODE && targetClick.classList.contains('gallery-overlay-close')) {
    evt.preventDefault();
    galleryClose();
  }
};

// функция ЗАКРЫТИЯ галереи по нажатию ESC
var onGalleryEscPress = function (evt) {
  var keyCode = evt.keyCode;
  if (keyCode === ESC_KEYCODE) {
    galleryClose();
  }
};

// функция нажатия ENTER на картинку .picture,
// заполнение галереи данными картинки и открытие галереи
var onPictureEnterPress = function (evt) {
  var keyCode = evt.keyCode;
  var targetClick = evt.target;
  if (keyCode === ENTER_KEYCODE && targetClick.classList.contains('picture')) {
    evt.preventDefault();
    setPictureToGallery(targetClick);
    galleryOpen();
  }
};

// перемещаю fragment в .pictures
picturesList.appendChild(fragment);

// скрываю форму кадрирования изображения upload-overlay
cropForm.classList.add('hidden');

// обработка клика по картинкам (.picture)
picturesList.addEventListener('click', onPictureClick);

// обработка нажатия ENTER, при фокусе на картинке (.picture)
picturesList.addEventListener('keydown', onPictureEnterPress);

// обработка нажатия ENTER, при фокусе на картинке (.picture)
galleryElement.addEventListener('keydown', onCrossEnterPress);

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

  // снимаю обработчик очистки поля хэш-тегов при открытии окна uploadOverlay
  uploadFileInput.removeEventListener('click', clearInputHashtag);

  // вешаю обработчик - убираю красную рамку пока в поле вводятся комментарии
  // поле валидно по-умолчанию
  uploadComment.addEventListener('click', becameValidDefault);

  // вешаю обработчик - убрать красную рамку по нажатию на кнопку Отправить
  // если комменты валидны
  submitButton.addEventListener('click', becameValidAfterSubmitClick);
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

  // вешаю обработчик очистки поля хэш-тегов при закрытии окна uploadOverlay
  uploadFileInput.addEventListener('click', clearInputHashtag);

  // снимаю обработчик - убираю красную рамку пока в поле вводятся комментарии
  // поле валидно по-умолчанию
  uploadComment.removeEventListener('click', becameValidDefault);

  // снимаю обработчик - убрать красную рамку по нажатию на кнопку Отправить
  // если комменты валидны
  submitButton.removeEventListener('click', becameValidAfterSubmitClick);
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
  if (evt.keyCode === ESC_KEYCODE && evt.target !== uploadComment) {
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
  if (evt.keyCode === ENTER_KEYCODE) {
    closeUploadOverlay();
  }
};

// функция генерации клика
var doClick = new Event('click');

// функция генерации клика на нажатию ENTER на кнопке Отправить
var onSubmitButtonEnterPress = function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
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
var resizeInc = cropForm.querySelector('.upload-resize-controls-button-inc');

// кнопка уменьшения масштаба изображения
var resizeDec = cropForm.querySelector('.upload-resize-controls-button-dec');

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

// красная рамка
var RED_BORDER = '3px solid red';

// ---------- переменные ----------
// поле ввода хэш-тегов
var inputHashtag = cropForm.querySelector('.upload-form-hashtags');

// ---------- функции ----------
// функция удаление повторяющихся хэш-тегов
var deleteRepeatedHashtag = function (arr) {
  var obj = {};

  for (var j = 0; j < arr.length; j++) {
    var str = arr[j].toLowerCase();
    obj[str] = true; // запомнить строку в виде свойства объекта
  }

  // массив названий свойств объекта
  var uniqueHashtags = Object.keys(obj);

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
  return arr.length > HASHTAG_MAX_AMOUNT ? false : true;
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

// функция добавления красной рамки
var addRedBorder = function (elem) {
  elem.style.border = RED_BORDER;
};

// функция удалния красной рамки
var removeRedBorder = function (elem) {
  elem.style.border = 'none';
};

// делаю форму комментарие валидной по-умолчанию
var becameValidDefault = function () {
  // убираю красную рамку на поле ввода комментария - если она есть
  if (uploadComment.style.border === RED_BORDER) {
    removeRedBorder(uploadComment);
  }
};

// удаляю красную рамку по нажатию на кнопку Отправить
// если комменты валидны
var becameValidAfterSubmitClick = function () {
  if (uploadComment.validity.valid) {
    removeRedBorder(uploadComment);
  }
};

// функция очистки поля хэш-тегов после сабмита
var clearInputHashtag = function () {
  inputHashtag.value = '';
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
    inputHashtag.style.border = RED_BORDER;

    // вешаю обработчик - после клика на кнопку Отправить
    // если поле невалидно - добавь красную рамку
    uploadComment.addEventListener('invalid', addRedBorder(uploadComment));
  } else {
    // сброс значения обработчика валидации, если это значение стало корректно
    inputHashtag.setCustomValidity('');

    // убираю красную рамку в поле
    inputHashtag.style.border = 'none';

    // снимаю обработчик добавления красной рамки
    uploadComment.removeEventListener('invalid', addRedBorder(uploadComment));
  }
};

// ---------- добавление атрибутов ----------
uploadForm.setAttribute('action', 'https://1510.dump.academy/kekstagram');
uploadForm.setAttribute('method', 'post');
uploadForm.setAttribute('enctype', 'multipart/form-data');

// ---------- обработчики событий ----------
// вешаю обработчик очистки поля хэш-тегов
uploadFileInput.addEventListener('click', clearInputHashtag);
