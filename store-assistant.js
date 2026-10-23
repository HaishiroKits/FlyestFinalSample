(() => {
  const trigger = document.querySelector("[data-store-search]");
  if (!trigger || typeof products === "undefined" || !Array.isArray(products)) return;

  const searchMarkup = `
    <div class="store-dialog-backdrop" data-search-backdrop hidden>
      <section class="store-search-dialog" role="dialog" aria-modal="true" aria-label="Search the FLYEST collection">
        <header class="store-dialog-header">
          <form class="store-search-form" data-search-form role="search">
            <input class="store-search-input" data-search-input type="search" placeholder="Search for..." aria-label="Search clothing" autocomplete="off" />
          </form>
          <button class="store-dialog-close" type="button" data-search-close aria-label="Close search">×</button>
        </header>
        <section class="store-top-searches" aria-labelledby="store-top-searches-title">
          <h2 id="store-top-searches-title">TOP SEARCHES</h2>
          <div class="store-top-search-list">
            <button type="button" data-search-term="Dream Hoodie">Dream Hoodie</button>
            <button type="button" data-search-term="Dream Shirt">Dream Shirt</button>
            <button type="button" data-search-term="Dream Short">Dream Short</button>
            <button type="button" data-search-term="Dream Pants">Dream Pants</button>
            <button type="button" data-search-term="Dream Sweater">Dream Sweater</button>
          </div>
        </section>
        <div class="store-search-results" data-search-results aria-live="polite">
          <p class="store-search-message">Search products by name, category, or color.</p>
        </div>
      </section>
    </div>
    <aside class="store-assistant">
      <section class="store-chat-panel" data-chat-panel role="dialog" aria-label="FLYEST store helper" hidden>
        <header class="store-chat-heading">
          <div><span class="store-chat-brand">FLYEST STORE HELPER</span><span class="store-chat-status" data-chat-status>Automatic replies · Always available</span></div>
          <button class="store-dialog-close" type="button" data-chat-close aria-label="Close assistant">×</button>
        </header>
        <div class="store-chat-messages" data-chat-messages aria-live="polite" aria-relevant="additions text">
          <div class="store-chat-message"><p>Hello. I’m FLYEST’s automatic store helper. Ask me about products, prices, sizes, shipping, exchanges, or payment methods.</p></div>
        </div>
        <div class="store-chat-chips">
          <button class="store-chat-chip" type="button">Show me hoodies</button>
          <button class="store-chat-chip" type="button">Find a tee</button>
          <button class="store-chat-chip" type="button">Shipping info</button>
        </div>
        <form class="store-chat-form" data-chat-form>
          <input class="store-chat-input" data-chat-input type="text" maxlength="1200" placeholder="Ask about FLYEST..." aria-label="Message the store helper" autocomplete="off" />
          <button class="store-chat-send" type="submit" aria-label="Send message">➤</button>
        </form>
        <p class="store-chat-disclosure">Automatic replies cover common store questions. Please don’t share payment or personal information.</p>
      </section>
      <button class="store-chat-toggle" type="button" data-chat-toggle aria-expanded="false" aria-label="Open FLYEST store helper">
        <span aria-hidden="true">✦</span><span>STORE HELPER</span>
      </button>
    </aside>`;
  document.body.insertAdjacentHTML("beforeend", searchMarkup);

  const backdrop = document.querySelector("[data-search-backdrop]");
  const searchInput = document.querySelector("[data-search-input]");
  const searchResults = document.querySelector("[data-search-results]");
  const chatPanel = document.querySelector("[data-chat-panel]");
  const chatToggle = document.querySelector("[data-chat-toggle]");
  const chatMessages = document.querySelector("[data-chat-messages]");
  const chatInput = document.querySelector("[data-chat-input]");
  const chatForm = chatPanel.querySelector("[data-chat-form]");
  const chatSend = chatForm.querySelector(".store-chat-send");
  const searchTokens = (value) => value.toLowerCase().match(/[a-z0-9]+/g) || [];
  const productUrl = (product) => `${product.category === "hoodies" ? "hoodie" : "shirt"}.html?id=${encodeURIComponent(product.id)}`;
  const priceFor = (product) => product.price;

  const storeEmail = "flyestclothing.ph@gmail.com";
  const availableProducts = products.filter((product) => !product.isSoldOut);
  const stopWords = new Set(["a", "an", "and", "find", "for", "i", "me", "my", "of", "please", "show", "the", "to", "want", "with"]);
  const wordsIn = (value) => value.toLowerCase().match(/[a-z0-9]+/g) || [];
  const categoryFor = (query) => {
    if (/\b(hoodie|hoodies|sweatshirt|sweatshirts)\b/i.test(query)) return "hoodies";
    if (/\b(tee|tees|t-shirt|t-shirts|tshirt|tshirts|shirt|shirts)\b/i.test(query)) return "shirts";
    if (/\b(sweater|sweaters|quarter zip|quarter zips)\b/i.test(query)) return "sweaters";
    if (/\b(polo|polos)\b/i.test(query)) return "polos";
    if (/\b(pant|pants|trouser|trousers)\b/i.test(query)) return "pants";
    if (/\b(short|shorts)\b/i.test(query)) return "shorts";
    return null;
  };

  const getStoreReply = (query) => {
    const text = query.toLowerCase();
    const category = categoryFor(query);
    const budgetMatch = text.match(/(?:under|below|less than|max(?:imum)?|budget(?: of)?|₱|php)\s*(?:₱|php)?\s*([\d,]+)/i);
    const budget = budgetMatch ? Number(budgetMatch[1].replace(/,/g, "")) : null;

    if (/\b(hello|hi|hey|good morning|good afternoon|good evening)\b/i.test(text)) {
      return { message: "Hi! I can help you find products, check prices and sizes, or answer questions about delivery and exchanges. What are you looking for?", matches: [] };
    }
    if (/\b(thanks|thank you|thx)\b/i.test(text)) {
      return { message: `You’re welcome! If you need anything else, email us at ${storeEmail}.`, matches: [] };
    }
    if (/\b(ship|shipping|delivery|deliver|courier|j&t|j and t)\b/i.test(text)) {
      return { message: "Shipping rates and availability depend on your destination. Contact flyestclothing.ph@gmail.com to confirm delivery options and costs before ordering.", matches: [] };
    }
    if (/\b(exchange|exchanges|return|returns|refund|refunds)\b/i.test(text)) {
      return { message: `Exchanges are accepted within 7–14 days after delivery for unworn items with tags attached, including wrong-size exchanges. Please contact ${storeEmail} for help with an order. Contact us about refund requests; I can’t confirm a refund policy here.`, matches: [] };
    }
    if (/\b(size|sizing|fit|chest|length)\b/i.test(text)) {
      return { message: "Hoodies have an oversized fit: choose your usual size for a relaxed fit or size down for a regular fit. Our size guide (chest × length, inches) is M 22 × 27, L 23 × 28, XL 24 × 29, 2XL 25 × 30, and 3XL 26 × 31. T-shirts are available in M–3XL; contact us if you need a tee measurement.", matches: [] };
    }
    if (/\b(pay|payment|payments|gcash|instapay|atome|qr)\b/i.test(text)) {
      return { message: "Checkout offers GCash and InstaPay QR payment. Select your method at checkout to see its QR instructions. Never share your PIN, password, or payment details in this chat.", matches: [] };
    }
    if (/\b(track|tracking|order|orders|where is my)\b/i.test(text)) {
      return { message: `I can’t look up orders or tracking details. Please contact ${storeEmail} or call 0924 443 0173 for help.`, matches: [] };
    }
    if (/\b(contact|email|phone|human|person|support|help)\b/i.test(text) && !category) {
      return { message: `You can reach the FLYEST team at ${storeEmail} or call 0924 443 0173.`, matches: [] };
    }
    if (/\b(new|newest|latest)\b/i.test(text)) {
      return { message: "Here are the latest pieces in the current collection.", matches: availableProducts.slice(0, 3) };
    }

    const requestedWords = wordsIn(query).filter((word) => !stopWords.has(word) && !/^\d+$/.test(word) && !["available", "below", "budget", "color", "colors", "cost", "do", "dream", "have", "hoodie", "hoodies", "in", "less", "max", "maximum", "much", "of", "pants", "pant", "polo", "polos", "price", "prices", "product", "products", "shirt", "shirts", "short", "shorts", "stock", "sweater", "sweaters", "sweatshirt", "sweatshirts", "t", "tee", "tees", "than", "tshirt", "tshirts", "under", "what", "which"].includes(word));
    let matches = availableProducts.filter((product) => {
      if (category && product.category !== category) return false;
      if (budget !== null && priceFor(product) > budget) return false;
      if (!requestedWords.length) return Boolean(category || budget !== null);
      const searchable = wordsIn(`${product.name} ${product.id} ${product.category}`);
      return requestedWords.some((word) => searchable.includes(word));
    });

    if (matches.length) {
      matches = matches.sort((a, b) => Number(Boolean(b.isNewRelease)) - Number(Boolean(a.isNewRelease)) || priceFor(a) - priceFor(b)).slice(0, 3);
      const names = matches.map((product) => product.name).join(", ");
      const lead = budget !== null
        ? `Here ${matches.length === 1 ? "is a piece" : "are pieces"} under ₱${budget.toLocaleString("en-PH")}: ${names}.`
        : `Here ${matches.length === 1 ? "is a match" : "are a few matches"}: ${names}.`;
      return { message: `${lead} Current prices are shown on each product page.`, matches };
    }

    if (category) {
      if (budget !== null) {
        return { message: `I couldn’t find an available item in this category under ₱${budget.toLocaleString("en-PH")}.`, matches: [] };
      }
      matches = availableProducts.filter((product) => product.category === category).sort((a, b) => Number(Boolean(b.isNewRelease)) - Number(Boolean(a.isNewRelease)) || priceFor(a) - priceFor(b)).slice(0, 3);
      return { message: `Here are a few ${category} from the current collection.`,
      matches };
    }
    if (budget !== null) {
      matches = availableProducts.filter((product) => priceFor(product) <= budget).sort((a, b) => priceFor(a) - priceFor(b)).slice(0, 3);
      return matches.length
        ? { message: `Here are available pieces at or under ₱${budget.toLocaleString("en-PH")}.`, matches }
        : { message: `I couldn’t find an available item under ₱${budget.toLocaleString("en-PH")}.`, matches: [] };
    }
    return { message: "I’m an automatic store helper, so I can answer common questions about FLYEST products, prices, sizes, shipping, exchanges, and payment methods. Try “show me hoodies,” “find a tee,” or “what’s your shipping policy?”", matches: [] };
  };

  const closeSearch = () => {
    backdrop.hidden = true;
    trigger.focus();
  };
  const closeChat = () => {
    chatPanel.hidden = true;
    chatToggle.setAttribute("aria-expanded", "false");
    chatToggle.focus();
  };

  const renderSearch = (query) => {
    const terms = searchTokens(query);
    const matches = products.filter((product) => {
      const aliases = {
        hoodies: "dream hoodie hoodies sweatshirt sweatshirts",
        shirts: "dream shirt tee tees tshirt tshirts shirt shirts",
        shorts: "dream short shorts",
        pants: "dream pants pant trousers",
        sweaters: "dream sweater sweaters quarter zip",
        polos: "dream polo polos",
      }[product.category] || "";
      const searchable = new Set(searchTokens(`${product.name} ${product.category} ${product.id} ${aliases}`));
      return terms.every((term) => searchable.has(term));
    });
    searchResults.replaceChildren();
    if (!matches.length) {
      const message = document.createElement("p");
      message.className = "store-search-message";
      message.textContent = "No matching pieces in the current collection yet. Try a hoodie color or shirt design.";
      searchResults.appendChild(message);
      return;
    }

    matches.slice(0, 12).forEach((product) => {
      const link = document.createElement("a");
      link.className = "store-search-result";
      link.href = productUrl(product);
      const image = document.createElement("img");
      image.src = product.image;
      image.alt = "";
      image.loading = "lazy";
      const details = document.createElement("span");
      const name = document.createElement("span");
      name.className = "store-search-result-name";
      name.textContent = product.name;
      const category = document.createElement("span");
      category.className = "store-search-result-category";
      category.textContent = product.category === "shirts" ? "TEE" : product.category.slice(0, -1).toUpperCase();
      details.append(name, category);
      if (product.isSoldOut) {
        const soldOut = document.createElement("span");
        soldOut.className = "store-search-soldout";
        soldOut.textContent = "SOLD OUT";
        details.appendChild(soldOut);
      }
      const price = document.createElement("span");
      price.className = "store-search-result-price";
      price.textContent = `₱${priceFor(product).toLocaleString("en-PH")}`;
      link.append(image, details, price);
      searchResults.appendChild(link);
    });
  };

  const addChatMessage = (text, className = "") => {
    const message = document.createElement("div");
    message.className = `store-chat-message ${className}`.trim();
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    message.appendChild(paragraph);
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return message;
  };

  const appendProductLinks = (message, matches) => {
    if (!matches.length) return;
    const list = document.createElement("div");
    list.className = "store-chat-products";
    matches.slice(0, 3).forEach((product) => {
      const link = document.createElement("a");
      link.className = "store-chat-product";
      link.href = productUrl(product);
      const image = document.createElement("img");
      image.src = product.image;
      image.alt = "";
      const info = document.createElement("span");
      info.append(document.createTextNode(product.name));
      const price = document.createElement("small");
      price.textContent = product.isSoldOut
        ? "SOLD OUT"
        : `₱${priceFor(product).toLocaleString("en-PH")}`;
      info.appendChild(price);
      link.append(image, info);
      list.appendChild(link);
    });
    message.appendChild(list);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const sendChat = (rawText) => {
    const query = rawText.trim();
    if (!query || chatSend.disabled) return;
    addChatMessage(query, "store-chat-message-user");
    chatInput.value = "";
    chatSend.disabled = true;
    chatInput.disabled = true;
    const result = getStoreReply(query);
    const answer = addChatMessage(result.message);
    appendProductLinks(answer, result.matches);
    chatSend.disabled = false;
    chatInput.disabled = false;
    chatInput.focus();
  };

  trigger.addEventListener("click", () => {
    chatPanel.hidden = true;
    chatToggle.setAttribute("aria-expanded", "false");
    backdrop.hidden = false;
    searchInput.focus();
  });
  backdrop.querySelector("[data-search-close]").addEventListener("click", closeSearch);
  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) closeSearch();
  });
  backdrop.querySelector("[data-search-form]").addEventListener("submit", (event) => {
    event.preventDefault();
    renderSearch(searchInput.value.trim());
  });
  backdrop.querySelectorAll("[data-search-term]").forEach((button) => {
    button.addEventListener("click", () => {
      searchInput.value = button.dataset.searchTerm;
      renderSearch(searchInput.value);
      searchInput.focus();
    });
  });
  searchInput.addEventListener("input", () => {
    if (searchInput.value.trim()) renderSearch(searchInput.value.trim());
    else searchResults.innerHTML = '<p class="store-search-message">Search products by name, category, or color.</p>';
  });

  chatToggle.addEventListener("click", () => {
    const open = chatPanel.hidden;
    backdrop.hidden = true;
    chatPanel.hidden = !open;
    chatToggle.setAttribute("aria-expanded", String(open));
    if (open) chatInput.focus();
  });
  chatPanel.querySelector("[data-chat-close]").addEventListener("click", closeChat);
  chatForm.addEventListener("submit", (event) => {
    event.preventDefault();
    sendChat(chatInput.value);
  });
  chatPanel.querySelectorAll(".store-chat-chip").forEach((chip) => {
    chip.addEventListener("click", () => sendChat(chip.textContent));
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (!backdrop.hidden) closeSearch();
      if (!chatPanel.hidden) closeChat();
    }
  });
})();
