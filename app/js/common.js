document.addEventListener('DOMContentLoaded', function(){
    // Menu
    const leftMenu = document.querySelector('.left-menu');
    const hamburger = document.querySelector('.hamburger');

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

  });
