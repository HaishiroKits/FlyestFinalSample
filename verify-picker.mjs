export default async function (page) {
  const initial = await page.locator('#pickerSelection').innerText();
  await page.getByRole('button', { name: 'Flyest Sky Blue Hoodie' }).click();
  const result = await page.evaluate(() => ({
    selected: document.querySelector('#pickerSelection').textContent,
    image: document.querySelector('#pickerImage').getAttribute('src'),
    shop: document.querySelector('#pickerShop').getAttribute('href'),
    pressed: document.querySelectorAll('.picker-option[aria-pressed="true"]').length,
    missingImages: [...document.images].filter(img => !img.complete || !img.naturalWidth).map(img => img.src),
    overflow: document.documentElement.scrollWidth > window.innerWidth,
  }));
  await page.setViewportSize({ width: 390, height: 844 });
  result.mobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  return { initial, ...result };
}
