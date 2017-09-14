// Файл gallery.js
'use strict';

(function () {
  // блок фильтров картинок Рекомендуемые, Популярные и т.д.
  var sortBlock = document.querySelector('.filters');

  // коллекция input форм с эффектами
  var sortInputs = sortBlock.querySelectorAll('input');

  // на входе получаю не сортированный массив из картинок
  // сортирую его по убыванию количества лайков
  var onPopularClick = function (images) {
    var popularImages = images.slice();
    popularImages.sort(function (left, right) {
      return left.likes - right.likes;
    });

    onLoadSucces(popularImages);
  };

  var onDiscussedClick = function (images) {
    var popularImages = images.slice();
    popularImages.sort(function (left, right) {
      return left.likes - right.likes;
    });

    onLoadSucces(popularImages);
  };

  var onRandomClick = function (images) {
    var popularImages = images.slice();
    popularImages.sort(function (left, right) {
      return left.likes - right.likes;
    });

    onLoadSucces(popularImages);
  };

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

    for (var j = 0; j < images.length; j++) {
      var currentPicture = createPictureDomElement(images[j]);

      // добавляю картинке индекс - номер картинки в массиве
      currentPicture.querySelector('.picture').dataset.index = j;
      fragment.appendChild(currentPicture);
    }

    // перемещаю fragment в контейнер с картинками .pictures
    picturesList.appendChild(fragment);

    // форма кадрирования изображения upload-overlay
    var cropForm = document.querySelector('.upload-overlay');

    // скрываю форму кадрирования изображения upload-overlay
    cropForm.classList.add('hidden');

    // показываю блок фильтров картинок Рекомендуемые, Популярные и т.д.
    sortBlock.classList.remove('hidden');
  };

  // переключателям эффекта добавляю data-атрибут с названием фильтра
  for (var i = 0; i < sortInputs.length; i++) {
    var sortClassName = sortInputs[i].getAttribute('id');
    var sortName = sortClassName;
    sortInputs[i].dataset.filter = sortName;

    switch (sortName) {
      case 'filter-recommend':
        sortInputs[i].addEventListener(
            'click',
            window.backend.load(onLoadSucces, window.backend.onLoadError)
        );
        break;
      case 'filter-popular':
        sortInputs[i].addEventListener(
            'click',
            window.backend.load(onPopularClick, window.backend.onLoadError)
        );
        break;
      case 'filter-discussed':
        sortInputs[i].addEventListener(
            'click',
            window.backend.load(onDiscussedClick, window.backend.onLoadError)
        );
        break;
      case 'filter-random':
        sortInputs[i].addEventListener(
            'click',
            window.backend.load(onRandomClick, window.backend.onLoadError)
        );
        break;
      default:
        sortInputs[i].addEventListener(
            'click',
            window.backend.load(onLoadSucces, window.backend.onLoadError)
      );
    }
  }

  window.backend.load(onLoadSucces, window.backend.onLoadError);
})();
