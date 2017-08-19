'use strict';
var similarPictureTemplate = document.querySelector('#picture-template');
var similarListElement = document.querySelector('.pictures');

// функция генерации случайных чисел от min до max
var randomInteger = function (min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  rand = Math.floor(rand);
  return rand;
};

// функция генерации случайных чисел в зависимости от длины массива
var randomProperty = function (arr) {
  var rand = Math.random() * arr.length;
  rand = Math.floor(rand);
  return rand;
};

// массив комментариев
var commentsArr = [
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

// функция создания массива из 25 картинок - объектов
var createArr = function (commentsArray) {
  var arr = [];
  for (var i = 1; i <= 25; i++) { // на каждом этапе создаю объект и задаю свойства
    var object = {};
    object.url = 'photos/' + i + '.jpg';
    object.likes = randomInteger(15, 200);
    if (Math.round(Math.random())) { // одно или два случайных комментария
      object.comments = commentsArray[randomProperty(commentsArray)]; // один комментарий
    } else {
      var firstComment = commentsArray[randomProperty(commentsArray)]; // иначе два комментария
      // проверка на повторение одинаковых комментариев
      do {
        var secondComment = commentsArray[randomProperty(commentsArray)];
      } while (secondComment === firstComment);
      object.comments = firstComment + '<br>' + secondComment;
    }

    arr.push(object);
  }

  return arr;
};

// создаю массив из картинок
var pictures = createArr(commentsArr);

// функция создания DOM-элементов на основе #picture-template
var renderPicture = function (arr) {
  var pictureElement = similarPictureTemplate.content.cloneNode(true);
  pictureElement.querySelector('.picture').children[0].setAttribute('src', arr.url);
  pictureElement.querySelector('.picture-likes').textContent = arr.likes;
  pictureElement.querySelector('.picture-comments').textContent = arr.comments;

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

// заполняю данными .gallery-overlay
// из первого элемента массива .pictures
var galleryElement = document.querySelector('.gallery-overlay');
galleryElement.querySelector('.gallery-overlay-image').src = pictures[0].url;
galleryElement.querySelector('.likes-count').textContent = pictures[0].likes;
galleryElement.querySelector('.comments-count').innerHTML = pictures[0].comments;

galleryElement.classList.remove('hidden'); // в задании нужно убрать класс invisible, но его там нет
