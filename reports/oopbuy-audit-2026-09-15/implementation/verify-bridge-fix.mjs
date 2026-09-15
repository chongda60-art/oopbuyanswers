import playwright from "file:///E:/seo/node_modules/.pnpm/playwright@1.61.1/node_modules/playwright/index.js";
const { chromium } = playwright;
import fs from "node:fs";
const outDir = "F:/seojieliu/reports/oopbuy-audit-2026-09-15/implementation";
fs.mkdirSync(outDir,{recursive:true});
const pages = [
  "/questions/oopbuy-shipping-cost",
  "/questions/oopbuy-shipping-time",
  "/questions/oopbuy-qc-photos-not-showing",
  "/topics/qc",
  "/topics/product-links",
  "/topics/shipping"
];
const forbidden = ["New Products","Oopbuy product research"];
const browser = await chromium.launch({headless:true});
const results = [];
for (const path of pages) {
  const page = await browser.newPage({viewport:{width:390,height:844}});
  const url = "https://oopbuyanswers.com" + path;
  const started = Date.now();
  try {
    const response = await page.goto(url,{waitUntil:"networkidle",timeout:30000});
    const body = await page.locator("body").innerText();
    const html = await page.content();
    const hrefs = await page.locator('a[href*="www.curicart.com"]').evaluateAll(as=>as.map(a=>a.href));
    const badUtm = hrefs.filter(h=>!h.includes("utm_source=oopbuyanswers") || !h.includes("utm_medium=referral") || !h.includes("utm_campaign=oopbuy_questions") || h.includes("\\"));
    const metrics = await page.evaluate(()=>({innerWidth:innerWidth,scrollWidth:document.documentElement.scrollWidth,bodyScrollWidth:document.body.scrollWidth,h1:document.querySelectorAll("h1").length}));
    for (const word of forbidden) if (body.includes(word)) throw new Error("forbidden label: " + word);
    if (badUtm.length) throw new Error("bad UTM links: " + badUtm.join(","));
    if (metrics.scrollWidth > metrics.innerWidth || metrics.bodyScrollWidth > metrics.innerWidth) throw new Error("horizontal overflow");
    const name = path === "/topics/qc" ? "topic-qc" : path === "/topics/product-links" ? "topic-product-links" : path === "/topics/shipping" ? "topic-shipping" : path.split("/").pop();
    await page.screenshot({path:outDir + "/" + name + "-mobile-390.png",fullPage:true});
    await page.setViewportSize({width:1440,height:900});
    await page.screenshot({path:outDir + "/" + name + "-desktop.png",fullPage:true});
    results.push({path,status:response?.status()??null,forbidden_count:0,curicart_links:hrefs.length,bad_utm:0,horizontal_overflow:false,h1:metrics.h1,elapsed_ms:Date.now()-started});
  } catch (error) {
    results.push({path,status:"error",error:String(error),elapsed_ms:Date.now()-started});
  } finally { await page.close(); }
}
await browser.close();
fs.writeFileSync(outDir + "/BRIDGE_FIX_VERIFICATION.json",JSON.stringify({checked_at:new Date().toISOString(),production:"https://oopbuyanswers.com",results},null,2));
if (results.some(r=>r.status==="error")) process.exitCode=1;
