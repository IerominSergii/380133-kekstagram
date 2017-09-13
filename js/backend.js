// Файл backend.js - модуль для работы с сервером
'use strict';

(function () {
  // сервер, на который должны отправиться данные
  var SERVER_URL = 'https://1510.dump.academy/kekstagram';

  // настройкой запроса, логика связанная с работой по сети
  var setup = function (onLoad, onError) {

    // новый запрос к серверу
    var xhr = new XMLHttpRequest();

    // для того чтобы xhr.response сразу вернул объект или массив
    xhr.responseType = 'json';

    // если данные загружены успешно выполнится onLoad
    // и onError, если что-то пошло не так
    xhr.addEventListener('load', function () {
      try {
        onLoad(xhr.response);
      } catch (err) {
        onError(err.message);
      }
    });

    // обработка ошибочных ситуаций
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 10000;// 10s

    return xhr;
  };

  window.backend = {
    // получение данных с сервера с методом POST на адрес SERVER_URL
    // функция onLoad, если данные отправлены успешно
    // onError, если - ошибка
    load: function (onLoad, onError) {
      var xhr = setup(onLoad, onError);

      // запрос к серверу
      xhr.open('GET', SERVER_URL + '/data');
      xhr.send();
    },

    // функция загрузки данных на сервер
    // объект с данными, которые необходимо отправить data
    // функцию обратного вызова onLoad, если данные отправлены успешно
    // onError, если - ошибка
    save: function (data, onLoad, onError) {
      var xhr = setup(onLoad, onError);

      // запрос к серверу
      xhr.open('POST', SERVER_URL);
      xhr.send(data);
    },

    // сообщение об ошибках
    onLoadError: function (errorMessage) {
      var node = document.createElement('div');
      node.style['z-index'] = 100;
      node.style.padding = '60px';
      node.style.margin = '0 auto';
      node.style['text-align'] = 'center';
      node.style['background-color'] = 'rgba( 0, 0, 0, 0.8)';
      node.style.position = 'fixed';
      node.style.left = 0;
      node.style.right = 0;
      node.style.fontSize = '20px';
      node.style.color = 'tomato';
      node.style['font-family'] = '/"Open Sans/", Arial, sans-serif;';
      node.style['border-radius'] = '4px';

      node.textContent = errorMessage;
      document.body.insertAdjacentElement('afterbegin', node);
    },
  };
})();
