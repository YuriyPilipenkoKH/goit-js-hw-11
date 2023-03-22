
import { fetchImages } from './js/fetch';
import { renderGallery } from './js/render';
import { onScroll, onToTop } from './js/scroll';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';

import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('#search-form');
const inputField = document.querySelector('.search-form > input');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.btn-load-more');

const refs = {
    form: document.querySelector('.search-form'),
    inputField: document.querySelector('.search-form > input'),
    buttonSubmit: document.querySelector('.search-form > button'),
    loadMore: document.querySelector('.btn-load-more'),
    galleryList: document.querySelector('.gallery'),
};

refs.buttonSubmit.classList.add('search-btn')


const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });

let query = '';
let page = 1;
const perPage = 40;

refs.form.addEventListener('submit', onSearchForm);
refs.loadMore.addEventListener('click', onLoadMoreBtn);
refs.inputField.addEventListener('input', onInputChange);

onScroll();
onToTop();

function onSearchForm(e) {
  e.preventDefault();
  window.scrollTo({ top: 0 });
  page = 1;
  query = e.currentTarget.searchQuery.value.trim();
  refs.galleryList.innerHTML = '';
  refs.loadMore.classList.add('is-hidden');

  if (query === '') {
    Notiflix.Notify.failure('The search string cannot be empty. Please specify your search query.');
    return;
  }

  fetchImages(query, page, perPage)
    .then(({ data }) => {
      if (data.totalHits === 0) {
        Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.',
          );
      } else {
        renderGallery(data.hits);
        lightbox.refresh();
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        refs.buttonSubmit.disabled = true;

        if (data.totalHits > perPage) {
            refs.loadMore.classList.remove('is-hidden');
        }
      }
    })
    .catch(error => console.log(error))
    .finally(() => {
    //   refs.form.reset();
    });
}

function onLoadMoreBtn() {
  page += 1;

  fetchImages(query, page, perPage)
    .then(({ data }) => {
      renderGallery(data.hits);
      lightbox.refresh();

      const totalPages = Math.ceil(data.totalHits / perPage);

      if (page > totalPages) {
        refs.loadMore.classList.add('is-hidden');
        Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
      }
    })
    .catch(error => console.log(error));
}

function onInputChange(e) {
     refs.buttonSubmit.disabled = false;
}