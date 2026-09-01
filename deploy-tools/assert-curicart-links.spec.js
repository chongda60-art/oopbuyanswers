const { test } = require("@playwright/test");

const baseUrl = process.env.OOPBUY_PRODUCTION_URL || "https://oopbuyanswers.com";
const paths = (process.env.OOPBUY_ASSERT_PATHS || "/,/questions,/questions/oopbuy-qc-photos,/topics/qc,/sources")
  .split(",")
  .map((path) => path.trim())
  .filter(Boolean);

test.use({ channel: "chrome" });

async function gotoWithRetry(page, url) {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
      return;
    } catch (error) {
      lastError = error;
      if (attempt < 3) {
        await page.waitForTimeout(2000);
      }
    }
  }
  throw lastError;
}

test("CuriCart links use complete Oopbuy Answers UTM parameters", async ({ page }) => {
  const badLinks = [];
  let totalLinks = 0;

  for (const path of paths) {
    const url = new URL(path, baseUrl).toString();
    await gotoWithRetry(page, url);
    const hrefs = await page.$$eval("a[href^='https://www.curicart.com']", (anchors) =>
      anchors.map((anchor) => anchor.href)
    );

    let pageBad = 0;
    for (const href of hrefs) {
      totalLinks += 1;
      if (href.endsWith("\\")) {
        pageBad += 1;
        badLinks.push(`${path}\t${href}\ttrailing_backslash`);
        continue;
      }
      const parsed = new URL(href);
      const params = parsed.searchParams;
      const ok =
        parsed.origin === "https://www.curicart.com" &&
        params.get("utm_source") === "oopbuyanswers" &&
        params.get("utm_medium") === "referral" &&
        params.get("utm_campaign") === "oopbuy_questions" &&
        Boolean(params.get("utm_content"));
      if (!ok) {
        pageBad += 1;
        badLinks.push(`${path}\t${href}\tbad_utm`);
      }
    }

    console.log(`${path} curicart_links=${hrefs.length} bad_utm_links=${pageBad}`);
  }

  if (badLinks.length > 0) {
    throw new Error(`BAD_CURICART_UTM_LINKS\n${badLinks.join("\n")}`);
  }

  console.log(`CURICART_LINK_ASSERT_OK total_links=${totalLinks} bad_utm_links=0`);
});
