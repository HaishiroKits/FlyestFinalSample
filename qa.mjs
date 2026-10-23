export default async function run(page, ui) {
  const results = {};
  // 1. Add a hoodie with a size
  await page.locator('.size-btn[data-size="L"]').first().click();
  const addBtns = await page.locator("button.add-btn").all();
  await addBtns[0].click();
  await page.waitForTimeout(400);
  results.cartCount = await page.evaluate(() => document.getElementById("cartCount").textContent);
  results.cartTotal = await page.evaluate(() => document.getElementById("cartTotal").textContent);

  // 2. Checkout
  await page.evaluate(() => document.getElementById("checkoutBtn").click());
  await page.waitForTimeout(300);
  results.modalOpen = await page.evaluate(() => document.getElementById("checkoutModal").classList.contains("open"));

  // 3. Fill the form
  await page.fill("#email", "test@flyest.ph");
  await page.fill("#name", "Juan Dela Cruz");
  await page.fill("#phone", "09171234567");
  await page.fill("#house", "123");
  await page.fill("#street", "Rizal St.");
  await page.fill("#barangay", "Poblacion");
  await page.fill("#city", "Calamba");
  await page.fill("#province", "Laguna");
  await page.fill("#postal", "4027");

  // 4. Submit
  await page.evaluate(() => document.getElementById("checkoutForm").requestSubmit());
  await page.waitForTimeout(300);
  results.step2Shown = await page.evaluate(() => !document.getElementById("checkoutStep2").classList.contains("hidden"));
  results.orderNo = await page.textContent("#orderNo");
  results.tracking = await page.textContent("#waybillTracking");
  results.waybillReceiver = await page.textContent("#wbReceiver");
  results.waybillCod = await page.textContent("#wbCod");
  results.payMethod = await page.textContent("#confirmPay");

  // 5. Notify me flow
  await page.evaluate(() => document.getElementById("doneBtn").click());
  await page.fill("#notifyEmail", "fan@email.com");
  await page.evaluate(() => document.getElementById("notifyBtn").click());
  await page.waitForTimeout(200);
  results.notifyToast = await page.textContent("#toast");
  results.notifyList = await page.evaluate(() => localStorage.getItem("flyest_notify"));
  return results;
}
