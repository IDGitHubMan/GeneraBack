const express = require("express"); // Adding Express
const app = express(); // Initializing Express
const puppeteer = require("puppeteer"); // Adding Puppeteer

// Making Express listen on port 7000
app.listen(1000, () => {
  console.log(`Running on port 7000.`);
});

app.get("/", (req, res) => {
  url = "https://interstitia-is.web.app/genera/";
  url += `${req.query.gen}?`;
  let count = 0;
  for (key in req.query) {
    console.log(`${key}: ${req.query[key]}`);
    if (!(key === "gen")) {
      if (count === 0) {
        url += `${key}=${req.query[key]}`;
        count += 1;
      } else {
        url += `&${key}=${req.query[key]}`;
      }
    }
  }
  console.log(url);
  // Launching the Puppeteer controlled headless browser and navigate to the Digimon website
  puppeteer.launch().then(async function (browser) {
    const page = await browser.newPage();
    await page.goto(url);

    await page.waitForTimeout(2000);

    await page.screenshot({ path: "genCap.png" });

    // Closing the Puppeteer controlled headless browser
    await browser.close();
  });
  res.sendFile("genCap.png", { root: __dirname });
});
