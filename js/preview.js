// Файл preview.js
'use strict';

(function () {
  // ---------- константы ----------
  // кнопки клавиатуры
  var ESC_KEYCODE = 27;// кнопка ESC
  var ENTER_KEYCODE = 13;// кнопка ENTER

  // ---------- DOM элементы ----------
  // превью
  var galleryElement = document.querySelector('.gallery-overlay');

  // крестик - закрытие превью
  var galleryCloseCross = galleryElement.querySelector('.gallery-overlay-close');

  // контейнер с картинками
  var picturesList = document.querySelector('.pictures');

  // ---------- изменение атрибута ----------
  // добавление tabindex на крестик в превью
  galleryCloseCross.setAttribute('tabindex', '0');

  // ---------- функции ----------
  // функция добавления картинки в превью
  var setPictureToGallery = function (pict) {
    // 'достаю' data- индекс из элемента
    var index = pict.dataset.index;

    var onLoadSuccesSetPictureToGallery = function (images) {
      // отрисовываю превью
      galleryElement.querySelector('.gallery-overlay-image').setAttribute('src', images[index].url);
      galleryElement.querySelector('.likes-count').textContent = images[index].likes;
      galleryElement.querySelector('.comments-count').textContent = images[index].comments.length;

      // открываю превью
      galleryOpen();
    };

    window.backend.load(onLoadSuccesSetPictureToGallery, window.backend.onLoadError);
  };

  // функция открытия превью
  var galleryOpen = function () {
    // показываю превью
    galleryElement.classList.remove('hidden');

    // удаляю обработчик: клика по маленькой картинке - открытие превью
    picturesList.removeEventListener('click', onPictureClickGalleryOpen);

    // удаляю обработчик: нажатия ENTER при фокусе на картинке - открытие превью
    picturesList.removeEventListener('keydown', onPictureEnterPressGalleryOpen);

    // добавляю обработчик: клика на крестике - закрытие превью
    galleryCloseCross.addEventListener('click', onCrossClickGalleryClose);

    // добавляю обработчик: нажатия ENTER, при фокусе на крестике - закрытие превью
    galleryCloseCross.addEventListener('keydown', onCrossEnterPressGalleryClose);

    // добавляю обработчик: нажатие ESC на документе - закрытие превью
    document.addEventListener('keydown', onEscPressGalleryClose);
  };

  // функция закрытия превью
  var galleryClose = function () {
    galleryElement.classList.add('hidden');

    // добавляю обработчик: клика по маленькой картинке - открытие превью
    picturesList.addEventListener('click', onPictureClickGalleryOpen);

    // добавляю обработчик: нажатия ENTER при фокусе на картинке - открытие превью
    picturesList.addEventListener('keydown', onPictureEnterPressGalleryOpen);

    // удаляю обработчик: клика на крестике - закрытие превью
    galleryCloseCross.removeEventListener('click', onCrossClickGalleryClose);

    // удаляю обработчик: нажатия ENTER, при фокусе на крестике - закрытие превью
    galleryCloseCross.removeEventListener('keydown', onCrossEnterPressGalleryClose);

    // удаляю обработчик: нажатие ESC на документе - закрытие превью
    document.removeEventListener('keydown', onEscPressGalleryClose);
  };

  // функция ЗАКРЫТИЯ превью по КЛИКУ по крестике
  var onCrossClickGalleryClose = function () {
    galleryClose();
  };

  // функция ЗАКРЫТИЯ превью по нажатию ENTER на КРЕСТИКЕ
  var onCrossEnterPressGalleryClose = function (evt) {
    var keyCode = evt.keyCode;
    var targetClick = evt.target;
    var enterButton = ENTER_KEYCODE;

    if (keyCode === enterButton && targetClick.classList.contains('gallery-overlay-close')) {
      evt.preventDefault();
      galleryClose();
    }
  };

  // функция закрытия превью по нажатию ESC
  var onEscPressGalleryClose = function (evt) {
    var keyCode = evt.keyCode;
    if (keyCode === ESC_KEYCODE) {
      galleryClose();
    }
  };

  // функция клика на картинке
  var onPictureClickGalleryOpen = function (evt) {
    evt.preventDefault();
    var targetClick = evt.target;

    // ограничиваю всплытие контейнером с картинками .pictures
    while (targetClick !== picturesList) {

      // если нахожу нужный элемент .picture, то выполняю функции
      if (targetClick.classList.contains('picture')) {

        // добавляю картинку (по которой был клик) в превью
        setPictureToGallery(targetClick);
        break;
      }

      // поднимаюсь выше к родителю, чтоб проверить не содержит ли он .picture
      targetClick = targetClick.parentElement;
    }
  };

  // функция нажатия ENTER на картинку .picture,
  // заполнение превью данными картинки и открытие превью
  var onPictureEnterPressGalleryOpen = function (evt) {
    var keyCode = evt.keyCode;
    var targetClick = evt.target;
    if (keyCode === ENTER_KEYCODE && targetClick.classList.contains('picture')) {
      evt.preventDefault();
      setPictureToGallery(targetClick);
      galleryOpen();
    }
  };

  // обработка клика по картинкам (.picture)
  picturesList.addEventListener('click', onPictureClickGalleryOpen);

  // обработка нажатия ENTER, при фокусе на картинке (.picture)
  picturesList.addEventListener('keydown', onPictureEnterPressGalleryOpen);
})();
