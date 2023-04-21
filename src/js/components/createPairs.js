import { createEl } from "../helpers/createEl.js";
import { shuffleArray } from "../helpers/shuffleArray.js";
import { showAlert } from "./showAlert.js";

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
    Функция управлением карточкой. 
    Принимает данные с сервера и выводит их в карточки
  */
  const cardController = data => {
    let index = 0; // Переменная для перешагивания по карточкам

    cardFront.textContent = data[index][0];
    cardBack.textContent = data[index][1];

    const flipCard = () => {
      card.classList.add('card__item_flipped');
      card.removeEventListener('click', flipCard);

      setTimeout(() => {
        card.classList.remove('card__item_flipped');
        setTimeout(() => {
          index++;

          if (index === data.length) {
            cardFront.textContent = 'Конец категории';
            showAlert('Вернемся к категориям', 2000);

            setTimeout(() => {
              btnReturn.click();
            }, 2000);

            return;
          };

          cardFront.textContent = data[index][0];
          cardBack.textContent = data[index][1];

          setTimeout(() => {
            card.addEventListener('click', flipCard);
          }, 200);
        }, 100);
      }, 1000);
    };

    card.addEventListener('click', flipCard);
  };

  /* 
    Функции монтирования элемента. 
  */
  const mount = (data = { title: 'Учим', pairs: [] }) => {
    parent.append(pairs);

    /* !!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
    /* Функция перемешивания массива */
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    
    /* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
    cardController(data.pairs);
  };

  /* 
    Функция размонтирования элемента.
    Удаляет элемент со страницы.
  */
  const unmount = () => {
    pairs.remove();
  };

  return { btnReturn, mount, unmount };
};