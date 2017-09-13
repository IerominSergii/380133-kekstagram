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
    pictureElement.querySelector('.picture-comments').textContent = shot.comments.length;
    pictureElement.querySelector('.picture').setAttribute('tabindex', shot.tabindex);

    return pictureElement;
  };

  var onLoadSucces = function (images) {
    // заполнению блок DOM-элементами на основе массива JS-объектов
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < images.length; i++) {
      var currentPicture = createPictureDomElement(images[i]);

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
  };

  var onLoadError = function (errorMessage) {
    var node = document.createElement('div');
    node.style['z-index'] = 100;
    node.style.padding = '60px';
    node.style.margin = '0 auto';
    node.style['text-align'] = 'center';
    node.style['background-color'] = 'rgba( 30, 30, 30, 0.7)';
    node.style.position = 'fixed';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '20px';
    node.style.color = 'tomato';
    node.style['font-family'] = '/"Open Sans/", Arial, sans-serif;';
    node.style['border-radius'] = '4px';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  window.backend.load(onLoadSucces, onLoadError);
})();
