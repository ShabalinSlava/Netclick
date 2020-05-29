document.addEventListener('DOMContentLoaded', function(){
  const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
  // Получение элементов
  const leftMenu = document.querySelector('.left-menu');
  const hamburger = document.querySelector('.hamburger');
  const tvShowsList = document.querySelector('.tv-shows__list');
  const modal = document.querySelector('.modal');
  const tvShows = document.querySelector('.tv-shows');
  const tvCardImg = document.querySelector('.tv-card__img');
  const modalTitle = document.querySelector('.modal__title');
  const genresList = document.querySelector('.genres-list');
  const rating = document.querySelector('.rating');
  const description = document.querySelector('.description');
  const modalLink = document.querySelector('.modal__link');
  const searchForm = document.querySelector('.search__form');
  const searchFormInput = document.querySelector('.search__form-input');
  const preloader = document.querySelector('.preloader');
  const dropdown = document.querySelectorAll('.dropdown');
  const tvShowsHead = document.querySelector('.tv-shows__head');
  const posterWpapper = document.querySelector('.poster__wrapper');
  const modalContent = document.querySelector('.modal__content');
  const pagination = document.querySelector('.pagination');

  // Создание preloader
  const loading = document.createElement('div');
  loading.className = 'loading';

  class DBService {
    constructor() {
      this.SERVER = 'https://api.themoviedb.org/3';
      this.API_KEY = '7544f507c859cbb303dfd5456dbb2524';
    }
    getData = async (url) => {
      const res = await fetch(url);
      if (res.ok) {
        return res.json();
      } else {
        throw new Error(`Не удалось получить данные по адресу ${url}`)
      }
    }
    // Методы
    getTestData = () => {
      return this.getData('test.json');
    }
    getTestCard = () => {
      return this.getData('card.json');
    }
    getSearchResult = query => {
      this.temp = `${this.SERVER}/search/tv?api_key=${this.API_KEY}&language=ru-RU&query=${query}`;
      return this.getData(this.temp);
    }
    getNextPage = page => {
      return this.getData(this.temp + '&page=' + page);
    }
    getTvShow = id => {
      return this.getData(`${this.SERVER}/tv/${id}?api_key=${this.API_KEY}&language=ru-RU`);
    }
    getTopRated = () => this.getData(`${this.SERVER}/tv/top_rated?api_key=${this.API_KEY}&language=ru-RU`);
    getPopular = () => this.getData(`${this.SERVER}/tv/popular?api_key=${this.API_KEY}&language=ru-RU`);
    getToday = () => this.getData(`${this.SERVER}/tv/airing_today?api_key=${this.API_KEY}&language=ru-RU`);
    getWeek = () => this.getData(`${this.SERVER}/tv/on_the_air?api_key=${this.API_KEY}&language=ru-RU`);
  };

  const dbService = new DBService();

  // Создание карточки
  const renderCard = (responce, target) => {
    tvShowsList.textContent = '';
    if (!responce.total_results) {
      loading.remove();
      tvShowsHead.textContent = 'К сожалению по вашему запросу ничего не найдено...';
      tvShowsHead.style.color = 'red';
      return;
    };

    tvShowsHead.textContent = target ? target.textContent : 'Результат поиска';
    tvShowsHead.style.color = '';

    responce.results.forEach(item => {
      const {
        backdrop_path: backdrop,
        name: title,
        poster_path: poster,
        vote_average: vote,
        id
      } = item;

      const posterImg = poster ? IMG_URL + poster : 'img/no-poster.jpg';
      const backdropImg = backdrop ?  IMG_URL + backdrop : '';
      const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : '';

      const card = document.createElement('li');
      card.idTv = id;
      card.classList.add('tv-shows__item');
      card.innerHTML = `<a href="#" id='${id}' class="tv-card">
      ${voteElem}
      <img class="tv-card__img"
      src="${posterImg}"
      data-backdrop="${backdropImg}" alt="${title}">
      <h4 class="tv-card__head">${title}</h4>
      </a>`;

      loading.remove();
      tvShowsList.append(card);
    });

    pagination.textContent = '';
    if (!target && responce.total_pages > 1) {
      for (let i = 1; i <= responce.total_pages; i++) {
        pagination.innerHTML += `<li><a href='#' class='pages'>${i}</a></li>`;
      }
    }
  };
  // Клик enter в поиске
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = searchFormInput.value.trim();

    if (value) {
      tvShows.append(loading)
      dbService.getSearchResult(value).then(renderCard);
    }

    searchFormInput.value = '';
  });

  // Открытие и закрытие меню
  const closeDropdown = () => {
    dropdown.forEach(item => {
      item.classList.remove('active');
    })
  };

  hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
    closeDropdown();
  });

  // Click вне меню
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.left-menu')) {
      leftMenu.classList.remove('openMenu');
      hamburger.classList.remove('open');
      closeDropdown();
    }
  })
  // Открытие подменю при клике
  leftMenu.addEventListener('click', (event) => {
    event.preventDefault();
    const target = event.target;
    const dropdown = target.closest('.dropdown');
    if (dropdown) {
      dropdown.classList.toggle('active')
      leftMenu.classList.add('openMenu');
      hamburger.classList.add('open');
    }
    // Клик по внутренним меню
    if (target.closest('#top-rated')) {
      tvShows.append(loading)
      dbService.getTopRated().then((responce) => renderCard(responce, target));
    }
    if (target.closest('#popular')) {
      tvShows.append(loading)
      dbService.getPopular().then((responce) => renderCard(responce, target));
    }
    if (target.closest('#week')) {
      tvShows.append(loading)
      dbService.getToday().then((responce) => renderCard(responce, target));
    }
    if (target.closest('#today')) {
      tvShows.append(loading)
      dbService.getWeek().then((responce) => renderCard(responce, target));
    }
    if (target.closest('#search')) {
      tvShowsList.textContent = '';
      tvShowsHead.textContent = '';
    }
  });

  // открытие модального окна
  tvShowsList.addEventListener('click', event => {
    event.preventDefault();
    const target = event.target;
    const card = target.closest('.tv-card');

    if (card) {
      preloader.style.display = 'block';
      dbService.getTvShow(card.id).then(data => {
        if (data.poster_path) {
          tvCardImg.src = IMG_URL + data.poster_path;
          posterWpapper.style.display = '';
          modalContent.style.paddingLeft = '';
        } else {
          posterWpapper.style.display = 'none';
          modalContent.style.paddingLeft = '50px';
        }

        modalTitle.textContent = data.name;
        genresList.textContent = '';

        for (const item of data.genres) {
          genresList.innerHTML += `<li>${item.name}</li>`
        }

        rating.textContent = data.vote_average;
        description.textContent = data.overview;
        modalLink.href = data.homepage;
      })
      .then(() => {
        document.body.style.overflow = 'hidden';
        modal.classList.remove('hide')
      })
      .finally(() => {
        preloader.style.display = '';
      })
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

  pagination.addEventListener('click', (event) => {
    event.preventDefault();
    const target = event.target;
    if (target.classList.contains('pages')) {
      tvShows.append(loading);
      dbService.getNextPage(target.textContent).then(renderCard);
    }
  })
});
