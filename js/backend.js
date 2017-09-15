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

    xhr.timeout = 10000;// 10s - time in milliseconds

    // если данные загружены успешно выполнится onLoad
    // и onError, если что-то пошло не так
    xhr.onload = function () {
      try {
        onLoad(xhr.response);
      } catch (err) {
        onError(err.message);
      }
    };

    // обработка ошибочных ситуаций
    xhr.onerror = function () {
      onError('Произошла ошибка соединения');
    };

    xhr.ontimeout = function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    };

    return xhr;
  };

  // CSS свойства окна ошибки
  var notificationWindowStyles = {
    zIndex: 100,
    padding: '60px',
    margin: '0 auto',
    textAlign: 'center',
    backgroundColor: 'rgba( 0, 0, 0, 0.8)',
    position: 'fixed',
    left: 0,
    right: 0,
    fontSize: '20px',
    color: 'tomato',
    fontFamily: '/"Open Sans/", Arial, sans-serif;',
    borderRadius: '4px',
  };

  // создание окна ошибки
  var createNotification = function (innerText) {
    var notificationWindow = document.createElement('div');
    for (var key in notificationWindowStyles) {
      if (notificationWindowStyles.hasOwnProperty(key)) {
        notificationWindow.style[key] = notificationWindowStyles[key];
      }
    }

    // innerText - текст сообщения (например, текст ошибки)
    notificationWindow.textContent = innerText;

    return notificationWindow;
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

    // передаю текст ошибки в функцию создания окна об ошибках
    // добавляю окно об ошибках в DOM дерево
    onLoadError: function (errorText) {
      var errorMessage = createNotification(errorText);
      document.body.insertAdjacentElement('afterbegin', errorMessage);
    },
  };
})();
