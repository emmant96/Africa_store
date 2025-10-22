// Adire Threads JavaScript (AWS-connected version with phone number support)

document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
  document.getElementById("year").textContent = new Date().getFullYear();
  fetchProducts(); // 👈 Load live products from DynamoDB via API Gateway
});

// ✅ API Endpoints
const PRODUCTS_API = "https://ocis19k1s6.execute-api.us-east-1.amazonaws.com/default/getproduct";
const ORDER_API = "https://fyhmikvlsh.execute-api.us-east-1.amazonaws.com/africastore";

let cart = {};
let PRODUCTS = [];

const productsGrid = document.getElementById("products");
const cartModal = document.getElementById("cart-modal");
const cartButton = document.getElementById("cart-button");
const cartCount = document.getElementById("cart-count");
const checkoutModal = document.getElementById("checkout-modal");

// --- FETCH PRODUCTS FROM API ---
async function fetchProducts() {
  try {
    const response = await fetch(PRODUCTS_API);
    const data = await response.json();

    // Handle potential API Gateway formatting
    PRODUCTS = Array.isArray(data) ? data : JSON.parse(data.body || "[]");

    renderProducts(PRODUCTS);
  } catch (err) {
    console.error("Error fetching products:", err);
    productsGrid.innerHTML = `
      <p class="text-center text-red-600 font-semibold py-10">
        ⚠️ Unable to load products. Please try again later.
      </p>`;
  }
}

// --- RENDER PRODUCTS ---
function renderProducts(list = PRODUCTS) {
  productsGrid.innerHTML = list
    .map(
      (p) => `
    <div class="product-card bg-white p-4 rounded-lg shadow hover:shadow-2xl transition-transform transform hover:scale-105">
      <img src="${p.img || p.image}" alt="${p.name}" class="w-full h-64 object-cover border-b rounded">
      <h3 class="text-xl font-bold mt-2">${p.name}</h3>
      <p class="text-gray-600 text-sm mb-2">${p.description}</p>
      <p class="text-red-600 font-extrabold text-xl mb-3">$${parseFloat(p.price).toFixed(2)}</p>
      <button class="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition" onclick="addToCart('${p.id}')">
        Add to Cart
      </button>
    </div>`
    )
    .join("");
  lucide.createIcons();
}

// --- CART LOGIC ---
function addToCart(id) {
  const item = PRODUCTS.find((p) => p.id === id);
  if (!item) return;
  cart[id] = cart[id]
    ? { ...cart[id], qty: cart[id].qty + 1 }
    : { ...item, qty: 1 };
  updateCartCount();
  renderCart();
  openCartModal();
}

function renderCart() {
  const list = document.getElementById("cart-items-list");
  const totalDisplay = document.getElementById("cart-total");
  const total = Object.values(cart).reduce((t, i) => t + parseFloat(i.price) * i.qty, 0);
  totalDisplay.textContent = `$${total.toFixed(2)}`;

  if (Object.keys(cart).length === 0) {
    list.innerHTML =
      '<p class="text-gray-500 text-center py-4">Your cart is empty.</p>';
    return;
  }

  list.innerHTML = Object.values(cart)
    .map(
      ({ name, price, qty, id }) => `
    <div class="flex justify-between items-center border-b py-2">
      <div>
        <p class="font-semibold">${name}</p>
        <p class="text-sm text-gray-500">$${parseFloat(price).toFixed(2)} x ${qty}</p>
      </div>
      <div class="flex items-center space-x-2">
        <button onclick="removeFromCart('${id}')" class="text-red-500 hover:text-red-700">
          <i data-lucide="minus-circle" class="w-4 h-4"></i>
        </button>
      </div>
    </div>`
    )
    .join("");
  lucide.createIcons();
}

function removeFromCart(id) {
  if (!cart[id]) return;
  cart[id].qty -= 1;
  if (cart[id].qty <= 0) delete cart[id];
  renderCart();
  updateCartCount();
}

function updateCartCount() {
  cartCount.textContent = Object.values(cart).reduce(
    (sum, i) => sum + i.qty,
    0
  );
}

// --- CART MODAL ---
cartButton.addEventListener("click", toggleCartModal);

function toggleCartModal() {
  const hidden = cartModal.classList.contains("hidden");
  if (hidden) openCartModal();
  else closeCartModal();
}

function openCartModal() {
  cartModal.classList.remove("hidden", "scale-95", "opacity-0");
  cartModal.classList.add("scale-100", "opacity-100");
}

function closeCartModal() {
  cartModal.classList.remove("scale-100", "opacity-100");
  cartModal.classList.add("scale-95", "opacity-0");
  setTimeout(() => cartModal.classList.add("hidden"), 300);
}

// --- SECURE CHECKOUT BUTTON HANDLER ---
document.getElementById("checkout-button")?.addEventListener("click", () => {
  if (Object.keys(cart).length === 0) {
    alert("🛒 Your cart is empty. Please add some items before checkout!");
    return;
  }
  closeCartModal();
  openCheckoutModal();
});

// --- SEARCH & SORT ---
function filterAndSortProducts() {
  const search = document
    .getElementById("search-input")
    ?.value.toLowerCase()
    .trim();
  const sort = document.getElementById("sort-select")?.value || "default";
  let filtered = PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(search) ||
      p.description.toLowerCase().includes(search)
  );
  if (sort === "price-asc") filtered.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") filtered.sort((a, b) => b.price - a.price);
  if (sort === "name-asc") filtered.sort((a, b) => a.name.localeCompare(b.name));
  renderProducts(filtered);
}

// --- CHECKOUT MODAL ---
function openCheckoutModal() {
  document.getElementById("final-total").textContent = `$${calculateTotal()}`;
  checkoutModal.classList.remove("hidden", "opacity-0");
  checkoutModal.classList.add("opacity-100");
}

function closeCheckoutModal() {
  checkoutModal.classList.remove("opacity-100");
  checkoutModal.classList.add("opacity-0");
  setTimeout(() => checkoutModal.classList.add("hidden"), 300);
}

function calculateTotal() {
  return Object.values(cart)
    .reduce((t, i) => t + parseFloat(i.price) * i.qty, 0)
    .toFixed(2);
}

// --- SUBMIT ORDER ---
document
  .getElementById("checkout-form")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const order = {
      orderId:
        "ORDER-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
      customerName: document.getElementById("customer-name").value,
      customerPhone: document.getElementById("customer-phone").value,
      customerEmail: document.getElementById("customer-email").value,
      items: Object.values(cart),
      total: parseFloat(calculateTotal()),
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await fetch(ORDER_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });

      const data = await res.json();
      console.log("Order response:", data);

      alert(
        `✅ Order ${order.orderId} placed successfully!\n\nCustomer Info:\nName: ${order.customerName}\nPhone: ${order.customerPhone}\nEmail: ${order.customerEmail}`
      );

      cart = {};
      updateCartCount();
      renderCart();
      closeCheckoutModal();
    } catch (err) {
      console.error("Order error:", err);
      alert("❌ Order failed. Please try again.");
    }
  });
