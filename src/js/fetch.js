import axios from "axios";
export { fetchImages };

// axios.defaults.baseURL = 'https://pixabay.com/api/';
const KEY = '34491623-5c4ef369d6c59f62bc483440c';
const BASE_URL = 'https://pixabay.com/api';

async function fetchImages(query, page, perPage) {
  try {
    const response = await axios.get(
  `${BASE_URL}/?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`,
);
return response;
  } catch (error) {
      console.error(error);
      throw Error(response.statusText)
    
  }
}


