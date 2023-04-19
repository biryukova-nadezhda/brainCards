import { createEl } from "../helpers/createEl.js";

const TITLE = 'Введите название категории';

export const createEditCategory = (parent) => {
  const editCatecory = createEl('section', {
    className: 'edit section-offset'
  });

  const container = createEl('div', {
    className: 'container edit__container'
  });

  const title = createEl('h2', {
    className: 'edit__title',
    contentEditable: true,
    title: 'Можно редактировать',
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
    textContent: 'Сохранить категорию'
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

  /* Функция создания строки таблицы с данными с сервера */
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

    btnDelRow.addEventListener('click', () => {
      if (confirm('Вы уверены, что хотите удалить строку?')) {
        tr.remove();
      }
    });

    return tr;
  };

  /* Функция, очищающая заголовок при клике на него */
  const clearTitle = () => {
    if (title.textContent === TITLE) {
      title.textContent = '';
    };
  };

  /* Функция, проверяющая, а ввели ли новое название, если нет, то вставляем стандартное */
  const checkTitle = () => {
    if (title.textContent === '') {
      title.textContent = TITLE;
    };
  };

  title.addEventListener('focus', clearTitle);
  title.addEventListener('blur', checkTitle);

  btnAddRow.addEventListener('click', () => {
    const emptyRow = createTrCell(['', '']);
    tbody.append(emptyRow);
  });

  /* Функции монтирования и размонтирования элемента */
  const mount = (data = {title: TITLE, pairs: []}) => {
    tbody.textContent = ''; // Очищаем таблицу
    title.textContent = data.title; // Задаем таблице название из data

    /* Добавляем класс заголовку */
    if (title.textContent === TITLE) {
      title.classList.add('edit__title_change');
    } else {
      title.classList.remove('edit__title_change');
    };

    /* Создаем строки таблицы с данными от сервера и вставляем в таблицу */
    const rows = data.pairs.map(createTrCell);
    const emptyRow = createTrCell(['', '']); // Чтобы сразу у нас уже была одна пустая ячейка
    tbody.append(...rows, emptyRow);

    /* Вставляем в родителя секцию с таблицей */
    parent.append(editCatecory);
  };

  const unmount = () => {
    editCatecory.remove();
  };

  return { mount, unmount };
}