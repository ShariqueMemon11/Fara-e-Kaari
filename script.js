function openOrderForm(product) {
    alert("Order placed for: " + product + "\nWe will contact you shortly.");
}

// Custom Order Modal Logic
const customForm = document.querySelector('.custom-form');
const modal = document.getElementById('orderModal');
const closeModal = document.getElementById('closeModal');

if (customForm && modal && closeModal) {
    customForm.addEventListener('submit', function(e) {
        e.preventDefault();
        modal.style.display = 'flex';
        customForm.reset();
    });

    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// ---- MODERN CART SYSTEM ---- //

const CART_KEY = 'fek_cart_v1';
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cartModal');
const cartClose = document.getElementById('cartClose');
const cartItemsDiv = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const checkoutForm = document.getElementById('checkout-form');

// Cart State
let cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');

function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
function updateCartBadge() {
    let qty = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCount.textContent = qty;
}
function renderCart() {
    cartItemsDiv.innerHTML = '';
    if (!cart.length) {
        cartItemsDiv.innerHTML = '<p style="color:#698968">Your cart is empty.</p>';
        cartTotal.textContent = 'Rs. 0';
        return;
    }
    let total = 0;
    cart.forEach((item, idx) => {
        total += item.qty * item.price;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <span class="cart-item-name">${item.name}</span>
            <span class="cart-item-qty">
                <button data-act="decr" data-idx="${idx}">-</button>
                <span>${item.qty}</span>
                <button data-act="incr" data-idx="${idx}">+</button>
            </span>
            <span>Rs. ${item.price * item.qty}</span>
            <button class="cart-item-remove" data-act="rmv" data-idx="${idx}" title="Remove">🗑️</button>
        `;
        cartItemsDiv.appendChild(div);
    });
    cartTotal.textContent = `Rs. ${total}`;
}
function addToCart(id, name, price) {
    id = String(id);
    let ex = cart.find(item => item.id === id);
    if (ex) {
        ex.qty++;
    } else {
        cart.push({ id, name, price, qty: 1 });
    }
    saveCart();
    updateCartBadge();
    renderCart();
}
function handleCartActions(e) {
    let btn = e.target.closest('button');
    if (!btn) return;
    let act = btn.dataset.act, idx = Number(btn.dataset.idx);
    if (act === 'incr') {
        cart[idx].qty++;
    } else if (act === 'decr') {
        if (cart[idx].qty > 1) cart[idx].qty--;
    } else if (act === 'rmv') {
        cart.splice(idx, 1);
    }
    saveCart();
    updateCartBadge();
    renderCart();
}
// Show cart modal
cartBtn.addEventListener('click', () => {
    cartModal.classList.add('show');
    renderCart();
});
// Hide cart modal
cartClose.addEventListener('click', () => {
    cartModal.classList.remove('show');
});
window.addEventListener('click', function(event) {
    if (event.target === cartModal) {
        cartModal.classList.remove('show');
    }
});
cartItemsDiv.addEventListener('click', handleCartActions);

// --- SVG CART ICON ---
const cartSVG = `
<svg width="28" height="24" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="0.7" y="5.3" width="25.6" height="15" rx="3.7" stroke="#1da94a" stroke-width="1.4" fill="#fff"/>
  <ellipse cx="7.8" cy="20.4" rx="2.1" ry="2.1" fill="#25a244"/>
  <ellipse cx="19.5" cy="20.4" rx="2.1" ry="2.1" fill="#25a244"/>
  <path d="M2.3 7.1 L4.4 14.7 H21.5" stroke="#17b856" stroke-width="1.3" stroke-linecap="round"/>
  <path d="M10 13h6.2" stroke="#0b6623" stroke-width="1.2" stroke-linecap="round"/>
</svg>`;
const svgCart = document.getElementById('svg-cart');
if(svgCart) svgCart.innerHTML = cartSVG;

// Add to Cart Animation Feedback
const cartAddAnim = document.getElementById('cart-add-animation');
function showAddToCartAnimation() {
  if (!cartAddAnim) return;
  cartAddAnim.textContent = 'Added to Cart!';
  cartAddAnim.classList.remove('show');
  // trigger reflow so the animation will play again if called twice in a row
  void cartAddAnim.offsetWidth;
  cartAddAnim.classList.add('show');
  setTimeout(() => cartAddAnim.classList.remove('show'), 700);
}
// Bind all Add to Cart buttons
[...document.querySelectorAll('.add-to-cart')].forEach(btn => {
    btn.addEventListener('click', () => {
        showAddToCartAnimation();
        const id = btn.dataset.id, name = btn.dataset.name, price = Number(btn.dataset.price);
        addToCart(id, name, price);
    });
});
// initial badge
updateCartBadge();

// Cart button show/hide for modal open state
const cartBtnContainer = document.querySelector('.cart-btn-container');
function hideCartBtnContainer(){
    if(cartBtnContainer) cartBtnContainer.style.display = 'none';
}
function showCartBtnContainer(){
    if(cartBtnContainer) cartBtnContainer.style.display = '';
}
// extend modal show/hide logic
cartBtn.addEventListener('click', () => {
    cartModal.classList.add('show');
    renderCart();
    hideCartBtnContainer();
});
cartClose.addEventListener('click', () => {
    cartModal.classList.remove('show');
    showCartBtnContainer();
});
window.addEventListener('click', function(event) {
    if (event.target === cartModal) {
        cartModal.classList.remove('show');
        showCartBtnContainer();
    }
});

// -- Checkout -- //
checkoutForm.addEventListener('submit', function(e){
    e.preventDefault();
    if (!cart.length) return;
    // simulate checkout, show confirmation popup
    cart = [];
    saveCart();
    updateCartBadge();
    renderCart();
    cartModal.classList.remove('show');
    // show thank you modal
    showOrderPopup('Thank you!', 'Your order has been placed. We will contact you soon!');
    checkoutForm.reset();
});
// Show order confirmation popup (reuse modal)
function showOrderPopup(title, msg){
    const orderModal = document.getElementById('orderModal');
    const modalContent = orderModal.querySelector('.modal-content');
    modalContent.querySelector('h2').textContent = title;
    modalContent.querySelector('p').textContent = msg;
    orderModal.style.display = 'flex';
}