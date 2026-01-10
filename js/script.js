const BASE_URL = 'https://v2.api.noroff.dev/';
const PRODUCTS_URL = 'square-eyes';
const FULL_PRODUCTS_URL = BASE_URL + PRODUCTS_URL;

// Fetching all movie titles and movie covers, and filtering on genre
async function fetchMovieData() {
    try {
        const response = await fetch(FULL_PRODUCTS_URL);
        const data = await response.json();

        const productsContainer = document.getElementById('products-container');
        const filterContainer = document.getElementById('filter-container');

        const uniqueGenres = [];

        data.data.forEach(product => {
            if(!uniqueGenres.includes(product.genre)) {
                uniqueGenres.push(product.genre);
            }
        });

        uniqueGenres.unshift('All');

        uniqueGenres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre;
            option.textContent = genre;
            filterContainer.appendChild(option);
        });
        renderMovies(data.data, productsContainer);

        filterContainer.addEventListener('change', function() {
            const selectedGenre = filterContainer.value;
            const moviesToShow = [];

            data.data.forEach(movie => {
                if(selectedGenre === 'All') {
                    moviesToShow.push(movie);
                } else if (movie.genre === selectedGenre) {
                    moviesToShow.push(movie);
                }
            });
            renderMovies(moviesToShow, productsContainer);
        });

    } catch(error) {
        console.error(error);
    }
};
fetchMovieData();


// Render all the movies on the home page
function renderMovies(moviesArray, container) {
    container.innerHTML = '';
    moviesArray.forEach(product => {

    const productCard = document.createElement('div');
     productCard.classList.add('product-card');

    const productTitle = document.createElement('h2');
    productTitle.textContent = product.title;

    const productImage = document.createElement('img');
    productImage.src = product.image.url;
    productImage.alt = product.image.alt;
        
    productCard.appendChild(productTitle);
    productCard.appendChild(productImage);
    container.appendChild(productCard);
    });
};