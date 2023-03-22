import axios from "axios";
export { fetchImages };

axios.defaults.baseURL = 'https://pixabay.com/api/';
const KEY = '34491623-5c4ef369d6c59f62bc483440c';

async function fetchImages(query, page, perPage) {
  const response = await axios.get(
    `?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`,
  );
  return response;
}


