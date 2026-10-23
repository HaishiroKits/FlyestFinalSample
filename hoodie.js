const params = new URLSearchParams(location.search);
const pid = params.get("id");

const product = products.find((x) => x.id === pid) || products[0];
const isShirt = product.category === "shirts";
const isSoldOut = Boolean(product.isSoldOut);
const categoryLabel = {
  shirts: "TEE",
  hoodies: "HOODIE",
  sweaters: "SWEATER",
  polos: "POLO",
  pants: "PANTS",
  shorts: "SHORTS",
}[product.category] || "PRODUCT";
document.title = `FLYEST — ${product.name}`;
const productImage = document.getElementById("pImg");
productImage.replaceWith(createProductGallery(product));
document.getElementById("pName").textContent = product.name.toUpperCase();
document.getElementById("crumbName").textContent = product.name;
const productPrice = document.getElementById("pPrice");
productPrice.innerHTML = formatProductPrice(product, 2);
productPrice.classList.add("price-row");
if (isSoldOut) {
  const soldOutBadge = document.createElement("span");
  soldOutBadge.className = "product-status";
  soldOutBadge.textContent = "SOLD OUT";
  productPrice.before(soldOutBadge);
}
document.querySelector(".p-overline").textContent = `FLYEST · THE ${categoryLabel} COLLECTION`;
document.querySelector(".p-details ul").innerHTML = isShirt
  ? "<li>Graphic tee from the FLYEST collection</li><li>Made for everyday wear</li><li>Select a size before adding to your cart</li><li>Worldwide shipping available; rates depend on destination</li>"
  : product.category === "hoodies"
    ? "<li>Hoodie from the FLYEST collection</li><li>Made for everyday comfort</li><li>Unisex sizing — choose your usual size</li><li>Worldwide shipping available; rates depend on destination</li>"
    : `<li>${categoryLabel.charAt(0)}${categoryLabel.slice(1).toLowerCase()} from the FLYEST collection</li><li>Made for everyday wear</li><li>Select a size before adding to your cart</li><li>Worldwide shipping available; rates depend on destination</li>`;

let chosenSize = null;
const sizeRow = document.getElementById("sizeRow");
const addBtn = document.getElementById("addBtn");
const sizeHint = document.getElementById("sizeHint");
const quantityInput = document.getElementById("quantityInput");

function normalizeQuantity() {
  const quantity = Number(quantityInput.value);
  quantityInput.value = String(Number.isInteger(quantity) && quantity > 0 ? quantity : 1);
  return Number(quantityInput.value);
}

document.getElementById("quantityDecrease").addEventListener("click", () => {
  quantityInput.value = String(Math.max(1, normalizeQuantity() - 1));
});
document.getElementById("quantityIncrease").addEventListener("click", () => {
  quantityInput.value = String(normalizeQuantity() + 1);
});
quantityInput.addEventListener("change", normalizeQuantity);

sizeRow.addEventListener("click", (e) => {
  if (isSoldOut) {
    toast("THIS ITEM IS SOLD OUT");
    return;
  }
  if (!e.target.classList.contains("size-btn")) return;
  chosenSize = e.target.dataset.size;
  sizeRow.querySelectorAll(".size-btn").forEach((b) => b.classList.remove("selected"));
  e.target.classList.add("selected");
  addBtn.disabled = false;
  addBtn.textContent = `ADD TO CART — ${chosenSize}`;
  sizeHint.textContent = `Size ${chosenSize} selected`;
  sizeHint.classList.add("ok");
});

if (isSoldOut) {
  sizeRow.querySelectorAll(".size-btn").forEach((button) => {
    button.disabled = true;
    button.setAttribute("aria-disabled", "true");
  });
  addBtn.disabled = true;
  addBtn.textContent = "SOLD OUT";
  sizeHint.textContent = "This item is sold out";
  sizeHint.classList.add("warn");
}

addBtn.addEventListener("click", () => {
  if (isSoldOut) {
    toast("THIS ITEM IS SOLD OUT");
    return;
  }
  if (!chosenSize) {
    sizeRow.classList.add("shake");
    setTimeout(() => sizeRow.classList.remove("shake"), 500);
    toast("PLEASE PICK A SIZE FIRST");
    return;
  }
  const quantity = normalizeQuantity();
  addToCart(product.id, chosenSize, quantity);
});

const alsoGrid = document.getElementById("alsoGrid");
alsoGrid.innerHTML = "";
products
  .filter((p) => p.category === product.category && p.id !== product.id)
  .forEach((p) => {
    const card = document.createElement("a");
    card.className = "also-card";
    card.href = `${p.category === "shirts" ? "shirt" : "hoodie"}.html?id=${encodeURIComponent(p.id)}`;
    const image = createProductCardImage(p);
    image.classList.add("also-card-image");
    const meta = document.createElement("div");
    meta.className = "also-card-meta";
    meta.innerHTML = `
      <div class="also-name">${p.name}</div>
      <div class="also-price">${formatProductPrice(p, 2)}</div>`;
    card.append(image, meta);
    alsoGrid.appendChild(card);
  });

const origRenderCart = renderCart;
renderCart = function () {
  origRenderCart();
  document.getElementById("cartCount").textContent = cartCount();
};
renderCart();
