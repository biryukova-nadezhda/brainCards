const API_URL = 'https://cooked-gem-burglar.glitch.me'; // Адрес сервера, к которому образаемся за данными

/* 
  Функция запроса данных о категориях с сервера.
  Если запрос выполнен успешно, то возвращает данные о категориях.
  Если запрос выполнен с ошибкой, то возвращает объект с ошибкой.
*/
export const fetchCategories = async () => {
  try {
    const response = await fetch(`${ API_URL }/api/category`);

    if (!(response.status === 200 || response.status === 201)) {
      const error = await response.json();
      throw error;
    };

    const categories = await response.json();
    return categories;

  } catch (error) {
    return { error };
  };
};

/* 
  Функция запроса данных об отдельной категории с сервера.
  Если запрос выполнен успешно, то возвращает данные о категории.
  Если запрос выполнен с ошибкой, то возвращает объект с ошибкой.
*/
export const fetchCards = async id => {
  try {
    const response = await fetch(`${ API_URL }/api/category/${ id }`);

    if (!(response.status === 200 || response.status === 201)) {
      const error = await response.json();
      throw error;
    };

    const cards = await response.json();
    return cards;

  } catch (error) {
    return { error };
  };
};