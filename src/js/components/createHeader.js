import { createEl } from "../helpers/createEl.js";

export const createHeader = (parent) => {
  const container = createEl('div', {
    className: 'container header__container'
  });

  const link = createEl('a', {
    href: '#',
    className: 'header__logo-link'
  });

  const logo = createEl('img', {
    src: './img/logo.svg',
    alt: 'Логотип сервиса Brain Cards',
    className: 'header__logo'
  });
  link.append(logo);

  const title = createEl('h2', {
    className: 'header__subtitle',
    textContent: 'Категории'
  });
  
  const btn = createEl('button', {
    type: 'button',
    className: 'header__btn',
    textContent: 'Добавить категорию'
  });

  container.append(link, title, btn);
  parent.append(container);

  const updateHeaderTitle = headerTitle => {
    title.textContent = headerTitle;
  }

  return {
    headerLogoLink: link,
    headerBtn: btn,
    updateHeaderTitle
  }
}