import { createCategory } from "./js/components/createCategory.js";
import { createHeader } from "./js/components/createHeader.js";
import { createEl } from "./js/helpers/createEl.js";
import { fetchCategories } from "./js/service/api.service.js";

const init = async () => {
  console.log('Work');
  /* Находим элементы на странице */
  const header = document.querySelector('.header');
  const app = document.querySelector('#app');

  const headerObject = createHeader(header);
  const categoryObject = createCategory(app);
  console.log('categoryObject: ', categoryObject);

  const returnIndex = async e => {
    e?.preventDefault();
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
    categoryObject.unmount();
    headerObject.updateHeaderTitle('Новая категория');
  })
}

init(); 