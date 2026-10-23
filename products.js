const SIZES = ["M", "L", "XL", "2XL", "3XL"];

const PRODUCT_DEFINITIONS = [
  ["Dream Hoodie - Black", "hoodies", 1700, true],
  ["Dream Hoodie - Brown", "hoodies", 1700, true],
  ["Dream Hoodie - Green", "hoodies", 1700, true],
  ["Dream Hoodie - Off White", "hoodies", 1700, true],
  ["Classic Hoodie - Charcoal Gray", "hoodies", 1700, true],
  ["Classic Hoodie - Sky Blue", "hoodies", 1700, true],
  ["0 Fear Bling Jersey - Black", "shirts", 1200, true],
  ["Chrome Tee - Black", "shirts", 750, true],
  ["Do I Look Fly Tee - Black", "shirts", 750, true],
  ["Flyest Sando - White and Black", "shirts", 750, true],
  ["Frank Ocean Tee - Black", "shirts", 750, true],
  ["Get Rich Tee - Black", "shirts", 750, true],
  ["I Love Fly Boys Baby Tee - White,Pink,Black", "shirts", 750, true],
  ["Look Mom I Can Fly Tee - White", "shirts", 750, true],
  ["One Good Girl Tee - Black", "shirts", 750, true],
  ["CLB Tee - White", "shirts", 750, true],
  ["For All The Dogs Tee - Black", "shirts", 750, true],
  ["Her Loss Tee - Black", "shirts", 750, true],
  ["Porsche Tee - Black", "shirts", 750, true],
  ["Porsche Tee - Off White", "shirts", 750, true],
  ["Vision Tee - Black", "shirts", 750, true],
  ["Vision Tee - Off White", "shirts", 750, true],
  ["Chain Mesh Short - Black", "shorts", 750, true],
  ["Chain Mesh Short - White", "shorts", 750, true],
  ["Denim Jorts - Black", "shorts", 750, true],
  ["V1 Sweatshorts - Black and White", "shorts", 750, true],
  ["Premium Baggy Sweatpants - Black", "pants", 1250, true],
  ["Chromey Reflective Polo - Black", "polos", 1200, true],
  ["Premium Sweater - Black", "sweaters", 1300, true],
  ["Quarter Zip V2 - Black", "sweaters", 1500, false],
  ["Quarter Zip V2 - Gray", "sweaters", 1500, false],
  ["Quarter Zip V2 - Navy Blue", "sweaters", 1500, false],
];

function productSlug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const SOLD_OUT_PRODUCT_IDS = new Set([
  "CLB Tee - White",
  "For All The Dogs Tee - Black",
  "Her Loss Tee - Black",
  "Porsche Tee - Black",
  "Porsche Tee - Off White",
  "Vision Tee - Black",
  "Vision Tee - Off White",
].map(productSlug));

const products = PRODUCT_DEFINITIONS.map(([name, category, price, hasBack]) => {
  const imageCategory = category === "shirts" ? "shirts" : category;
  const id = productSlug(name);
  return {
    id,
    name,
    price,
    image: `product-images/${imageCategory}/${id}-front.jpg`,
    backImage: hasBack ? `product-images/${imageCategory}/${id}-back.jpg` : null,
    category,
    isSoldOut: SOLD_OUT_PRODUCT_IDS.has(id),
  };
});

if (typeof module !== "undefined") module.exports = products;

function getProductPrice(product) {
  return product.price;
}

function formatProductPrice(product, fractionDigits = 0) {
  return `₱${getProductPrice(product).toLocaleString("en-PH", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}`;
}

function createSoldOutBadge() {
  const badge = document.createElement("span");
  badge.className = "product-card-soldout";
  badge.textContent = "Sold out";
  return badge;
}

function createProductCardImage(product) {
  const preview = document.createElement("div");
  preview.className = `product-card-preview${product.backImage ? " has-back" : ""}`;
  if (product.isSoldOut) preview.append(createSoldOutBadge());

  if (product.backImage) {
    preview.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "mouse") preview.classList.add("show-back");
    });
    preview.addEventListener("pointerleave", () => preview.classList.remove("show-back"));
  }

  const front = document.createElement("img");
  front.className = "product-card-preview-front";
  front.src = product.image;
  front.alt = product.name;
  front.loading = "lazy";
  front.draggable = false;
  preview.append(front);

  if (product.backImage) {
    const back = document.createElement("img");
    back.className = "product-card-preview-back";
    back.src = product.backImage;
    back.alt = "";
    back.setAttribute("aria-hidden", "true");
    back.loading = "lazy";
    back.draggable = false;
    preview.append(back);
  }

  return preview;
}

function createProductGallery(product) {
  const gallery = document.createElement("div");
  gallery.className = "product-gallery";
  gallery.tabIndex = 0;
  gallery.setAttribute("role", "group");
  gallery.setAttribute("aria-label", `${product.name} product views`);

  const views = [
    { image: product.image, label: "FRONT" },
    ...(product.backImage ? [{ image: product.backImage, label: "BACK" }] : []),
  ];

  if (product.isSoldOut) gallery.append(createSoldOutBadge());

  views.forEach(({ image, label }) => {
    const slide = document.createElement("figure");
    slide.className = "product-gallery-slide";
    const photo = document.createElement("img");
    photo.src = image;
    photo.alt = `${product.name} — ${label.toLowerCase()} view`;
    photo.loading = label === "FRONT" ? "eager" : "lazy";
    photo.draggable = false;
    slide.append(photo);
    const caption = document.createElement("figcaption");
    caption.textContent = label;
    slide.append(caption);
    gallery.append(slide);
  });

  return gallery;
}
