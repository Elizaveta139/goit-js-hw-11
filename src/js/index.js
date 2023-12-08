// Створи фронтенд частину застосунку пошуку і перегляду зображень за ключовим словом.

import Notiflix from 'notiflix';
import InfiniteScroll from 'infinite-scroll';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { NewsApiServer } from './pixabay-api';
import { createMarkup } from './markup';

const searchForm = document.querySelector('.search-form');
const buttonSubmit = document.querySelector('.button-submit');
const galleryContainer = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');

searchForm.addEventListener('submit', onSubmitForm);
btnLoadMore.addEventListener('click', onLoadMore);

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

// let infScroll = new InfiniteScroll(galleryContainer, {
//   // options
//   path: '.pagination__next',
//   append: '.post',
//   history: false,
// });

const newsApiServer = new NewsApiServer();
btnLoadMore.classList.replace('load-more', 'hidden');

//зчитуємо при сабміті
function onSubmitForm(evt) {
  evt.preventDefault();

  btnLoadMore.classList.replace('load-more', 'hidden');
  galleryContainer.innerHTML = '';

  newsApiServer.searchQuery = evt.currentTarget.elements.searchQuery.value
    .trim()
    .toLowerCase()
    .split(' ')
    .join('+');
  console.log(newsApiServer.searchQuery);

  if (newsApiServer.searchQuery === '') {
    return Notiflix.Notify.info('Please fill in the search field.');
  }

  newsApiServer.resetPage();
  fetchPhoto();
}

//фетч картинок і відображення
function fetchPhoto() {
  newsApiServer
    .fetchImages()
    .then(data => {
      if (data.totalHits === 0) {
        return Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        appendPhotoMarkup(data);

        lightbox.refresh();
        btnLoadMore.classList.replace('hidden', 'load-more');
      }

      //Якщо користувач дійшов до кінця колекції
      if (data.totalHits <= galleryContainer.children.length) {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        btnLoadMore.classList.replace('load-more', 'hidden');
      }
    })
    .catch(error => error.message);
}

//по кліку на Load More
function onLoadMore() {
  newsApiServer.fetchImages().then(data => {
    appendPhotoMarkup(data);
    pageScrolling();
  });
}

//додаємо розмітку
function appendPhotoMarkup(data) {
  galleryContainer.insertAdjacentHTML('beforeend', createMarkup(data.hits));
}

//плавне прокручування сторінки
function pageScrolling() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
