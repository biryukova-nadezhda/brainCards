import { createEl } from '../helpers/createEl.js';

/* 
  Функция для отображения окошка alert с ошибкой при ее возникновении, а также для удаления его через 3 секунды после завершени анимации
*/
export const showAlert = (text, time = 3000) => {
  const alertBlock = createEl('div', {
    className: 'alert',
  });

  const alertText = createEl('p', {
    className: 'alert__text',
    textContent: text,
  });

  alertBlock.append(alertText);
  document.body.append(alertBlock);

  /*
    Таймаут для плавности появления блока на странице 
  */
  setTimeout(() => {
    alertBlock.classList.add('alert_show');
  });

  /*
    Таймаут для удаления блока со страницы.
    По завершению анимации через 200 блок удаляем со страницы вовсе
  */
    setTimeout(() => {
      alertBlock.classList.remove('alert_show');

      setTimeout(() => {
        alertBlock.remove();
      }, 200);
    }, time);
};