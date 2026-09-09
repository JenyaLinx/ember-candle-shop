/*=============== NAVIGATION ===============*/
const navMenu = document.getElementById("js-nav-menu");
const navToggle = document.getElementById("js-nav-toggle");
const navClose = document.getElementById("js-nav-close");
const navLinks = document.querySelectorAll(".nav__link");

const openMenu = () => {
  navMenu?.classList.add("show-menu");
  document.body.classList.add("no-scroll");
};

const closeMenu = () => {
  navMenu?.classList.remove("show-menu");
  document.body.classList.remove("no-scroll");
};

navToggle?.addEventListener("click", openMenu);
navClose?.addEventListener("click", closeMenu);

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

/*=============== ACTIVE LINK ===============*/
const sections = document.querySelectorAll("section[id]");

const updateActiveLink = () => {
  const scrollY = window.scrollY;

  sections.forEach((section) => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 120;
    const sectionId = section.getAttribute("id");

    const currentLink = document.querySelector(
      `.nav__link[href="#${sectionId}"]`,
    );

    if (
      scrollY > sectionTop &&
      scrollY <= sectionTop + sectionHeight
    ) {
      navLinks.forEach((link) => {
        link.classList.remove("active-link");
      });

      currentLink?.classList.add("active-link");
    }
  });
};

window.addEventListener("scroll", updateActiveLink);

/*=============== CART ELEMENTS ===============*/
const cart = document.getElementById("js-cart");
const cartOverlay = document.getElementById("js-cart-overlay");
const cartOpen = document.getElementById("js-cart-open");
const cartClose = document.getElementById("js-cart-close");

const cartContent = document.getElementById("js-cart-content");
const cartCount = document.getElementById("js-cart-count");
const cartTotal = document.getElementById("js-cart-total");

const checkoutOpen = document.getElementById(
  "js-checkout-open",
);

const addToCartButtons = document.querySelectorAll(
  ".js-add-to-cart",
);

let cartItems = [];

/*=============== OPEN / CLOSE CART ===============*/
const openCart = () => {
  cart?.classList.add("show-cart");
  cartOverlay?.classList.add("show-overlay");

  document.body.classList.add("no-scroll");
};

const closeCart = () => {
  cart?.classList.remove("show-cart");
  cartOverlay?.classList.remove("show-overlay");

  document.body.classList.remove("no-scroll");
};

cartOpen?.addEventListener("click", openCart);
cartClose?.addEventListener("click", closeCart);
cartOverlay?.addEventListener("click", closeCart);

/*=============== FORMAT PRICE ===============*/
const formatPrice = (price) => {
  return `£${price.toFixed(2)}`;
};

/*=============== UPDATE CART ===============*/
const updateCart = () => {
  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  cartCount.textContent = totalQuantity;
  cartTotal.textContent = formatPrice(totalPrice);

  if (cartItems.length === 0) {
    cartContent.innerHTML = `
      <div class="cart__empty" id="js-cart-empty">
        <i class="ri-shopping-bag-4-line"></i>

        <h3>Your cart is empty</h3>

        <p>Add something beautiful.</p>
      </div>
    `;

    return;
  }

  cartContent.innerHTML = cartItems
    .map(
      (item) => `
        <article class="cart__item" data-id="${item.id}">
          <div class="cart__item-img">
            <img
              src="${item.image}"
              alt="${item.title}"
            />
          </div>

          <div>
            <h3 class="cart__item-title">
              ${item.title}
            </h3>

            <span class="cart__item-price">
              ${formatPrice(item.price)}
            </span>

            <div class="cart__quantity">
              <button
                type="button"
                data-action="decrease"
                aria-label="Decrease quantity"
              >
                <i class="ri-subtract-line"></i>
              </button>

              <span>${item.quantity}</span>

              <button
                type="button"
                data-action="increase"
                aria-label="Increase quantity"
              >
                <i class="ri-add-line"></i>
              </button>
            </div>
          </div>

          <button
            class="cart__remove"
            type="button"
            data-action="remove"
            aria-label="Remove item"
          >
            <i class="ri-delete-bin-6-line"></i>
          </button>
        </article>
      `,
    )
    .join("");
};

/*=============== ADD TO CART ===============*/
addToCartButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    const title = button.dataset.title;
    const price = Number(button.dataset.price);
    const image = button.dataset.image;

    const productId = `${title}-${index}`;

    const existingItem = cartItems.find(
      (item) => item.id === productId,
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.push({
        id: productId,
        title,
        price,
        image,
        quantity: 1,
      });
    }

    const icon = button.querySelector("i");

    button.classList.add("added");

    if (icon) {
      icon.className = "ri-check-line";
    }

    setTimeout(() => {
      button.classList.remove("added");

      if (icon) {
        icon.className = "ri-shopping-bag-4-line";
      }
    }, 900);

    updateCart();
  });
});

/*=============== CART ACTIONS ===============*/
cartContent?.addEventListener("click", (event) => {
  const button = event.target.closest("button");

  if (!button) return;

  const cartItem = button.closest(".cart__item");

  if (!cartItem) return;

  const itemId = cartItem.dataset.id;
  const action = button.dataset.action;

  const item = cartItems.find(
    (cartItem) => cartItem.id === itemId,
  );

  if (!item) return;

  if (action === "increase") {
    item.quantity += 1;
  }

  if (action === "decrease") {
    item.quantity -= 1;

    if (item.quantity <= 0) {
      cartItems = cartItems.filter(
        (cartItem) => cartItem.id !== itemId,
      );
    }
  }

  if (action === "remove") {
    cartItems = cartItems.filter(
      (cartItem) => cartItem.id !== itemId,
    );
  }

  updateCart();
});

/*=============== CHECKOUT ===============*/
const checkoutModal = document.getElementById(
  "js-checkout-modal",
);

const checkoutOverlay = document.getElementById(
  "js-checkout-overlay",
);

const checkoutClose = document.getElementById(
  "js-checkout-close",
);

const checkoutForm = document.getElementById(
  "js-checkout-form",
);

const checkoutFormContent = document.getElementById(
  "js-checkout-form-content",
);

const checkoutSuccess = document.getElementById(
  "js-checkout-success",
);

const checkoutFinish = document.getElementById(
  "js-checkout-finish",
);

/*=============== OPEN CHECKOUT ===============*/
const openCheckout = () => {
  if (cartItems.length === 0) return;

  closeCart();

  checkoutModal?.classList.add("show-checkout");
  checkoutOverlay?.classList.add("show-overlay");

  checkoutModal?.setAttribute(
    "aria-hidden",
    "false",
  );

  document.body.classList.add("no-scroll");
};

/*=============== CLOSE CHECKOUT ===============*/
const closeCheckout = () => {
  checkoutModal?.classList.remove("show-checkout");
  checkoutOverlay?.classList.remove("show-overlay");

  checkoutModal?.setAttribute(
    "aria-hidden",
    "true",
  );

  document.body.classList.remove("no-scroll");
};

checkoutOpen?.addEventListener("click", openCheckout);

checkoutClose?.addEventListener(
  "click",
  closeCheckout,
);

checkoutOverlay?.addEventListener(
  "click",
  closeCheckout,
);

/*=============== PLACE ORDER ===============*/
checkoutForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!checkoutForm.checkValidity()) {
    checkoutForm.reportValidity();
    return;
  }

  /*
    Telegram integration will be added later.

    At that stage we will send:
    - Name
    - Phone
    - Email
    - Address
    - Order items
    - Quantities
    - Total
  */

  checkoutFormContent.style.display = "none";

  checkoutSuccess?.classList.add("show-success");

  cartItems = [];

  updateCart();

  checkoutForm.reset();
});

/*=============== FINISH CHECKOUT ===============*/
checkoutFinish?.addEventListener("click", () => {
  closeCheckout();

  checkoutSuccess?.classList.remove(
    "show-success",
  );

  checkoutFormContent.style.display = "block";

  document
    .getElementById("shop")
    ?.scrollIntoView({
      behavior: "smooth",
    });
});

/*=============== ESC KEY ===============*/
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  closeMenu();

  if (cart?.classList.contains("show-cart")) {
    closeCart();
  }

  if (
    checkoutModal?.classList.contains(
      "show-checkout",
    )
  ) {
    closeCheckout();
  }
});

/*=============== INITIAL STATE ===============*/
updateCart();