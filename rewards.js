// Rewards and "My page": a faint scrapbook behind the study pages.
// Every week with 14 minutes on at least 5 days unlocks something new: photo slots,
// big faded stickers and backgrounds. The signature is free from day one.
// Choices are saved in student_settings; photos in scrapbook_photos (small JPEGs).
(function(){
  const me = document.currentScript;
  const profileId = me && me.dataset.profile || "";
  const KEY = "sp-decor-" + profileId;
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

  const STICKERS = {
    bolt:     { name: "Lightning", color: "#2E8B72", svg: c => `<circle cx="32" cy="32" r="28" fill="${c}"/><path d="M35 12 L20 36 H31 L28 52 L44 27 H33 Z" fill="#fff"/>` },
    planet:   { name: "Planet", color: "#6A55B0", svg: c => `<circle cx="32" cy="32" r="16" fill="${c}"/><ellipse cx="32" cy="32" rx="28" ry="8" fill="none" stroke="${c}" stroke-width="4" transform="rotate(-20 32 32)"/>` },
    mountain: { name: "Mountain", color: "#2457A6", svg: c => `<rect x="6" y="10" width="52" height="44" rx="14" fill="${c}"/><path d="M12 46 L26 26 L34 36 L40 30 L52 46 Z" fill="#fff"/><circle cx="44" cy="20" r="4" fill="#fff"/>` },
    star:     { name: "Star", color: "#C99A2E", svg: c => `<path d="M32 4 L39 23 L59 24 L43 37 L49 57 L32 45 L15 57 L21 37 L5 24 L25 23 Z" fill="${c}"/>` },
    wave:     { name: "Wave", color: "#3A7FA8", svg: c => `<rect x="6" y="14" width="52" height="36" rx="18" fill="${c}"/><path d="M12 36 Q20 26 28 36 T44 36 T56 34" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>` },
    leaf:     { name: "Leaf", color: "#B0607E", svg: c => `<circle cx="32" cy="32" r="28" fill="${c}"/><path d="M20 44 C20 26 32 18 46 18 C46 34 38 44 20 44 Z" fill="#fff"/>` }
  };
  const BGS = { plain: "Plain", dots: "Dots", grid: "Grid paper", stripes: "Stripes", waves: "Waves" };
  // What each completed week unlocks, in order
  const LADDER = [
    { type: "photo" }, { type: "sticker", key: "bolt" }, { type: "bg", key: "grid" }, { type: "sticker", key: "planet" },
    { type: "photo" }, { type: "sticker", key: "mountain" }, { type: "bg", key: "stripes" }, { type: "sticker", key: "star" },
    { type: "photo" }, { type: "sticker", key: "wave" }, { type: "bg", key: "waves" }, { type: "sticker", key: "leaf" }
  ];
  const label = r => r.type === "photo" ? "a photo spot" : r.type === "sticker" ? `the ${STICKERS[r.key].name} sticker` : `the ${BGS[r.key]} background`;
  function unlocked(weeks){
    const got = LADDER.slice(0, Math.max(0, weeks));
    return {
      photos: got.filter(r => r.type === "photo").length,
      stickers: got.filter(r => r.type === "sticker").map(r => r.key),
      bgs: ["plain", "dots", ...got.filter(r => r.type === "bg").map(r => r.key)],
      next: LADDER[weeks] || null
    };
  }
  const stickerSvg = (key, size, color) => `<svg width="${size}" height="${size}" viewBox="0 0 64 64" aria-hidden="true">${STICKERS[key].svg(color || STICKERS[key].color)}</svg>`;

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
  .dk.sig{color:var(--t-accent)}
  .dk .sig-img{width:100%;aspect-ratio:960/280;background:var(--t-accent);-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-size:contain;mask-size:contain;-webkit-mask-position:center;mask-position:center}
  .dk .sig-text{font-family:Caveat,cursive;line-height:1;white-space:nowrap;text-align:center}
  @media (max-width:899px){#decor .dk{display:none}}
  `;
  function addCss(){ if (document.getElementById("decor-css")) return; const s = document.createElement("style"); s.id = "decor-css"; s.textContent = css; document.head.appendChild(s); }
  if (!document.querySelector('link[href*="family=Caveat"]')) {
    const l = document.createElement("link"); l.rel = "stylesheet"; l.href = "https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap"; document.head.appendChild(l);
  }

  let data = { bg: "dots", stickers: [], signature: null, decor_on: true, rewards_seen: 0, photos: [], layout: {} };
  try { const c = JSON.parse(localStorage.getItem(KEY) || "null"); if (c) data = Object.assign(data, c); } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {} };

  // Where things sit by default (percent of the screen). Each can be moved, resized, turned and faded in "Arrange my page".
  const DEF = {
    sig: { x: 2, y: 80, w: 26, r: -5, o: .2 },
    st: [ { x: -2, y: 9, w: 19, r: -14, o: .14 }, { x: 84, y: 3, w: 16, r: 12, o: .14 }, { x: 85, y: 60, w: 17, r: -8, o: .14 } ],
    ph: [ { x: 3, y: 44, w: 12.5, r: -9, o: .32 }, { x: 84, y: 30, w: 13.5, r: 7, o: .32 }, { x: 5, y: 70, w: 11, r: 5, o: .32 } ]
  };
  // Everything that's on the page right now, with its position
  function items(){
    const L = data.layout || {}, out = [];
    (data.stickers || []).slice(0, 3).forEach((k, i) => { if (STICKERS[k]) out.push({ id: "st:" + k, kind: "st", key: k, pos: Object.assign({}, DEF.st[i], L["st:" + k] || {}) }); });
    (data.photos || []).slice(0, 3).forEach(ph => { if (ph.image) out.push({ id: "ph:" + ph.slot, kind: "ph", ph, pos: Object.assign({}, DEF.ph[(ph.slot || 1) - 1], L["ph:" + ph.slot] || {}) }); });
    const sig = data.signature || "";
    if (sig) out.push({ id: "sig", kind: "sig", sig, pos: Object.assign({}, DEF.sig, L.sig || {}) });
    return out.filter(it => !it.pos.h);
  }
  function hiddenItems(){
    const L = data.layout || {}, out = [];
    (data.photos || []).forEach(ph => { if (ph.image && L["ph:" + ph.slot] && L["ph:" + ph.slot].h) out.push({ id: "ph:" + ph.slot, label: ph.caption || "Photo " + ph.slot }); });
    if (data.signature && L.sig && L.sig.h) out.push({ id: "sig", label: "Signature" });
    return out;
  }
  // unit: "vw"/"vh" on the real page, "%" inside the editor frame
  function itemHtml(it, ux, uy){
    const p = it.pos, mode = document.documentElement.dataset.mode;
    const op = Math.max(.05, Math.min(.6, (p.o || .15) * (mode === "dark" ? .75 : 1)));
    const style = `left:${p.x}${ux};top:${p.y}${uy};width:${p.w}${ux};transform:rotate(${p.r || 0}deg);opacity:${op}`;
    let inner = "";
    if (it.kind === "st") inner = stickerSvg(it.key, 64).replace('width="64" height="64"', "");
    else if (it.kind === "ph") inner = `<span class="pol"><span class="tape"></span><img alt="" src="${it.ph.image}"><span class="cap" style="font-size:calc(${p.w}${ux} * .13)">${esc(it.ph.caption || "")}</span></span>`;
    else if (it.sig.startsWith("img:")) inner = `<span class="sig-img" style="display:block;-webkit-mask-image:url(${it.sig.slice(4)});mask-image:url(${it.sig.slice(4)})"></span>`;
    else inner = `<span class="sig-text" style="display:block;font-size:calc(${p.w}${ux} * ${Math.min(.6, 1.6 / Math.max(3, it.sig.length - 5))})">${esc(it.sig.slice(5))}</span>`;
    return `<span class="dk ${it.kind}" data-id="${it.id}" style="${style}">${inner}</span>`;
  }
  function render(){
    addCss();
    document.documentElement.dataset.bg = data.decor_on ? (data.bg || "plain") : "plain";
    let layer = document.getElementById("decor");
    if (!layer) { layer = document.createElement("div"); layer.id = "decor"; layer.setAttribute("aria-hidden", "true"); document.body.prepend(layer); }
    layer.innerHTML = data.decor_on ? items().map(it => itemHtml(it, "vw", "vh")).join("") : "";
  }

  async function load(sb){
    try {
      const [rows, photos] = await Promise.all([
        sb(`student_settings?select=bg,stickers,signature,decor_on,rewards_seen,layout&profile_id=eq.${profileId}`),
        sb(`scrapbook_photos?select=slot,image,caption&profile_id=eq.${profileId}&order=slot.asc`)
      ]);
      if (rows && rows[0]) Object.assign(data, rows[0]);
      data.photos = photos || [];
      save(); render();
    } catch (e) {}
  }
  async function saveSettings(sb, change){
    Object.assign(data, change); save(); render();
    const t = window.Theme ? Theme.get() : { accent: "green", mode: "light" };
    await sb("student_settings", { method: "POST", prefer: "resolution=merge-duplicates,return=minimal",
      body: [{ profile_id: profileId, accent: t.accent, mode: t.mode, bg: data.bg, stickers: data.stickers, signature: data.signature, decor_on: data.decor_on, rewards_seen: data.rewards_seen, layout: data.layout || {}, updated_at: new Date().toISOString() }] });
  }

  function shrink(file, max){
    return new Promise((resolve, reject) => {
      const img = new Image(), url = URL.createObjectURL(file);
      img.onload = () => {
        const s = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement("canvas"); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
        resolve(c.toDataURL("image/jpeg", 0.72));
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("That file isn't a photo we can read.")); };
      img.src = url;
    });
  }

  const pcss = `
  .mp{background:var(--t-card);border-radius:18px;padding:8px 24px 20px;margin:0 0 22px;font-family:"Atkinson Hyperlegible",Verdana,sans-serif}
  .mp-sec{padding:16px 0;border-top:1px solid var(--t-line);display:flex;flex-direction:column;gap:10px}
  .mp-sec:first-child{border-top:none}
  .mp-sec>b{font-size:18px}
  .mp-sub{font-size:14px;color:var(--t-muted)}
  .mp-days{display:flex;gap:10px}
  .mp-day{display:flex;flex-direction:column;align-items:center;gap:4px;font-size:12px;color:var(--t-muted)}
  .mp-day i{display:block;width:28px;height:28px;border-radius:50%;background:var(--t-soft2)}
  .mp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:10px}
  .mp-tile{position:relative;border:2px solid var(--t-line);border-radius:12px;background:var(--t-soft);font:inherit;font-size:13px;font-weight:700;color:var(--t-ink);cursor:pointer;padding:0;display:flex;flex-direction:column;overflow:hidden;text-align:left}
  .mp-tile[aria-pressed="true"]{border-color:var(--t-accent);box-shadow:0 0 0 2px var(--t-accent)}
  .mp-tile[disabled]{cursor:default;color:var(--t-muted)}
  .mp-tile .sw{height:62px;display:grid;place-items:center;background-color:var(--t-bg)}
  .mp-tile .nm{padding:6px 8px}
  .mp-lock{position:absolute;right:6px;top:6px;font-size:11px;font-weight:700;background:var(--t-card);color:var(--t-muted);border-radius:999px;padding:1px 7px}
  .mp-photos{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}
  .mp-photo{border:2px dashed var(--t-line);border-radius:12px;padding:10px;display:flex;flex-direction:column;gap:8px;align-items:stretch}
  .mp-photo img{width:100%;aspect-ratio:1/0.85;object-fit:cover;border-radius:6px}
  .mp-photo input[type=text]{font:inherit;font-size:14px;border:2px solid var(--t-line);border-radius:8px;padding:6px 8px}
  .mp-photo .empty{aspect-ratio:1/0.85;border-radius:6px;background:var(--t-soft);display:grid;place-items:center;color:var(--t-muted);font-size:13px;text-align:center;padding:6px}
  .mp-btns{display:flex;gap:8px;flex-wrap:wrap}
  .mp [hidden]{display:none!important}
  .mp-btn{white-space:nowrap;flex:none;border:2px solid var(--t-accent);background:var(--t-card);color:var(--t-accent);border-radius:999px;padding:6px 14px;font:inherit;font-size:14px;font-weight:700;cursor:pointer}
  .mp-btn.mp-solid{background:var(--t-accent);color:var(--t-on-accent)}
  .mp-btn input{display:none}
  .mp-pad{width:100%;max-width:480px;height:140px;border:2px dashed var(--t-line);border-radius:12px;background:var(--t-soft);touch-action:none;cursor:crosshair}
  .mp-sigprev{font-family:Caveat,cursive;font-size:56px;color:var(--t-accent);line-height:1}
  .mp-toggle{display:flex;align-items:center;justify-content:space-between;gap:12px}
  .mp-err{color:#a32020;font-size:14px;margin:0}
  `;
  function addPanelCss(){ if (document.getElementById("mp-css")) return; const s = document.createElement("style"); s.id = "mp-css"; s.textContent = pcss; document.head.appendChild(s); }

  const BG_SWATCH = { plain: "", dots: "background-image:radial-gradient(var(--t-line) 1.4px,transparent 1.5px);background-size:14px 14px", grid: "background-image:linear-gradient(var(--t-line) 1px,transparent 1px),linear-gradient(90deg,var(--t-line) 1px,transparent 1px);background-size:14px 14px", stripes: "background-image:repeating-linear-gradient(135deg,var(--t-line) 0 6px,transparent 6px 14px)", waves: "background-image:radial-gradient(circle at 50% 120%,transparent 9px,var(--t-line) 10px,var(--t-line) 11px,transparent 12px);background-size:22px 12px" };
  const weekOf = (type, key) => { const i = LADDER.findIndex(r => r.type === type && r.key === key); return i + 1; };
  const photoWeek = n => { let c = 0; for (let i = 0; i < LADDER.length; i++) if (LADDER[i].type === "photo" && ++c === n) return i + 1; return null; };

  // The "My page" section in Settings
  function panel(el, { sb, goal }){
    addPanelCss();
    const u = unlocked(goal ? goal.weeksDone : 0);
    const days = (() => {
      if (!goal) return "";
      const ws = new Date(); ws.setHours(0,0,0,0); ws.setDate(ws.getDate() - ((ws.getDay() + 6) % 7));
      return ["M","T","W","T","F","S","S"].map((l, i) => {
        const d = new Date(ws.getTime() + i * 86400000), k = d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate();
        const m = Math.min(1, (goal.dayMin[k] || 0) / goal.minutes);
        return `<span class="mp-day"><i style="background:${m >= 1 ? "var(--t-accent)" : m > 0 ? `conic-gradient(var(--t-accent) 0 ${Math.round(m*100)}%,var(--t-soft2) 0)` : ""}"></i>${l}</span>`;
      }).join("");
    })();
    const sig = data.signature || "";
    el.innerHTML = `<div class="mp">
      <div class="mp-sec"><b>My page</b><span class="mp-sub">Decorate your study space. Every week with ${goal ? goal.minutes : 14} minutes on at least ${goal ? goal.days : 5} days unlocks something new.</span>
        ${goal ? `<div class="mp-days">${days}</div><span class="mp-sub">This week: ${goal.thisWeekGood} of ${goal.days} days · today ${goal.today} of ${goal.minutes} minutes${u.next ? ` · next: ${label(u.next)}` : ""}</span>` : ""}
        <div class="mp-btns"><button type="button" class="mp-btn mp-solid" data-arrange>Arrange my page</button></div>
        <div class="mp-toggle"><span>Show my page decorations</span><button type="button" class="settings-toggle ${data.decor_on ? "on" : ""}" data-decor aria-label="Show decorations"><span class="knob"></span></button></div>
      </div>
      <div class="mp-sec"><b>Signature</b><span class="mp-sub">Sign with your finger or mouse. It shows faintly at the bottom of your pages.</span>
        ${sig.startsWith("text:") ? `<span class="mp-sigprev">${esc(sig.slice(5))}</span>` : ""}
        <canvas class="mp-pad" width="960" height="280" aria-label="Signature pad"></canvas>
        <div class="mp-btns"><button type="button" class="mp-btn mp-solid" data-sig-save>Save signature</button><button type="button" class="mp-btn" data-sig-clear>Clear</button><button type="button" class="mp-btn" data-sig-type>Type it instead</button>${sig ? `<button type="button" class="mp-btn" data-sig-remove>Remove</button>` : ""}</div>
        <form class="mp-btns" data-sig-form hidden><input type="text" name="n" maxlength="24" placeholder="Your name" aria-label="Your name" value="${esc(sig.startsWith("text:") ? sig.slice(5) : "")}" style="font:inherit;font-size:16px;border:2px solid var(--t-line);border-radius:10px;padding:6px 10px"><button class="mp-btn mp-solid" type="submit">Use this</button></form>
      </div>
      <div class="mp-sec"><b>Photos</b><span class="mp-sub">Pinned like faded polaroids. Only you can see them.</span>
        <div class="mp-photos">${[1,2,3].map(n => {
          const ph = (data.photos || []).find(p => p.slot === n);
          if (n > u.photos) return `<div class="mp-photo"><div class="empty">Unlocks after week ${photoWeek(n)}</div></div>`;
          return `<div class="mp-photo">${ph ? `<img alt="Photo ${n}" src="${ph.image}">` : `<div class="empty">Add a photo</div>`}
            <input type="text" maxlength="24" placeholder="Caption" value="${esc(ph ? ph.caption || "" : "")}" data-cap="${n}" aria-label="Caption for photo ${n}">
            <div class="mp-btns"><label class="mp-btn">${ph ? "Change" : "Add photo"}<input type="file" accept="image/*" data-photo="${n}"></label>${ph ? `<button type="button" class="mp-btn" data-photo-remove="${n}">Remove</button>` : ""}</div></div>`;
        }).join("")}</div>
      </div>
      <div class="mp-sec"><b>Stickers</b><span class="mp-sub">Big and faded behind your pages. Pick up to 3.</span>
        <div class="mp-grid">${Object.keys(STICKERS).map(k => {
          const open = u.stickers.includes(k), on = (data.stickers || []).includes(k);
          return `<button type="button" class="mp-tile" data-sticker="${k}" aria-pressed="${on}"${open ? "" : " disabled"}><span class="sw">${stickerSvg(k, 44, open ? null : "#C9CFD6")}</span><span class="nm">${STICKERS[k].name}</span>${open ? "" : `<span class="mp-lock">Week ${weekOf("sticker", k)}</span>`}</button>`;
        }).join("")}</div>
      </div>
      <div class="mp-sec"><b>Background</b>
        <div class="mp-grid">${Object.keys(BGS).map(k => {
          const open = u.bgs.includes(k);
          return `<button type="button" class="mp-tile" data-bg="${k}" aria-pressed="${data.bg === k}"${open ? "" : " disabled"}><span class="sw" style="${BG_SWATCH[k]}"></span><span class="nm">${BGS[k]}</span>${open ? "" : `<span class="mp-lock">Week ${weekOf("bg", k)}</span>`}</button>`;
        }).join("")}</div>
      </div>
      <p class="mp-err" hidden></p>
    </div>`;
    const err = el.querySelector(".mp-err");
    const again = () => panel(el, { sb, goal });
    window.__decorWeeks = goal ? goal.weeksDone : 0;
    el.querySelector("[data-arrange]").onclick = () => arrange(sb, again);
    el.querySelector("[data-decor]").onclick = async () => { await saveSettings(sb, { decor_on: !data.decor_on }); again(); };
    el.querySelectorAll("[data-bg]").forEach(b => b.onclick = async () => { await saveSettings(sb, { bg: b.dataset.bg }); again(); });
    el.querySelectorAll("[data-sticker]").forEach(b => b.onclick = async () => {
      const k = b.dataset.sticker; let list = (data.stickers || []).slice();
      if (list.includes(k)) list = list.filter(x => x !== k); else { list.push(k); if (list.length > 3) list.shift(); }
      await saveSettings(sb, { stickers: list }); again();
    });
    // photos
    el.querySelectorAll("[data-photo]").forEach(inp => inp.onchange = async () => {
      const f = inp.files && inp.files[0]; if (!f) return;
      const n = +inp.dataset.photo; err.hidden = true;
      try {
        const image = await shrink(f, 520);
        const caption = (el.querySelector(`[data-cap="${n}"]`).value || "").trim();
        await sb("scrapbook_photos", { method: "POST", prefer: "resolution=merge-duplicates,return=minimal", body: [{ profile_id: profileId, slot: n, image, caption, updated_at: new Date().toISOString() }] });
        data.photos = (data.photos || []).filter(p => p.slot !== n).concat([{ slot: n, image, caption }]).sort((a, b) => a.slot - b.slot);
        save(); render(); again();
      } catch (e) { err.textContent = e.message || "That photo didn't save."; err.hidden = false; }
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
    // signature pad
    const pad = el.querySelector(".mp-pad"), ctx = pad.getContext("2d");
    ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = "#1F2328";
    let drawing = false, drew = false, last = null;
    const pos = e => { const r = pad.getBoundingClientRect(); return [(e.clientX - r.left) * pad.width / r.width, (e.clientY - r.top) * pad.height / r.height]; };
    pad.addEventListener("pointerdown", e => { drawing = true; last = pos(e); pad.setPointerCapture(e.pointerId); });
    pad.addEventListener("pointermove", e => { if (!drawing) return; const p = pos(e); ctx.beginPath(); ctx.moveTo(last[0], last[1]); ctx.lineTo(p[0], p[1]); ctx.stroke(); last = p; drew = true; });
    pad.addEventListener("pointerup", () => { drawing = false; });
    el.querySelector("[data-sig-clear]").onclick = () => { ctx.clearRect(0, 0, pad.width, pad.height); drew = false; };
    el.querySelector("[data-sig-save]").onclick = async () => {
      if (!drew) { err.textContent = "Sign in the box first."; err.hidden = false; return; }
      await saveSettings(sb, { signature: "img:" + pad.toDataURL("image/png") }); again();
    };
    const sf = el.querySelector("[data-sig-form]");
    el.querySelector("[data-sig-type]").onclick = () => { sf.hidden = false; sf.n.focus(); };
    sf.onsubmit = async (e) => { e.preventDefault(); const t = (sf.n.value || "").trim().slice(0, 24); if (t) { await saveSettings(sb, { signature: "text:" + t }); again(); } };
    const rm = el.querySelector("[data-sig-remove]"); if (rm) rm.onclick = async () => { await saveSettings(sb, { signature: null }); again(); };
  }


  // ---- "Arrange my page": move, resize, turn and fade things on a preview of the page ----
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
      frame.innerHTML = items().map(it => itemHtml(it, "cqw", "cqh")).join("") +
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
      const u = unlocked(window.__decorWeeks || 0);
      const st = u.stickers.filter(k => !(data.stickers || []).includes(k));
      const hid = hiddenItems();
      if (!st.length && !hid.length) { tray.innerHTML = ""; return; }
      tray.innerHTML = `<span>Add to page:</span>` + st.map(k => `<button type="button" class="arr-btn" data-add-st="${k}">${STICKERS[k].name} sticker</button>`).join("") + hid.map(h => `<button type="button" class="arr-btn" data-show="${esc(h.id)}">${esc(h.label)}</button>`).join("");
      tray.querySelectorAll("[data-add-st]").forEach(b => b.onclick = () => { const list = (data.stickers || []).slice(); list.push(b.dataset.addSt); if (list.length > 3) list.shift(); data.stickers = list; sel = "st:" + b.dataset.addSt; paint(); });
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

  // Homepage celebration when a new week is complete
  function celebration(goal){
    if (!goal || goal.weeksDone <= (data.rewards_seen || 0)) return null;
    const fresh = LADDER.slice(data.rewards_seen || 0, goal.weeksDone);
    return { items: fresh.map(label), weeks: goal.weeksDone };
  }
  async function markSeen(sb, weeks){ await saveSettings(sb, { rewards_seen: weeks }); }

  addCss();
  if (document.body) render(); else document.addEventListener("DOMContentLoaded", render);
  window.Decor = { load, render, panel, arrange, celebration, markSeen, unlocked, LADDER, label, stickerSvg, get: () => data };
})();
