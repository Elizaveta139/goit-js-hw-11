import Notiflix from 'notiflix';

import { NewsApiServer } from './pixabay-api';

const searchForm = document.querySelector('.search-form');
const buttonSubmit = document.querySelector('.button-submit');
const galleryContainet = document.querySelector('.gallery');

searchForm.addEventListener('submit', onSubmitForm);

const newsApiServer = new NewsApiServer();

let page = 1;

function onSubmitForm(evt) {
  evt.preventDefault();

  newsApiServer.searchQuery = evt.currentTarget.elements.searchQuery.value
    .trim()
    .toLowerCase()
    .split(' ')
    .join('+');
  console.log(newsApiServer.searchQuery);

  newsApiServer.resetPage();
  newsApiServer.fetchImages(searchQuery);
}
