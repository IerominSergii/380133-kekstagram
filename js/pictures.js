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

// функция скрытия формы кадрирования изображения upload-overlay
var cropForm = document.querySelector('.upload-overlay');

// "нахожу" элемент .gallery-overlay, в который потом добавлю картинку
var galleryElement = document.querySelector('.gallery-overlay');

// ---------- module4 ----------
// объявляю константы со значениями клавиш
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

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
