import axios from 'axios';

const KEY = '41107033-20f612c52ee0102e5a994dfd8';
const URL = 'https://pixabay.com/api/';

async function fetchImages(q) {
  const searchParams = new URLSearchParams({
    key: KEY,
    q: q,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
  });

  try {
    const response = await axios.get(`${URL}?${searchParams}`);
    return response;
  } catch (error) {
    console.log(error.message);
  }
}

export { fetchImages };
