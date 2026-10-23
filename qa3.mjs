export default async function run(page) {
  // add hoodie, checkout
  await page.locator('.size-btn[data-size="XL"]').first().click();
  await page.locator("button.add-btn").first().click();
  await page.waitForTimeout(300);
  await page.evaluate(() => document.getElementById("checkoutBtn").click());
  await page.waitForTimeout(600);
  // wait for modal + also-like grid
  await page.waitForSelector("#alsoGrid .also-card", { state: "attached", timeout: 10000 });
  const alsoLike = await page.evaluate(() => document.querySelectorAll("#alsoGrid .also-card").length);

  // fill address
  await page.fill("#email", "test@flyest.ph");
  await page.fill("#name", "Maria Santos");
  await page.fill("#phone", "09171234567");
  await page.fill("#house", "45");
  await page.fill("#street", "Bonifacio Dr");
  await page.fill("#barangay", "Real");
  await page.fill("#city", "Calamba");
  await page.fill("#province", "Laguna");
  await page.fill("#postal", "4027");
  await page.evaluate(() => document.getElementById("checkoutForm").requestSubmit());
  await page.waitForTimeout(300);

  // step 2: scan to pay
  const payStep = await page.evaluate(() => ({
    shown: !document.getElementById("checkoutStepPay").classList.contains("hidden"),
    amount: document.getElementById("qrAmount").textContent,
    qrSrc: document.getElementById("qrImage").getAttribute("src"),
  }));

  // upload receipt
  await page.setInputFiles("#receiptFile", "C:/Users/Asus Vivobook/Desktop/sample 1 flyest/Gcash Logo.png");
  await page.waitForTimeout(300);
  const previewShown = await page.evaluate(() => !document.getElementById("receiptPreview").classList.contains("hidden"));

  // confirm paid
  await page.evaluate(() => document.getElementById("paidBtn").click());
  await page.waitForTimeout(500);
  const step3 = await page.evaluate(() => ({
    shown: !document.getElementById("checkoutStep2").classList.contains("hidden"),
    pay: document.getElementById("confirmPay").textContent,
    tracking: document.getElementById("waybillTracking").textContent,
    cod: document.getElementById("wbCod").textContent,
  }));
  await page.screenshot({ path: "C:/Users/Asus Vivobook/Desktop/sample 1 flyest/pay-preview.png" });
  return { alsoLike, payStep, previewShown, step3 };
}
