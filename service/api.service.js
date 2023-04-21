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

/* 
  Функция для запроса к серверу на создание новой категории.
  Если запрос выполнен успешно, то возвращает данные категорий.
  Если запрос выполнен с ошибкой, то возвращает объект с ошибкой.
*/
export const fetchCreateCategory = async data => {
  try {
    const response = await fetch(`${ API_URL }/api/category`, {
      method: 'POST',
      body: JSON.stringify(data),
    });

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
  Функция для запроса к серверу на редактирование данных категории по id.
  Если запрос выполнен успешно, то возвращает данные категорий.
  Если запрос выполнен с ошибкой, то возвращает объект с ошибкой.
*/
export const fetchEditCategory = async (data, id) => {
  try {
    const response = await fetch(`${ API_URL }/api/category/${ id }`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });

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
  Функция удаления категории по id.
  Если запрос выполнен успешно, то возвращает данные категорий.
  Если запрос выполнен с ошибкой, то возвращает объект с ошибкой.
*/
export const fetchDeleteCategory = async id => {
  try {
    const response = await fetch(`${ API_URL }/api/category/${ id }`, {
      method: 'DELETE',
    });

    if (!(response.status === 200 || response.status === 201)) {
      const error = await response.json();
      throw error;
    };

    const result = await response.json();
    return result;

  } catch (error) {
    return { error };
  };
};