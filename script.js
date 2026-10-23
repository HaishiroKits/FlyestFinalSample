let cart = [];
try {
  cart = JSON.parse(localStorage.getItem("flyest_cart")) || [];
} catch {
  cart = [];
}
const cartItemCountBeforeUpdate = cart.length;
cart = cart.map((item) => {
  const product = products.find((candidate) => candidate.id === item.id);
  return product
    ? { ...item, name: product.name, price: getProductPrice(product), qty: Number.isInteger(item.qty) && item.qty > 0 ? item.qty : 1 }
    : item;
}).filter((item) => products.some((product) => product.id === item.id));
const cartHadRemovedProducts = cart.length < cartItemCountBeforeUpdate;

const $ = (id) => document.getElementById(id);

let toastTimer;
function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

const pickedSize = {};

function handleSizeClick(e) {
  const btn = e.target;
  if (btn.classList.contains("size-btn")) {
    pickedSize[btn.dataset.id] = btn.dataset.size;
    btn.parentElement.querySelectorAll(".size-btn").forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");
  }
  if (btn.classList.contains("add-btn")) {
    const size = pickedSize[btn.dataset.id];
    if (!size) {
      toast("PLEASE PICK A SIZE FIRST");
      const row = btn.parentElement.querySelector(".size-row");
      row.style.borderColor = "#000";
      row.classList.add("shake");
      setTimeout(() => row.classList.remove("shake"), 500);
      return;
    }
    addToCart(btn.dataset.id, size);
  }
}

function saveCart() {
  localStorage.setItem("flyest_cart", JSON.stringify(cart));
}

function cartCount() {
  return cart.reduce((sum, i) => sum + i.qty, 0);
}

function cartTotal() {
  return cart.reduce((sum, i) => sum + i.price * i.qty, 0);
}

function renderCart() {
  const items = $("cartItems");
  items.innerHTML = "";
  if (!cart.length) {
    items.innerHTML = `
      <div class="cart-empty">
        <span class="cart-empty-mark" aria-hidden="true">F</span>
        <p class="cart-empty-title">Your next favorite belongs here.</p>
        <p class="cart-empty-note">Explore the collection and find the piece that feels like you.</p>
        <a class="cart-empty-link" href="shop.html?category=hoodies">EXPLORE THE COLLECTION <span aria-hidden="true">↗</span></a>
      </div>`;
  } else {
    cart.forEach((item) => {
      const product = products.find((candidate) => candidate.id === item.id);
      const row = document.createElement("div");
      row.className = "cart-item";
      const media = document.createElement("div");
      media.className = "cart-item-media";
      if (product) {
        const image = document.createElement("img");
        image.src = product.image;
        image.alt = product.name;
        image.loading = "lazy";
        media.appendChild(image);
      } else {
        media.textContent = "F";
        media.setAttribute("aria-hidden", "true");
      }

      const details = document.createElement("div");
      details.className = "cart-item-details";
      const titleRow = document.createElement("div");
      titleRow.className = "cart-item-title-row";
      const name = document.createElement("div");
      name.className = "cart-item-name";
      name.textContent = item.name;
      titleRow.appendChild(name);
      const lineTotal = document.createElement("span");
      lineTotal.className = "cart-item-line-total";
      lineTotal.textContent = `₱${(item.price * item.qty).toFixed(2)}`;
      titleRow.appendChild(lineTotal);

      const options = document.createElement("div");
      options.className = "cart-item-options";
      const categoryLabel = product.category === "shirts" ? "TEE" : product.category.slice(0, -1).toUpperCase();
      options.textContent = `${categoryLabel}${item.size ? ` · SIZE ${item.size}` : ""}`;

      const unitPrice = document.createElement("div");
      unitPrice.className = "cart-item-price";
      unitPrice.textContent = `₱${item.price.toFixed(2)} each`;

      const quantity = document.createElement("div");
      quantity.className = "cart-quantity";
      quantity.setAttribute("aria-label", "Cart quantity controls");
      const decrease = document.createElement("button");
      decrease.className = "cart-quantity-btn";
      decrease.type = "button";
      decrease.dataset.action = "decrease";
      decrease.dataset.key = encodeURIComponent(item.key);
      decrease.setAttribute("aria-label", `Decrease ${item.name} quantity`);
      decrease.disabled = item.qty <= 1;
      decrease.textContent = "−";
      const quantityValue = document.createElement("span");
      quantityValue.className = "cart-quantity-value";
      quantityValue.setAttribute("aria-live", "polite");
      quantityValue.textContent = item.qty;
      const increase = document.createElement("button");
      increase.className = "cart-quantity-btn";
      increase.type = "button";
      increase.dataset.action = "increase";
      increase.dataset.key = encodeURIComponent(item.key);
      increase.setAttribute("aria-label", `Increase ${item.name} quantity`);
      increase.textContent = "+";
      quantity.append(decrease, quantityValue, increase);
      details.append(titleRow, options, unitPrice, quantity);

      const remove = document.createElement("button");
      remove.className = "icon-btn remove-btn";
      remove.type = "button";
      remove.dataset.key = encodeURIComponent(item.key);
      remove.setAttribute("aria-label", `Remove ${item.name} from cart`);
      remove.title = "Remove item";
      remove.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6m4-6v6M5.5 7l1 13h11l1-13M9 7V4h6v3" /></svg>';
      row.append(media, details, remove);
      items.appendChild(row);
    });
  }
  $("cartCount").textContent = cartCount();
  if ($("cartHeaderCount")) {
    const count = cartCount();
    $("cartHeaderCount").textContent = `${count} ${count === 1 ? "ITEM" : "ITEMS"}`;
  }
  $("cartTotal").textContent = `₱${cartTotal().toFixed(2)}`;
  if ($("payAmount")) $("payAmount").textContent = `₱${cartTotal().toFixed(2)}`;
}

function addToCart(id, size, quantity = 1) {
  const p = products.find((x) => x.id === id);
  if (!p || !Number.isInteger(quantity) || quantity < 1) return;
  const key = `${id}::${size}`;
  const existing = cart.find((i) => i.key === key);
  if (existing) existing.qty += quantity;
  else cart.push({ key, id: p.id, name: p.name, price: getProductPrice(p), size: size || null, qty: quantity });
  saveCart();
  renderCart();
  const countBadge = $("cartCount");
  countBadge.classList.remove("bump");
  requestAnimationFrame(() => countBadge.classList.add("bump"));
  toast(`ADDED ${quantity} TO CART${size ? " — SIZE " + size : ""}`);
  openCart();
}

function removeFromCart(key) {
  cart = cart.filter((i) => i.key !== key);
  saveCart();
  renderCart();
}

function updateCartQuantity(key, action) {
  const item = cart.find((entry) => entry.key === key);
  if (!item) return;
  if (action === "increase") item.qty += 1;
  else if (action === "decrease" && item.qty > 1) item.qty -= 1;
  saveCart();
  renderCart();
}

function openCart() {
  $("cartDrawer").classList.add("open");
  $("overlay").classList.add("open");
  $("cartDrawer").setAttribute("aria-hidden", "false");
}
function closeCart() {
  $("cartDrawer").classList.remove("open");
  $("overlay").classList.remove("open");
  $("cartDrawer").setAttribute("aria-hidden", "true");
}
function openCheckout() {
  if (!cart.length) {
    toast("YOUR CART IS EMPTY");
    return;
  }
  closeCart();
  $("checkoutStep1").classList.remove("hidden");
  $("checkoutStepPay").classList.add("hidden");
  $("checkoutStep2").classList.add("hidden");
  $("checkoutModal").classList.add("open");
  $("checkoutModal").setAttribute("aria-hidden", "false");
}
function closeCheckout() {
  const checkoutModal = $("checkoutModal");
  if (!checkoutModal) return;
  checkoutModal.classList.remove("open");
  checkoutModal.setAttribute("aria-hidden", "true");
}

let lastOrder = null;

function makeBarcode(text) {
  let html = "";
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    html += `<i style="width:${1 + (code % 3)}px"></i><i style="width:${1 + ((code >> 2) % 3)}px;margin-left:2px"></i>`;
  }
  return html;
}

function generateWaybill(order) {
  const tracking = "JT" + Date.now().toString().slice(-9) + Math.floor(Math.random() * 90 + 10);
  $("waybillTracking").textContent = tracking;
  $("wbReceiver").textContent = order.name;
  $("wbAddress").innerHTML =
    `${order.house}, ${order.street},<br />Brgy. ${order.barangay}, ${order.city},<br />${order.province} ${order.postal}`;
  $("wbPhone").textContent = order.phone;
  $("wbItems").textContent = order.items.map((i) => `${i.name}${i.size ? ` (${i.size})` : ""} × ${i.qty}`).join(", ");
  $("wbTotal").textContent = `Total: ₱${order.total.toFixed(2)}`;
  $("wbCod").textContent = order.payment === "GCash" || order.payment === "Atome"
    ? "₱0.00 (PREPAID)" : `₱${order.total.toFixed(2)}`;
  $("wbBarcode").innerHTML = makeBarcode(tracking);
  return tracking;
}

if ($("checkoutForm")) $("checkoutForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const payment = document.querySelector('input[name="payment"]:checked').value;

  const order = {
    no: "FLY-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
    name: $("name").value,
    email: $("email").value,
    phone: $("phone").value,
    house: $("house").value,
    street: $("street").value,
    barangay: $("barangay").value,
    city: $("city").value,
    province: $("province").value,
    postal: $("postal").value,
    notes: $("notes").value,
    payment,
    items: cart.slice(),
    total: cartTotal(),
    status: "PENDING_PAYMENT",
  };
  lastOrder = order;

  const orders = JSON.parse(localStorage.getItem("flyest_orders") || "[]");
  orders.push(order);
  localStorage.setItem("flyest_orders", JSON.stringify(orders));

  $("qrAmount").textContent = `₱${order.total.toFixed(2)}`;
  $("qrImage").src = payment === "GCash" ? "Gcash.jpg" : "Atome.jpg";
  $("qrNote").innerHTML =
    payment === "GCash"
      ? "1. Open your <strong>GCash</strong> app → Scan QR.<br />2. Send the <strong>exact amount</strong> above.<br />3. Upload your payment screenshot below."
      : "1. Open your banking / <strong>Atome</strong> app → Scan QR (InstaPay).<br />2. Send the <strong>exact amount</strong> above.<br />3. Upload your payment screenshot below.";
  $("checkoutStep1").classList.add("hidden");
  $("checkoutStepPay").classList.remove("hidden");
});

if ($("receiptFile")) $("receiptFile").addEventListener("change", () => {
  const f = $("receiptFile").files[0];
  if (!f) return;
  $("receiptPreview").classList.remove("hidden");
  $("receiptPreview").querySelector("img").src = URL.createObjectURL(f);
});

if ($("paidBtn")) $("paidBtn").addEventListener("click", () => {
  if (!$("receiptFile").files.length) {
    toast("UPLOAD YOUR PAYMENT SCREENSHOT FIRST");
    return;
  }
  if (!lastOrder) return;

  lastOrder.status = "PAID";
  lastOrder.paidAt = new Date().toISOString();
  lastOrder.tracking = generateWaybill(lastOrder);
  updateOrderInStorage(lastOrder);

  $("confirmName").textContent = lastOrder.name;
  $("confirmEmail").textContent = lastOrder.email;
  $("confirmPay").textContent = lastOrder.payment;
  $("orderNo").textContent = lastOrder.no;

  cart = [];
  saveCart();
  renderCart();

  const receiptBody =
    `NEW PAID ORDER — ${lastOrder.no}%0D%0A%0D%0A` +
    `Customer: ${lastOrder.name}%0D%0APhone: ${lastOrder.phone}%0D%0AEmail: ${lastOrder.email}%0D%0A` +
    `Address: ${lastOrder.house} ${lastOrder.street}, Brgy. ${lastOrder.barangay}, ${lastOrder.city}, ${lastOrder.province} ${lastOrder.postal}%0D%0A` +
    `Notes: ${lastOrder.notes || "none"}%0D%0A%0D%0A` +
    `Payment: ${lastOrder.payment} (receipt uploaded)%0D%0AAmount: ₱${lastOrder.total.toFixed(2)}%0D%0A%0D%0A` +
    `Items:%0D%0A` +
    lastOrder.items.map((i) => `- ${i.name}${i.size ? ` (${i.size})` : ""} x${i.qty} = ₱${(i.price * i.qty).toFixed(2)}`).join("%0D%0A") +
    `%0D%0A%0D%0AJ&T Tracking: ${lastOrder.tracking}%0D%0APaid at: ${lastOrder.paidAt}`;

  const mailto = `mailto:flyestclothing.ph@gmail.com?subject=${encodeURIComponent("NEW ORDER " + lastOrder.no)}&body=${receiptBody}`;
  window.open(mailto, "_blank");

  $("checkoutStepPay").classList.add("hidden");
  $("checkoutStep2").classList.remove("hidden");
  toast("PAYMENT VERIFIED — ORDER CONFIRMED ✓");
});

function updateOrderInStorage(order) {
  const orders = JSON.parse(localStorage.getItem("flyest_orders") || "[]");
  const idx = orders.findIndex((o) => o.no === order.no);
  if (idx > -1) orders[idx] = order;
  localStorage.setItem("flyest_orders", JSON.stringify(orders));
}

if ($("printWaybill")) $("printWaybill").addEventListener("click", () => {
  if (!lastOrder) return;
  const wb = $("waybill").outerHTML;
  const w = window.open("", "_blank", "width=800,height=600");
  w.document.write(`
    <html><head><title>FLYEST — J&T Waybill ${$("waybillTracking").textContent}</title>
    <style>
      body { font-family: Arial, sans-serif; color: #000; padding: 20px; }
      .waybill { border: 2px solid #000; padding: 16px; max-width: 700px; }
      h5, p { margin: 4px 0; }
      .waybill-cols { display: flex; gap: 20px; margin-top: 12px; }
      .waybill-col { flex: 1; }
      .waybill-head { display: flex; justify-content: space-between; font-weight: bold; border-bottom: 2px solid #000; padding-bottom: 8px; }
      .waybill-tracking { margin-top: 10px; font-size: 18px; }
      .waybill-barcode i { display: inline-block; height: 40px; background: #000; }
      .waybill-cod { margin-top: 12px; font-size: 16px; }
      @media print { body { padding: 0; } }
    </style></head><body>
    <div class="waybill">${wb}</div>
    <script>window.print()<\/script>
    </body></html>`);
  w.document.close();
});

$("cartBtn").addEventListener("click", openCart);
$("closeCart").addEventListener("click", closeCart);
$("overlay").addEventListener("click", closeCart);
if ($("checkoutBtn")) $("checkoutBtn").addEventListener("click", openCheckout);
if ($("closeCheckout")) $("closeCheckout").addEventListener("click", closeCheckout);
if ($("doneBtn")) $("doneBtn").addEventListener("click", closeCheckout);

if ($("productGrid")) $("productGrid").addEventListener("click", handleSizeClick);

$("cartItems").addEventListener("click", (e) => {
  const button = e.target.closest("button");
  if (!button) return;
  if (button.classList.contains("remove-btn")) removeFromCart(decodeURIComponent(button.dataset.key));
  else if (button.classList.contains("cart-quantity-btn")) {
    updateCartQuantity(decodeURIComponent(button.dataset.key), button.dataset.action);
  }
});

if ($("communitySignup")) {
  $("communitySignup").addEventListener("submit", (event) => {
    event.preventDefault();
    const email = $("communityEmail").value.trim();
    const subject = encodeURIComponent("FLYEST new-drop notifications");
    const body = encodeURIComponent(`Please sign me up for new clothing and collection updates.\n\nEmail: ${email}`);
    $("communitySignupStatus").textContent = "Your email app will open. Send the message to complete your signup request.";
    window.location.href = `mailto:flyestclothing.ph@gmail.com?subject=${subject}&body=${body}`;
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && document.getElementById("cartDrawer")) {
    closeCart();
    closeCheckout();
  }
});

document.querySelectorAll('input[name="payment"]').forEach((r) =>
  r.addEventListener("change", () => {
    $("payNote").textContent =
      r.value === "GCash"
        ? "You'll scan the GCash QR to pay after placing your order."
        : "You'll scan the InstaPay QR via your banking / Atome app.";
  })
);

function renderProductGrid(gridId, collection) {
  const grid = $(gridId);
  if (!grid) return;
  grid.innerHTML = "";
  collection.forEach((p) => {
    const card = document.createElement("a");
    card.className = "card";
    card.href = `${p.category === "shirts" ? "shirt" : "hoodie"}.html?id=${encodeURIComponent(p.id)}`;
    const image = document.createElement("div");
    image.className = "card-img";
    image.append(createProductCardImage(p));
    const meta = document.createElement("div");
    meta.className = "card-meta";
    meta.innerHTML = `<div class="card-name">${p.name}</div><div class="card-price">${formatProductPrice(p)}</div>`;
    card.append(image, meta);
    grid.appendChild(card);
  });
}

function renderProducts() {
  renderProductGrid("productGrid", products.filter((product) => product.category === "hoodies"));
  renderProductGrid("shirtFeatureGrid", products.filter((product) => product.category === "shirts"));
  renderProductGrid("otherProductGrid", products.filter((product) => !["hoodies", "shirts"].includes(product.category)));
}

renderProducts();
renderCart();
if (cartHadRemovedProducts) toast("YOUR CART WAS UPDATED FOR THE NEW COLLECTION");
if (new URLSearchParams(location.search).has("checkout")) openCheckout();
if (document.getElementById("emailReceipt")) {
  $("emailReceipt").addEventListener("click", () => toast("RECEIPT SENT TO YOUR EMAIL ✓"));
}
