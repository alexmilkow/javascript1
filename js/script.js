const BASE_URL = 'https://v2.api.noroff.dev/';
const PRODUCTS_URL = 'square-eyes';
const FULL_PRODUCTS_URL = BASE_URL + PRODUCTS_URL;

async function fetchMovieData() {
    try {
        const response = await fetch(FULL_PRODUCTS_URL);
        const data = await response.json();
        console.log(data);
        
    } catch(error) {
        console.error(error);
    }
};
fetchMovieData();

const productsContainer = document.getElementById('products-container');
