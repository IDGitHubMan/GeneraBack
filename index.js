const express = require("express"); // Adding Express
const app = express(); // Initializing Express
const puppeteer = require("puppeteer"); // Adding Puppeteer

import functions from "firebase-functions";
import cors from "cors";

app.use(cors());

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
    if (!(key === "gen" && !(key === "delay"))) {
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

    await page.waitForTimeout(req.query.delay ?? 1000);

    await page.screenshot({ path: "genCap.png" });

    await res.sendFile("genCap.png", { root: __dirname });

    // Closing the Puppeteer controlled headless browser
    await browser.close();
  });
});

export const api = functions.https.onRequest(app);
