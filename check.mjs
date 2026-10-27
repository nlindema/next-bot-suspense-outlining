// Fetches each route as an HTML-limited bot (from Next's default htmlLimitedBots list) and as a
// browser, and reports where the Suspense content ends up in the HTML.
const BASE = process.env.BASE ?? "http://localhost:3000";
const AGENTS = {
  "Twitterbot (htmlLimitedBots default)": "Twitterbot/1.0",
  "bingbot (htmlLimitedBots default)":
    "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
  "Chrome": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
};

for (const path of ["/", "/small/", "/slow/"]) {
  for (const [name, ua] of Object.entries(AGENTS)) {
    const res = await fetch(BASE + path, { headers: { "user-agent": ua } });
    const html = await res.text();
    const main = html.slice(html.indexOf("<main>"), html.indexOf("</main>"));
    console.log(
      [
        `${path.padEnd(8)} ${name.padEnd(38)}`,
        `status ${res.status}`,
        `fallback in <main>: ${main.includes('id="fallback"')}`,
        `items in <main>: ${main.includes('id="items"')}`,
        `items in hidden div: ${/<div hidden id="S:\d+">[\s\S]*?id="items"/.test(html)}`,
        `HTML ${html.length} B`,
      ].join(" | "),
    );
  }
}
