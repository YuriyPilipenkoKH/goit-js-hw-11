import SimpleLightbox from 'simplelightbox'
import "simplelightbox/dist/simple-lightbox.min.css"
import Notiflix from 'notiflix'
import {fetchCard} from './js/service'
import { lens,addStyle } from './js/markup'


export const refs = {
    form: document.querySelector('.search-form'),
    inputField: document.querySelector('.search-form > input'),
    buttonSubmit: document.querySelector('.search-form > button'),
    buttonMore: document.querySelector('.load-more'),
    galleryList: document.querySelector('.gallery'),
  };
    let perPage = 40;
    let page = 0;
    let currentQuery = ''
    let remained = 0

    refs.inputField.classList.add('field')
    refs.buttonSubmit.classList.add('search-btn')
    refs.buttonSubmit.innerHTML = lens
    addStyle()
    // refs.buttonSubmit.disabled = true


    refs.form.addEventListener('submit', onSearch)
    refs.buttonMore.addEventListener('click', onLoadMoreImg)
    refs.inputField.addEventListener('input', onInputChange)

function onSearch(e) {
    e.preventDefault()
    clearGallery()
    page = 1
    // console.log('page',page);

    refs.inputField.focused = false
    const input = e.currentTarget.elements.searchQuery.value.trim()
    currentQuery = input

    if(input === '' || input.length === 1){
    return Notiflix.Notify.failure('Please enter valid name.')
    }
   
    fetchCard(input, page, perPage)
    .then(({ hits,totalHits }) => {
        console.log('totalHits',totalHits);

        remained =  totalHits - perPage
        console.log('page',page,'remained',remained);

        if (hits.length === 0) {
            Notiflix.Notify.failure(
              'Sorry, there are no images matching your search query. Please try again.'
            );
          } else {

        const maxPage = totalHits / hits.length;
       
        if (maxPage <= page) {
          Notiflix.Notify.failure(
            "We're sorry, but you've reached the end of search results."
          );
          Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
          return createMarkup(hits)
        }
        Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
        refs.buttonMore.classList.remove('is-hidden');

        return createMarkup(hits);
          }
    })
    .catch(error => console.log(error))
    .finally(() => {
      refs.buttonMore.disabled = false;
      refs.buttonSubmit.disabled = true;
    //   refs.form.reset()
    });

}



function onLoadMoreImg(e) {
    refs.buttonMore.disabled = true;
    page +=1
    // console.log('page',page);

fetchCard(currentQuery, page, perPage)
.then(({ hits, totalHits }) => {

    remained =  totalHits - perPage * page
    console.log('page',page,'remained',remained);

  const maxPage = totalHits / perPage;

  if (maxPage <= page) {
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
    refs.buttonMore.classList.add('is-hidden');
  }

  return createMarkup(hits);
})
.catch(error => console.log(error))
.finally(() => {
  refs.buttonMore.disabled = false;
});
}

function onInputChange(e) {
    refs.buttonSubmit.disabled = false;
}


function renderItem(data) {
    const markup = data
    .map(({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
        <a class="gallery-item" href="${largeImageURL}">
        <div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" width="320"     height="214"/>
        <div class="info"><p class="info-item">
        <b>Likes:</b> ${likes}
        </p>
        <p class="info-item">
        <b>Views:</b> ${views}
        </p>
        <p class="info-item">
        <b>Comments:</b> ${comments}
        </p>
        <p class="info-item">
        <b>Downloads:</b> ${downloads}
        </p>
        </div></div></a>
        `

      }).join('')
    return markup;
  }


function createMarkup(data) {
    refs.galleryList.insertAdjacentHTML('beforeend', renderItem(data));
    lightbox.refresh();


    // const { height: cardHeight } = document
    //   .querySelector('.gallery')
    //   .firstElementChild.getBoundingClientRect();

  
  
    // window.scrollBy({
    //   top: cardHeight * 2,
    //   behavior: 'smooth',
    // });
  }

  const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
   
  });

function clearGallery() {
    refs.galleryList.innerHTML = '';
  }

  
 