import { createEl } from '../helpers/createEl.js';

const TITLE = 'Введите название категории'; // исходный заголовок таблицы

/* 
  Функция создания раздела страницы для редактирования категорий.
  Возвращает объект с методами для монтирования элемента `mount` и размонтирования `unmount`, функцию парсинга parseData, кнопку сохранения изменений `btnSave` и кнопку отмены `btnCancel`
*/
export const createEditCategory = (parent) => {
  const editCatecory = createEl('section', {
    className: 'edit section-offset'
  });

  const container = createEl('div', {
    className: 'container edit__container'
  });

  const title = createEl('h2', {
    className: 'edit__title',
    contentEditable: true
  });

  /* Создание редактируемой таблицы */
  const table = createEl('table', {
    className: 'edit__table table'
  });

  const thead = createEl('thead');
  const trThead = createEl('tr');

  const thMain = createEl('th', {
    className: 'table__cell',
    textContent: 'main'
  });

  const thSecond = createEl('th', {
    className: 'table__cell',
    textContent: 'second'
  });

  const thEmpty = createEl('th', {
    className: 'table__cell'
  });
  
  const tbody = createEl('tbody');
  
  /* Создание блока кнопок редактирования */
  const btnWrapper = createEl('div', {
    className: 'edit__btn-wrapper'
  });

  const btnAddRow = createEl('button', {
    className: 'edit__btn edit__add-row',
    textContent: 'Добавить пару'
  });

  const btnSave = createEl('button', {
    className: 'edit__btn edit__save',
    textContent: 'Сохранить'
  });

  const btnCancel = createEl('button', {
    className: 'edit__btn edit__cancel',
    textContent: 'Отмена'
  });

  btnWrapper.append(btnAddRow, btnSave, btnCancel);
  trThead.append(thMain, thSecond, thEmpty);
  thead.append(trThead);
  table.append(thead, tbody);
  container.append(title, table, btnWrapper);
  editCatecory.append(container);

  /*
    Функция создания строки таблицы с данными с сервера.
    Возвращает элемент строки таблицы, состоящую из трех ячеек, в двух из которых слово и его значение, а в третьей кнопка для удаления строки. 
    На кнопке сразу навешен слушатель события клика, который удаляет строку, попросив перед этим подтверждение пользователя.
  */
  const createTrCell = (dataArr) => {
    const tr = createEl('tr');
    const tdOne = createEl('td', {
      className: 'table__cell table__cell_one',
      contentEditable: true,
      textContent: dataArr[0]
    });
  
    const tdTwo = createEl('td', {
      className: 'table__cell table__cell_two',
      contentEditable: true,
      textContent: dataArr[1]
    });
  
    const tdCellDel = createEl('td', {
      className: 'table__cell',
    });
  
    const btnDelRow = createEl('button', {
      type: 'button',
      className: 'table__del',
      textContent: 'x'
    });

    tdCellDel.append(btnDelRow);
    tr.append(tdOne, tdTwo, tdCellDel);

    /* 
      Слушатель события клика по кнопке для удаления строки таблицы с запрашиванием подтверждения от пользователя.
    */
    btnDelRow.addEventListener('click', () => {
      if (confirm('Вы уверены, что хотите удалить строку?')) {
        tr.remove();
      };
    });

    return tr;
  };

  /*
    Функция, очищающая заголовок таблицы при клике на него 
  */
  const clearTitle = () => {
    if (title.textContent === TITLE) {
      title.textContent = '';
    };
  };

  /*
    Функция, проверяющая, а ввели ли новое название, если нет, то вставляем стандартное
  */
  const checkTitle = () => {
    if (title.textContent === '') {
      title.textContent = TITLE;
    };
  };

  /*
    Обрабатываем события фокуса и блюра на заголовке таблицы вышеописанными функциями
  */
  title.addEventListener('focus', clearTitle);
  title.addEventListener('blur', checkTitle);

  /*
    Обрабатываем события клика по кнопке добавления строки.
    Если произошел клик, то вставляем в таблицу пустую строку
  */
  btnAddRow.addEventListener('click', () => {
    const emptyRow = createTrCell(['', '']);
    tbody.append(emptyRow);
  });

  /* 
    Функция, которая на основании данных в таблице, формирует объект с массивом данных под ключом pairs
    1. Находим все ячейки на странице
    2. Формируем объект data, который мы в последующем будем отправлять
    3. Проверяем заполнены ли 2 соответствующие ячейки, т.е. пары, если да, то записываем в массив отправляемого объекта
    4. Проверяем, если заголовок таблицы не пустой, а также не равен стандартному, то его тоже записываем в объект
    5. Проверяем, если на кнопке есть id, то добавляем его в объект
  */
  const parseData = () => {
    const cellOne = document.querySelectorAll('.table__cell_one');
    const cellTwo = document.querySelectorAll('.table__cell_two');

    const data = {
      pairs: [],
    };

    for (let i = 0; i < cellOne.length; i++) {
      const textOne = cellOne[i].textContent.trim();
      const textTwo = cellTwo[i].textContent.trim();

      if (textOne && textTwo) {
        data.pairs.push([textOne, textTwo]);
      };
    };

    if (title.textContent.trim() && title.textContent.trim() !== TITLE) {
      data.title = title.textContent.trim();
    };

    if (btnSave.dataset.id) {
      data.id = btnSave.dataset.id;
    };
    
    return data;
  };

  /*
    Функции монтирования элемента
  */
  const mount = (data = {title: TITLE, pairs: []}) => {
    tbody.textContent = ''; // Очищаем таблицу
    title.textContent = data.title; // Задаем таблице название из data

    /* 
      Добавляем класс заголовку при его редактировании (для визуализации)
    */
    if (title.textContent === TITLE) {
      title.classList.add('edit__title_change');
    } else {
      title.classList.remove('edit__title_change');
    };

    /*
      Создаем строки таблицы с данными от сервера и вставляем в таблицу, также добавляем сразу пустую строку для новых слов
    */
    const rows = data.pairs.map(createTrCell);
    const emptyRow = createTrCell(['', '']); 
    tbody.append(...rows, emptyRow);

    /*
      Записываем id на кнопку, если он пришел с сервера
    */
    btnSave.dataset.id = data.id ? data.id : '';

    /*
      Вставляем в родителя секцию с таблицей
    */
    parent.append(editCatecory);
  };

  /* 
    Функция размонтирования элемента.
    Удаляет элемент со страницы
  */
  const unmount = () => {
    editCatecory.remove();
  };

  return { mount, unmount, parseData, btnSave, btnCancel };
};