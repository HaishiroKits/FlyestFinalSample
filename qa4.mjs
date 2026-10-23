export default async function run(page) {
  // 1. size required: click ADD without size
  await page.locator("button.add-btn").first().click();
  await page.waitForTimeout(300);
  const noSize = await page.evaluate(() => ({
    cartCount: document.getElementById("cartCount").textContent,
    toast: document.getElementById("toast").textContent,
  }));

  // 2. pick size then add
  await page.locator('.size-btn[data-size="M"]').first().click();
  await page.locator("button.add-btn").first().click();
  await page.waitForTimeout(300);
  const withSize = await page.evaluate(() => document.getElementById("cartCount").textContent);

  // 3. lookbook page loads and links work
  await page.goto("file:///c:/Users/Asus Vivobook/Desktop/sample 1 flyest/lookbook.html");
  await page.waitForTimeout(300);
  const lb = await page.evaluate(() => ({
    title: document.title,
    images: document.querySelectorAll(".lb-item img").length,
    imgsLoaded: [...document.querySelectorAll(".lb-item img")].every((i) => i.complete && i.naturalWidth > 0),
  }));
  const backLink = await page.locator('a.lb-back[href="index.html"]').count();
  await page.screenshot({ path: "C:/Users/Asus Vivobook/Desktop/sample 1 flyest/lookbook-preview.png" });
  return { noSize, withSize, lb, backLink };
}
