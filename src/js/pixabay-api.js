import axios from 'axios';

const KEY = '41107033-20f612c52ee0102e5a994dfd8';
const URL = 'https://pixabay.com/api/';

export class NewsApiServer {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
    // this.totalImages = 0;
  }

  async fetchImages() {
    // console.log(this);
    try {
      const response = await axios.get(
        `${URL}?key=${KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.per_page}&page=${this.page}`
      );
      this.incrementPage();

      console.log('response.data', response.data);
      return response.data;
    } catch (error) {
      console.log(error.message);
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  // setTotalImages(total) {
  //   this.totalImages += total;
  // }

  // numberOfPage() {
  //   return this.page < Math.ceil(this.totalImages / this.per_page);
  // }
}

// page=${page}&per_page=${perPage}
// async function fetchImages(q) {
//   try {
//     const response = await axios.get(
//       `${URL}?key=${KEY}&q=${q}&page=${page}&per_page=${perPage}&image_type=photo&orientation=horizontal&safesearch=true`
//     );
//     return response;
//   } catch (error) {
//     console.log(error.message);
//   }

// const searchParams = new URLSearchParams({
//   key: KEY,
//   q: q,
//   image_type: 'photo',
//   orientation: 'horizontal',
//   safesearch: 'true',
// });
// try {
//   const response = await axios.get(URL, {
//     params: {
//       key: KEY,
//       q: q,
//       image_type: 'photo',
//       orientation: 'horizontal',
//       safesearch: 'true',
//       page: '1',
//       per_page: '40',
//     },
//   });
//   return response;
// } catch (error) {
//   console.log(error.message);
// }

// try {
//   const response = await axios.get(`${URL}?${searchParams}`);
//   return response;
// } catch (error) {
//   console.log(error.message);
// }
// }

// export { fetchImages };
