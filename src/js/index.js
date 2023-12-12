// Створи фронтенд частину застосунку пошуку і перегляду зображень за ключовим словом.

import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { NewsApiServer } from './pixabay-api';
import { createMarkup } from './markup';

const searchForm = document.querySelector('.search-form');
const galleryContainer = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');
const loader = document.querySelector('.loader');

searchForm.addEventListener('submit', onSubmitForm);
// btnLoadMore.addEventListener('click', onLoadMore);

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const newsApiServer = new NewsApiServer();
// btnLoadMore.classList.replace('load-more', 'hidden');
loader.classList.replace('loader', 'hidden');

//зчитуємо при сабміті
function onSubmitForm(evt) {
  evt.preventDefault();

  window.scrollTo(0, 0);

  clearPage();

  // window.addEventListener('scroll', infinityScroll);

  // btnLoadMore.classList.replace('load-more', 'hidden');

  newsApiServer.searchQuery = evt.currentTarget.elements.searchQuery.value
    .trim()
    .toLowerCase()
    .split(' ')
    .join('+');
  console.log(newsApiServer.searchQuery);

  if (newsApiServer.searchQuery === '') {
    return Notiflix.Notify.info('Please fill in the search field.');
  }

  fetchPhoto();
  // evt.currentTarget.reset();
}

//фетч картинок і відображення
function fetchPhoto() {
  clearPage();

  newsApiServer
    .fetchImages()
    .then(data => {
      if (data.totalHits === 0) {
        clearPage();
        return Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);

        newsApiServer.totalImgs += data.hits.length;
        console.log('data.hits', newsApiServer.totalImgs);

        appendPhotoMarkup(data);
        pageScrolling();
        lightbox.refresh();

        if (data.totalHits <= newsApiServer.totalImgs) {
          Notiflix.Notify.info(
            "We're sorry, but you've reached the end of search results."
          );
          window.removeEventListener('scroll', infinityScroll);
          loader.classList.replace('loader', 'hidden');
          totalImgs = 0;
          return;
        }

        window.addEventListener('scroll', infinityScroll);

        // newsApiServer.totalImgs += data.hits.length;
        console.log('data.hits', newsApiServer.totalImgs);
        // btnLoadMore.classList.replace('hidden', 'load-more');
      }
    })
    .catch(error => console.log(error.message));
}

//завантаження / перевірка коли користувач дійшов до кінця колекції
// Load More
function onLoadMore() {
  newsApiServer
    .fetchImages()
    .then(data => {
      appendPhotoMarkup(data);
      pageScrolling();
      lightbox.refresh();

      newsApiServer.totalImgs += data.hits.length;
      console.log('data.hits', newsApiServer.totalImgs);

      if (data.totalHits <= newsApiServer.totalImgs) {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        window.removeEventListener('scroll', infinityScroll);
        loader.classList.replace('loader', 'hidden');
        totalImgs = 0;
      }
    })
    .catch(error => console.log(error.message));
}

//додаємо розмітку
function appendPhotoMarkup(data) {
  galleryContainer.insertAdjacentHTML('beforeend', createMarkup(data.hits));
}

//очищення
function clearPage() {
  galleryContainer.innerHTML = '';
  newsApiServer.page = 1;
  newsApiServer.resetPage();
  newsApiServer.totalImgs = 0;
}

//плавне прокручування сторінки
function pageScrolling() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 1.5,
    behavior: 'smooth',
  });
}

// Infinity scroll

function infinityScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 5) {
    onLoadMore();
  }

  loader.classList.replace('hidden', 'loader');
}

////////////////////////
//зчитуємо при сабміті
// async function onSubmitForm(evt) {
//   evt.preventDefault();

//   window.addEventListener('scroll', infinityScroll);

//   clearPage();

//   // btnLoadMore.classList.replace('load-more', 'hidden');

//   newsApiServer.searchQuery = evt.currentTarget.elements.searchQuery.value
//     .trim()
//     .toLowerCase()
//     .split(' ')
//     .join('+');
//   console.log(newsApiServer.searchQuery);

//   if (newsApiServer.searchQuery === '') {
//     return Notiflix.Notify.info('Please fill in the search field.');
//   }

//   // fetchPhoto();
//   // evt.currentTarget.reset();

//   try {
//     const response = await newsApiServer.fetchImages();
//     console.log(response.data.totalHits);
//     const totalPicturs = response.data.totalHits;
//     if (totalPicturs === 0) {
//       clearPage();
//       return Notiflix.Notify.failure(
//         'Sorry, there are no images matching your search query. Please try again.'
//       );
//     } else {
//       Notiflix.Notify.success(`Hooray! We found ${totalPicturs} images.`);

//       // lastPages(data);
//       appendPhotoMarkup(response.data);
//       pageScrolling();
//       lightbox.refresh();

//       newsApiServer.totalImgs += response.data.hits.length;
//       console.log('data.hits', newsApiServer.totalImgs);
//       // btnLoadMore.classList.replace('hidden', 'load-more');
//     }
//   } catch (error) {
//     console.log(error.message);
//   }
// }

// async function onLoadMore() {
//   try {
//     const response = await newsApiServer.fetchImages();

//     newsApiServer.totalImgs += response.data.hits.length;
//     console.log('data.hits', newsApiServer.totalImgs);

//     if (response.data.totalHits <= newsApiServer.totalImgs) {
//       Notiflix.Notify.info(
//         "We're sorry, but you've reached the end of search results."
//       );
//       window.removeEventListener('scroll', infinityScroll);
//       loader.classList.replace('loader', 'hidden');
//       totalImgs = 0;
//     }
//     appendPhotoMarkup(response.data);
//     pageScrolling();
//     lightbox.refresh();
//   } catch (error) {
//     console.log(error.message);
//   }
// }
