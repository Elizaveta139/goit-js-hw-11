import Notiflix from 'notiflix';
import { fetchImages } from './pixabay-api';

const searchForm = document.querySelector('.search-form');
const buttonSubmit = document.querySelector('.button-submit');
const galleryContainet = document.querySelector('.gallery');

searchForm.addEventListener('submit', onSubmitForm);

let page = 1;
let searchQuery = '';
const perPage = 40;

function onSubmitForm(evt) {
  evt.preventDefault();

  console.log(evt.currentTarget.elements);
}
