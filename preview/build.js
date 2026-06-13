#!/usr/bin/env node
// Generates the homepage design-option previews (optN.html) + the gallery (index.html).
// Every option reuses ONE shared HTML skeleton + base CSS (lifted from opt7.html) and
// differs only by: a :root palette block, the Google-Fonts <link>, and a layout class on
// <body> (lay-left / lay-center / lay-side / boxed / display-xl — all defined in the base CSS).
// To add or tweak an option, edit the OPTS table below and re-run `node build.js`.

const fs = require('fs');
const path = require('path');
const dir = __dirname;

// --- lift the shared skeleton out of opt7.html (content + base CSS) ---
const tmpl = fs.readFileSync(path.join(dir, 'opt7.html'), 'utf8');
const styleInner = tmpl.match(/<style>([\s\S]*?)<\/style>/)[1];
const BASE_CSS = styleInner.replace(/^:root\{[^}]*\}\s*/, '');          // drop opt7's own palette
const BODY = tmpl.match(/<main class="page">[\s\S]*?<\/main>/)[0];      // the page content

// --- Google Fonts query fragments, keyed by short name ---
const F = {
  inter:    'family=Inter:wght@400;500;600;700',
  grotesk:  'family=Space+Grotesk:wght@400;500;600;700',
  jet:      'family=JetBrains+Mono:wght@400;500;600;700',
  plexmono: 'family=IBM+Plex+Mono:wght@400;500;600;700',
  fraunces: 'family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600',
  garamond: 'family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400',
  playfair: 'family=Playfair+Display:wght@400;500;600;700',
  newsread: 'family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600',
  spectral: 'family=Spectral:wght@400;500;600;700',
  lora:     'family=Lora:wght@400;500;600;700',
  sourcese: 'family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600',
  franklin: 'family=Libre+Franklin:wght@400;500;600;700',
  plexsans: 'family=IBM+Plex+Sans:wght@400;500;600;700',
  manrope:  'family=Manrope:wght@400;500;600;700',
  dmsans:   'family=DM+Sans:wght@400;500;600;700',
  dmserif:  'family=DM+Serif+Display:ital@0;1',
  bitter:   'family=Bitter:wght@400;500;600;700',
  sora:     'family=Sora:wght@400;500;600;700',
  schibst:  'family=Schibsted+Grotesk:wght@400;500;600;700',
};
const fontsLink = keys =>
  '<link rel=preconnect href="https://fonts.googleapis.com"><link rel=preconnect href="https://fonts.gstatic.com" crossorigin>' +
  '<link href="https://fonts.googleapis.com/css2?' + keys.map(k => F[k]).join('&') + '&display=swap" rel=stylesheet>';

// helper to compose a :root palette string
const root = o =>
  `--bg:${o.bg};--surface:${o.surface};--ink:${o.ink};--soft:${o.soft};--faint:${o.faint};--line:${o.line};` +
  `--accent:${o.accent};--accent-deep:${o.deep};--accent-tint:${o.tint};` +
  `--display:${o.disp};--body:${o.body};--label-font:${o.label};--fs:${o.fs}`;

// font stacks (so --display etc. fall back gracefully)
const SERIF = ',Georgia,serif', SANS = ',system-ui,sans-serif', MONO = ',ui-monospace,monospace';
const stack = { fraunces:`'Fraunces'${SERIF}`, garamond:`'EB Garamond'${SERIF}`, playfair:`'Playfair Display'${SERIF}`,
  newsread:`'Newsreader'${SERIF}`, spectral:`'Spectral'${SERIF}`, lora:`'Lora'${SERIF}`, sourcese:`'Source Serif 4'${SERIF}`,
  bitter:`'Bitter'${SERIF}`, dmserif:`'DM Serif Display'${SERIF}`,
  inter:`'Inter'${SANS}`, grotesk:`'Space Grotesk'${SANS}`, franklin:`'Libre Franklin'${SANS}`, plexsans:`'IBM Plex Sans'${SANS}`,
  manrope:`'Manrope'${SANS}`, dmsans:`'DM Sans'${SANS}`, sora:`'Sora'${SANS}`, schibst:`'Schibsted Grotesk'${SANS}`,
  jet:`'JetBrains Mono'${MONO}`, plexmono:`'IBM Plex Mono'${MONO}` };

// === the 30 options ===========================================================
// Each: id, group, title, blurb (gallery line), fonts (link keys), disp/body/label (stack keys),
// layout class, fs, and the palette tokens.
const OPTS = [
  // --- earlier directions (rounds 1–2) ---
  { id:1, group:'Earlier directions (rounds 1–2)', title:'Swiss Minimal', blurb:'Indigo on white · Space Grotesk + Inter',
    fonts:['grotesk','inter'], disp:'grotesk', body:'inter', label:'inter', lay:'lay-left', fs:'18px',
    bg:'#ffffff', surface:'#ffffff', ink:'#0f1012', soft:'#585b62', faint:'#9398a1', line:'#e9eaed', accent:'#2f4bf0', deep:'#1f37c4', tint:'#e7ebff' },
  { id:2, group:'Earlier directions (rounds 1–2)', title:'Classic Centered', blurb:'Sepia on cream · EB Garamond (centered)',
    fonts:['garamond','inter'], disp:'garamond', body:'garamond', label:'inter', lay:'lay-center', fs:'20px',
    bg:'#fcfaf4', surface:'#ffffff', ink:'#211c16', soft:'#6b6353', faint:'#a99f8b', line:'#e7e1d3', accent:'#7a3b2e', deep:'#5b2c20', tint:'#f0e4dd' },
  { id:3, group:'Earlier directions (rounds 1–2)', title:'Dark Technical', blurb:'Mint on charcoal · Space Grotesk + mono',
    fonts:['grotesk','inter','jet'], disp:'grotesk', body:'inter', label:'jet', lay:'lay-left', fs:'18px',
    bg:'#131519', surface:'#1b1e24', ink:'#e7e8ea', soft:'#9aa0ab', faint:'#6c727c', line:'#292d35', accent:'#54d3c4', deep:'#86efe0', tint:'#13302c' },
  { id:4, group:'Earlier directions (rounds 1–2)', title:'Sidebar', blurb:'Green · Fraunces (two-column)',
    fonts:['fraunces','inter'], disp:'fraunces', body:'inter', label:'inter', lay:'lay-side', fs:'18px',
    bg:'#f6f5f1', surface:'#ffffff', ink:'#1d211c', soft:'#5f655b', faint:'#9aa093', line:'#e2e3d8', accent:'#2f6b54', deep:'#1f4d3b', tint:'#e6efe8' },
  { id:5, group:'Earlier directions (rounds 1–2)', title:'Mono Boxed', blurb:'Orange · JetBrains Mono (boxed cards)',
    fonts:['jet','inter'], disp:'jet', body:'inter', label:'jet', lay:'lay-left boxed', fs:'17px',
    bg:'#fafaf8', surface:'#ffffff', ink:'#17181a', soft:'#5c5d61', faint:'#97989d', line:'#e5e5e2', accent:'#d2401f', deep:'#a8330f', tint:'#fbe5de' },
  { id:6, group:'Earlier directions (rounds 1–2)', title:'Editorial Bold', blurb:'Plum on cream · Playfair Display + Newsreader',
    fonts:['playfair','newsread','inter'], disp:'playfair', body:'newsread', label:'inter', lay:'lay-left display-xl', fs:'18px',
    bg:'#f8f5ef', surface:'#ffffff', ink:'#1c1813', soft:'#6e6657', faint:'#a89e8c', line:'#e6dfce', accent:'#6d2e4e', deep:'#501f39', tint:'#f0e2e9' },
  { id:7, group:'Earlier directions (rounds 1–2)', title:'Original (live)', blurb:'Terracotta on cream · Fraunces — current live design',
    fonts:['fraunces','inter'], disp:'fraunces', body:'fraunces', label:'inter', lay:'lay-left', fs:'18px',
    bg:'#f7f4ed', surface:'#fbf9f3', ink:'#1d1a15', soft:'#6f685c', faint:'#a7a092', line:'#e4ddcd', accent:'#b04e34', deep:'#8c3c27', tint:'#f1e7da' },

  // --- Pastel ---
  { id:8, group:'Pastel', title:'Pastel Bloom', blurb:'Blush rose · Spectral + Inter (centered)',
    fonts:['spectral','inter'], disp:'spectral', body:'spectral', label:'inter', lay:'lay-center', fs:'19px',
    bg:'#fdf6f4', surface:'#ffffff', ink:'#3a2d2f', soft:'#8a7174', faint:'#c0a8aa', line:'#f0e0df', accent:'#c76d83', deep:'#a8516a', tint:'#f8e6ea' },
  { id:9, group:'Pastel', title:'Pastel Sage', blurb:'Soft mint-sage · Lora + Inter',
    fonts:['lora','inter'], disp:'lora', body:'lora', label:'inter', lay:'lay-left', fs:'19px',
    bg:'#f3f8f4', surface:'#ffffff', ink:'#24302a', soft:'#5f7268', faint:'#9bb0a5', line:'#dceae0', accent:'#4fa07e', deep:'#357c5e', tint:'#e0f0e7' },
  { id:10, group:'Pastel', title:'Pastel Periwinkle', blurb:'Lavender · Newsreader + Inter (centered)',
    fonts:['newsread','inter'], disp:'newsread', body:'newsread', label:'inter', lay:'lay-center', fs:'19px',
    bg:'#f6f6fc', surface:'#ffffff', ink:'#2b2c3c', soft:'#6a6b82', faint:'#a3a4bd', line:'#e4e4f2', accent:'#7b7fd6', deep:'#5a5fc0', tint:'#e8e9fa' },

  // --- Vintage & retro ---
  { id:11, group:'Vintage & retro', title:'Vintage Sepia', blurb:'Aged amber paper · EB Garamond',
    fonts:['garamond','inter'], disp:'garamond', body:'garamond', label:'inter', lay:'lay-left', fs:'20px',
    bg:'#f3ead6', surface:'#fbf6ea', ink:'#2e2518', soft:'#6f604a', faint:'#a89274', line:'#e2d4ba', accent:'#9a6b34', deep:'#79521f', tint:'#ecdcc0' },
  { id:12, group:'Vintage & retro', title:'Retro Mustard', blurb:'70s mustard + brown · Space Grotesk + DM Sans (boxed)',
    fonts:['grotesk','dmsans'], disp:'grotesk', body:'dmsans', label:'grotesk', lay:'lay-left boxed', fs:'17px',
    bg:'#f7f0e0', surface:'#fffaf0', ink:'#2b2417', soft:'#6e6048', faint:'#a89070', line:'#e7dcc2', accent:'#c8902a', deep:'#a06f17', tint:'#f1e2c2' },
  { id:13, group:'Vintage & retro', title:'Retro Rust', blurb:'Rust on warm cream · Bitter',
    fonts:['bitter','inter'], disp:'bitter', body:'bitter', label:'inter', lay:'lay-left', fs:'18px',
    bg:'#f4f1e6', surface:'#fdfbf3', ink:'#2c2a1f', soft:'#6a6453', faint:'#a39c86', line:'#e3dcc8', accent:'#b5532a', deep:'#8f3e1c', tint:'#f1ddcf' },

  // --- Neutral & monochrome ---
  { id:14, group:'Neutral & monochrome', title:'Monochrome Ink', blurb:'Pure grayscale, black accent · Libre Franklin (boxed)',
    fonts:['franklin','inter'], disp:'franklin', body:'inter', label:'franklin', lay:'lay-left boxed', fs:'18px',
    bg:'#f7f7f6', surface:'#ffffff', ink:'#141414', soft:'#57585a', faint:'#9a9b9d', line:'#e7e7e6', accent:'#161616', deep:'#000000', tint:'#e6e6e6' },
  { id:15, group:'Neutral & monochrome', title:'Warm Greige', blurb:'Taupe neutral · Source Serif 4 + Inter',
    fonts:['sourcese','inter'], disp:'sourcese', body:'sourcese', label:'inter', lay:'lay-left', fs:'19px',
    bg:'#f4f2ed', surface:'#fdfcf9', ink:'#2a261f', soft:'#6b6358', faint:'#a59c8e', line:'#e5e0d5', accent:'#7a6a55', deep:'#5c4f3e', tint:'#ece4d8' },
  { id:16, group:'Neutral & monochrome', title:'Cool Slate', blurb:'Cool gray + slate blue · IBM Plex Sans (sidebar)',
    fonts:['plexsans','inter'], disp:'plexsans', body:'plexsans', label:'plexsans', lay:'lay-side', fs:'17px',
    bg:'#f5f6f8', surface:'#ffffff', ink:'#1b2129', soft:'#586471', faint:'#97a1ad', line:'#e4e8ec', accent:'#46627e', deep:'#324a62', tint:'#e2e9f0' },
  { id:17, group:'Neutral & monochrome', title:'Stone (monochromatic)', blurb:'Single-hue stone · Spectral',
    fonts:['spectral','inter'], disp:'spectral', body:'spectral', label:'inter', lay:'lay-left', fs:'19px',
    bg:'#f2efe9', surface:'#fbf9f4', ink:'#2d281f', soft:'#6d6657', faint:'#a79f8d', line:'#e2dccd', accent:'#8a7a5f', deep:'#6b5d44', tint:'#ece3d2' },

  // --- Natural & earthy ---
  { id:18, group:'Natural & earthy', title:'Forest & Moss', blurb:'Deep forest green · Fraunces + Inter (sidebar)',
    fonts:['fraunces','inter'], disp:'fraunces', body:'inter', label:'inter', lay:'lay-side', fs:'18px',
    bg:'#f3f6f1', surface:'#fbfdf9', ink:'#1e261d', soft:'#586350', faint:'#95a08c', line:'#dde7d6', accent:'#3d6b48', deep:'#294e32', tint:'#e0eedf' },
  { id:19, group:'Natural & earthy', title:'Clay & Sand', blurb:'Warm clay earth tone · Lora',
    fonts:['lora','inter'], disp:'lora', body:'lora', label:'inter', lay:'lay-left', fs:'19px',
    bg:'#f6efe5', surface:'#fdf9f2', ink:'#2e2419', soft:'#6f6150', faint:'#a8987f', line:'#e6dac8', accent:'#b5663f', deep:'#8f4d2b', tint:'#f0dfce' },
  { id:20, group:'Natural & earthy', title:'Ocean Driftwood', blurb:'Teal + warm sand · Newsreader',
    fonts:['newsread','inter'], disp:'newsread', body:'newsread', label:'inter', lay:'lay-left', fs:'19px',
    bg:'#f3f4f1', surface:'#fbfbf8', ink:'#20282a', soft:'#586461', faint:'#94a09c', line:'#dee5e0', accent:'#2f7073', deep:'#1f5457', tint:'#dcecec' },

  // --- Cool & blue ---
  { id:21, group:'Cool & blue', title:'Deep Navy', blurb:'Classic academic navy · EB Garamond (centered)',
    fonts:['garamond','inter'], disp:'garamond', body:'garamond', label:'inter', lay:'lay-center', fs:'20px',
    bg:'#f9f8f3', surface:'#ffffff', ink:'#1a2230', soft:'#5a6373', faint:'#9aa2b0', line:'#e6e3d8', accent:'#1f3b66', deep:'#142a4d', tint:'#e0e6f0' },
  { id:22, group:'Cool & blue', title:'Royal Cobalt', blurb:'Vivid cobalt modern · Space Grotesk + Inter',
    fonts:['grotesk','inter'], disp:'grotesk', body:'inter', label:'inter', lay:'lay-left', fs:'18px',
    bg:'#fbfbfd', surface:'#ffffff', ink:'#14181f', soft:'#555c68', faint:'#969ca8', line:'#e8eaef', accent:'#2547d0', deep:'#1834a8', tint:'#e4e8fb' },
  { id:23, group:'Cool & blue', title:'Teal Modern', blurb:'Bright teal · Manrope',
    fonts:['manrope','inter'], disp:'manrope', body:'manrope', label:'manrope', lay:'lay-left', fs:'18px',
    bg:'#fbfdfd', surface:'#ffffff', ink:'#142020', soft:'#51605f', faint:'#93a09f', line:'#e6eded', accent:'#0e8b8b', deep:'#086c6c', tint:'#ddf0ef' },

  // --- Dark & high-contrast ---
  { id:24, group:'Dark & high-contrast', title:'Midnight Amber', blurb:'Dark navy + amber · Newsreader + Inter',
    fonts:['newsread','inter'], disp:'newsread', body:'newsread', label:'inter', lay:'lay-left', fs:'18px',
    bg:'#14171f', surface:'#1c212c', ink:'#e9e7e0', soft:'#9aa0ac', faint:'#6a7180', line:'#2a3140', accent:'#e0a23a', deep:'#f0bc63', tint:'#2e2716' },
  { id:25, group:'Dark & high-contrast', title:'Carbon Lime', blurb:'Near-black + electric lime · Space Grotesk + mono',
    fonts:['grotesk','inter','jet'], disp:'grotesk', body:'inter', label:'jet', lay:'lay-left', fs:'18px',
    bg:'#101110', surface:'#1a1c19', ink:'#e9eae5', soft:'#989a92', faint:'#686a62', line:'#282a26', accent:'#b6e23a', deep:'#c9ee5c', tint:'#1f2a10' },
  { id:26, group:'Dark & high-contrast', title:'Plum Noir', blurb:'Dark plum + pink · Playfair Display + Inter',
    fonts:['playfair','inter'], disp:'playfair', body:'inter', label:'inter', lay:'lay-left display-xl', fs:'18px',
    bg:'#1a151c', surface:'#241d27', ink:'#ece6ec', soft:'#a59caa', faint:'#746a78', line:'#322a35', accent:'#e0709e', deep:'#ee8fb6', tint:'#2c1a24' },
  { id:27, group:'Dark & high-contrast', title:'Ink Blue Night', blurb:'Deep blue-black + sky · IBM Plex Sans + mono',
    fonts:['plexsans','plexmono'], disp:'plexsans', body:'plexsans', label:'plexmono', lay:'lay-left', fs:'17px',
    bg:'#0f1622', surface:'#18202e', ink:'#dde6f0', soft:'#93a0b3', faint:'#62718a', line:'#25303f', accent:'#5aa9f0', deep:'#7cbef5', tint:'#14253a' },

  // --- Color harmony & special ---
  { id:28, group:'Color harmony & special', title:'Complementary Blue/Orange', blurb:'Navy ink + orange accent (complementary) · Schibsted Grotesk + Inter',
    fonts:['schibst','inter'], disp:'schibst', body:'inter', label:'schibst', lay:'lay-left', fs:'18px',
    bg:'#fbfaf6', surface:'#ffffff', ink:'#182a40', soft:'#56636f', faint:'#95a0ab', line:'#e8e6df', accent:'#e8742a', deep:'#c25718', tint:'#fbe6d6' },
  { id:29, group:'Color harmony & special', title:'Triadic Berry', blurb:'Berry on warm cream, large display · DM Serif Display + Inter (centered)',
    fonts:['dmserif','inter'], disp:'dmserif', body:'inter', label:'inter', lay:'lay-center display-xl', fs:'18px',
    bg:'#fbf6f2', surface:'#ffffff', ink:'#2a1f26', soft:'#6e5f67', faint:'#a99ba2', line:'#ece0d8', accent:'#b13a6a', deep:'#8c2b52', tint:'#f6e0ea' },
  { id:30, group:'Color harmony & special', title:'Gradient Aurora', blurb:'Subtle gradient wash + violet · Sora + Inter (centered)',
    fonts:['sora','inter'], disp:'sora', body:'sora', label:'inter', lay:'lay-center', fs:'18px',
    bg:'linear-gradient(160deg,#f3f0fb 0%,#eef4fb 55%,#f4eefb 100%) fixed', surface:'#ffffffee', ink:'#20222e', soft:'#5e6072', faint:'#9a9cb0', line:'#e6e4f2', accent:'#6d5ae0', deep:'#5141c4', tint:'#e9e5fa' },
];

// resolve stack keys -> actual font-family values right before stamping :root
function emitOption(o) {
  const palette = root({ ...o, disp: stack[o.disp], body: stack[o.body], label: stack[o.label] });
  const badge = `Option ${o.id} · ${o.title} — ${o.blurb}`;
  return `<!DOCTYPE html><html lang=en><head><meta charset=UTF-8>` +
    `<meta name=viewport content="width=device-width,initial-scale=1">` +
    `<meta name=robots content=noindex><title>Option ${o.id} — ${o.title}</title>` +
    fontsLink(o.fonts) +
    `<style>:root{${palette}}\n${BASE_CSS}</style></head>` +
    `<body class='${o.lay}'><div class=optbadge>${badge}</div>\n  ${BODY}\n</body></html>\n`;
}

OPTS.forEach(o => fs.writeFileSync(path.join(dir, `opt${o.id}.html`), emitOption(o)));

// === gallery (index.html) =====================================================
let cards = '';
let lastGroup = null;
for (const o of OPTS) {
  if (o.group !== lastGroup) {
    cards += `\n    </div>\n    <h2 class="grouphead">${o.group}</h2>\n    <div class="grid">`;
    lastGroup = o.group;
  }
  cards +=
`
      <div class="card">
        <div class="cap"><h3>${o.id} — ${o.title}</h3>
          <div class="meta"><span class="swatch" style="background:${o.accent}"></span>${o.blurb}</div></div>
        <a class="thumb" href="opt${o.id}.html"><iframe src="opt${o.id}.html" scrolling="no" loading="lazy" tabindex="-1" title="Option ${o.id}"></iframe></a>
        <a class="open" href="opt${o.id}.html">Open full preview →</a>
      </div>`;
}
cards += '\n    </div>'; // close final grid; opening <div class="grid"> is emitted before first group

const index =
`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex" />
  <title>Homepage — 30 design options</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; background: #ecebe7; color: #1d1a15;
      font-family: system-ui, -apple-system, "Segoe UI", sans-serif; line-height: 1.6; }
    .head { max-width: 1280px; margin: 0 auto; padding: 2.5rem 1.5rem 0.25rem; }
    .head h1 { font-size: 1.55rem; margin: 0 0 0.45rem; }
    .head p { margin: 0; color: #5d574c; max-width: 78ch; }
    .grouphead { max-width: 1280px; margin: 2.2rem auto 0; padding: 0 1.5rem;
      font-size: 0.82rem; font-weight: 700; letter-spacing: 0.09em; text-transform: uppercase; color: #8a8276; }
    .grid { max-width: 1280px; margin: 0.6rem auto 0; padding: 0 1.5rem;
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.6rem; }
    @media (max-width: 1000px) { .grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 640px) { .grid { grid-template-columns: 1fr; } }
    .card { background: #fff; border: 1px solid #d9d5cb; border-radius: 10px;
      overflow: hidden; box-shadow: 0 6px 22px rgba(40,30,20,0.07); display: flex; flex-direction: column; }
    .cap { padding: 0.8rem 1rem 0.7rem; }
    .cap h3 { font-size: 0.98rem; margin: 0 0 0.15rem; }
    .meta { font-size: 0.79rem; color: #6f685c; }
    .swatch { display: inline-block; width: 0.78rem; height: 0.78rem; border-radius: 50%;
      vertical-align: -1px; margin-right: 0.35rem; border: 1px solid rgba(0,0,0,0.12); }
    .thumb { display: block; height: 300px; overflow: hidden; border-top: 1px solid #ece9e2;
      background: #fbfaf7; position: relative; }
    .thumb iframe { width: 1180px; height: 1900px; border: 0; display: block;
      transform: scale(0.315); transform-origin: top left; pointer-events: none; }
    .open { display: block; padding: 0.65rem 1rem; font-size: 0.83rem; font-weight: 600;
      color: #b04e34; text-decoration: none; border-top: 1px solid #ece9e2; }
    .open:hover { background: #faf7f2; }
    .foot { max-width: 1280px; margin: 0 auto; padding: 1.5rem 1.5rem 3rem; color: #6f685c; font-size: 0.85rem; }
  </style>
</head>
<body>
  <div class="head">
    <h1>Homepage — 30 design options</h1>
    <p>All 30 share the same content (from your CV); they differ in color palette, type, and layout, with palettes drawn from the color-combination references you sent (pastel, vintage/retro, neutral & monochrome, earthy, cool/blue, dark, and color-harmony sets). Each thumbnail is the real page rendered live — click any to open it full. Tell me a number; you can also mix (e.g. “Option 18 layout with Option 30 colors”) or ask me to tweak one.</p>
  </div>
    <div class="grid">${cards}

  <div class="foot">The colored bar at the top of each preview is just a label, not part of the design. Photo is a placeholder (“SK”). Web fonts load live, so previews look best on the deployed site (or with a network connection).</div>
</body>
</html>
`;
fs.writeFileSync(path.join(dir, 'index.html'), index);

// remove the now-unused round-2 screenshots (gallery uses live iframes)
for (let i = 1; i <= 7; i++) { const p = path.join(dir, `shot${i}.png`); if (fs.existsSync(p)) fs.unlinkSync(p); }

console.log(`Wrote ${OPTS.length} options + index.html; removed old shot*.png.`);
