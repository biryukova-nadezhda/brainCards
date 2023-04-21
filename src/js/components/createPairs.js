import { createEl } from '../helpers/createEl.js';
import { shuffleArray } from '../helpers/shuffleArray.js';
import { showAlert } from './showAlert.js';

/* 
  Функция создания секции с карточками для изучения слов.
  Возвращает объект с методами для монтирования элемента `mount` и размонтирования элемента `unmount`, а также кнопкой `btnReturn` для возвращения к категориям из раздела.
*/
export const createPairs = (parent) => {
  const pairs = createEl('section', {
    className: 'card section-offset'
  });

  const container = createEl('div', {
    className: 'container card__container'
  });

  const btnReturn = createEl('button', {
    className: 'card__return',
    ariaLabel: 'Возврат к категориям'
  });

  const card = createEl('button', {
    className: 'card__item',
  });

  const cardFront = createEl('span', {
    className: 'card__front',
  });

  const cardBack = createEl('span', {
    className: 'card__back',
  });

  card.append(cardFront, cardBack);
  container.append(btnReturn, card);
  pairs.append(container);

  /* 
    Функция переворота карточек.
    1. Добавляет класс для переворота карточки и удаляет его через секунду, для анимации переворота
    2. Если у нас последний набор слов, то выводим сообщение об этом
    3. Показываем пользователю сообщение о том, что сейчас произойдет переход на главную страничку и возвращаемся туда
  */
  let dataCards = []; // промежуточная переменная для хранения копии данных, приходящих с сервера
  const flipCard = () => {
    card.classList.add('card__item_flipped');
    card.removeEventListener('click', flipCard);

    setTimeout(() => {
      card.classList.remove('card__item_flipped');
      setTimeout(() => {
        card.index++;

        if (card.index === dataCards.length) {
          cardFront.textContent = 'Конец категории';
          showAlert('Вернемся к категориям', 2000);

          setTimeout(() => {
            btnReturn.click();
          }, 2000);

          return;
        };

        cardFront.textContent = dataCards[card.index][0];
        cardBack.textContent = dataCards[card.index][1];

        setTimeout(() => {
          card.addEventListener('click', flipCard);
        }, 200);
      }, 100);
    }, 1000);
  };

  /* 
    Функция управлением карточкой. 
    1. Принимает данные с сервера и выводит их в карточки.
    2. Навешивает слушатель события клика по карточке для ее переворота
  */
  const cardController = data => {
    dataCards = [...data];
    card.index = 0;
    cardFront.textContent = data[card.index][0];
    cardBack.textContent = data[card.index][1];
    card.addEventListener('click', flipCard);
  };

  /* 
    Функции монтирования элемента. 
    Сразу перемешиваем исходные данные, а затем уже на основании перемешенного массива создаем карточки.
  */
  const mount = (data = { title: 'Учим', pairs: [] }) => {
    parent.append(pairs);
    const shuffleData = shuffleArray(data.pairs);
    cardController(shuffleData);
  };

  /* 
    Функция размонтирования элемента.
    Удаляет элемент со страницы.
  */
  const unmount = () => {
    pairs.remove();
    card.removeEventListener('click', flipCard);
  };

  return { btnReturn, mount, unmount };
};