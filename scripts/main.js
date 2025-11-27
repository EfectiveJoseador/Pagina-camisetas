(function () {
  const navToggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('#site-menu');
  const year = document.querySelector('#current-year');
  const faqButtons = document.querySelectorAll('.faq-question');

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  if (navToggle && menu) {
    navToggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  faqButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
      const item = button.closest('.faq-item');
      if (item) {
        item.classList.toggle('open', !expanded);
      }
    });
  });
})();
