const products = [
  {
    id: 1,
    name: 'Fresh Apples',
    price: 129,
    description: 'Crisp and juicy apples packed with natural sweetness.',
    image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 2,
    name: 'Organic Spinach',
    price: 89,
    description: 'Fresh green spinach for smoothies, salads, and cooking.',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 3,
    name: 'Farm Eggs',
    price: 96,
    description: 'Protein-rich eggs from trusted local farms.',
    image: 'https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 4,
    name: 'Whole Wheat Bread',
    price: 70,
    description: 'Soft, fresh, and ideal for daily breakfasts.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 5,
    name: 'Tomato Pack',
    price: 120,
    description: 'Fresh and juicy tomatoes for curries and salads.',
    image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 6,
    name: 'Banana Bunch',
    price: 80,
    description: 'Naturally sweet bananas for breakfast and snacks.',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 7,
    name: 'Milk Pack',
    price: 56,
    description: 'Fresh dairy milk for tea, coffee, and cooking.',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 8,
    name: 'Rice 5kg',
    price: 350,
    description: 'Premium quality rice for daily family meals.',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=80'
  }
];

const productGrid = document.getElementById('productGrid');
const cartButton = document.getElementById('cartButton');
const cartBadge = document.getElementById('cartBadge');
const cartItems = document.getElementById('cartItems');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const closeCart = document.getElementById('closeCart');
const cartDrawerItems = document.getElementById('cartDrawerItems');
const drawerItemCount = document.getElementById('drawerItemCount');
const drawerSubtotal = document.getElementById('drawerSubtotal');
const drawerTotal = document.getElementById('drawerTotal');
const subtotalElement = document.getElementById('subtotal');
const totalElement = document.getElementById('total');
const checkoutBtn = document.getElementById('checkoutBtn');
const finalCheckoutBtn = document.getElementById('finalCheckoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const closeModal = document.getElementById('closeModal');
const checkoutForm = document.getElementById('checkoutForm');
const orderSuccess = document.getElementById('orderSuccess');
const successMessage = document.getElementById('successMessage');
const modalItemCount = document.getElementById('modalItemCount');
const modalSubtotal = document.getElementById('modalSubtotal');
const modalTotal = document.getElementById('modalTotal');

const STORAGE_KEY = 'freshBasketCart';
let cart = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

function saveCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function getCartProducts() {
  const productMap = new Map(products.map(product => [product.id, product]));
  return cart
    .map(item => ({ ...productMap.get(item.id), quantity: item.quantity }))
    .filter(Boolean);
}

function getTotals() {
  const cartProducts = getCartProducts();
  const subtotal = cartProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = cartProducts.length ? 40 : 0;
  const total = subtotal + delivery;
  return { cartProducts, subtotal, delivery, total, count: cartProducts.reduce((sum, item) => sum + item.quantity, 0) };
}

function renderProducts() {
  productGrid.innerHTML = products.map(product => `
    <article class="product-card">
      <div class="product-image" style="background-image: linear-gradient(rgba(0,0,0,0.08), rgba(0,0,0,0.14)), url('${product.image}')"></div>
      <div class="product-body">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-meta">
          <strong>₹${product.price}</strong>
          <button class="add-btn" data-id="${product.id}" type="button">Add</button>
        </div>
      </div>
    </article>
  `).join('');
}

function renderCartSummary() {
  const { cartProducts, subtotal, total, count } = getTotals();

  cartBadge.textContent = count;
  cartButton.setAttribute('aria-label', `Cart with ${count} items`);
  cartItems.innerHTML = cartProducts.length
    ? cartProducts.map(item => `
        <div class="cart-item">
          <div class="cart-item-details">
            <div class="cart-mini" style="background-image: url('${item.image}')"></div>
            <div>
              <h4>${item.name}</h4>
              <p>₹${item.price} each</p>
            </div>
          </div>

          <div class="qty-control">
            <button class="qty-button" data-action="decrease" data-id="${item.id}" type="button">-</button>
            <span>${item.quantity}</span>
            <button class="qty-button" data-action="increase" data-id="${item.id}" type="button">+</button>
          </div>
        </div>
      `).join('')
    : '<div class="cart-item empty-state"><p>Your cart is empty.</p></div>';

  subtotalElement.textContent = `₹${subtotal}`;
  totalElement.textContent = `₹${total}`;
  modalItemCount.textContent = count;
  modalSubtotal.textContent = `₹${subtotal}`;
  modalTotal.textContent = `₹${total}`;

  drawerItemCount.textContent = `${count} item${count === 1 ? '' : 's'}`;
  drawerSubtotal.textContent = `₹${subtotal}`;
  drawerTotal.textContent = `₹${total}`;

  cartDrawerItems.innerHTML = cartProducts.length
    ? cartProducts.map(item => `
        <div class="drawer-item">
          <div class="drawer-product">
            <div class="drawer-mini" style="background-image: url('${item.image}')"></div>
            <div>
              <h4>${item.name}</h4>
              <p>₹${item.price} × ${item.quantity}</p>
            </div>
          </div>
          <div class="drawer-qty">
            <button class="qty-button" data-action="decrease" data-id="${item.id}" type="button">-</button>
            <span>${item.quantity}</span>
            <button class="qty-button" data-action="increase" data-id="${item.id}" type="button">+</button>
          </div>
        </div>
      `).join('')
    : '<div class="drawer-empty"><p>Your cart is empty. Add groceries to continue.</p></div>';
}

function updateCart() {
  saveCart();
  renderCartSummary();
}

function addToCart(productId) {
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  updateCart();
  openCartDrawer();
}

function toggleCartDrawer(forceOpen) {
  const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : !cartDrawer.classList.contains('hidden');
  cartDrawer.classList.toggle('hidden', !shouldOpen);
  cartOverlay.classList.toggle('hidden', !shouldOpen);
}

function openCartDrawer() {
  toggleCartDrawer(true);
}

function closeCartDrawer() {
  toggleCartDrawer(false);
}

function openCheckoutModal() {
  const { cartProducts, subtotal, total, count } = getTotals();

  if (!cartProducts.length) {
    alert('Your cart is empty. Add products before checkout.');
    return;
  }

  modalItemCount.textContent = count;
  modalSubtotal.textContent = `₹${subtotal}`;
  modalTotal.textContent = `₹${total}`;
  orderSuccess.classList.add('hidden');
  checkoutForm.classList.remove('hidden');
  checkoutModal.classList.remove('hidden');
  closeCartDrawer();
}

function closeCheckoutModal() {
  checkoutModal.classList.add('hidden');
  orderSuccess.classList.add('hidden');
  checkoutForm.classList.remove('hidden');
  checkoutForm.reset();
}

function handleCartAction(id, action) {
  const item = cart.find(entry => entry.id === id);
  if (!item) return;

  if (action === 'increase') {
    item.quantity += 1;
  }

  if (action === 'decrease') {
    item.quantity -= 1;
    if (item.quantity <= 0) {
      cart = cart.filter(entry => entry.id !== id);
    }
  }

  updateCart();
}

function placeOrder(event) {
  event.preventDefault();

  const name = document.getElementById('customerName').value.trim();
  const phone = document.getElementById('customerPhone').value.trim();
  const address = document.getElementById('customerAddress').value.trim();

  if (!name || !phone || !address) {
    alert('Please fill in your details before placing the order.');
    return;
  }

  const { total, count } = getTotals();
  const orderId = `FB-${Math.floor(Math.random() * 9000 + 1000)}`;

  checkoutForm.classList.add('hidden');
  orderSuccess.classList.remove('hidden');
  successMessage.textContent = `${name}, your order ${orderId} for ${count} item(s) worth ₹${total} is placed successfully and will be delivered soon.`;

  cart = [];
  updateCart();
}

renderProducts();
updateCart();

productGrid.addEventListener('click', (event) => {
  const addButton = event.target.closest('.add-btn');
  if (addButton) {
    addToCart(Number(addButton.dataset.id));
  }
});

document.addEventListener('click', (event) => {
  const qtyButton = event.target.closest('.qty-button');
  if (qtyButton) {
    const id = Number(qtyButton.dataset.id);
    const action = qtyButton.dataset.action;
    handleCartAction(id, action);
  }

  if (event.target.closest('#cartButton')) {
    openCartDrawer();
  }

  if (event.target.closest('#closeCart') || event.target.closest('#cartOverlay')) {
    closeCartDrawer();
  }

  if (event.target.closest('#checkoutBtn') || event.target.closest('#finalCheckoutBtn')) {
    openCheckoutModal();
  }

  if (event.target.closest('#closeModal')) {
    closeCheckoutModal();
  }
});

checkoutForm.addEventListener('submit', placeOrder);
