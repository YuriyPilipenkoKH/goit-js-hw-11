export { onScroll, onToTop };

const toTopBtn = document.querySelector('.btn-to-top');
const toDownBtn = document.querySelector('.btn-to-bot');

window.addEventListener('scroll', onScroll);
toTopBtn.addEventListener('click', onToTop);
toDownBtn.addEventListener('click', onToDown);

function onScroll() {
  const scrolled = window.pageYOffset;
  const coords = document.documentElement.clientHeight;
console.log('scrolled',scrolled,'coords',coords);


  if (scrolled > coords) {
    toTopBtn.classList.add('btn-to-top--visible');
  }
  if (scrolled < coords) {
    toTopBtn.classList.remove('btn-to-top--visible');
  }
}

function onToTop() {
  if (window.pageYOffset > 0) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function onToDown() {
    
}