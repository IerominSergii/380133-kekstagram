// Файл preview.js
'use strict';

(function () {
  window.preview = {
    // "нахожу" элемент .gallery-overlay, в который потом добавлю картинку
    galleryElement: document.querySelector('.gallery-overlay'),

    // функция добавления картинки в галерею
    setPictureToGallery: function (pict) {
      var pictureSource = pict.querySelector('img').getAttribute('src');
      var pictureLikes = pict.querySelector('.picture-likes').textContent;
      var pictureComments = pict.querySelector('.picture-comments').textContent;

      var gallery = window.preview.galleryElement;
      gallery.querySelector('.gallery-overlay-image').setAttribute('src', pictureSource);
      gallery.querySelector('.likes-count').textContent = pictureLikes;
      gallery.querySelector('.comments-count').textContent = pictureComments;
    },
  };
})();
