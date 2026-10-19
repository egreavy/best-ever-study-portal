// Colour (green, blue or purple) and screen (light or dark), chosen by each student in Settings.
// Loaded in <head> so the page never flashes the wrong colours. The choice is saved to
// Supabase (student_settings) and remembered on this device for a fast start.
(function(){
  const me = document.currentScript;
  const profileId = me && me.dataset.profile || "";
  const KEY = "sp-theme-" + profileId;
  const ACCENTS = {
    green:  { light: ["#1F6F5C","#15513F","#E3F1EC","#CFE4DC","#7FC4AE"], dark: ["#5FBF9F","#7FD0B3","#1C3A32","#2C5A4D","#3E8F75"] },
    blue:   { light: ["#2457A6","#1A4280","#E4ECF8","#CCDAF0","#8FB1E6"], dark: ["#7AA7F0","#9BBEF5","#1D2C45","#2E4670","#4D78BF"] },
    purple: { light: ["#6A3FA0","#522F7D","#EEE6F7","#DDCEEE","#B79AD9"], dark: ["#B48CF0","#C7A8F5","#33264A","#4C3870","#8460BF"] }
  };
  const BASE = {
    light: { card:"#FFFFFF", bg:"#F4F5F6", ink:"#1F2328", muted:"#5B6470", line:"#DDE1E5", soft:"#F4F5F6", soft2:"#EEF0F2", hero:"#1F2328", warn:"#8A5A00", warnTint:"#FBF0D9", on:"#FFFFFF" },
    dark:  { card:"#1F2329", bg:"#15181C", ink:"#ECEEF0", muted:"#A3ABB5", line:"#333A42", soft:"#262B31", soft2:"#2A2F36", hero:"#2A3038", warn:"#F0C46A", warnTint:"#3A3020", on:"#111417" }
  };
  function css(accent, mode){
    const a = (ACCENTS[accent] || ACCENTS.green)[mode] || ACCENTS.green.light, b = BASE[mode] || BASE.light;
    return `html:root{color-scheme:${mode};
      --t-accent:${a[0]};--t-accent-hover:${a[1]};--t-accent-tint:${a[2]};--t-accent-border:${a[3]};--t-accent-soft:${a[4]};
      --t-card:${b.card};--t-bg:${b.bg};--t-ink:${b.ink};--t-muted:${b.muted};--t-line:${b.line};--t-soft:${b.soft};--t-soft2:${b.soft2};
      --t-hero:${b.hero};--t-warn:${b.warn};--t-warn-tint:${b.warnTint};--t-on-accent:${b.on};
      --ink:${b.ink};--sub:${b.muted};--accent:${a[0]};--accent-soft:${a[2]};--green:${a[0]};--track:${b.line};--card-border:${b.line};--bg:${b.bg};}
    html body{background:var(--t-bg);color:var(--t-ink)}
    input,textarea,select{background:var(--t-card);color:var(--t-ink);border-color:var(--t-line)}
    a{color:var(--t-accent)}`;
  }
  function read(){ try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { return null; } }
  function write(t){ try { localStorage.setItem(KEY, JSON.stringify(t)); } catch (e) {} }
  let current = Object.assign({ accent: "green", mode: "light" }, read() || {});
  function apply(t){
    current = { accent: ACCENTS[t.accent] ? t.accent : "green", mode: t.mode === "dark" ? "dark" : "light" };
    let el = document.getElementById("sp-theme");
    if (!el) { el = document.createElement("style"); el.id = "sp-theme"; document.head.appendChild(el); }
    el.textContent = css(current.accent, current.mode);
    document.documentElement.dataset.accent = current.accent;
    document.documentElement.dataset.mode = current.mode;
  }
  apply(current);

  window.Theme = {
    ACCENTS: Object.keys(ACCENTS),
    swatch: (accent) => ACCENTS[accent].light[0],
    get: () => Object.assign({}, current),
    // Load the saved choice for this student (keeps working if the network is down)
    async load(sb){
      try {
        const rows = await sb(`student_settings?select=accent,mode&profile_id=eq.${profileId}`);
        if (rows && rows[0]) { apply(rows[0]); write(current); }
      } catch (e) {}
    },
    async set(sb, change){
      apply(Object.assign({}, current, change)); write(current);
      try {
        await sb("student_settings", { method: "POST", prefer: "resolution=merge-duplicates,return=minimal",
          body: [{ profile_id: profileId, accent: current.accent, mode: current.mode, updated_at: new Date().toISOString() }] });
      } catch (e) {}
    }
  };
})();
