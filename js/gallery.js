// Файл gallery.js
'use strict';

(function () {
  // контейнер с картинками
  var picturesList = document.querySelector('.pictures');

  // шаблон картинки
  var similarPictureTemplate = document.querySelector('#picture-template');

  // функция создания DOM-элементов на основе #picture-template
  var createPictureDomElement = function (shot) {
    var pictureElement = similarPictureTemplate.content.cloneNode(true);
    pictureElement.querySelector('img').setAttribute('src', shot.url);
    pictureElement.querySelector('.picture-likes').textContent = shot.likes;
    pictureElement.querySelector('.picture-comments').textContent = shot.commentsCount;
    pictureElement.querySelector('.picture').setAttribute('tabindex', shot.tabindex);

    return pictureElement;
  };

  // заполнению блок DOM-элементами на основе массива JS-объектов
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < window.picture.pictures.length; i++) {
    var currentPicture = createPictureDomElement(window.picture.pictures[i]);

    // добавляю картинке индекс - номер картинки в массиве
    currentPicture.querySelector('.picture').dataset.index = i;
    fragment.appendChild(currentPicture);
  }

  // перемещаю fragment в контейнер с картинками .pictures
  picturesList.appendChild(fragment);

  // форма кадрирования изображения upload-overlay
  var cropForm = document.querySelector('.upload-overlay');

  // скрываю форму кадрирования изображения upload-overlay
  cropForm.classList.add('hidden');

})();
