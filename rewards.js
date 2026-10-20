// Rewards and "My page": a faint scrapbook behind the study pages.
// Everyone starts with 1 writing, 1 sticker and 1 photo. Milestones (a 5 day streak,
// 140 minutes of testing, a 30 day streak, then every extra 140 minutes or 5 day streak)
// each let the student choose +1 sticker, +1 writing or +1 photo.
// Choices are saved in student_settings; photos in scrapbook_photos (small JPEGs).
(function(){
  const me = document.currentScript;
  const profileId = me && me.dataset.profile || "";
  const KEY = "sp-decor-" + profileId;
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

  // Original retro sticker set, drawn for the portal
  const STICKERS = {
    aplus: { name: "A+ starburst", svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"-8 -8 136 136\"><g filter=\"drop-shadow(3px 4px 0 rgba(43,33,24,.25))\"><path d=\"M60.0,6.0 L69.8,17.1 L83.4,11.3 L87.4,25.6 L102.2,26.3 L99.6,40.9 L112.6,48.0 L104.0,60.0 L112.6,72.0 L99.6,79.1 L102.2,93.7 L87.4,94.4 L83.4,108.7 L69.8,102.9 L60.0,114.0 L50.2,102.9 L36.6,108.7 L32.6,94.4 L17.8,93.7 L20.4,79.1 L7.4,72.0 L16.0,60.0 L7.4,48.0 L20.4,40.9 L17.8,26.3 L32.6,25.6 L36.6,11.3 L50.2,17.1 Z\" fill=\"#fff\" stroke=\"#fff\" stroke-width=\"14\" stroke-linejoin=\"round\"/><path d=\"M60.0,6.0 L69.8,17.1 L83.4,11.3 L87.4,25.6 L102.2,26.3 L99.6,40.9 L112.6,48.0 L104.0,60.0 L112.6,72.0 L99.6,79.1 L102.2,93.7 L87.4,94.4 L83.4,108.7 L69.8,102.9 L60.0,114.0 L50.2,102.9 L36.6,108.7 L32.6,94.4 L17.8,93.7 L20.4,79.1 L7.4,72.0 L16.0,60.0 L7.4,48.0 L20.4,40.9 L17.8,26.3 L32.6,25.6 L36.6,11.3 L50.2,17.1 Z\" fill=\"#F4C430\" stroke=\"#2B2118\" stroke-width=\"4\" stroke-linejoin=\"round\"/><circle cx=\"60\" cy=\"60\" r=\"32\" fill=\"#E4572E\" stroke=\"#2B2118\" stroke-width=\"4\"/><text x=\"60\" y=\"72\" text-anchor=\"middle\" font-family=\"Arial Black,Impact,Arial,sans-serif\" font-weight=\"900\" font-size=\"34\" fill=\"#FFF4DC\" letter-spacing=\"0\" transform=\"rotate(0 60 72)\">A+</text></g></svg>" },
    nailed: { name: "Nailed it", svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"-8 -8 136 136\"><g filter=\"drop-shadow(3px 4px 0 rgba(43,33,24,.25))\"><path d=\"M8 42 Q60 30 112 42 L106 62 L112 82 Q60 70 8 82 L14 62 Z\" fill=\"#fff\" stroke=\"#fff\" stroke-width=\"14\" stroke-linejoin=\"round\"/><path d=\"M8 42 Q60 30 112 42 L106 62 L112 82 Q60 70 8 82 L14 62 Z\" fill=\"#F27BA5\" stroke=\"#2B2118\" stroke-width=\"4\" stroke-linejoin=\"round\"/><text x=\"60\" y=\"58\" text-anchor=\"middle\" font-family=\"Arial Black,Impact,Arial,sans-serif\" font-weight=\"900\" font-size=\"19\" fill=\"#FFF4DC\" letter-spacing=\"0\" transform=\"rotate(-3 60 58)\">NAILED</text><text x=\"60\" y=\"79\" text-anchor=\"middle\" font-family=\"Arial Black,Impact,Arial,sans-serif\" font-weight=\"900\" font-size=\"19\" fill=\"#2B2118\" letter-spacing=\"0\" transform=\"rotate(-3 60 79)\">IT!</text></g></svg>" },
    bolt: { name: "Lightning", svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"-8 -8 136 136\"><g filter=\"drop-shadow(3px 4px 0 rgba(43,33,24,.25))\"><path d=\"M68 6 L24 66 H54 L44 114 L98 46 H66 Z\" fill=\"#fff\" stroke=\"#fff\" stroke-width=\"14\" stroke-linejoin=\"round\"/><path d=\"M68 6 L24 66 H54 L44 114 L98 46 H66 Z\" fill=\"#F4C430\" stroke=\"#2B2118\" stroke-width=\"4\" stroke-linejoin=\"round\"/><path d=\"M62 18 L36 60\" stroke=\"#fff\" stroke-width=\"5\" stroke-linecap=\"round\" opacity=\".7\"/></g></svg>" },
    rainbow: { name: "Rainbow", svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"-8 -8 136 136\"><g filter=\"drop-shadow(3px 4px 0 rgba(43,33,24,.25))\"><path d=\"M10 90 A50 50 0 0 1 110 90 H90 A30 30 0 0 0 30 90 Z\" fill=\"#fff\" stroke=\"#fff\" stroke-width=\"14\" stroke-linejoin=\"round\"/><path d=\"M10 90 A50 50 0 0 1 110 90 H90 A30 30 0 0 0 30 90 Z\" fill=\"#E4572E\" stroke=\"#2B2118\" stroke-width=\"4\" stroke-linejoin=\"round\"/><path d=\"M20 90 A40 40 0 0 1 100 90\" fill=\"none\" stroke=\"#F28C28\" stroke-width=\"7\"/><path d=\"M27 90 A33 33 0 0 1 93 90\" fill=\"none\" stroke=\"#F4C430\" stroke-width=\"6\"/><path d=\"M33 90 A27 27 0 0 1 87 90\" fill=\"none\" stroke=\"#2A9D8F\" stroke-width=\"5\"/><ellipse cx=\"22\" cy=\"94\" rx=\"16\" ry=\"10\" fill=\"#fff\" stroke=\"#2B2118\" stroke-width=\"3\"/><ellipse cx=\"98\" cy=\"94\" rx=\"16\" ry=\"10\" fill=\"#fff\" stroke=\"#2B2118\" stroke-width=\"3\"/></g></svg>" },
    cassette: { name: "Cassette", svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"-8 -8 136 136\"><g filter=\"drop-shadow(3px 4px 0 rgba(43,33,24,.25))\"><path d=\"M10 28 H110 V92 H10 Z\" fill=\"#fff\" stroke=\"#fff\" stroke-width=\"14\" stroke-linejoin=\"round\"/><path d=\"M10 28 H110 V92 H10 Z\" fill=\"#F28C28\" stroke=\"#2B2118\" stroke-width=\"4\" stroke-linejoin=\"round\"/><rect x=\"22\" y=\"38\" width=\"76\" height=\"26\" rx=\"5\" fill=\"#FFF4DC\" stroke=\"#2B2118\" stroke-width=\"3\"/><circle cx=\"42\" cy=\"51\" r=\"7\" fill=\"#2B2118\"/><circle cx=\"78\" cy=\"51\" r=\"7\" fill=\"#2B2118\"/><path d=\"M30 92 L38 74 H82 L90 92\" fill=\"#F4C430\" stroke=\"#2B2118\" stroke-width=\"3\"/><text x=\"60\" y=\"35\" text-anchor=\"middle\" font-family=\"Arial Black,Impact,Arial,sans-serif\" font-weight=\"900\" font-size=\"8\" fill=\"#2B2118\" letter-spacing=\"0\" transform=\"rotate(0 60 35)\">REVISION MIX</text></g></svg>" },
    sun: { name: "Retro sun", svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"-8 -8 136 136\"><g filter=\"drop-shadow(3px 4px 0 rgba(43,33,24,.25))\"><path d=\"M60.0,4.0 L70.4,21.4 L88.0,11.5 L88.3,31.7 L108.5,32.0 L98.6,49.6 L116.0,60.0 L98.6,70.4 L108.5,88.0 L88.3,88.3 L88.0,108.5 L70.4,98.6 L60.0,116.0 L49.6,98.6 L32.0,108.5 L31.7,88.3 L11.5,88.0 L21.4,70.4 L4.0,60.0 L21.4,49.6 L11.5,32.0 L31.7,31.7 L32.0,11.5 L49.6,21.4 Z\" fill=\"#fff\" stroke=\"#fff\" stroke-width=\"14\" stroke-linejoin=\"round\"/><path d=\"M60.0,4.0 L70.4,21.4 L88.0,11.5 L88.3,31.7 L108.5,32.0 L98.6,49.6 L116.0,60.0 L98.6,70.4 L108.5,88.0 L88.3,88.3 L88.0,108.5 L70.4,98.6 L60.0,116.0 L49.6,98.6 L32.0,108.5 L31.7,88.3 L11.5,88.0 L21.4,70.4 L4.0,60.0 L21.4,49.6 L11.5,32.0 L31.7,31.7 L32.0,11.5 L49.6,21.4 Z\" fill=\"#F28C28\" stroke=\"#2B2118\" stroke-width=\"4\" stroke-linejoin=\"round\"/><circle cx=\"60\" cy=\"60\" r=\"30\" fill=\"#F4C430\" stroke=\"#2B2118\" stroke-width=\"4\"/><path d=\"M44 56 q4 -6 8 0 M68 56 q4 -6 8 0\" fill=\"none\" stroke=\"#2B2118\" stroke-width=\"4\" stroke-linecap=\"round\"/><path d=\"M46 68 q14 12 28 0\" fill=\"none\" stroke=\"#2B2118\" stroke-width=\"4\" stroke-linecap=\"round\"/></g></svg>" },
    daisy: { name: "Daisy", svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"-8 -8 136 136\"><g filter=\"drop-shadow(3px 4px 0 rgba(43,33,24,.25))\"><path d=\"M60 12 C72 12 74 34 66 44 C78 36 100 40 100 54 C100 66 80 68 70 62 C78 72 78 96 64 100 C52 104 46 82 52 72 C44 82 22 86 18 72 C14 58 34 52 46 56 C34 48 32 26 46 18 C52 14 56 12 60 12 Z\" fill=\"#fff\" stroke=\"#fff\" stroke-width=\"14\" stroke-linejoin=\"round\"/><path d=\"M60 12 C72 12 74 34 66 44 C78 36 100 40 100 54 C100 66 80 68 70 62 C78 72 78 96 64 100 C52 104 46 82 52 72 C44 82 22 86 18 72 C14 58 34 52 46 56 C34 48 32 26 46 18 C52 14 56 12 60 12 Z\" fill=\"#fff\" stroke=\"#2B2118\" stroke-width=\"4\" stroke-linejoin=\"round\"/><circle cx=\"58\" cy=\"58\" r=\"13\" fill=\"#F4C430\" stroke=\"#2B2118\" stroke-width=\"4\"/></g></svg>" },
    rocket: { name: "Rocket", svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"-8 -8 136 136\"><g filter=\"drop-shadow(3px 4px 0 rgba(43,33,24,.25))\"><path d=\"M60 6 C82 22 86 56 78 84 H42 C34 56 38 22 60 6 Z\" fill=\"#fff\" stroke=\"#fff\" stroke-width=\"14\" stroke-linejoin=\"round\"/><path d=\"M60 6 C82 22 86 56 78 84 H42 C34 56 38 22 60 6 Z\" fill=\"#FFF4DC\" stroke=\"#2B2118\" stroke-width=\"4\" stroke-linejoin=\"round\"/><circle cx=\"60\" cy=\"44\" r=\"10\" fill=\"#3D7DD8\" stroke=\"#2B2118\" stroke-width=\"4\"/><path d=\"M42 70 L26 94 L44 88 Z M78 70 L94 94 L76 88 Z\" fill=\"#E4572E\" stroke=\"#2B2118\" stroke-width=\"4\" stroke-linejoin=\"round\"/><path d=\"M50 86 Q60 112 70 86 Z\" fill=\"#F28C28\" stroke=\"#2B2118\" stroke-width=\"4\"/></g></svg>" },
    studymode: { name: "Study mode", svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"-8 -8 136 136\"><g filter=\"drop-shadow(3px 4px 0 rgba(43,33,24,.25))\"><path d=\"M14 30 H106 Q114 30 114 38 V82 Q114 90 106 90 H14 Q6 90 6 82 V38 Q6 30 14 30 Z\" fill=\"#fff\" stroke=\"#fff\" stroke-width=\"14\" stroke-linejoin=\"round\"/><path d=\"M14 30 H106 Q114 30 114 38 V82 Q114 90 106 90 H14 Q6 90 6 82 V38 Q6 30 14 30 Z\" fill=\"#2A9D8F\" stroke=\"#2B2118\" stroke-width=\"4\" stroke-linejoin=\"round\"/><text x=\"60\" y=\"58\" text-anchor=\"middle\" font-family=\"Arial Black,Impact,Arial,sans-serif\" font-weight=\"900\" font-size=\"22\" fill=\"#FFF4DC\" letter-spacing=\"0\" transform=\"rotate(0 60 58)\">STUDY</text><text x=\"60\" y=\"80\" text-anchor=\"middle\" font-family=\"Arial Black,Impact,Arial,sans-serif\" font-weight=\"900\" font-size=\"15\" fill=\"#F4C430\" letter-spacing=\"0\" transform=\"rotate(0 60 80)\">MODE: ON</text></g></svg>" },
    planet: { name: "Planet", svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"-8 -8 136 136\"><g filter=\"drop-shadow(3px 4px 0 rgba(43,33,24,.25))\"><path d=\"M60 26 A34 34 0 1 1 59.9 26 Z\" fill=\"#fff\" stroke=\"#fff\" stroke-width=\"14\" stroke-linejoin=\"round\"/><path d=\"M60 26 A34 34 0 1 1 59.9 26 Z\" fill=\"#8C6BD6\" stroke=\"#2B2118\" stroke-width=\"4\" stroke-linejoin=\"round\"/><ellipse cx=\"60\" cy=\"60\" rx=\"56\" ry=\"15\" fill=\"none\" stroke=\"#2B2118\" stroke-width=\"9\" transform=\"rotate(-18 60 60)\"/><ellipse cx=\"60\" cy=\"60\" rx=\"56\" ry=\"15\" fill=\"none\" stroke=\"#F27BA5\" stroke-width=\"5\" transform=\"rotate(-18 60 60)\"/><circle cx=\"48\" cy=\"48\" r=\"5\" fill=\"#fff\" opacity=\".6\"/></g></svg>" },
    heart: { name: "Checker heart", svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"-8 -8 136 136\"><g filter=\"drop-shadow(3px 4px 0 rgba(43,33,24,.25))\"><path d=\"M60 104 C20 78 8 58 8 40 C8 22 22 12 36 12 C48 12 56 20 60 28 C64 20 72 12 84 12 C98 12 112 22 112 40 C112 58 100 78 60 104 Z\" fill=\"#fff\" stroke=\"#fff\" stroke-width=\"14\" stroke-linejoin=\"round\"/><path d=\"M60 104 C20 78 8 58 8 40 C8 22 22 12 36 12 C48 12 56 20 60 28 C64 20 72 12 84 12 C98 12 112 22 112 40 C112 58 100 78 60 104 Z\" fill=\"#E4572E\" stroke=\"#2B2118\" stroke-width=\"4\" stroke-linejoin=\"round\"/><clipPath id=\"hc\"><path d=\"M60 104 C20 78 8 58 8 40 C8 22 22 12 36 12 C48 12 56 20 60 28 C64 20 72 12 84 12 C98 12 112 22 112 40 C112 58 100 78 60 104 Z\"/></clipPath><g clip-path=\"url(#hc)\" opacity=\".35\"><rect x=\"0\" y=\"0\" width=\"12\" height=\"12\" fill=\"#fff\"/><rect x=\"0\" y=\"24\" width=\"12\" height=\"12\" fill=\"#fff\"/><rect x=\"0\" y=\"48\" width=\"12\" height=\"12\" fill=\"#fff\"/><rect x=\"0\" y=\"72\" width=\"12\" height=\"12\" fill=\"#fff\"/><rect x=\"0\" y=\"96\" width=\"12\" height=\"12\" fill=\"#fff\"/><rect x=\"24\" y=\"0\" width=\"12\" height=\"12\" fill=\"#fff\"/><rect x=\"24\" y=\"24\" width=\"12\" height=\"12\" fill=\"#fff\"/><rect x=\"24\" y=\"48\" width=\"12\" height=\"12\" fill=\"#fff\"/><rect x=\"24\" y=\"72\" width=\"12\" height=\"12\" fill=\"#fff\"/><rect x=\"24\" y=\"96\" width=\"12\" height=\"12\" fill=\"#fff\"/><rect x=\"48\" y=\"0\" width=\"12\" height=\"12\" fill=\"#fff\"/><rect x=\"48\" y=\"24\" width=\"12\" height=\"12\" fill=\"#fff\"/><rect x=\"48\" y=\"48\" width=\"12\" height=\"12\" fill=\"#fff\"/><rect x=\"48\" y=\"72\" width=\"12\" height=\"12\" fill=\"#fff\"/><rect x=\"48\" y=\"96\" width=\"12\" height=\"12\" fill=\"#fff\"/><rect x=\"72\" y=\"0\" width=\"12\" height=\"12\" fill=\"#fff\"/><rect x=\"72\" y=\"24\" width=\"12\" height=\"12\" fill=\"#fff\"/><rect x=\"72\" y=\"48\" width=\"12\" height=\"12\" fill=\"#fff\"/><rect x=\"72\" y=\"72\" width=\"12\" height=\"12\" fill=\"#fff\"/><rect x=\"72\" y=\"96\" width=\"12\" height=\"12\" fill=\"#fff\"/><rect x=\"96\" y=\"0\" width=\"12\" height=\"12\" fill=\"#fff\"/><rect x=\"96\" y=\"24\" width=\"12\" height=\"12\" fill=\"#fff\"/><rect x=\"96\" y=\"48\" width=\"12\" height=\"12\" fill=\"#fff\"/><rect x=\"96\" y=\"72\" width=\"12\" height=\"12\" fill=\"#fff\"/><rect x=\"96\" y=\"96\" width=\"12\" height=\"12\" fill=\"#fff\"/><rect x=\"12\" y=\"12\" width=\"12\" height=\"12\" fill=\"#fff\"/><rect x=\"12\" y=\"36\" width=\"12\" height=\"12\" fill=\"#fff\"/><rect x=\"12\" y=\"60\" width=\"12\" height=\"12\" fill=\"#fff\"/><rect x=\"12\" y=\"84\" width=\"12\" height=\"12\" fill=\"#fff\"/><rect x=\"12\" y=\"108\" width=\"12\" height=\"12\" fill=\"#fff\"/><rect x=\"36\" y=\"12\" width=\"12\" height=\"12\" fill=\"#fff\"/><rect x=\"36\" y=\"36\" width=\"12\" height=\"12\" fill=\"#fff\"/><rect x=\"36\" y=\"60\" width=\"12\" height=\"12\" fill=\"#fff\"/><rect x=\"36\" y=\"84\" width=\"12\" height=\"12\" fill=\"#fff\"/><rect x=\"36\" y=\"108\" width=\"12\" height=\"12\" fill=\"#fff\"/><rect x=\"60\" y=\"12\" width=\"12\" height=\"12\" fill=\"#fff\"/><rect x=\"60\" y=\"36\" width=\"12\" height=\"12\" fill=\"#fff\"/><rect x=\"60\" y=\"60\" width=\"12\" height=\"12\" fill=\"#fff\"/><rect x=\"60\" y=\"84\" width=\"12\" height=\"12\" fill=\"#fff\"/><rect x=\"60\" y=\"108\" width=\"12\" height=\"12\" fill=\"#fff\"/><rect x=\"84\" y=\"12\" width=\"12\" height=\"12\" fill=\"#fff\"/><rect x=\"84\" y=\"36\" width=\"12\" height=\"12\" fill=\"#fff\"/><rect x=\"84\" y=\"60\" width=\"12\" height=\"12\" fill=\"#fff\"/><rect x=\"84\" y=\"84\" width=\"12\" height=\"12\" fill=\"#fff\"/><rect x=\"84\" y=\"108\" width=\"12\" height=\"12\" fill=\"#fff\"/><rect x=\"108\" y=\"12\" width=\"12\" height=\"12\" fill=\"#fff\"/><rect x=\"108\" y=\"36\" width=\"12\" height=\"12\" fill=\"#fff\"/><rect x=\"108\" y=\"60\" width=\"12\" height=\"12\" fill=\"#fff\"/><rect x=\"108\" y=\"84\" width=\"12\" height=\"12\" fill=\"#fff\"/><rect x=\"108\" y=\"108\" width=\"12\" height=\"12\" fill=\"#fff\"/></g></g></svg>" },
    toprank: { name: "Top marks ribbon", svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"-8 -8 136 136\"><g filter=\"drop-shadow(3px 4px 0 rgba(43,33,24,.25))\"><path d=\"M60 8 A30 30 0 1 1 59.9 8 Z\" fill=\"#fff\" stroke=\"#fff\" stroke-width=\"14\" stroke-linejoin=\"round\"/><path d=\"M60 8 A30 30 0 1 1 59.9 8 Z\" fill=\"#3D7DD8\" stroke=\"#2B2118\" stroke-width=\"4\" stroke-linejoin=\"round\"/><path d=\"M40 60 L28 112 L46 102 L54 116 L60 66 M80 60 L92 112 L74 102 L66 116 L60 66\" fill=\"#E4572E\" stroke=\"#2B2118\" stroke-width=\"4\" stroke-linejoin=\"round\"/><circle cx=\"60\" cy=\"38\" r=\"22\" fill=\"#FFF4DC\" stroke=\"#2B2118\" stroke-width=\"3\"/><text x=\"60\" y=\"36\" text-anchor=\"middle\" font-family=\"Arial Black,Impact,Arial,sans-serif\" font-weight=\"900\" font-size=\"12\" fill=\"#2B2118\" letter-spacing=\"0\" transform=\"rotate(0 60 36)\">TOP</text><text x=\"60\" y=\"50\" text-anchor=\"middle\" font-family=\"Arial Black,Impact,Arial,sans-serif\" font-weight=\"900\" font-size=\"10\" fill=\"#2B2118\" letter-spacing=\"0\" transform=\"rotate(0 60 50)\">MARKS</text></g></svg>" }
  };
  const BGS = { plain: "Plain", dots: "Dots", grid: "Grid paper", stripes: "Stripes", waves: "Waves" };
  const FONTS = {
    big: { name: "Block letters", family: "Anton, Impact, sans-serif", ratio: .46, upper: true },
    hand: { name: "Handwriting", family: "Caveat, cursive", ratio: .42 },
    graffiti: { name: "Graffiti", family: "'Permanent Marker', cursive", ratio: .62 }
  };
  const BASE = { sticker: 1, writing: 1, photo: 1 };
  const stickerSvg = (key, size) => STICKERS[key] ? STICKERS[key].svg.replace("<svg ", `<svg width="${size}" height="${size}" aria-hidden="true" `) : "";

  // ---- rewards: what's been earned ----
  function earned(goal){
    if (!goal) return [];
    const runs = goal.runs || [], out = [];
    if (runs.some(r => r >= 5)) out.push("a 5 day streak");
    if ((goal.testMin || 0) >= 140) out.push("140 minutes of testing");
    if (runs.some(r => r >= 30)) out.push("a 30 day streak");
    const blocks = runs.reduce((n, r) => n + Math.floor(r / 5), 0);
    for (let i = 1; i < blocks; i++) out.push("another 5 day streak");
    for (let i = 1; i < Math.floor((goal.testMin || 0) / 140); i++) out.push(`${(i + 1) * 140} minutes of testing`);
    return out;
  }
  function nextUp(goal){
    if (!goal) return [];
    const runs = goal.runs || [], s = goal.streakNow || 0, t = goal.testMin || 0, list = [];
    if (!runs.some(r => r >= 5)) list.push({ name: "5 day streak", have: s, need: 5, unit: "days" });
    else list.push({ name: "Next 5 day streak", have: s % 5, need: 5, unit: "days" });
    list.push({ name: t >= 140 ? `${(Math.floor(t / 140) + 1) * 140} minutes of testing` : "140 minutes of testing", have: Math.round(t % 140), need: 140, unit: "minutes" });
    if (!runs.some(r => r >= 30)) list.push({ name: "30 day streak", have: s, need: 30, unit: "days" });
    return list;
  }

  const css = `
  .wrap{position:relative;z-index:1}
  html[data-bg="dots"] body{background-image:radial-gradient(var(--t-line) 1.4px,transparent 1.5px);background-size:24px 24px}
  html[data-bg="grid"] body{background-image:linear-gradient(var(--t-soft2) 1px,transparent 1px),linear-gradient(90deg,var(--t-soft2) 1px,transparent 1px);background-size:26px 26px}
  html[data-bg="stripes"] body{background-image:repeating-linear-gradient(135deg,var(--t-soft2) 0 10px,transparent 10px 22px)}
  html[data-bg="waves"] body{background-image:radial-gradient(circle at 50% 120%,transparent 14px,var(--t-line) 15px,var(--t-line) 16px,transparent 17px);background-size:34px 18px}
  #decor{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden}
  .dk{position:absolute;transform-origin:center center}
  .dk svg{display:block;width:100%;height:auto}
  .dk.ph .pol{display:block;position:relative;background:#fff;padding:6% 6% 22%;box-shadow:0 2px 6px rgba(0,0,0,.15);filter:grayscale(.55)}
  .dk.ph .pol img{display:block;width:100%;aspect-ratio:1/0.85;object-fit:cover}
  .dk.ph .cap{position:absolute;left:0;right:0;bottom:4%;text-align:center;font-family:Caveat,cursive;color:#3A4149;white-space:nowrap;overflow:hidden}
  .dk.ph .tape{position:absolute;left:50%;top:-6%;width:40%;height:12%;transform:translateX(-50%) rotate(3deg);background:rgba(255,255,255,.7)}
  .dk.wr{color:var(--t-accent)}
  .dk .wr-text{display:block;line-height:1.05;white-space:nowrap;text-align:center}
  .dk .wr-img{display:block;width:100%;height:auto;mix-blend-mode:multiply;filter:grayscale(1) contrast(1.5)}
  html[data-mode="dark"] .dk .wr-img{mix-blend-mode:screen;filter:invert(1) grayscale(1) contrast(1.5)}
  @media (max-width:899px){#decor .dk{display:none}}
  `;
  function addCss(){ if (document.getElementById("decor-css")) return; const s = document.createElement("style"); s.id = "decor-css"; s.textContent = css; document.head.appendChild(s); }
  if (!document.querySelector('link[href*="Permanent+Marker"]')) {
    const l = document.createElement("link"); l.rel = "stylesheet"; l.href = "https://fonts.googleapis.com/css2?family=Anton&family=Caveat:wght@600&family=Permanent+Marker&display=swap"; document.head.appendChild(l);
  }

  let data = { bg: "dots", stickers: [], signature: null, writings: [], picks: {}, decor_on: true, rewards_seen: 0, photos: [], layout: {} };
  try { const c = JSON.parse(localStorage.getItem(KEY) || "null"); if (c) data = Object.assign(data, c); } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {} };
  function migrate(){
    if ((!data.writings || !data.writings.length) && data.signature) {
      const s = data.signature;
      data.writings = [s.startsWith("img:") ? { id: "w1", image: s.slice(4) } : { id: "w1", text: s.replace(/^text:/, ""), style: "hand" }];
      if (data.layout && data.layout.sig) { data.layout["wr:w1"] = data.layout.sig; delete data.layout.sig; }
    }
    data.signature = null;
    data.stickers = (data.stickers || []).filter(k => STICKERS[k]);
  }
  function allowance(){
    const p = data.picks || {};
    return { sticker: BASE.sticker + (p.sticker || 0), writing: BASE.writing + (p.writing || 0), photo: BASE.photo + (p.photo || 0) };
  }

  // Default spots (percent of the screen); each can be moved, resized, turned and faded in "Arrange my page"
  const SPOTS = {
    st: [ { x: -2, y: 8, w: 18, r: -12 }, { x: 84, y: 3, w: 15, r: 12 }, { x: 85, y: 60, w: 16, r: -8 }, { x: 2, y: 62, w: 14, r: 9 }, { x: 88, y: 82, w: 12, r: -6 }, { x: 12, y: 30, w: 10, r: 14 } ],
    ph: [ { x: 3, y: 40, w: 12.5, r: -9 }, { x: 84, y: 30, w: 13.5, r: 7 }, { x: 6, y: 70, w: 11, r: 5 }, { x: 86, y: 6, w: 10, r: -5 }, { x: 1, y: 4, w: 10, r: 6 } ],
    wr: [ { x: 2, y: 82, w: 24, r: -5 }, { x: 76, y: 88, w: 20, r: 4 }, { x: 80, y: 46, w: 16, r: -3 }, { x: 3, y: 24, w: 16, r: 4 }, { x: 74, y: 18, w: 18, r: -6 } ]
  };
  const OP = { st: .18, ph: .32, wr: .22 };
  const spot = (kind, i) => Object.assign({ o: OP[kind] }, SPOTS[kind][i % SPOTS[kind].length]);
  function items(){
    const L = data.layout || {}, al = allowance(), out = [];
    (data.stickers || []).slice(0, al.sticker).forEach((k, i) => out.push({ id: "st:" + k, kind: "st", key: k, label: STICKERS[k].name, pos: Object.assign(spot("st", i), L["st:" + k] || {}) }));
    (data.photos || []).filter(p => p.image).slice(0, al.photo).forEach((ph, i) => out.push({ id: "ph:" + ph.slot, kind: "ph", ph, label: ph.caption || "Photo", pos: Object.assign(spot("ph", i), L["ph:" + ph.slot] || {}) }));
    (data.writings || []).slice(0, al.writing).forEach((w, i) => out.push({ id: "wr:" + w.id, kind: "wr", w, label: w.text || "Writing", pos: Object.assign(spot("wr", i), L["wr:" + w.id] || {}) }));
    return out;
  }
  const hiddenItems = () => items().filter(it => it.pos.h).map(it => ({ id: it.id, label: it.label }));
  // unit: "vw"/"vh" on the real page, "cqw"/"cqh" inside the editor frame
  function itemHtml(it, ux, uy){
    if (!it) return "";
    const p = it.pos, mode = document.documentElement.dataset.mode;
    const op = Math.max(.05, Math.min(.7, (p.o || .18) * (mode === "dark" ? .8 : 1)));
    const style = `left:${p.x}${ux};top:${p.y}${uy};width:${p.w}${ux};transform:rotate(${p.r || 0}deg);opacity:${op}`;
    let inner = "";
    if (it.kind === "st") inner = stickerSvg(it.key, 64).replace(/ width="64" height="64"/, "");
    else if (it.kind === "ph") inner = `<span class="pol"><span class="tape"></span><img alt="" src="${it.ph.image}"><span class="cap" style="font-size:calc(${p.w}${ux} * .13)">${esc(it.ph.caption || "")}</span></span>`;
    else if (it.w.image) inner = `<img class="wr-img" alt="" src="${it.w.image}">`;
    else { const f = FONTS[it.w.style] || FONTS.hand, t = f.upper ? String(it.w.text || "").toUpperCase() : String(it.w.text || "");
      inner = `<span class="wr-text" style="font-family:${f.family};font-size:calc(${p.w}${ux} * ${Math.min(.9, 1 / (Math.max(3, t.length) * f.ratio)).toFixed(3)})">${esc(t)}</span>`; }
    return `<span class="dk ${it.kind}" data-id="${esc(it.id)}" style="${style}">${inner}</span>`;
  }
  function render(){
    addCss();
    document.documentElement.dataset.bg = data.decor_on ? (data.bg || "plain") : "plain";
    let layer = document.getElementById("decor");
    if (!layer) { layer = document.createElement("div"); layer.id = "decor"; layer.setAttribute("aria-hidden", "true"); document.body.prepend(layer); }
    layer.innerHTML = data.decor_on ? items().filter(it => !it.pos.h).map(it => itemHtml(it, "vw", "vh")).join("") : "";
  }

  async function load(sb){
    try {
      const [rows, photos] = await Promise.all([
        sb(`student_settings?select=bg,stickers,signature,writings,picks,decor_on,rewards_seen,layout&profile_id=eq.${profileId}`),
        sb(`scrapbook_photos?select=slot,image,caption&profile_id=eq.${profileId}&order=slot.asc`)
      ]);
      if (rows && rows[0]) Object.assign(data, rows[0]);
      data.photos = photos || [];
      migrate(); save(); render();
    } catch (e) {}
  }
  async function saveSettings(sb, change){
    Object.assign(data, change); save(); render();
    const t = window.Theme ? Theme.get() : { accent: "green", mode: "light" };
    await sb("student_settings", { method: "POST", prefer: "resolution=merge-duplicates,return=minimal",
      body: [{ profile_id: profileId, accent: t.accent, mode: t.mode, bg: data.bg, stickers: data.stickers, writings: data.writings || [], picks: data.picks || {}, signature: null, decor_on: data.decor_on, rewards_seen: data.rewards_seen, layout: data.layout || {}, updated_at: new Date().toISOString() }] });
  }
  function shrink(file, max, type){
    return new Promise((resolve, reject) => {
      const img = new Image(), url = URL.createObjectURL(file);
      img.onload = () => {
        const s = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement("canvas"); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
        const g = c.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
        resolve(c.toDataURL("image/jpeg", 0.72));
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("That file isn't a picture we can read.")); };
      img.src = url;
    });
  }
  // trim empty space round a drawn signature
  function trimPad(pad){
    const g = pad.getContext("2d"), { width: W, height: H } = pad, d = g.getImageData(0, 0, W, H).data;
    let x0 = W, y0 = H, x1 = 0, y1 = 0;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (d[(y * W + x) * 4 + 3] > 10) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    if (x1 <= x0) return null;
    const m = 12, c = document.createElement("canvas"); c.width = x1 - x0 + m * 2; c.height = y1 - y0 + m * 2;
    c.getContext("2d").drawImage(pad, x0 - m, y0 - m, c.width, c.height, 0, 0, c.width, c.height);
    return c.toDataURL("image/png");
  }

  const pcss = `
  .mp{background:var(--t-card);border-radius:18px;padding:8px 24px 20px;margin:0 0 22px;font-family:"Atkinson Hyperlegible",Verdana,sans-serif}
  .mp [hidden]{display:none!important}
  .mp-sec{padding:16px 0;border-top:1px solid var(--t-line);display:flex;flex-direction:column;gap:10px}
  .mp-sec:first-child{border-top:none}
  .mp-sec>b,.mp-h{font-size:18px;font-weight:700}
  .mp-hrow{display:flex;justify-content:space-between;align-items:baseline;gap:10px;flex-wrap:wrap}
  .mp-sub{font-size:14px;color:var(--t-muted)}
  .mp-goals{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}
  .mp-goal{background:var(--t-soft);border-radius:12px;padding:10px 12px;display:flex;flex-direction:column;gap:6px;font-size:14px}
  .mp-goal b{font-size:15px}
  .mp-goal .bar{height:6px;border-radius:99px;background:var(--t-line);overflow:hidden}
  .mp-goal .bar i{display:block;height:100%;background:var(--t-accent)}
  .mp-pick{background:var(--t-accent-tint);border-radius:14px;padding:14px 16px;display:flex;flex-direction:column;gap:10px}
  .mp-pick b{font-size:17px}
  .mp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(104px,1fr));gap:10px}
  .mp-tile{position:relative;border:2px solid var(--t-line);border-radius:12px;background:var(--t-soft);font:inherit;font-size:13px;font-weight:700;color:var(--t-ink);cursor:pointer;padding:0;display:flex;flex-direction:column;overflow:hidden;text-align:left}
  .mp-tile[aria-pressed="true"]{border-color:var(--t-accent);box-shadow:0 0 0 2px var(--t-accent)}
  .mp-tile .sw{height:84px;display:grid;place-items:center;background-color:var(--t-bg)}
  .mp-tile .nm{padding:6px 8px}
  .mp-photos{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}
  .mp-photo{border:2px dashed var(--t-line);border-radius:12px;padding:10px;display:flex;flex-direction:column;gap:8px;align-items:stretch}
  .mp-photo img{width:100%;aspect-ratio:1/0.85;object-fit:cover;border-radius:6px}
  .mp-photo input[type=text]{font:inherit;font-size:14px;border:2px solid var(--t-line);border-radius:8px;padding:6px 8px}
  .mp-photo .empty{aspect-ratio:1/0.85;border-radius:6px;background:var(--t-soft);display:grid;place-items:center;color:var(--t-muted);font-size:13px;text-align:center;padding:6px}
  .mp-wlist{display:flex;flex-direction:column;gap:10px}
  .mp-w{display:flex;align-items:center;gap:12px;border:2px solid var(--t-line);border-radius:12px;padding:10px 12px}
  .mp-w .pv{flex:1;min-width:0;color:var(--t-accent);font-size:34px;line-height:1.1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .mp-w .pv img{max-height:56px;max-width:100%;mix-blend-mode:multiply;filter:grayscale(1) contrast(1.5)}
  html[data-mode="dark"] .mp-w .pv img{mix-blend-mode:screen;filter:invert(1) grayscale(1) contrast(1.5)}
  .mp-new{border:2px dashed var(--t-line);border-radius:12px;padding:12px;display:flex;flex-direction:column;gap:10px}
  .mp-tabs{display:flex;gap:6px;flex-wrap:wrap}
  .mp-tabs button{border:2px solid var(--t-line);background:var(--t-card);color:var(--t-ink);border-radius:999px;padding:5px 14px;font:inherit;font-size:14px;font-weight:700;cursor:pointer}
  .mp-tabs button[aria-pressed="true"]{border-color:var(--t-accent);color:var(--t-accent)}
  .mp-styles{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
  .mp-style{border:2px solid var(--t-line);border-radius:12px;background:var(--t-soft);padding:10px;cursor:pointer;color:var(--t-accent);font-size:26px;line-height:1.1;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;text-align:center}
  .mp-style small{display:block;font:700 12px "Atkinson Hyperlegible",sans-serif;color:var(--t-muted);margin-top:4px}
  .mp-style[aria-pressed="true"]{border-color:var(--t-accent);box-shadow:0 0 0 2px var(--t-accent)}
  .mp-in{font:inherit;font-size:17px;border:2px solid var(--t-line);border-radius:10px;padding:8px 12px;max-width:420px}
  .mp-btns{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
  .mp-btn{white-space:nowrap;flex:none;border:2px solid var(--t-accent);background:var(--t-card);color:var(--t-accent);border-radius:999px;padding:6px 14px;font:inherit;font-size:14px;font-weight:700;cursor:pointer}
  .mp-btn.mp-solid{background:var(--t-accent);color:var(--t-on-accent)}
  .mp-btn input{display:none}
  .mp-btn:focus-visible,.mp-tile:focus-visible,.mp-style:focus-visible{outline:3px solid var(--t-accent);outline-offset:2px}
  .mp-pad{width:100%;max-width:520px;height:150px;border:2px dashed var(--t-line);border-radius:12px;background:var(--t-soft);touch-action:none;cursor:crosshair}
  .mp-toggle{display:flex;align-items:center;justify-content:space-between;gap:12px}
  .mp-err{color:#a32020;font-size:14px;margin:0}
  `;
  function addPanelCss(){ if (document.getElementById("mp-css")) return; const s = document.createElement("style"); s.id = "mp-css"; s.textContent = pcss; document.head.appendChild(s); }
  const BG_SWATCH = { plain: "", dots: "background-image:radial-gradient(var(--t-line) 1.4px,transparent 1.5px);background-size:14px 14px", grid: "background-image:linear-gradient(var(--t-line) 1px,transparent 1px),linear-gradient(90deg,var(--t-line) 1px,transparent 1px);background-size:14px 14px", stripes: "background-image:repeating-linear-gradient(135deg,var(--t-line) 0 6px,transparent 6px 14px)", waves: "background-image:radial-gradient(circle at 50% 120%,transparent 9px,var(--t-line) 10px,var(--t-line) 11px,transparent 12px);background-size:22px 12px" };
  const KIND_NAME = { sticker: "sticker", writing: "writing", photo: "photo" };
  const unspent = goal => Math.max(0, earned(goal).length - Object.values(data.picks || {}).reduce((a, b) => a + b, 0));
  async function spend(sb, kind){ const p = Object.assign({}, data.picks || {}); p[kind] = (p[kind] || 0) + 1; await saveSettings(sb, { picks: p }); }
  const pickButtons = () => `<div class="mp-btns"><button type="button" class="mp-btn mp-solid" data-spend="sticker">+1 sticker</button><button type="button" class="mp-btn mp-solid" data-spend="writing">+1 writing</button><button type="button" class="mp-btn mp-solid" data-spend="photo">+1 photo</button></div>`;

  // The "My page" section in Settings
  function panel(el, { sb, goal }){
    addPanelCss(); migrate();
    const al = allowance(), left = unspent(goal), ws = data.writings || [];
    const goals = nextUp(goal).map(g => `<div class="mp-goal"><b>${esc(g.name)}</b><div class="bar"><i style="width:${Math.min(100, g.have / g.need * 100)}%"></i></div><span class="mp-sub">${g.have} of ${g.need} ${g.unit}</span></div>`).join("");
    const wPrev = w => w.image ? `<img alt="Your writing" src="${w.image}">` : `<span style="font-family:${(FONTS[w.style] || FONTS.hand).family}">${esc((FONTS[w.style] || {}).upper ? String(w.text).toUpperCase() : w.text)}</span>`;
    el.innerHTML = `<div class="mp">
      <div class="mp-sec"><b>My page</b><span class="mp-sub">Decorate your study space with writing, photos and stickers. Each reward lets you choose one more.</span>
        ${left ? `<div class="mp-pick"><b>You have ${left === 1 ? "a reward" : left + " rewards"} to choose</b><span class="mp-sub" style="color:inherit">For ${esc(earned(goal).slice(-left).join(", "))}.</span>${pickButtons()}</div>` : ""}
        <span class="mp-sub">Next rewards:</span><div class="mp-goals">${goals}</div>
        <span class="mp-sub">Your page can have ${al.writing} writing, ${al.sticker} sticker${al.sticker === 1 ? "" : "s"} and ${al.photo} photo${al.photo === 1 ? "" : "s"}. A streak day is ${goal ? goal.minutes : 14} minutes or more.</span>
        <div class="mp-btns"><button type="button" class="mp-btn mp-solid" data-arrange>Arrange my page</button></div>
        <div class="mp-toggle"><span>Show my page decorations</span><button type="button" class="settings-toggle ${data.decor_on ? "on" : ""}" data-decor aria-label="Show decorations"><span class="knob"></span></button></div>
      </div>
      <div class="mp-sec"><div class="mp-hrow"><span class="mp-h">Writing</span><span class="mp-sub">${ws.length} of ${al.writing}</span></div>
        <span class="mp-sub">Your name, a motto, or upload your signature or a note from a friend.</span>
        <div class="mp-wlist">${ws.map(w => `<div class="mp-w" style="flex-wrap:wrap"><span class="pv">${wPrev(w)}</span><button type="button" class="mp-btn" data-wdel="${esc(w.id)}">${ws.length >= al.writing ? "Remove and add new" : "Remove"}</button>
          ${w.image ? "" : `<div class="mp-styles" style="flex-basis:100%">${Object.keys(FONTS).map(k => `<button type="button" class="mp-style" data-wrestyle="${esc(w.id)}" data-k="${k}" aria-pressed="${(w.style || "hand") === k}"><span style="font-family:${FONTS[k].family}">${esc(FONTS[k].upper ? String(w.text).toUpperCase() : w.text)}</span><small>${FONTS[k].name}</small></button>`).join("")}</div>`}</div>`).join("")}</div>
        ${ws.length < al.writing ? `<div class="mp-new">
          <div class="mp-tabs" role="group" aria-label="How to add writing"><button type="button" data-wtab="type" aria-pressed="true">Type it</button><button type="button" data-wtab="draw" aria-pressed="false">Draw it</button><button type="button" data-wtab="upload" aria-pressed="false">Upload a picture</button></div>
          <div data-wpane="type"><input class="mp-in" type="text" maxlength="30" placeholder="e.g. Leaving Cert 2028" aria-label="Your writing" data-wtext>
            <div class="mp-styles" style="margin-top:10px">${Object.keys(FONTS).map((k, i) => `<button type="button" class="mp-style" data-wstyle="${k}" aria-pressed="${i === 1}"><span data-wsample="${k}" style="font-family:${FONTS[k].family}">${FONTS[k].upper ? "YOUR WORDS" : "Your words"}</span><small>${FONTS[k].name}</small></button>`).join("")}</div>
            <div class="mp-btns" style="margin-top:10px"><button type="button" class="mp-btn mp-solid" data-wsave-text>Add to my page</button></div></div>
          <div data-wpane="draw" hidden><canvas class="mp-pad" width="1040" height="300" aria-label="Drawing pad"></canvas>
            <div class="mp-btns"><button type="button" class="mp-btn mp-solid" data-wsave-draw>Add to my page</button><button type="button" class="mp-btn" data-wclear>Clear</button></div></div>
          <div data-wpane="upload" hidden><span class="mp-sub">A photo of your signature or a note on white paper works best. The paper fades away.</span>
            <div class="mp-btns" style="margin-top:8px"><label class="mp-btn mp-solid">Choose a picture<input type="file" accept="image/*" data-wfile></label></div></div>
        </div>` : (left ? "" : `<span class="mp-sub">Earn a reward to add more writing.</span>`)}
      </div>
      <div class="mp-sec"><div class="mp-hrow"><span class="mp-h">Photos</span><span class="mp-sub">Pinned like faded polaroids. Only you can see them.</span></div>
        <div class="mp-photos">${Array.from({ length: al.photo }, (_, i) => i + 1).map(n => {
          const ph = (data.photos || []).find(p => p.slot === n);
          return `<div class="mp-photo">${ph ? `<img alt="Photo ${n}" src="${ph.image}">` : `<div class="empty">Add a photo</div>`}
            <input type="text" maxlength="24" placeholder="Caption the photo" value="${esc(ph ? ph.caption || "" : "")}" data-cap="${n}" aria-label="Caption for photo ${n}">
            <div class="mp-btns"><label class="mp-btn">${ph ? "Change" : "Add photo"}<input type="file" accept="image/*" data-photo="${n}"></label>${ph ? `<button type="button" class="mp-btn" data-photo-remove="${n}">Remove</button>` : ""}</div></div>`;
        }).join("")}</div>
      </div>
      <div class="mp-sec"><div class="mp-hrow"><span class="mp-h">Stickers</span><span class="mp-sub">${(data.stickers || []).length} of ${al.sticker} on your page</span></div>
        <div class="mp-grid">${Object.keys(STICKERS).map(k => `<button type="button" class="mp-tile" data-sticker="${k}" aria-pressed="${(data.stickers || []).includes(k)}"><span class="sw">${stickerSvg(k, 70)}</span><span class="nm">${esc(STICKERS[k].name)}</span></button>`).join("")}</div>
      </div>
      <div class="mp-sec"><b>Background</b>
        <div class="mp-grid">${Object.keys(BGS).map(k => `<button type="button" class="mp-tile" data-bg="${k}" aria-pressed="${data.bg === k}"><span class="sw" style="height:62px;${BG_SWATCH[k]}"></span><span class="nm">${BGS[k]}</span></button>`).join("")}</div>
      </div>
      <p class="mp-err" hidden></p>
    </div>`;
    const err = el.querySelector(".mp-err"), say = m => { err.textContent = m; err.hidden = !m; };
    const again = () => panel(el, { sb, goal });
    el.querySelector("[data-arrange]").onclick = () => arrange(sb, again);
    el.querySelector("[data-decor]").onclick = async () => { await saveSettings(sb, { decor_on: !data.decor_on }); again(); };
    el.querySelectorAll("[data-spend]").forEach(b => b.onclick = async () => { await spend(sb, b.dataset.spend); again(); });
    el.querySelectorAll("[data-bg]").forEach(b => b.onclick = async () => { await saveSettings(sb, { bg: b.dataset.bg }); again(); });
    el.querySelectorAll("[data-sticker]").forEach(b => b.onclick = async () => {
      const k = b.dataset.sticker; let list = (data.stickers || []).slice();
      if (list.includes(k)) list = list.filter(x => x !== k);
      else if (list.length >= al.sticker) { say(al.sticker === 1 ? "You can have 1 sticker for now. Tap your sticker to take it off, or earn a reward for more." : `You can have ${al.sticker} stickers. Take one off first, or earn a reward for more.`); return; }
      else list.push(k);
      say(""); await saveSettings(sb, { stickers: list }); again();
    });
    // writing
    el.querySelectorAll("[data-wrestyle]").forEach(b => b.onclick = async () => { const id = b.dataset.wrestyle; await saveSettings(sb, { writings: ws.map(w => w.id === id ? Object.assign({}, w, { style: b.dataset.k }) : w) }); again(); });
    el.querySelectorAll("[data-wdel]").forEach(b => b.onclick = async () => { const id = b.dataset.wdel; const L = Object.assign({}, data.layout); delete L["wr:" + id]; await saveSettings(sb, { writings: ws.filter(w => w.id !== id), layout: L }); again(); });
    const newId = () => "w" + Date.now().toString(36);
    const addWriting = async (w) => { await saveSettings(sb, { writings: ws.concat([Object.assign({ id: newId() }, w)]) }); again(); };
    el.querySelectorAll("[data-wtab]").forEach(b => b.onclick = () => {
      el.querySelectorAll("[data-wtab]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      el.querySelectorAll("[data-wpane]").forEach(p => p.hidden = p.dataset.wpane !== b.dataset.wtab);
    });
    let style = "hand";
    const tIn = el.querySelector("[data-wtext]");
    if (tIn) tIn.oninput = () => el.querySelectorAll("[data-wsample]").forEach(s => { const f = FONTS[s.dataset.wsample]; const v = tIn.value.trim() || "Your words"; s.textContent = f.upper ? v.toUpperCase() : v; });
    el.querySelectorAll("[data-wstyle]").forEach(b => b.onclick = () => { style = b.dataset.wstyle; el.querySelectorAll("[data-wstyle]").forEach(x => x.setAttribute("aria-pressed", String(x === b))); });
    const st = el.querySelector("[data-wsave-text]");
    if (st) st.onclick = () => { const t = tIn.value.trim().slice(0, 30); if (!t) { say("Type your words first."); return; } say(""); addWriting({ text: t, style }); };
    const pad = el.querySelector(".mp-pad");
    if (pad) {
      const ctx = pad.getContext("2d"); ctx.lineWidth = 8; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = "#1F2328";
      let drawing = false, drew = false, last = null;
      const pos = e => { const r = pad.getBoundingClientRect(); return [(e.clientX - r.left) * pad.width / r.width, (e.clientY - r.top) * pad.height / r.height]; };
      pad.addEventListener("pointerdown", e => { drawing = true; last = pos(e); pad.setPointerCapture(e.pointerId); });
      pad.addEventListener("pointermove", e => { if (!drawing) return; const p = pos(e); ctx.beginPath(); ctx.moveTo(last[0], last[1]); ctx.lineTo(p[0], p[1]); ctx.stroke(); last = p; drew = true; });
      pad.addEventListener("pointerup", () => { drawing = false; });
      el.querySelector("[data-wclear]").onclick = () => { ctx.clearRect(0, 0, pad.width, pad.height); drew = false; };
      el.querySelector("[data-wsave-draw]").onclick = () => { const img = drew && trimPad(pad); if (!img) { say("Draw in the box first."); return; } say(""); addWriting({ image: img }); };
    }
    const wf = el.querySelector("[data-wfile]");
    if (wf) wf.onchange = async () => { const f = wf.files && wf.files[0]; if (!f) return; try { const img = await shrink(f, 700); say(""); addWriting({ image: img }); } catch (e) { say(e.message); } };
    // photos
    el.querySelectorAll("[data-photo]").forEach(inp => inp.onchange = async () => {
      const f = inp.files && inp.files[0]; if (!f) return;
      const n = +inp.dataset.photo; say("");
      try {
        const image = await shrink(f, 520);
        const caption = (el.querySelector(`[data-cap="${n}"]`).value || "").trim();
        await sb("scrapbook_photos", { method: "POST", prefer: "resolution=merge-duplicates,return=minimal", body: [{ profile_id: profileId, slot: n, image, caption, updated_at: new Date().toISOString() }] });
        data.photos = (data.photos || []).filter(p => p.slot !== n).concat([{ slot: n, image, caption }]).sort((a, b) => a.slot - b.slot);
        save(); render(); again();
      } catch (e) { say(e.message || "That photo didn't save."); }
    });
    el.querySelectorAll("[data-cap]").forEach(inp => inp.onchange = async () => {
      const n = +inp.dataset.cap, ph = (data.photos || []).find(p => p.slot === n); if (!ph) return;
      ph.caption = inp.value.trim(); save(); render();
      await sb(`scrapbook_photos?profile_id=eq.${profileId}&slot=eq.${n}`, { method: "PATCH", prefer: "return=minimal", body: { caption: ph.caption, updated_at: new Date().toISOString() } });
    });
    el.querySelectorAll("[data-photo-remove]").forEach(b => b.onclick = async () => {
      const n = +b.dataset.photoRemove;
      await sb(`scrapbook_photos?profile_id=eq.${profileId}&slot=eq.${n}`, { method: "DELETE", prefer: "return=minimal" });
      data.photos = (data.photos || []).filter(p => p.slot !== n); save(); render(); again();
    });
  }

  const acss = `
  .arr{position:fixed;inset:0;z-index:1000;background:var(--t-bg);display:flex;flex-direction:column;align-items:center;gap:12px;padding:14px 16px;box-sizing:border-box;font-family:"Atkinson Hyperlegible",Verdana,sans-serif;color:var(--t-ink);overflow:auto}
  .arr-top{width:100%;max-width:1100px;display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}
  .arr-top h2{margin:0;font-size:22px}
  .arr-top p{margin:2px 0 0;font-size:14px;color:var(--t-muted)}
  .arr-frame{position:relative;overflow:hidden;border-radius:12px;border:2px solid var(--t-line);background-color:var(--t-bg);container-type:size;flex:none;touch-action:none;user-select:none}
  .arr-frame .dk{cursor:grab}
  .arr-frame .dk.sel{outline:2px dashed var(--t-accent);outline-offset:4px;z-index:3;opacity:.75!important}
  .arr-frame .dk.behind.sel{outline-color:#C77700}
  .arr-col{position:absolute;top:0;bottom:0;z-index:2;pointer-events:none;display:flex;flex-direction:column;gap:2.4cqh;padding-top:2.5cqh}
  .arr-col i{display:block;background:var(--t-card);border-radius:1.4cqw;opacity:.94;box-shadow:0 1px 2px rgba(0,0,0,.06)}
  .arr-col i.g{background:none;box-shadow:none;opacity:1;display:flex;flex-direction:column;gap:1cqh}
  .arr-col i.g b{display:block;height:2.6cqh;width:55%;background:var(--t-ink);opacity:.18;border-radius:4px}
  .arr-col i.g s{display:block;height:1.6cqh;width:75%;background:var(--t-ink);opacity:.1;border-radius:4px}
  .arr-col span{position:absolute;left:0;right:0;top:45%;text-align:center;font-size:13px;font-weight:700;color:var(--t-muted)}
  .arr-handle{position:absolute;z-index:4;width:22px;height:22px;border-radius:50%;background:var(--t-accent);border:3px solid var(--t-card);cursor:nwse-resize;transform:translate(-50%,-50%);touch-action:none}
  .arr-tools{width:100%;max-width:1100px;display:flex;gap:8px;flex-wrap:wrap;align-items:center;min-height:44px}
  .arr-tools .msg{font-size:14px;color:var(--t-muted);margin-right:6px}
  .arr-tools .warn{color:#C77700;font-weight:700}
  .arr-btn{border:2px solid var(--t-accent);background:var(--t-card);color:var(--t-accent);border-radius:999px;padding:6px 14px;font:inherit;font-size:14px;font-weight:700;cursor:pointer;white-space:nowrap}
  .arr-btn.solid{background:var(--t-accent);color:var(--t-on-accent)}
  .arr-btn:focus-visible{outline:3px solid var(--t-accent);outline-offset:2px}
  .arr-tray{width:100%;max-width:1100px;display:flex;gap:8px;flex-wrap:wrap;align-items:center;font-size:14px;color:var(--t-muted)}
  `;
  function arrange(sb, onDone){
    if (!document.getElementById("arr-css")) { const st = document.createElement("style"); st.id = "arr-css"; st.textContent = acss; document.head.appendChild(st); }
    const before = JSON.stringify({ layout: data.layout || {}, stickers: data.stickers || [] });
    data.layout = JSON.parse(JSON.stringify(data.layout || {}));
    const vw = window.innerWidth < 900 ? 1440 : window.innerWidth, vh = window.innerWidth < 900 ? 900 : window.innerHeight;
    const colW = Math.min(820, vw - 36) / vw * 100;
    const ov = document.createElement("div"); ov.className = "arr"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-label", "Arrange my page");
    ov.innerHTML = `<div class="arr-top"><div><h2>Arrange my page</h2><p>Drag things to move them. Drag the round handle to resize. The white blocks are where your work sits, so anything under them is hidden.${window.innerWidth < 900 ? " Decorations show on laptops and tablets." : ""}</p></div>
      <div style="display:flex;gap:8px"><button type="button" class="arr-btn" data-reset>Reset</button><button type="button" class="arr-btn" data-cancel>Cancel</button><button type="button" class="arr-btn solid" data-done>Done</button></div></div>
      <div class="arr-frame" data-bg="${esc(data.bg || "plain")}"></div>
      <div class="arr-tools"></div><div class="arr-tray"></div>`;
    document.body.appendChild(ov);
    const frame = ov.querySelector(".arr-frame"), tools = ov.querySelector(".arr-tools"), tray = ov.querySelector(".arr-tray");
    const fit = () => { const maxW = Math.min(1100, window.innerWidth - 32), maxH = window.innerHeight - 250; const w = Math.max(300, Math.min(maxW, maxH * vw / vh)); frame.style.width = w + "px"; frame.style.height = (w * vh / vw) + "px"; };
    fit(); window.addEventListener("resize", fit);
    frame.style.cssText += ";" + (BG_SWATCH[data.bg] || "").replace(/14px 14px/g, "1.7cqw 1.7cqw");
    let sel = null;
    const posOf = id => { const it = items().find(x => x.id === id); return it ? it.pos : null; };
    const setPos = (id, change) => { const cur = posOf(id) || {}; data.layout[id] = Object.assign({}, cur, change); };
    function behind(el){
      const f = frame.getBoundingClientRect(), r = el.getBoundingClientRect();
      const cl = f.left + f.width * (100 - colW) / 200, cr = f.left + f.width * (100 + colW) / 200;
      const ov2 = Math.max(0, Math.min(r.right, cr) - Math.max(r.left, cl));
      return r.width ? ov2 / r.width : 0;
    }
    function paint(){
      frame.innerHTML = items().filter(it => !it.pos.h).map(it => itemHtml(it, "cqw", "cqh")).join("") +
        `<div class="arr-col" style="left:${(100 - colW) / 2}cqw;width:${colW}cqw"><i class="g" style="height:7cqh"><b></b><s></s></i><i style="height:17cqh"></i><i style="flex:1;margin-bottom:-2cqh"></i><span>Your study work</span></div>`;
      frame.querySelectorAll(".dk").forEach(el => {
        if (el.dataset.id === sel) el.classList.add("sel");
        if (behind(el) > .35) el.classList.add("behind");
        el.addEventListener("pointerdown", e => startDrag(e, el));
      });
      const se = sel && frame.querySelector(`.dk[data-id="${CSS.escape(sel)}"]`);
      if (se) {
        const f = frame.getBoundingClientRect(), r = se.getBoundingClientRect();
        const h = document.createElement("span"); h.className = "arr-handle"; h.setAttribute("aria-label", "Resize");
        h.style.left = (r.right - f.left) + "px"; h.style.top = (r.bottom - f.top) + "px";
        h.addEventListener("pointerdown", e => startResize(e)); frame.appendChild(h);
      }
      paintTools(se);
      paintTray();
    }
    function paintTools(se){
      if (!sel || !se) { tools.innerHTML = `<span class="msg">Tap something on the page to change it.</span>`; return; }
      const b = behind(se);
      tools.innerHTML = `<span class="msg${b > .35 ? " warn" : ""}">${b > .35 ? "This is mostly behind your work. Drag it to the side." : "Selected."}</span>
        <button type="button" class="arr-btn" data-t="small">Smaller</button><button type="button" class="arr-btn" data-t="big">Bigger</button>
        <button type="button" class="arr-btn" data-t="left">Turn left</button><button type="button" class="arr-btn" data-t="right">Turn right</button>
        <button type="button" class="arr-btn" data-t="faint">Fainter</button><button type="button" class="arr-btn" data-t="strong">Stronger</button>
        <button type="button" class="arr-btn" data-t="remove">Take off page</button>`;
      tools.querySelectorAll("[data-t]").forEach(bt => bt.onclick = () => {
        const p = posOf(sel); if (!p) return;
        const t = bt.dataset.t;
        if (t === "small") setPos(sel, { w: Math.max(4, p.w * .88) });
        if (t === "big") setPos(sel, { w: Math.min(60, p.w * 1.14) });
        if (t === "left") setPos(sel, { r: (p.r || 0) - 6 });
        if (t === "right") setPos(sel, { r: (p.r || 0) + 6 });
        if (t === "faint") setPos(sel, { o: Math.max(.05, (p.o || .15) - .04) });
        if (t === "strong") setPos(sel, { o: Math.min(.6, (p.o || .15) + .04) });
        if (t === "remove") {
          if (sel.startsWith("st:")) data.stickers = (data.stickers || []).filter(k => "st:" + k !== sel);
          else setPos(sel, { h: true });
          sel = null;
        }
        paint();
      });
    }
    function paintTray(){
      const al = allowance();
      const st = Object.keys(STICKERS).filter(k => !(data.stickers || []).includes(k));
      const roomSt = (data.stickers || []).length < al.sticker;
      const hid = hiddenItems();
      if ((!roomSt || !st.length) && !hid.length) { tray.innerHTML = roomSt ? "" : `<span>All ${al.sticker} sticker${al.sticker === 1 ? "" : "s"} are on your page. Earn rewards for more.</span>`; return; }
      tray.innerHTML = `<span>Add to page:</span>` + (roomSt ? st.map(k => `<button type="button" class="arr-btn" data-add-st="${k}">${STICKERS[k].name}</button>`).join("") : "") + hid.map(h => `<button type="button" class="arr-btn" data-show="${esc(h.id)}">${esc(h.label)}</button>`).join("");
      tray.querySelectorAll("[data-add-st]").forEach(b => b.onclick = () => { data.stickers = (data.stickers || []).concat([b.dataset.addSt]); sel = "st:" + b.dataset.addSt; paint(); });
      tray.querySelectorAll("[data-show]").forEach(b => b.onclick = () => { const id = b.dataset.show; const cur = Object.assign({}, data.layout[id] || {}); delete cur.h; data.layout[id] = cur; sel = id; paint(); });
    }
    function startDrag(e, el){
      e.preventDefault(); sel = el.dataset.id;
      const p = posOf(sel), f = frame.getBoundingClientRect(), sx = e.clientX, sy = e.clientY, ox = p.x, oy = p.y;
      const move = ev => { setPos(sel, { x: ox + (ev.clientX - sx) / f.width * 100, y: oy + (ev.clientY - sy) / f.height * 100 });
        const it = items().find(x => x.id === sel); const node = frame.querySelector(`.dk[data-id="${CSS.escape(sel)}"]`);
        if (it && node) { node.style.left = it.pos.x + "cqw"; node.style.top = it.pos.y + "cqh"; } };
      const up = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); paint(); };
      window.addEventListener("pointermove", move); window.addEventListener("pointerup", up);
      paint();
    }
    function startResize(e){
      e.preventDefault(); e.stopPropagation();
      const p = posOf(sel), f = frame.getBoundingClientRect(), sx = e.clientX, ow = p.w;
      const move = ev => { setPos(sel, { w: Math.max(4, Math.min(60, ow + (ev.clientX - sx) / f.width * 100)) });
        const node = frame.querySelector(`.dk[data-id="${CSS.escape(sel)}"]`); if (node) node.outerHTML = itemHtml(items().find(x => x.id === sel), "cqw", "cqh"); };
      const up = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); paint(); };
      window.addEventListener("pointermove", move); window.addEventListener("pointerup", up);
    }
    frame.addEventListener("pointerdown", e => { if (e.target === frame) { sel = null; paint(); } });
    const close = () => { window.removeEventListener("resize", fit); ov.remove(); };
    ov.querySelector("[data-reset]").onclick = () => { data.layout = {}; sel = null; paint(); };
    ov.querySelector("[data-cancel]").onclick = () => { const b = JSON.parse(before); data.layout = b.layout; data.stickers = b.stickers; render(); close(); };
    ov.querySelector("[data-done]").onclick = async () => { await saveSettings(sb, { layout: data.layout, stickers: data.stickers }); close(); if (onDone) onDone(); };
    ov.addEventListener("keydown", e => { if (e.key === "Escape") ov.querySelector("[data-cancel]").click(); });
    paint();
    ov.querySelector("[data-done]").focus();
  }


  // Homepage: a reward card while there are rewards to choose
  function celebration(goal){
    const left = unspent(goal); if (!left) return null;
    return { left, why: earned(goal).slice(-left) };
  }
  window.Decor = { load, render, panel, arrange, celebration, spend, earned, nextUp, unspent, stickerSvg, get: () => data };
  addCss();
  if (document.body) render(); else document.addEventListener("DOMContentLoaded", render);
})();
