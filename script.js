'use strict';



/**
 * add event on multiple elements
 */

const addEventOnElements = function (elem, type, callback) {
  for (let i = 0, len = elem.length; i < len; i++) {
    elem[i].addEventListener(type, callback);
  }
}



/**
 * LOADING
 */

const loadingElement = document.querySelector("[data-loading-container]");

window.addEventListener("load", function () {
  loadingElement.classList.add("loaded");
  document.body.classList.add("loaded");
});



/**
 * MOBILE NAVBAR TOGGLE
 */

const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("active");
}

addEventOnElements(navTogglers, "click", toggleNavbar);

const closeNavbar = function () {
  navbar.classList.remove("active");
  overlay.classList.remove("active");
  document.body.classList.remove("active");
}

addEventOnElements(navbarLinks, "click", closeNavbar);



/**
 * HEADER
 */


// header will be active after scroll 200px of window

const header = document.querySelector("[data-header]");

const headerActive = function () {
  window.scrollY > 200 ? header.classList.add("active")
    : header.classList.remove("active");
}

window.addEventListener("scroll", headerActive);

//sign-in

const signInForm = document.querySelector(".wrapper");

document.querySelector(".signin").onclick = () => {
  signInForm.classList.add("active");
};

document.querySelector(".close-form").onclick = () => {
  signInForm.classList.remove("active");
};

// add to cart

let cart = [];

const updateCartCount = () => {
  const cartCountElement = document.querySelector(".cart-count");
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountElement.textContent = totalQuantity;
};




// Add to cart with quantity
const addToCart = (id) => {
  const existingItem = cart.find(p => p.id === id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    const product = productsData.product.find(p => p.id === id);
    if (product) {
      cart.push({ ...product, quantity: 1 });
    }
  }
  updateCartCount();
  renderCartItems();
  displayProductItems(productsData.product); // <-- Refresh main product UI
};



// Render Cart Items
const renderCartItems = () => {
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p>Your cart is empty 🛒</p>`;
    cartTotalElement.textContent = "0.00";
    document.querySelector(".checkout-btn").style.display = "none";
    return;
  }

  document.querySelector(".checkout-btn").style.display = "block";

  cart.forEach(item => {
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");

    cartItem.innerHTML = `
  <div class="cart-item-grid">
    <div class="product-name">${item.title}</div>
    <div class="quantity-btns">
      <button onclick="changeQuantity(${item.id}, -1)">−</button>
      <span>${item.quantity}</span>
      <button onclick="changeQuantity(${item.id}, 1)">+</button>
    </div>
    <div class="item-cost">₹${item.price * item.quantity}</div>
  </div>
`;

    cartItemsContainer.appendChild(cartItem);
  });

  updateTotal();
};



// Change Quantity
const changeQuantity = (productId, delta) => {
  const item = cart.find(p => p.id === productId);
  if (!item) return;

  item.quantity += delta;

  if (item.quantity <= 0) {
    cart = cart.filter(p => p.id !== productId);
  }

  updateCartCount();
  renderCartItems();
  displayProductItems(productsData.product); // <-- Refresh main product UI
};

// Update Total
const updateTotal = () => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotalElement.textContent = total.toFixed(2);
};





/**
 * SCROLL REVEAL
 */

const revealElements = document.querySelectorAll("[data-reveal]");

const scrollReveal = function () {
  for (let i = 0, len = revealElements.length; i < len; i++) {
    if (revealElements[i].getBoundingClientRect().top < window.innerHeight / 1.2) {
      revealElements[i].classList.add("revealed");
    }
  }
}

window.addEventListener("scroll", scrollReveal);
window.addEventListener("load", scrollReveal);


/* ======== Products Slider =========== */
const swiper = new Swiper(".mySwiper", {
  grabCursor: true,
  slidesPerView: 1,
  spaceBetween: 30,
  pagination: {
    el: ".custom-pagination",
    clickable: true,
  },
  breakpoints: {
    567: {
      slidesPerView: 2,
    },
    996: {
      slidesPerView: 3,
    },
    1200: {
      slidesPerView: 4,
    },
  },
});

/* ========== Fetch the Products =========== */

const getProducts = async () => {
  return productsData.product; // from products-data.js
};



const ProductsWrapper = document.getElementById("products-wrapper");

window.addEventListener("DOMContentLoaded", async function () {
  const products = await getProducts();
  displayProductItems(products);
});

/* ========== Display Products =========== */
const displayProductItems = (items) => {
  let displayProduct = items.map((product) => {
    const cartItem = cart.find((p) => p.id === product.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    return `
      <div class="card">
        <div class="image"><img src=${product.url} alt=""></div>

        <div class="rating">
          ${(() => {
            const fullStars = Math.floor(product.rating);
            const halfStar = product.rating % 1 >= 0.5;
            const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
            let stars = "";

            for (let i = 0; i < fullStars; i++) {
              stars += `<span><i class='bx bxs-star'></i></span>`;
            }
            if (halfStar) {
              stars += `<span><i class='bx bxs-star-half'></i></span>`;
            }
            for (let i = 0; i < emptyStars; i++) {
              stars += `<span><i class='bx bx-star'></i></span>`;
            }

            return stars;
          })()}
        </div>

        <h4>${product.title}</h4>
        <div class="price">
          <span>Price</span><span class="color">₹${product.price}</span>
        </div>

        ${
          quantity > 0
            ? `<div class="quantity-btns">
                <button onclick="changeQuantity(${product.id}, -1)">−</button>
                <span>${quantity}</span>
                <button onclick="changeQuantity(${product.id}, 1)">+</button>
              </div>`
            : `<div class="button btn" onclick="addToCart(${product.id})">Add To Cart</div>`
        }
      </div>
    `;
  });

  displayProduct = displayProduct.join("");
  if (ProductsWrapper) {
    ProductsWrapper.innerHTML = displayProduct;
  }
};


/* ========== Filter Products =========== */
const filters = [...document.querySelectorAll(".filters span")];

filters.forEach((filter) => {
  filters[0].classList.add("active");
  filter.addEventListener("click", async (e) => {
    const id = e.target.getAttribute("data-filter");
    const target = e.target;
    const products = await getProducts();
    filters.forEach((btn) => {
      btn.classList.remove("active");
    });
    target.classList.add("active");

    let menuCategory = products.filter((product) => {
      if (product.category === id) {
        return product;
      }
    });

    if (id === "All") {
      displayProductItems(products);
      swiper.update();
    } else {
  let menuCategory = products.filter((product) => product.category === id);
  displayProductItems(menuCategory);
  swiper.update();
    }
  });
});


function setupScrollDots(scrollContainerSelector, dotsContainerSelector) {
  const container = document.querySelector(scrollContainerSelector);
  const dotsContainer = document.querySelector(dotsContainerSelector);

  if (!container || !dotsContainer) return;

  const cardWidth = container.querySelector('.Rcard, .swiper-slide')?.offsetWidth || 220;
  const totalCards = container.children.length;
  const visibleCards = Math.floor(container.offsetWidth / cardWidth);
  const totalDots = Math.ceil(totalCards / visibleCards);

  dotsContainer.innerHTML = "";
  for (let i = 0; i < totalDots; i++) {
    const dot = document.createElement("span");
    if (i === 0) dot.classList.add("active");
    dotsContainer.appendChild(dot);
  }

  container.addEventListener("scroll", () => {
    const scrollLeft = container.scrollLeft;
    const index = Math.round(scrollLeft / cardWidth);
    const activeDot = Math.floor(index / visibleCards);

    const dots = dotsContainer.querySelectorAll("span");
    dots.forEach((dot, i) => dot.classList.toggle("active", i === activeDot));
  });
}

// Initialize both
window.addEventListener("DOMContentLoaded", () => {
  setupScrollDots(".restaurant-Rcards", ".restaurant-dots");
  setupScrollDots(".swiper-wrapper", ".recipes-dots");
});

const cartSidebar = document.getElementById("cart-sidebar");
const cartBtn = document.querySelector(".cart-btn");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalElement = document.getElementById("cart-total");

cartBtn.addEventListener("click", () => {
  cartSidebar.classList.toggle("active");
  renderCartItems(); // Update the UI every time it's opened
});

document.addEventListener("click", (e) => {
  const isClickInsideCart = cartSidebar.contains(e.target);
  const isCartBtn = e.target.closest(".cart-btn"); // handles whole cart button
  const isQuantityButton = e.target.closest(".quantity-btns"); // handles +/-

  if (!isClickInsideCart && !isCartBtn && !isQuantityButton) {
    cartSidebar.classList.remove("active");
  }
});




