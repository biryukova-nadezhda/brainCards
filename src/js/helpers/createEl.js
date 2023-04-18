export const createEl = (typeEl, options) => {
  const el = document.createElement(typeEl);
  return Object.assign(el, options);
}