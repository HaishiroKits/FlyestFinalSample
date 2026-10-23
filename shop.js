const categoryLabels = {
  shirts: "Tees",
  hoodies: "Hoodies",
  sweaters: "Sweaters",
  polos: "Polos",
  pants: "Pants",
  shorts: "Shorts",
  footwear: "Footwear",
  headwear: "Headwear",
  mens: "Men's",
  womens: "Women's",
};
const requestedCategory = new URLSearchParams(location.search).get("category");
const collectionCategory = Object.hasOwn(categoryLabels, requestedCategory) ? requestedCategory : "hoodies";
const collectionProducts = products.filter((product) => product.category === collectionCategory);
const collectionLabel = categoryLabels[collectionCategory];
document.title = `FLYEST — ${collectionLabel}`;
const shopGrid = document.getElementById("shopGrid");
const emptyState = document.getElementById("shopEmpty");
emptyState.hidden = collectionProducts.length > 0;
collectionProducts.forEach((product) => {
  const card = document.createElement("a");
  card.className = "card shop-card";
  card.href = `${product.category === "shirts" ? "shirt" : "hoodie"}.html?id=${encodeURIComponent(product.id)}`;
  const image = document.createElement("div");
  image.className = "card-img";
  image.append(createProductCardImage(product));
  const meta = document.createElement("div");
  meta.className = "card-meta";
  meta.innerHTML = `
      <div class="card-name">${product.name}</div>
      <div class="card-price price-row">${formatProductPrice(product)}</div>`;
  card.append(image, meta);
  shopGrid.appendChild(card);
});
