/* 
  Функция создания DOM-элемента по его типу `typeEl` с заданными свойствами `options`, передаваемыми в виде объекта со свойствами.
*/
export const createEl = (typeEl, options) => {
  const el = document.createElement(typeEl);
  return Object.assign(el, options);
};