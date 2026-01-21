const BASE_PATH = '/javascript1/';
const BASE_URL = 'https://v2.api.noroff.dev/';
const PRODUCTS_URL = 'square-eyes';
const FULL_PRODUCTS_URL = BASE_URL + PRODUCTS_URL;
const SINGLE_PRODUCT_URL = `${BASE_PATH}products/product.html?id=`;

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
    productTitle.classList.add('product-title');

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


function renderCheckoutCart() {
    const cartContainer = document.getElementById('checkout-cart-items');
    if(!cartContainer) return;

    const productCart = JSON.parse(localStorage.getItem("basket")) || [];
    cartContainer.innerHTML = '';

    let total = 0;

    productCart.forEach(product => {
        const itemTotal = product.price * product.quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-info');

        cartItem.innerHTML = `
        <div class="cart-info-right">
            <h4>${product.title}</h4>
            <div class="quantity-controls">
                <p>$${itemTotal.toFixed(2)}</p>
                <div class="quantity-buttons">
                    <button class="quantity-button decrease" data-id=${product.id}>-</button>
                    <span class="quantity">${product.quantity}</span>
                    <button class="quantity-button increase" data-id=${product.id}>+</button>
                        <i class="fa-solid fa-trash delete" data-id="${product.id}"></i>
                </div>
            </div>
        </div>
        `;

        cartContainer.appendChild(cartItem);
    });

    document.querySelectorAll('.increase').forEach(button => {
        button.addEventListener('click', () => {
            updateQuantity(button.dataset.id, 1);
        });
    });

    document.querySelectorAll('.decrease').forEach(button => {
        button.addEventListener('click', () => {
            updateQuantity(button.dataset.id, -1);
        });
    });

    document.querySelectorAll('.quantity-buttons i.delete').forEach(icon => {
        icon.addEventListener('click', () => {
            const id = icon.dataset.id;
            removeFromCart(id);
        });
    });

    const orderPrice = document.getElementById('order-price');
    const totalPrice = document.getElementById('total-price');

    if(orderPrice) orderPrice.textContent = `$${total.toFixed(2)}`;
    if(totalPrice) totalPrice.textContent = `$${total.toFixed(2)}`;

};
renderCheckoutCart();

const payButton = document.querySelector('.checkout-payment-button');
if(payButton) {
    payButton.addEventListener('click', (event) => {
        event.preventDefault();

        const productCart = JSON.parse(localStorage.getItem("basket")) || [];

        localStorage.setItem("basket", JSON.stringify([]));
        updateBasketCount();

        window.location.href = `${BASE_PATH}checkout/checkout-success.html`;
    });
};


function updateQuantity(productId, change) {
    let productCart = JSON.parse(localStorage.getItem("basket")) || [];
    const product = productCart.find(product => product.id === productId);

    if(!product) return;

    product.quantity += change;

    if(product.quantity < 1) {
        product.quantity = 1;
    };

    localStorage.setItem("basket", JSON.stringify(productCart));
    renderCheckoutCart();
    updateBasketCount();
};

function removeFromCart(productId) {
    let productCart = JSON.parse(localStorage.getItem("basket")) || [];
    productCart = productCart.filter(p => p.id !== productId);

    localStorage.setItem("basket", JSON.stringify(productCart));
    renderCheckoutCart();
    updateBasketCount();
};
