import * as fs from "node:fs";
import * as path from "node:path";

import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import puppeteer from "puppeteer";

const TARGET_URL = "https://trve.in";

(async () => {
  const currentDate = new Date().toISOString().split("T")[0];
  const folderPath = path.join(__dirname, "screenshots", currentDate);

  if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

  const screenshotSource = path.join(folderPath, "source.png");
  const screenshotToCompare = path.join(folderPath, "to-compare.png");
  const screenshotDiff = path.join(folderPath, "diff.png");
  const diffTextFile = path.join(folderPath, "diff.txt");

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.goto(TARGET_URL, { waitUntil: "networkidle0" });

  const originalExists = fs.existsSync(screenshotSource);

  if (!originalExists) {
    await page.screenshot({ path: screenshotSource, fullPage: true });

    console.log(
      `No source screenshot found for ${currentDate}. "source.png" created.`,
    );
  } else {
    await page.screenshot({ path: screenshotToCompare, fullPage: true });

    const imgSource = PNG.sync.read(fs.readFileSync(screenshotSource));
    const imgToCompare = PNG.sync.read(fs.readFileSync(screenshotToCompare));

    if (
      imgSource.width !== imgToCompare.width ||
      imgSource.height !== imgToCompare.height
    ) {
      console.log(
        "The images have different dimensions. Comparison is not possible.",
      );

      await browser.close();
      return;
    }

    const { width, height } = imgSource;
    const diff = new PNG({ width, height });

    const differingPixels = pixelmatch(
      imgSource.data,
      imgToCompare.data,
      diff.data,
      width,
      height,
      { threshold: 0.1 }, // tolerância para detectar diferenças
    );

    fs.writeFileSync(screenshotDiff, PNG.sync.write(diff));

    const totalPixels = width * height;
    const fractionDiff = differingPixels / totalPixels;
    const percentageString = (fractionDiff * 100).toFixed(0);

    console.log(`Difference detected: ${percentageString}%`);

    fs.writeFileSync(diffTextFile, fractionDiff.toFixed(4));
  }

  await browser.close();
})();
