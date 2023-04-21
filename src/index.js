import { createCategory } from './js/components/createCategory.js';
import { createEditCategory } from './js/components/createEditCategory.js';
import { createHeader } from './js/components/createHeader.js';
import { createPairs } from './js/components/createPairs.js';
import { showAlert } from './js/components/showAlert.js';
import { createEl } from './js/helpers/createEl.js';
import { fetchCards, fetchCategories, fetchCreateCategory, fetchDeleteCategory, fetchEditCategory } from './js/service/api.service.js';

const init = async () => {
  /* 
    Находим элементы на странице 
  */
  const header = document.querySelector('.header');
  const app = document.querySelector('#app');

  /* 
    Создаем структуру приложения и обратно получаем объекты с методами и элементами 
  */
  const headerObject = createHeader(header);
  const categoryObject = createCategory(app);
  const editCategoryObject = createEditCategory(app);
  const createPairsObject = createPairs(app);

  /* 
    Функция размонтирования всех секций 
  */
  const allSectionUnMount = () => {
    [categoryObject, editCategoryObject, createPairsObject].forEach(obj => obj.unmount());
  };

  /* 
    Функция для загрузки данных о новой категории на сервер
  */
  const postHandler = async () => {
    const data = editCategoryObject.parseData();
    const dataCategories = await fetchCreateCategory(data);

    if (dataCategories.error) {
      showAlert(dataCategories.error?.message);
      return;
    };

    showAlert(`Новая категория "${ data.title }" была добавлена`);
    allSectionUnMount();
    headerObject.updateHeaderTitle('Категории');
    categoryObject.mount(dataCategories);
  };

  /* 
    Функция для обновления данных редактируемой категории
  */
  const patchHandler = async () => {
    const data = editCategoryObject.parseData();
    const dataCategories = await fetchEditCategory(data, editCategoryObject.btnSave.dataset.id);

    if (dataCategories.error) {
      showAlert(dataCategories.error?.message);
      return;
    };

    showAlert(`Категория "${ data.title }" обновлена`);
    allSectionUnMount();
    headerObject.updateHeaderTitle('Категории');
    categoryObject.mount(dataCategories);
  };
  /* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */

  /* 
    Функция обнуляет все секции на странице, а также получает список категорий и отображает их на странице. Если при получении категорий от сервера возникли ошибки, то выводит ошибку на экран пользователя 
  */
  const returnIndex = async e => {
    e?.preventDefault();
    allSectionUnMount();
    headerObject.updateHeaderTitle('Категории');
    /* 
      Получаем категории с сервера и сразу обрабатываем ошибку 
    */
    const categories = await fetchCategories();
    if (categories.error) {
      app.append(createEl('p', {
        className: 'server-error',
        textContent: 'Ошибка сервера, попробуйте зайти позже'
      }));
      return;
    };
    categoryObject.mount(categories);
  };

  /* 
    Вызываем один раз, чтобы отобразить страничку при первом запуске 
  */
  returnIndex();

  /* 
    Добавляем обработчики событий клика на заголовок и кнопку header.
    При клике на логотип в шапке, возвращаемся в исходное состояние страницы.
    При клике на кнопку добавления категории, размонтируем все секции, меняем заголовок и отрисовываем таблицу изменения категории.
  */
  headerObject.headerLogoLink.addEventListener('click', returnIndex);
  headerObject.headerBtn.addEventListener('click', () => {
    allSectionUnMount();
    headerObject.updateHeaderTitle('Новая категория');
    editCategoryObject.mount();
    editCategoryObject.btnSave.addEventListener('click', postHandler);
    editCategoryObject.btnSave.removeEventListener('click', patchHandler);
  });

  /* 
    Добавляем обработчик события клика на кнопку возвращения к категориям из изучения карт.
    При клике возвращаем страницу в исходное состояние.
  */
  createPairsObject.btnReturn.addEventListener('click', returnIndex);

  /* 
    Добавляем обработчик события клика на кнопку отмены из редактирования/добавления категорий.
    При клике возвращаемся к категориям, перед этим получив подтвержение перехода.
  */
  editCategoryObject.btnCancel.addEventListener('click', () => {
    if (confirm('Вы уверены, что хотите выйти? Все несохраненные данные будут потеряны')) {
      returnIndex();
    };
  });

  /* 
    Вешаем слушатель события клика по карточке с категориями. 
    1. Определяем на какую именно карточку кликнули
    2. Если нет карточки, то возвращем
    3. Если нажимаем на карточку, то переходим в раздел изучения слов
    4. Если нажимаем на карточке на кнопку редактирования, то переходим в раздел редактирования категории
    5. Если происходит клик по кнопке удаления, то получив подтверждение намерений, удаляем категорию.
  */
  categoryObject.categoryList.addEventListener('click', async ({ target }) => {
    const card = target.closest('.category__item');

    if (!card) {
      return;
    };

    if (target.closest('.category__edit')) {
      const dataCards = await fetchCards(card.dataset.id);
      allSectionUnMount();
      headerObject.updateHeaderTitle('Редактирование');
      editCategoryObject.mount(dataCards);
      editCategoryObject.btnSave.addEventListener('click', patchHandler);
      editCategoryObject.btnSave.removeEventListener('click', postHandler);
      return;
    };

    if (target.closest('.category__del')) {
      if (confirm('Вы уверены, что хотите удалить категорию?')) {
        const result = fetchDeleteCategory(card.dataset.id);

        if (result.error) {
          showAlert(result.error.message);
        };

        showAlert('Категория удалена!');
        card.remove();
      };

      return;
    };

    if (target.closest('.category__card')) {
      const dataCards = await fetchCards(card.dataset.id);
      allSectionUnMount();
      headerObject.updateHeaderTitle(dataCards.title);
      createPairsObject.mount(dataCards);
      return;
    };
  });
};

init(); 