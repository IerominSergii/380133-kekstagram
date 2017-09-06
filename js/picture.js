// Файл picture.js
'use strict';

(function () {

  window.picture = {
    // функция создания массива из picturesAmount картинок - объектов
    createPictures: function (commentsArr, likesMin, likesMax, picturesAmount) {
      var picturesArray = [];
      for (var i = 1; i <= picturesAmount; i++) { // на каждом этапе создаю объект и задаю свойства
        var shotFeatures = {};

        // случайное число в зависимости от длины массива
        var randomNumber = window.data.randomProperty(commentsArr.length);

        // случайное число от min до max
        var randomMinMaxNumber = window.data.getRandomInt(likesMin, likesMax);

        shotFeatures.url = 'photos/' + i + '.jpg';
        shotFeatures.likes = randomMinMaxNumber;

        // один комментарий
        shotFeatures.comments = commentsArr[randomNumber];
        shotFeatures.commentsCount = 1;
        shotFeatures.tabindex = 0;

        // добавление второго комментария с вероятностью 50%
        if (Math.round(Math.random())) {
          shotFeatures.comments += '<br>' + commentsArr[randomNumber];
          shotFeatures.commentsCount = 2;
        }

        picturesArray.push(shotFeatures);
      }

      return picturesArray;
    },
  };
})();
