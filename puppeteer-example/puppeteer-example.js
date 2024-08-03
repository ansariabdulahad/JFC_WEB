// puppeteer-example.js

const puppeteer = require('puppeteer');

(async () => {
    // Launch a headless browser
    const browser = await puppeteer.launch();

    // Open a new page
    const page = await browser.newPage();

    // Navigate to a website
    await page.goto('https://example.com');

    // Take a screenshot
    await page.screenshot({ path: 'example.png' });

    // Close the browser
    await browser.close();
})();
