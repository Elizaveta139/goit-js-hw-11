// Створи фронтенд частину застосунку пошуку і перегляду зображень за ключовим словом.

import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { NewsApiServer } from './pixabay-api';
import { createMarkup } from './markup';

const searchForm = document.querySelector('.search-form');
const buttonSubmit = document.querySelector('.button-submit');
const galleryContainer = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');
const guard = document.querySelector('.js-guard');

searchForm.addEventListener('submit', onSubmitForm);
// btnLoadMore.addEventListener('click', onLoadMore);

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const newsApiServer = new NewsApiServer();
// btnLoadMore.classList.replace('load-more', 'hidden');

//зчитуємо при сабміті
function onSubmitForm(evt) {
  evt.preventDefault();

  galleryContainer.innerHTML = '';

  window.addEventListener('scroll', infinityScroll);

  // btnLoadMore.classList.replace('load-more', 'hidden');

  newsApiServer.searchQuery = evt.currentTarget.elements.searchQuery.value
    .trim()
    .toLowerCase()
    .split(' ')
    .join('+');
  console.log(newsApiServer.searchQuery);

  newsApiServer.resetPage();
  newsApiServer.page = 1;

  if (newsApiServer.searchQuery === '') {
    return Notiflix.Notify.info('Please fill in the search field.');
  }

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
        // btnLoadMore.classList.replace('hidden', 'load-more');
      }
    })
    .catch(error => console.log(error.message));
}

//перевірка коли користувач дійшов до кінця колекції
function lastPages(data) {
  const lastPage = Math.ceil(data.totalHits / newsApiServer.per_page);
  console.log('last', lastPage);

  if (lastPage === newsApiServer.page) {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
    window.removeEventListener('scroll', infinityScroll);
    return;
  }

  appendPhotoMarkup(data);
  pageScrolling();
  lightbox.refresh();

  console.log('p', newsApiServer.page);
}

// Load More
function onLoadMore() {
  newsApiServer
    .fetchImages()
    .then(data => {
      lastPages(data);
    })
    .catch(error =>
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      )
    );
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

// Infinity scroll

function infinityScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 5) {
    onLoadMore();
  }
}
