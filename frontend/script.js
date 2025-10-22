// Adire Threads JavaScript (modular + educational)
lucide.createIcons();
document.getElementById('year').textContent = new Date().getFullYear();

const API_URL = "YOUR_AWS_API_GATEWAY_URL_HERE"; // Replace after deployment
let cart = {};
const productsGrid = document.getElementById('products');

// --- PRODUCT DATA (temporary until connected to DynamoDB) ---
const PRODUCTS = [
  { id: "p001", name: "Adire Print Tunic", price: 49.99, img: "https://placehold.co/400x400/943126/ffffff?text=Adire+Tunic" },
  { id: "p002", name: "Ankara Infinity Dress", price: 89.99, img: "https://placehold.co/400x400/27ae60/ffffff?text=Ankara+Dress" },
  { id: "p003", name: "Kente Bomber Jacket", price: 79.50, img: "https://placehold.co/400x400/f39c12/ffffff?text=Kente+Jacket" },
];

// --- RENDER PRODUCTS ---
function renderProducts() {
  productsGrid.innerHTML = PRODUCTS.map(p => `
    <div class="product-card">
      <img src="${p.img}" alt="${p.name}" class="w-full h-64 object-cover border-b">
      <div class="p-4">
        <h3 class="text-lg font-bold mb-2">${p.name}</h3>
        <p class="text-accent text-xl font-black mb-3">$${p.price.toFixed(2)}</p>
        <div class="flex space-x-2">
          <button class="btn-secondary" onclick="addToCart('${p.id}')">Add to Cart</button>
          <button class="btn-primary" onclick="buyNow('${p.id}')">Buy Now</button>
        </div>
      </div>
    </div>
  `).join('');
}
renderProducts();

// --- CART LOGIC ---
function addToCart(id) {
  const item = PRODUCTS.find(p => p.id === id);
  if (!item) return;
  cart[id] = cart[id] ? { ...cart[id], qty: cart[id].qty + 1 } : { ...item, qty: 1 };
  updateCartCount();
  alert(`${item.name} added to cart`);
}

function updateCartCount() {
  document.getElementById('cart-count').textContent = Object.values(cart).reduce((sum, i) => sum + i.qty, 0);
}

// --- BUY NOW (OPENS CHECKOUT) ---
function buyNow(id) {
  addToCart(id);
  openCheckoutModal();
}

// --- CHECKOUT MODAL + ORDER SUBMISSION ---
async function submitOrder(e) {
  e.preventDefault();
  const order = {
    orderId: "ORDER-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
    customerName: document.getElementById('customer-name').value,
    customerEmail: document.getElementById('customer-email').value,
    items: Object.values(cart),
    total: Object.values(cart).reduce((t, i) => t + i.price * i.qty, 0),
    timestamp: new Date().toISOString()
  };

  try {
    // Replace mock delay with real API call after backend is live
    // await fetch(API_URL + "/orders", { method: "POST", headers: {'Content-Type':'application/json'}, body: JSON.stringify(order)});
    await new Promise(r => setTimeout(r, 2000));
    alert(`✅ Order ${order.orderId} placed!`);
    cart = {};
    updateCartCount();
  } catch (err) {
    console.error(err);
    alert("❌ Order failed. Try again.");
  }
}

document.getElementById('checkout-form')?.addEventListener('submit', submitOrder);
