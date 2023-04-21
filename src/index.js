import { createCategory } from './js/components/createCategory.js';
import { createEditCategory } from './js/components/createEditCategory.js';
import { createHeader } from './js/components/createHeader.js';
import { createPairs } from './js/components/createPairs.js';
import { createEl } from './js/helpers/createEl.js';
import { fetchCards, fetchCategories } from './js/service/api.service.js';

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
  });

  /* 
    Добавляем обработчик события клика на кнопку возвращения к категориям из изучения карт.
    При клике возвращаем страницу в исходное состояние.
  */
  createPairsObject.btnReturn.addEventListener('click', returnIndex);
  
  /* 
    Вешаем слушатель события клика по карточке с категориями. 
    1. Определяем на какую именно карточку кликнули
    2. Если нет карточки, то возвращем
    3. Если нажимаем на карточку, то переходим в раздел изучения слов
    4. Если нажимаем на карточке на кнопку редактирования, то переходим в раздел редактирования категории
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
      return;
    };

    if (target.closest('.category__del')) {
      console.log('Удалить');
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