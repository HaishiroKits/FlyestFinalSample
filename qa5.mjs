export default async function run(page) {
  // product page: size required, then add
  await page.goto("file:///c:/Users/Asus Vivobook/Desktop/sample 1 flyest/hoodie.html?id=grey");
  await page.waitForTimeout(300);
  await page.evaluate(() => document.getElementById("addBtn").click());
  await page.waitForTimeout(200);
  const noSize = await page.evaluate(() => ({
    toast: document.getElementById("toast").textContent,
    btnDisabled: document.getElementById("addBtn").disabled,
  }));

  await page.locator('.size-btn[data-size="2XL"]').click();
  await page.waitForTimeout(100);
  const afterSize = await page.evaluate(() => ({
    btnText: document.getElementById("addBtn").textContent,
    hint: document.getElementById("sizeHint").textContent,
  }));
  await page.evaluate(() => document.getElementById("addBtn").click());
  await page.waitForTimeout(300);
  const added = await page.evaluate(() => ({
    count: document.getElementById("cartCount").textContent,
    total: document.getElementById("cartTotal").textContent,
  }));

  // also-grid: 5 other hoodies, links to other product pages
  const also = await page.evaluate(() => {
    const links = [...document.querySelectorAll("#alsoGrid .also-card")].map((a) => a.getAttribute("href"));
    return { count: links.length, first: links[0] };
  });

  // navigate via also-card to another hoodie
  await page.locator("#alsoGrid .also-card").first().click();
  await page.waitForTimeout(400);
  const nav = await page.evaluate(() => ({
    url: location.href,
    name: document.getElementById("pName").textContent,
    count: document.getElementById("cartCount").textContent, // cart persists across pages
  }));

  // homepage cards link to product pages
  await page.goto("file:///c:/Users/Asus Vivobook/Desktop/sample 1 flyest/index.html");
  await page.waitForTimeout(400);
  const home = await page.evaluate(() => ({
    cards: [...document.querySelectorAll("#productGrid a.card")].map((a) => a.getAttribute("href")).slice(0, 3),
    hasSizeButtons: !!document.querySelector("#productGrid .size-btn"),
  }));

  return { noSize, afterSize, added, also, nav, home };
}
