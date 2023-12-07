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

searchForm.addEventListener('submit', onSubmitForm);
btnLoadMore.addEventListener('click', onLoadMore);

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const newsApiServer = new NewsApiServer();
btnLoadMore.classList.add('hidden');

//зчитуємо при сабміті
function onSubmitForm(evt) {
  evt.preventDefault();

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
        btnLoadMore.classList.remove('hidden');
      }

      // //Якщо користувач дійшов до кінця колекції
      // if (this.page < Math.ceil(data.totalHits / perPage)) {
      //   Notiflix.Notify.info(
      //     "We're sorry, but you've reached the end of search results."
      //   );
      //   btnLoadMore.classList.add('hidden');
      // }
    })
    .catch(error => error.message);
}

// function checkObserver() {
//   if (!newsApiServer.numberOfPage()) {
//     Notiflix.Notify.info(
//       "We're sorry, but you've reached the end of search results."
//     );
//     btnLoadMore.classList.add('hidden');
//   }
// }

//по кліку на Load More
function onLoadMore() {
  newsApiServer.fetchImages().then(appendPhotoMarkup);
}

//додаємо розмітку
function appendPhotoMarkup(data) {
  galleryContainer.insertAdjacentHTML('beforeend', createMarkup(data.hits));
}
