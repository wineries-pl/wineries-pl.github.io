// Собирает GitHub Pages из артефакта: /pl/, /en/, /ru/ + корень с выбором языка.
// node site/build.mjs [outDir]
import fs from "node:fs";
import path from "node:path";

const ORIGIN = "https://wineries-pl.github.io";
const out = process.argv[2] || "_site";
const fragment = fs.readFileSync("artifact/winnice-polska.html", "utf8").replace(/^<title>.*<\/title>\n/, "");

// данные мест для JSON-LD берём прямо из скрипта артефакта
const js = fragment.match(/<script>([\s\S]*)<\/script>/)[1];
const { PLACES, TX } = new Function(js.slice(js.indexOf("var PLACES"), js.indexOf("var UI")) + "return {PLACES, TX};")();
const SITE_NAME = "Winnice w Polsce";
const ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fill="#6B3B63" d="M16 31C12 25 6 19 6 12a10 10 0 0 1 20 0c0 7-6 13-10 19z"/><circle cx="16" cy="12" r="4.5" fill="#F8F9F5"/></svg>`;
const jsonld = (l, url) => JSON.stringify({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: META[l].title,
  description: META[l].desc,
  url,
  inLanguage: l,
  numberOfItems: PLACES.length,
  itemListElement: PLACES.map((p, i) => ({
    "@type": "ListItem",
    position: p.n,
    item: {
      "@type": p.stay === "hotel" ? "Hotel" : "LodgingBusiness",
      name: p.name,
      description: TX[l][i].lede,
      url: p.web[1],
      address: { "@type": "PostalAddress", streetAddress: p.addr, addressRegion: TX[l][i].region, addressCountry: "PL" },
      geo: { "@type": "GeoCoordinates", latitude: p.lat, longitude: p.lon },
      ...(p.tel[0] ? { telephone: p.tel[0] } : {}),
      ...(p.mail ? { email: p.mail } : {}),
      priceRange: TX[l][i].price,
    },
  })),
}).replace(/</g, "\\u003c");

const META = {
  pl: {
    title: "Winnice w Polsce z noclegiem i kolacją — mapa",
    desc: "12 polskich winnic, w których zjesz kolację i zostaniesz na noc: restauracja lub kolacja na zamówienie, hotel, pokoje lub domek. Interaktywna mapa, ceny i kontakty.",
    locale: "pl_PL",
  },
  en: {
    title: "Polish wineries with dinner and an overnight stay — map",
    desc: "12 Polish wineries where you can have dinner and stay the night: on-site restaurant or dinner on request, hotel, rooms or a cottage. Interactive map, prices and contacts.",
    locale: "en_GB",
  },
  ru: {
    title: "Винодельни Польши с ужином и ночлегом — карта",
    desc: "12 польских виноделен, где можно поужинать и остаться на ночь: ресторан или ужин по заказу, отель, комнаты или домик. Интерактивная карта, цены и контакты.",
    locale: "ru_RU",
  },
};
const LANGS = Object.keys(META);
const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const alternates = LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${ORIGIN}/${l}/">`)
  .concat(`<link rel="alternate" hreflang="x-default" href="${ORIGIN}/en/">`).join("\n");

for (const l of LANGS) {
  const m = META[l];
  const url = `${ORIGIN}/${l}/`;
  const html = `<!doctype html>
<html lang="${l}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(m.title)}</title>
<meta name="description" content="${esc(m.desc)}">
<link rel="canonical" href="${url}">
${alternates}
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(m.title)}">
<meta property="og:description" content="${esc(m.desc)}">
<meta property="og:locale" content="${m.locale}">
${LANGS.filter((a) => a !== l).map((a) => `<meta property="og:locale:alternate" content="${META[a].locale}">`).join("\n")}
<meta property="og:site_name" content="${SITE_NAME}">
<meta property="og:image" content="${ORIGIN}/og-${l}.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(m.title)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(m.title)}">
<meta name="twitter:description" content="${esc(m.desc)}">
<meta name="twitter:image" content="${ORIGIN}/og-${l}.png">
<meta name="theme-color" content="#F8F9F5" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#171F1A" media="(prefers-color-scheme: dark)">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<script type="application/ld+json">${jsonld(l, url)}</script>
</head>
<body>
${fragment}
</body>
</html>
`;
  fs.mkdirSync(path.join(out, l), { recursive: true });
  fs.writeFileSync(path.join(out, l, "index.html"), html);
}

const links = LANGS.map((l) => `<li><a href="${l}/" hreflang="${l}" lang="${l}">${esc(META[l].title)}</a></li>`).join("\n");
fs.writeFileSync(path.join(out, "index.html"), `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Winnice w Polsce · Polish wineries · Винодельни Польши</title>
<link rel="canonical" href="${ORIGIN}/">
${alternates}
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<meta property="og:title" content="${SITE_NAME}">
<meta property="og:image" content="${ORIGIN}/og-en.png">
<meta name="twitter:card" content="summary_large_image">
<script>
(function(){
  var langs=${JSON.stringify(LANGS)}, pick="en";
  try{var v=localStorage.getItem("winnice-lang"); if(langs.indexOf(v)>-1) pick=v}catch(e){}
  location.replace(pick+"/");
})();
</script>
<style>body{font-family:system-ui,sans-serif;margin:40px 16px;background:#F8F9F5;color:#151E19}a{color:#6B3B63}
@media (prefers-color-scheme:dark){body{background:#171F1A;color:#E4EADF}a{color:#C98CBF}}</style>
</head>
<body>
<ul>
${links}
</ul>
</body>
</html>
`);

fs.writeFileSync(path.join(out, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${LANGS.map((l) => `<url><loc>${ORIGIN}/${l}/</loc>
${LANGS.map((a) => `<xhtml:link rel="alternate" hreflang="${a}" href="${ORIGIN}/${a}/"/>`).join("\n")}
</url>`).join("\n")}
</urlset>
`);
fs.writeFileSync(path.join(out, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${ORIGIN}/sitemap.xml\n`);
fs.writeFileSync(path.join(out, "favicon.svg"), ICON);
for (const l of LANGS) fs.copyFileSync(`site/og-${l}.png`, path.join(out, `og-${l}.png`));
