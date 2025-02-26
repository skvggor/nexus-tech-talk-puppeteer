import puppeteer from "puppeteer";

const TARGET_URL = "https://trve.in";

(async () => {
  const browser = await puppeteer.launch({
    // headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.goto(TARGET_URL, { waitUntil: "networkidle0" });

  await page.setViewport({ width: 1920, height: 1080 });

  await page.waitForSelector(".track");
  await page.waitForSelector(".artist");

  const track = await page.$eval(".track", (text) => text.textContent?.trim());
  const artist = await page.$eval(".artist", (text) =>
    text.textContent?.trim(),
  );

  console.log(`The latest song is "${track}" by ${artist}`);

  await browser.close();
})();
