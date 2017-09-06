// Файл preview.js
'use strict';

(function () {
  // "нахожу" элемент .gallery-overlay, в который потом добавлю картинку
  var galleryElement = document.querySelector('.gallery-overlay');

  window.preview = {
    // функция добавления картинки в галерею
    setPictureToGallery: function (pict) {
      // 'достаю' data- индекс из элемента
      var index = pict.dataset.index;

      // по data- индексу передаю соответствующий элемент из массива в эту функцию
      var shot = window.picture.pictures[index];

      // отрисовываю превью
      galleryElement.querySelector('.gallery-overlay-image').setAttribute('src', shot.url);
      galleryElement.querySelector('.likes-count').textContent = shot.likes;
      galleryElement.querySelector('.comments-count').textContent = shot.commentsCount;
    },
  };
})();
