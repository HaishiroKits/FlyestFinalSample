document.querySelectorAll(".shop-menu-toggle").forEach((toggle) => {
  const item = toggle.closest(".shop-menu");
  const categories = item.querySelectorAll("[data-mega-category]");
  const panels = item.querySelectorAll("[data-mega-panel]");
  const setOpen = (open) => {
    item.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };
  const selectCategory = (category) => {
    categories.forEach((button) => {
      const selected = button.dataset.megaCategory === category;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-selected", String(selected));
    });
    panels.forEach((panel) => {
      const selected = panel.dataset.megaPanel === category;
      panel.classList.toggle("is-active", selected);
      panel.hidden = !selected;
    });
  };

  toggle.addEventListener("click", () => {
    setOpen(!item.classList.contains("open"));
  });
  item.addEventListener("mouseenter", () => toggle.setAttribute("aria-expanded", "true"));
  item.addEventListener("mouseleave", () => {
    if (!item.classList.contains("open")) toggle.setAttribute("aria-expanded", "false");
  });
  item.addEventListener("focusout", (event) => {
    if (!item.contains(event.relatedTarget)) setOpen(false);
  });
  categories.forEach((button) => {
    button.addEventListener("mouseenter", () => selectCategory(button.dataset.megaCategory));
    button.addEventListener("focus", () => selectCategory(button.dataset.megaCategory));
    button.addEventListener("click", () => selectCategory(button.dataset.megaCategory));
  });
  item.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setOpen(false)));
  document.addEventListener("click", (event) => {
    if (!item.contains(event.target)) setOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setOpen(false);
      toggle.blur();
    }
  });
});
