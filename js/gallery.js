// Файл gallery.js
'use strict';

(function () {
  var likesMin = 15; // минимальное количество лайков
  var likesMax = 200; // максимальное количество лайков

  var picturesList = document.querySelector('.pictures');
  var similarPictureTemplate = document.querySelector('#picture-template');

  // создаю массив из картинок
  var pictures = window.picture.createPictures(window.data.comments,
      likesMin,
      likesMax,
      window.data.picturesAmount
  );

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

  // перемещаю fragment в .pictures
  picturesList.appendChild(fragment);

  // форма кадрирования изображения upload-overlay
  var cropForm = document.querySelector('.upload-overlay');

  // Показ/скрытие картинки в галерее
  var galleryCloseCross = window.preview.galleryElement.querySelector('.gallery-overlay-close');

  // добавление tabindex на крестик в галерее
  galleryCloseCross.setAttribute('tabindex', '0');

  // ---------- обработчики событий ----------
  // функция закрытия галереи
  var galleryClose = function () {
    window.preview.galleryElement.classList.add('hidden');
    picturesList.addEventListener('click', onPictureClick);
    picturesList.addEventListener('keydown', onCrossEnterPress);
    galleryCloseCross.removeEventListener('click', onCrossClick);
    galleryCloseCross.removeEventListener('keydown', onCrossEnterPress);
    document.removeEventListener('keydown', onGalleryEscPress);
    picturesList.addEventListener('keydown', onPictureEnterPress);
  };

  // функция открытия галереи
  var galleryOpen = function () {
    window.preview.galleryElement.classList.remove('hidden');
    picturesList.removeEventListener('click', onPictureClick);
    picturesList.removeEventListener('keydown', onCrossEnterPress);
    galleryCloseCross.addEventListener('click', onCrossClick);
    galleryCloseCross.addEventListener('keydown', onCrossEnterPress);
    document.addEventListener('keydown', onGalleryEscPress);
    picturesList.removeEventListener('keydown', onPictureEnterPress);
  };

  // функция клика на картинке
  var onPictureClick = function (evt) {
    evt.preventDefault();
    var targetClick = evt.target;

    while (targetClick !== picturesList) {
      if (targetClick.classList.contains('picture')) {
        window.preview.setPictureToGallery(targetClick);
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
    var enterButton = window.data.ENTER_KEYCODE;

    if (keyCode === enterButton && targetClick.classList.contains('gallery-overlay-close')) {
      evt.preventDefault();
      galleryClose();
    }
  };

  // функция ЗАКРЫТИЯ галереи по нажатию ESC
  var onGalleryEscPress = function (evt) {
    var keyCode = evt.keyCode;
    if (keyCode === window.data.ESC_KEYCODE) {
      galleryClose();
    }
  };

  // функция нажатия ENTER на картинку .picture,
  // заполнение галереи данными картинки и открытие галереи
  var onPictureEnterPress = function (evt) {
    var keyCode = evt.keyCode;
    var targetClick = evt.target;
    if (keyCode === window.data.ENTER_KEYCODE && targetClick.classList.contains('picture')) {
      evt.preventDefault();
      window.preview.setPictureToGallery(targetClick);
      galleryOpen();
    }
  };

  // скрываю форму кадрирования изображения upload-overlay
  cropForm.classList.add('hidden');

  // обработка клика по картинкам (.picture)
  picturesList.addEventListener('click', onPictureClick);

  // обработка нажатия ENTER, при фокусе на картинке (.picture)
  picturesList.addEventListener('keydown', onPictureEnterPress);

  // обработка нажатия ENTER, при фокусе на картинке (.picture)
  window.preview.galleryElement.addEventListener('keydown', onCrossEnterPress);
})();
