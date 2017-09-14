// Файл gallery.js
'use strict';

(function () {
  // контейнер с картинками
  var picturesList = document.querySelector('.pictures');

  // блок фильтров картинок Рекомендуемые, Популярные и т.д.
  var sortBlock = document.querySelector('.filters');

  // коллекция input форм с эффектами
  var sortInputs = sortBlock.querySelectorAll('input');

  var removePictures = function (picturesContainer) {
    while (picturesContainer.lastChild) {
      picturesContainer.removeChild(picturesContainer.lastChild);
    }
  };

  // ---------- Recommend ----------
  // активирую фильтр Рекомендуемые
  var turnOnRecommendFilter = function () {
    removePictures(picturesList);
    window.backend.load(onLoadSucces, window.backend.onLoadError);
  };

  // ---------- Popular ----------
  // на входе получаю неотсортированный массив из картинок
  // сортирую его по убыванию количества лайков
  var sortByPopular = function (shot) {
    var popularImages = shot.slice();
    popularImages.sort(function (left, right) {
      return right.likes - left.likes;
    });

    return popularImages;
  };

  // заменяю функцию onLoadSucces на onLoadPopular для вызова в глобальной
  // функции window.backend.load
  var onLoadPopular = function (picts) {
    var popularImages = sortByPopular(picts);
    onLoadSucces(popularImages);
  };

  // активирую фильтр Популярные
  var turnOnPopularFilter = function () {
    removePictures(picturesList);
    window.backend.load(onLoadPopular, window.backend.onLoadError);
  };

  // ---------- Discussed ----------
  // на входе получаю неотсортированный массив из картинок
  // сортирую его в порядке убывания количества комментариев
  var sortByDiscussed = function (shots) {
    var discussedImages = shots.slice();
    discussedImages.sort(function (left, right) {
      return right.comments.length - left.comments.length;
    });

    return discussedImages;
  };

  // заменяю функцию onLoadSucces на onLoadDiscussed для вызова в глобальной
  // функции window.backend.load
  var onLoadDiscussed = function (picts) {
    var discussedImages = sortByDiscussed(picts);
    onLoadSucces(discussedImages);
  };

  // активирую фильтр Обсуждаемые
  var turnOnDiscussedFilter = function () {
    removePictures(picturesList);
    window.backend.load(onLoadDiscussed, window.backend.onLoadError);
  };

  // ---------- Random ----------
  // функция сортировки объектов массива в случайном порядке
  var compareRandom = function (a, b) {
    return Math.random() - 0.5;
  };

  // на входе получаю неотсортированный массив из картинок
  // сортирую его в случайном порядке
  var sortByRandom = function (images) {
    var randomImages = images.slice();
    randomImages.sort(compareRandom);
    return randomImages;
  };

  // заменяю функцию onLoadSucces на onLoadRandom для вызова в глобальной
  // функции window.backend.load
  var onLoadRandom = function (picts) {
    var randomImages = sortByRandom(picts);
    onLoadSucces(randomImages);
  };

  // активирую фильтр Случайные
  var turnOnRandomFilter = function () {
    removePictures(picturesList);
    window.backend.load(onLoadRandom, window.backend.onLoadError);
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

  var setDataAttrOnFilters = function (inputs) {
    // переключателям эффекта добавляю data-атрибут с названием фильтра
    for (var i = 0; i < inputs.length; i++) {
      var sortClassName = inputs[i].getAttribute('id');
      var sortName = sortClassName;
      inputs[i].dataset.filter = sortName;
    }
  };

  var addOnFiltersClick = function (filters) {
    for (var i = 0; i < filters.length; i++) {
      switch (filters[i].dataset.filter) {
        case 'filter-recommend':
          filters[i].addEventListener('click', turnOnRecommendFilter);
          break;
        case 'filter-popular':
          filters[i].addEventListener('click', turnOnPopularFilter);
          break;
        case 'filter-discussed':
          filters[i].addEventListener('click', turnOnDiscussedFilter);
          break;
        case 'filter-random':
          filters[i].addEventListener('click', turnOnRandomFilter);
          break;
      }
    }
  };

  setDataAttrOnFilters(sortInputs);
  addOnFiltersClick(sortInputs);

  window.backend.load(onLoadSucces, window.backend.onLoadError);
})();
