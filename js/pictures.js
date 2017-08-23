'use strict';
var similarPictureTemplate = document.querySelector('#picture-template');
var similarListElement = document.querySelector('.pictures');

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

  return pictureElement;
};

// функция заполнения блока DOM-элементами на основе массива JS-объектов
var fragment = document.createDocumentFragment();
for (var i = 0; i < pictures.length; i++) {
  fragment.appendChild(renderPicture(pictures[i]));
}

// перемещаю fragment в .pictures
similarListElement.appendChild(fragment);

// скрываю форму кадрирования изображения upload-overlay
var cropForm = document.querySelector('.upload-overlay');
cropForm.classList.add('hidden');

// "нахожу" элемент .gallery-overlay, в который потом добалю картинку
var galleryElement = document.querySelector('.gallery-overlay');

// функция добавления картинки в gallery-форму
var showPicture = function (pictureToGallery, gallery) {
  gallery.querySelector('.gallery-overlay-image').src = pictureToGallery.url;
  gallery.querySelector('.likes-count').textContent = pictureToGallery.likes;
  gallery.querySelector('.comments-count').textContent = pictureToGallery.commentsCount;
};

// вставляю в .gallery-overlay первую картинку из массива .pictures
showPicture(pictures[0], galleryElement);

galleryElement.classList.remove('hidden');
