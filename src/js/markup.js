export function createMarkup(searchData) {
  return searchData
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
          <a class="galery-link" href="${largeImageURL}">
            <img class="gallery__image" src="${webformatURL}" alt="${tags}" width=300 loading="lazy" />
          </a>
          <div class="info">
            <p class="info-item">
              <b>Likes: <br> ${likes}</b>
            </p>
            <p class="info-item">
              <b>Views: <br> ${views}</b>
            </p>
            <p class="info-item">
              <b>Comments: <br> ${comments}</b>
            </p>
            <p class="info-item">
              <b>Downloads: <br> ${downloads}</b>
            </p>
          </div>
        </div>`;
      }
    )
    .join('');
}
