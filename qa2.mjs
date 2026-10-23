export default async function run(page, ui) {
  // add hoodie, checkout, submit
  await page.locator('.size-btn[data-size="XL"]').first().click();
  await page.locator("button.add-btn").first().click();
  await page.waitForTimeout(300);
  await page.evaluate(() => document.getElementById("checkoutBtn").click());
  await page.fill("#email", "test@flyest.ph");
  await page.fill("#name", "Maria Santos");
  await page.fill("#phone", "09171234567");
  await page.fill("#house", "45");
  await page.fill("#street", "Bonifacio Dr");
  await page.fill("#barangay", "Real");
  await page.fill("#city", "Calamba");
  await page.fill("#province", "Laguna");
  await page.fill("#postal", "4027");
  // switch to Atome
  await page.check('input[name="payment"][value="Atome"]');
  await page.evaluate(() => document.getElementById("checkoutForm").requestSubmit());
  await page.waitForTimeout(300);
  const modal = await page.evaluate(() => {
    return {
      pay: document.getElementById("confirmPay").textContent,
      cod: document.getElementById("wbCod").textContent,
      items: document.getElementById("wbItems").textContent,
      addr: document.getElementById("wbAddress").innerText,
      sender: document.querySelector(".waybill-col p").textContent,
      phone: document.getElementById("wbPhone").textContent,
      tracking: document.getElementById("waybillTracking").textContent,
    };
  });
  // screenshot the waybill
  await page.screenshot({ path: "C:/Users/Asus Vivobook/Desktop/sample 1 flyest/waybill-preview.png" });
  return modal;
}
