import { createEl } from "../helpers/createEl.js";
import { declOfNum } from "../helpers/declOfNum.js";

/* 
  Функция создания раздела с категориями.
  Возвращает объект с методами для монтирования `mount` и  размонтирования `unmount` элемента, а также список с категориями `categoryList`.
*/
export const createCategory = (parent) => {
  const category = createEl('section', {
    className: 'category section-offset'
  });

  const container = createEl('div', {
    className: 'container'
  });

  const list = createEl('ul', {
    className: 'category__list'
  });

  /* 
    Функция создания карточки категории на основе данных с сервера.
    Возвращает элемент пункта меню - карточку категории.
  */
  const createCategoryCard = (data) => {
    const card = createEl('li', {
      className: 'category__item'
    });
    card.dataset.id = data.id;

    const btn = createEl('button', {
      type: 'button',
      className: 'category__card'
    });
    
    const cardTitle = createEl('span', {
      className: 'category__title',
      textContent: data.title,
    });

    const cardPairs = createEl('span', {
      className: 'category__pairs',
      textContent: declOfNum(data.length, ['пара', 'пары', 'пар']),
    });

    btn.append(cardTitle, cardPairs);

    const btnEdit = createEl('button', {
      type: 'button',
      className: 'category__btn category__edit',
      ariaLabel: 'редактировать'
    });

    const btnDel = createEl('button', {
      type: 'button',
      className: 'category__btn category__del',
      ariaLabel: 'удалить'
    });

    card.append(btn, btnEdit, btnDel);

    return card;
  };

  container.append(list);
  category.append(container);

  /*
    Функции монтирования элемента.
    1. Обнуляет содержимое списка с карточками категорий
    2. Создает на основании полученного массива данных карточки категорий
    3. Вставляет в переданного родителя `parent`
  */
  const mount = (data) => {
    list.textContent = '';
    const cards = data.map(createCategoryCard);
    list.append(...cards);
    app.append(category);
  };

  /* 
    Функция размонтирования элемента.
    Удаляет элемент со страницы.
  */
  const unmount = () => {
    category.remove();
  };

  return {
    mount,
    unmount,
    categoryList: list
  };
};