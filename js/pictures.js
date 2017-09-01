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
  image.setAttribute('transform', scaleRightFormat);
};

// функция увеличения масштаба изображения
var onResizeIncClick = function (evt) {
  evt.preventDefault();
  if ((resizeValue + RESIZE_STEP) <= MAX_IMAGE_SCALE) {
    resizeValue = resizeValue + RESIZE_STEP;
    resizeControl.setAttribute('value', resizeValue + '%');
  } else {
    resizeValue = MAX_IMAGE_SCALE;
    resizeControl.setAttribute('value', resizeValue + '%');
  }

  zoomPicture(previewPicture, resizeControl.value);
};

// функция уменьшения масштаба изображения
var onResizeDecClick = function (evt) {
  evt.preventDefault();
  if ((resizeValue - RESIZE_STEP) > MIN_IMAGE_SCALE) {
    resizeValue = resizeValue - RESIZE_STEP;
    resizeControl.setAttribute('value', resizeValue + '%');
  } else {
    resizeValue = MIN_IMAGE_SCALE;
    resizeControl.setAttribute('value', resizeValue + '%');
  }

  zoomPicture(previewPicture, resizeControl.value);
};
