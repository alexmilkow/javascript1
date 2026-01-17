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

            const addToBasketButton = document.getElementById('add-to-basket');
            addToBasketButton.textContent = 'Add to basket';

            const removeFromBasketButton = document.getElementById('remove-from-basket');
            removeFromBasketButton.textContent = 'Remove from basket';


            addToBasketButton.addEventListener('click', () => {
                const { productCart, product } = getCartAndProduct(data.data.id);

                if(product) {
                    product.quantity += 1;
                } else {
                    productCart.push({
                        id: data.data.id,
                        title: data.data.title,
                        price: data.data.price,
                        quantity: 1
                    });
                };

                localStorage.setItem("basket", JSON.stringify(productCart));
                updateBasketCount();
            });

            removeFromBasketButton.addEventListener('click', () => {
                const { productCart, product } = getCartAndProduct(data.data.id);

                if(!product) return;
                product.quantity -= 1;

                if(product.quantity === 0) {
                    const updatedCart = productCart.filter(product => product.id !== data.data.id);
                    localStorage.setItem("basket", JSON.stringify(updatedCart));
                } else {
                localStorage.setItem("basket", JSON.stringify(productCart));
                }

                updateBasketCount();
            });

                updateBasketCount();

        } catch(error) {
            console.error('Error fetching product: ', error)

        };

    };
    loadProduct();
};

//Helper function to prevent duplication of code, used in add to basket and remove from basket
function getCartAndProduct(productId) {
    let productCart = JSON.parse(localStorage.getItem("basket")) || [];
    let product = productCart.find(product => product.id === productId);

    return { productCart, product };
};

//Updates the count on the basket icon
function updateBasketCount() {
    const basketCountElement = document.getElementById('basket-count');

    let productCart = JSON.parse(localStorage.getItem("basket")) || [];
    let totalQuantity = productCart.reduce((sum, product) => sum + product.quantity, 0);

    if(!basketCountElement) return;

    if(totalQuantity === 0 ) {
        basketCountElement.style.display = "none";
    } else {
        basketCountElement.style.display = "inline-block";
        basketCountElement.textContent = totalQuantity;
    }
};
updateBasketCount();