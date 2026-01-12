const BASE_URL = 'https://v2.api.noroff.dev/';
const PRODUCTS_URL = 'square-eyes';
const FULL_PRODUCTS_URL = BASE_URL + PRODUCTS_URL;
const SINGLE_PRODUCT_URL = '/products/product.html?id=';

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

    const linkForProductCard = document.createElement('a');
    linkForProductCard.href = SINGLE_PRODUCT_URL + product.id;

    const productCard = document.createElement('div');
     productCard.classList.add('product-card');
     productCard.setAttribute('data-id', product.id);

    const productTitle = document.createElement('h2');
    productTitle.textContent = product.title;

    const productImage = document.createElement('img');
    productImage.src = product.image.url;
    productImage.alt = product.image.alt;
    
    linkForProductCard.appendChild(productCard);
    productCard.appendChild(productTitle);
    productCard.appendChild(productImage);
    container.appendChild(linkForProductCard);
    });
};


// This code only runs if we are on the products/product.html page
if(window.location.pathname.includes('product.html')) {
    async function loadProduct() {
        try {
            const params = new URLSearchParams(window.location.search);
            const productId = params.get('id');

            const response = await fetch(FULL_PRODUCTS_URL + '/' + productId);
            const data = await response.json();

            const productTitle = document.getElementById('product-title');
            productTitle.textContent = data.data.title;

            const productImage = document.getElementById('product-img');
            productImage.src = data.data.image.url;
            productImage.alt = data.data.image.alt;

            const productDescr = document.getElementById('product-descr');
            productDescr.textContent = data.data.description;

            const productRating = document.getElementById('product-rating');
            productRating.textContent = data.data.rating;

            const productGenre = document.getElementById('product-genre');
            productGenre.textContent = data.data.genre;

            const productReleased = document.getElementById('product-released');
            productReleased.textContent = data.data.released;

            const productPrice = document.getElementById('product-price');
            productPrice.textContent = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.data.price);

        } catch(error) {
            console.error('Error fetching product: ', error)

        };
    };
    loadProduct();
};
