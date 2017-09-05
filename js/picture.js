// Файл picture.js
'use strict';

(function () {

  window.picture = {
    // функция создания массива из picturesAmount картинок - объектов
    createPictures: function (commentsArr, likesMinimum, likesMaximum, picturesNumber) {
      var picturesArray = [];
      for (var i = 1; i <= picturesNumber; i++) { // на каждом этапе создаю объект и задаю свойства
        var object = {};
        object.url = 'photos/' + i + '.jpg';
        object.likes = window.data.getRandomInt(likesMinimum, likesMaximum);

        // один комментарий
        object.comments = commentsArr[window.data.randomProperty(commentsArr.length)];
        object.commentsCount = 1;
        object.tabindex = 0;

        // добавление второго комментария с вероятностью 50%
        if (Math.round(Math.random())) {
          object.comments += '<br>' + commentsArr[window.data.randomProperty(commentsArr.length)];
          object.commentsCount = 2;
        }

        picturesArray.push(object);
      }

      return picturesArray;
    },
  };
})();
