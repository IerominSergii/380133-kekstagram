// Файл gallery.js
'use strict';

(function () {
  // функция 'устранения дребезг' при частой нажатии
  var DEBOUNCE_INTERVAL = 300;// ms, время на которое откладывается действие
  var lastTimeout;
  var debounce = function (fun) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }

    lastTimeout = window.setTimeout(fun, DEBOUNCE_INTERVAL);
  };

  // контейнер с картинками
  var picturesList = document.querySelector('.pictures');

  // блок фильтров картинок Рекомендуемые, Популярные и т.д.
  var sortBlock = document.querySelector('.filters');

  var removePictures = function (picturesContainer) {
    while (picturesContainer.lastChild) {
      picturesContainer.removeChild(picturesContainer.lastChild);
    }
  };

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

      // добавляю картинке индекс - номер картинки в ИСХОДНОМ массиве
      currentPicture.querySelector('.picture').dataset.index = images[j].originalNumber;
      fragment.appendChild(currentPicture);
    }

    // перемещаю fragment в контейнер с картинками .pictures
    picturesList.appendChild(fragment);
  };

  // ---------- Recommend ----------
  // фильтр Рекомендуемые (в порядке, в котором получены с сервера)
  var turnOnRecommendFilter = function () {
    removePictures(picturesList);
    onLoadSucces(album);
  };

  // ---------- Popular ----------
  // фильтр Популярные
  var turnOnPopularFilter = function () {
    removePictures(picturesList);

    // копирую и сортирую массив по убыванию количества лайков
    var popularImages = album.slice().sort(function (left, right) {
      return right.likes - left.likes;
    });

    onLoadSucces(popularImages);
  };

  // ---------- Discussed ----------
  // фильтр Обсуждаемые
  var turnOnDiscussedFilter = function () {
    removePictures(picturesList);

    // копирую и сортирую массив в порядке убывания количества комментариев
    var discussedImages = album.slice().sort(function (left, right) {
      return right.comments.length - left.comments.length;
    });

    onLoadSucces(discussedImages);
  };

  // ---------- Random ----------
  // функция сортировки объектов массива в случайном порядке
  var compareRandom = function (a, b) {
    return Math.random() - 0.5;
  };

  // фильтр Случайные
  var turnOnRandomFilter = function () {
    removePictures(picturesList);
    var randomImages = album.slice().sort(compareRandom);
    onLoadSucces(randomImages);
  };

  // вешаю обработчики событий на каждый фильтр
  var filterRecommend = sortBlock.querySelector('#filter-recommend');
  filterRecommend.addEventListener('click', function () {
    debounce(turnOnRecommendFilter);
  });

  var filterPopular = sortBlock.querySelector('#filter-popular');
  filterPopular.addEventListener('click', function () {
    debounce(turnOnPopularFilter);
  });

  var filterDiscussed = sortBlock.querySelector('#filter-discussed');
  filterDiscussed.addEventListener('click', function () {
    debounce(turnOnDiscussedFilter);
  });

  var filterRandom = sortBlock.querySelector('#filter-random');
  filterRandom.addEventListener('click', function () {
    debounce(turnOnRandomFilter);
  });

  // показываю блок фильтров картинок Рекомендуемые, Популярные и т.д.
  var showSortBlock = function () {
    sortBlock.classList.remove('hidden');
  };

  // функцией getAlbum буду сохранять, полученный с сервера массив картинок в album
  // originalNumber - это номер картинки в исходном массиве. На его основе буду
  // присваивать data-attribute
  var album = [];
  var getAlbum = function (photos) {
    album = photos.map(function (photo, i) {
      photo.originalNumber = i;
      return photo;
    });

    onLoadSucces(album);
    showSortBlock();
  };

  window.backend.load(getAlbum, window.backend.onLoadError);
})();
