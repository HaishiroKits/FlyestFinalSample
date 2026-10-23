export default async function (page, ui) {
  await page.getByRole('button', { name: 'M', exact: true }).click();
  await page.locator('#addBtn').click();
  const added = await page.evaluate(() => ({ count: document.querySelector('#cartCount').textContent, open: document.querySelector('#cartDrawer').classList.contains('open'), item: document.querySelector('#cartItems').textContent, saved: JSON.parse(localStorage.getItem('flyest_cart')) }));
  await page.goto(new URL('index.html', page.url()).href);
  const home = await page.evaluate(() => ({ count: document.querySelector('#cartCount').textContent, item: document.querySelector('#cartItems').textContent }));
  if (added.count !== '1' || !added.open || !added.item.includes('Black') || home.count !== '1') throw Error(JSON.stringify({ added, home }));
  return { added, home };
}
