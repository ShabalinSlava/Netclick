document.addEventListener('DOMContentLoaded', function(){
  const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
  const API_KEY = '7544f507c859cbb303dfd5456dbb2524';
  // Получение элементов
  const leftMenu = document.querySelector('.left-menu');
  const hamburger = document.querySelector('.hamburger');
  const tvShowsList = document.querySelector('.tv-shows__list');
  const modal = document.querySelector('.modal');


  const DBService = class {
    getData = async (url) => {
      const res = await fetch(url);
      if (res.ok) {
        return res.json();
      } else {
        throw new Error(`Не удалось получить данные по адресу ${url}`)
      }
    }
    getTestData = () => {
      return this.getData('test.json')
    }
  }

  const renderCard = (responce) => {
    tvShowsList.textContent = '';
    responce.results.forEach(item => {
      const {
        backdrop_path: backdrop,
        name: title,
        poster_path: poster,
        vote_average: vote
      } = item;

      const posterImg = poster ? IMG_URL + poster : 'img/no-poster.jpg';
      const backdropImg = '';
      const voteElem = '';

      const card = document.createElement('li');
      card.classList.add('tv-shows__item');
      card.innerHTML = `<a href="#" class="tv-card">
      <span class="tv-card__vote">${vote}</span>
      <img class="tv-card__img"
      src="${posterImg}"
      data-backdrop="${IMG_URL + backdrop}" alt="${title}">
      <h4 class="tv-card__head">${title}</h4>
      </a>`;
      tvShowsList.append(card)
    })
  };
  new DBService().getTestData().then(renderCard);

  // Открытие и закрытие меню
  hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open')
  });

  // Click вне меню
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.left-menu')) {
      leftMenu.classList.remove('openMenu');
      hamburger.classList.remove('open')
    }
  })
  // Открытие подменю при клике
  leftMenu.addEventListener('click', (event) => {
    const target = event.target;
    const dropdown = target.closest('.dropdown');
    if (dropdown) {
      dropdown.classList.toggle('active')
      leftMenu.classList.add('openMenu');
      hamburger.classList.add('open');
    }
  });

  // открытие модального окна
  tvShowsList.addEventListener('click', event => {
    event.preventDefault();
    const target = event.target;
    const card = target.closest('.tv-card');
    if (card) {
      document.body.style.overflow = 'hidden';
      modal.classList.remove('hide')
    }
  });

  // Закрытие
  modal.addEventListener('click', event => {
    if (event.target.closest('.cross') || event.target.classList.contains('modal')) {
      document.body.style.overflow = '';
      modal.classList.add('hide');
    }
  });

  // Смена карточки
  const changeImage = event => {
    const card = event.target.closest('.tv-shows__item');
    if (card) {
      const img = card.querySelector('.tv-card__img');
      if (img.dataset.backdrop) {
        [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src]
      }
    }
  };
  tvShowsList.addEventListener('mouseover', changeImage);
  tvShowsList.addEventListener('mouseout', changeImage);




});
