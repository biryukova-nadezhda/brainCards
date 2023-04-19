import { createCategory } from "./js/components/createCategory.js";
import { createEditCategory } from "./js/components/createEditCategory.js";
import { createHeader } from "./js/components/createHeader.js";
import { createEl } from "./js/helpers/createEl.js";
import { fetchCards, fetchCategories } from "./js/service/api.service.js";

const init = async () => {
  console.log('Work');
  /* Находим элементы на странице */
  const header = document.querySelector('.header');
  const app = document.querySelector('#app');

  const headerObject = createHeader(header);
  const categoryObject = createCategory(app);
  const editCategoryObject = createEditCategory(app);

  /* Функция размонтирования секций */
  const allSectionUnMount = () => {
    [categoryObject, editCategoryObject].forEach(obj => obj.unmount());
  }

  const returnIndex = async e => {
    e?.preventDefault();
    allSectionUnMount();

    /* Получаем категории с сервера и сразу обрабатываем ошибку */
    const categories = await fetchCategories();
    if (categories.error) {
      app.append(createEl('p', {
        className: 'server-error',
        textContent: 'Ошибка сервера, попробуйте зайти позже'
      }));
      return;
    };
    console.log('categories: ', categories);
    categoryObject.mount(categories);
  };

  returnIndex();

  /* Добавляем обработчики событий клика на заголовок и кнопку header */
  headerObject.headerLogoLink.addEventListener('click', returnIndex);
  headerObject.headerBtn.addEventListener('click', () => {
    allSectionUnMount();
    headerObject.updateHeaderTitle('Новая категория');
    editCategoryObject.mount();
  });

  /* Вешаем слушатель события клика по карточке с категориями. 
  1. Определяем на какую именно карточку кликнули
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
    }
  });
};

init(); 