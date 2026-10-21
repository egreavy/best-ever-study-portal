// Learn it. Test it. Prep it for the exam.
// Works out where each chapter is (Learn, Quick Tests or Exam Prep) and draws the homepage
// and the subject pages. Shared by every student page.
(function(){
  const css = `
  .hs{display:flex;flex-direction:column;gap:18px;font-family:'Atkinson Hyperlegible',Verdana,sans-serif;color:var(--t-ink)}
  .hs a{color:var(--t-accent)}
  .hs-hi{background:var(--t-hero);color:#FFFFFE;border-radius:18px;padding:22px 24px;display:flex;flex-direction:column;gap:16px}
  .hs-hi-top{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap}
  .hs-hi h2{margin:0;font-size:26px;line-height:1.2}
  .hs-tag-line{font-size:15px;color:#C9CFD6;margin:4px 0 0}
  .hs-streak{display:flex;align-items:center;gap:14px}
  .hs-days{display:flex;gap:6px}
  .hs-day{display:flex;flex-direction:column;align-items:center;gap:4px;font-size:12px;color:#C9CFD6}
  .hs-day i{width:20px;height:20px;border-radius:50%;background:#3A4149;display:block;box-sizing:border-box}
  .hs-day.on i{background:var(--t-accent-soft)}
  .hs-day.today{color:#FFFFFE;font-weight:700}
  .hs-day.today:not(.on) i{background:none;border:2px dashed var(--t-accent-soft)}
  .hs-streak-n{display:flex;flex-direction:column;align-items:flex-end}
  .hs-streak-n b{font-size:26px;line-height:1}
  .hs-streak-n span{font-size:13px;color:#C9CFD6}
  .hs-week{border-top:1px solid #3A4149;padding-top:14px;display:flex;flex-direction:column;gap:10px}
  .hs-eyebrow{font-size:13px;font-weight:700;color:#C9CFD6;text-transform:uppercase;letter-spacing:.06em}
  .hs-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
  .hs-stat{display:flex;flex-direction:column;gap:2px}
  .hs-stat b{font-size:22px;line-height:1.15}
  .hs-stat span{font-size:13px;color:#C9CFD6}
  .hs-head{display:flex;justify-content:space-between;align-items:baseline;gap:12px;flex-wrap:wrap}
  .hs-head h3{margin:0;font-size:20px}
  .hs-link{background:none;border:none;padding:0;font:inherit;font-size:15px;font-weight:700;color:var(--t-accent);cursor:pointer;text-decoration:underline;text-underline-offset:3px}
  .hs-sub{font-size:14px;color:var(--t-muted)}
  .hs-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
  .hs-tile{background:var(--t-card);border:none;border-radius:14px;padding:16px 18px;display:flex;flex-direction:column;gap:8px;text-align:left;font:inherit;color:var(--t-ink);cursor:pointer;box-shadow:0 1px 2px rgba(0,0,0,.04)}
  .hs-tile:hover{box-shadow:0 2px 8px rgba(0,0,0,.08)}
  .hs-tile:focus-visible,.hs-card:focus-visible,.hs-row:focus-visible{outline:3px solid var(--t-accent);outline-offset:2px}
  .hs-tile b{font-size:17px}
  .hs-bar{height:8px;background:var(--t-line);border-radius:99px;display:flex;overflow:hidden}
  .hs-bar i{display:block;height:100%}
  .hs-card{background:var(--t-card);border:none;border-radius:14px;padding:16px 18px;display:flex;flex-direction:column;gap:6px;text-align:left;font:inherit;color:var(--t-ink);cursor:pointer;box-shadow:0 1px 2px rgba(0,0,0,.04)}
  .hs-card:hover{box-shadow:0 2px 8px rgba(0,0,0,.08)}
  .hs-card .t{font-size:16px;font-weight:700;line-height:1.35}
  .hs-card .s{font-size:14px;line-height:1.4}
  .hs-card .go{margin-top:auto;padding-top:8px;font-size:15px;font-weight:700;color:var(--t-accent)}
  .hs-pill{align-self:flex-start;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;border-radius:999px;padding:3px 9px;flex:none}
  .hs-pill.learn{color:var(--t-ink);background:var(--t-soft2)}
  .hs-pill.test{color:var(--t-accent);background:var(--t-accent-tint)}
  .hs-pill.refresh{color:var(--t-warn);background:var(--t-warn-tint)}
  .hs-steps{flex:none;display:flex;flex-direction:column;align-items:flex-end;gap:3px;min-width:92px}
  .hs-arrows{display:flex}
  .hs-arrows i{display:block;width:16px;height:14px;margin-left:-3px;background:var(--t-line);clip-path:polygon(0 0,62% 0,100% 50%,62% 100%,0 100%,38% 50%)}
  .hs-arrows i:first-child{margin-left:0}
  .hs-arrows i.on{background:var(--t-accent)}
  .hs-steps-l{font-size:12px;font-weight:700;color:var(--t-muted);white-space:nowrap}
  .hs-card .hs-steps{align-items:flex-start;min-width:0}
  .hs-back{background:none;border:none;padding:0;font:inherit;font-size:16px;font-weight:700;color:var(--t-accent);cursor:pointer;align-self:flex-start}
  .hs h1{margin:0;font-size:30px;line-height:1.2}
  .hs-exam{background:var(--t-card);border-radius:14px;padding:14px 18px;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap}
  .hs-exam.soon{background:var(--t-warn-tint)}
  .hs-exam-text{display:flex;flex-direction:column;gap:3px}
  .hs-exam-text b{font-size:17px}
  .hs-exam form{display:flex;gap:8px;flex-wrap:wrap;align-items:center;width:100%}
  .hs-exam input{font:inherit;font-size:16px;border:2px solid var(--t-line);border-radius:10px;padding:8px 10px;min-height:44px;box-sizing:border-box}
  .hs-exam input[type=text]{flex:1 1 180px}
  .hs-btn{border:2px solid var(--t-accent);background:var(--t-accent);color:var(--t-on-accent);border-radius:999px;padding:8px 18px;font:inherit;font-weight:700;font-size:15px;cursor:pointer;min-height:42px;white-space:nowrap}
  .hs-btn.ghost{background:var(--t-card);color:var(--t-accent)}
  .hs-btn.small{font-size:14px;padding:5px 14px;min-height:36px}
  .hs-list{background:var(--t-card);border-radius:14px;overflow:hidden;display:flex;flex-direction:column}
  .hs-row{display:flex;align-items:center;gap:14px;padding:13px 18px;border:none;border-top:1px solid var(--t-line);background:none;font:inherit;color:var(--t-ink);text-align:left;cursor:pointer;width:100%}
  .hs-list>:first-child{border-top:none}
  .hs-row:hover .hs-row-t{text-decoration:underline}
  .hs-row.dim{color:var(--t-muted)}
  .hs-num{flex:none;width:34px;height:34px;border-radius:10px;background:var(--t-soft);display:grid;place-items:center;font-size:15px;font-weight:700;color:var(--t-muted)}
  .hs-num.ok{background:var(--t-accent-tint);color:var(--t-accent)}
  .hs-row-b{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}
  .hs-row-t{font-size:17px;font-weight:700;line-height:1.35}
  .hs-row-s{font-size:14px;color:var(--t-muted);line-height:1.4}
  .hs-chev{flex:none;font-size:20px;color:var(--t-muted)}
  .hs-fold{background:var(--t-soft2)}
  .hs-fold .hs-show{flex:none;font-size:15px;font-weight:700;color:var(--t-accent)}
  .hs-group{display:block;padding:14px 18px 4px;border-top:1px solid var(--t-line);font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--t-muted)}
  .step-h{display:flex;align-items:center;gap:12px}
  .step-n{flex:none;width:32px;height:32px;border-radius:50%;background:var(--t-accent);color:var(--t-on-accent);display:grid;place-items:center;font-size:17px;font-weight:700}
  .step-in{margin-left:44px}
  .hs-link.step-in{margin-left:44px}
  .step2{display:flex;flex-direction:column;gap:14px}
  .step2-h{padding:0 24px}
  @media (max-width:600px){.step-in,.hs-link.step-in{margin-left:0 !important}.step2-h{padding:0}}
  .qa{background:var(--t-card);border-radius:18px;padding:24px 26px;display:flex;flex-direction:column;gap:12px}
  .qa h3{margin:0;font-size:19px}
  .qa-row{display:flex;gap:10px;align-items:center}
  .qa-box{flex:1;display:flex;align-items:center;gap:8px;border:2px solid var(--t-line);border-radius:14px;padding:6px 8px 6px 14px;background:var(--t-card)}
  .qa-box:focus-within{border-color:var(--t-accent)}
  .qa-box input{flex:1;border:none;outline:none;font:inherit;font-size:17px;padding:8px 0;background:transparent;color:var(--t-ink);min-width:0}
  .qa-mic{flex:none;width:40px;height:40px;border-radius:50%;border:2px solid var(--t-ink);background:var(--t-card);color:var(--t-ink);display:grid;place-items:center;cursor:pointer;padding:0}
  .qa-mic svg{width:20px;height:20px}
  .qa-mic.on{background:var(--t-ink);color:var(--t-on-accent)}
  .qa-list{display:flex;flex-direction:column}
  .qa-item{display:flex;align-items:center;gap:14px;padding:12px 0;border-top:1px solid var(--t-line)}
  .qa-ic{flex:none;width:36px;height:36px;border-radius:10px;display:grid;place-items:center;font-size:17px;font-weight:700}
  .qa-ic.done{background:var(--t-accent-tint);color:var(--t-accent)}
  .qa-ic.up{background:var(--t-soft2);color:var(--t-ink)}
  .qa-ic.date{background:var(--t-warn-tint);color:var(--t-warn)}
  .qa-ic.unclear{background:var(--t-soft2);color:var(--t-muted)}
  .qa-b{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
  .qa-b .k{font-size:13px;color:var(--t-muted)}
  .qa-b .t{font-size:16px;font-weight:700;line-height:1.35}
  .qa-b .w{font-size:15px}
  .qa-b select{font:inherit;font-size:15px;border:2px solid var(--t-line);border-radius:10px;padding:4px 8px;max-width:100%;background:var(--t-card);color:var(--t-ink)}
  .qa-check{flex:none;width:26px;height:26px;accent-color:var(--t-accent);cursor:pointer}
  .qa-msg{background:var(--t-accent-tint);border-radius:12px;padding:12px 16px;font-size:16px;display:flex;gap:12px;align-items:center;flex-wrap:wrap}
  .qa-err{color:#a32020;font-size:14px;margin:0}
  .hc{gap:28px}
  .hc-top{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap;padding:4px 2px 0}
  .hc-hello{display:flex;flex-direction:column;gap:4px}
  .hc-hello h2{margin:0;font-size:28px;line-height:1.2}
  .hc-hello span{font-size:16px;color:var(--t-muted)}
  .hc-meta{display:flex;flex-direction:column;align-items:flex-end;gap:6px}
  .hc-streak{font-size:15px;font-weight:700;color:var(--t-accent);background:var(--t-accent-tint);border-radius:999px;padding:5px 12px}
  .hc-weeklink{font-size:14px;color:var(--t-muted)}
  .hc-goal{flex-basis:100%;font-size:14px;color:var(--t-muted)}
  .hc-cele{background:var(--t-accent-tint);border-radius:18px;padding:18px 22px;display:flex;align-items:center;gap:16px;flex-wrap:wrap}
  .hc-cele-b{flex:1 1 260px;display:flex;flex-direction:column;gap:3px}
  .hc-cele-b b{font-size:18px}
  .hc-cele-btns{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
  .hc-cele-btns .hs-btn{font-size:15px;padding:8px 16px}
  .hc-week{background:var(--t-card);border-radius:18px;padding:18px 22px;display:flex;gap:24px;align-items:center;flex-wrap:wrap;margin-top:-14px}
  .hc-days{display:flex;gap:6px}
  .hc-day{display:flex;flex-direction:column;align-items:center;gap:4px;font-size:12px;color:var(--t-muted)}
  .hc-day i{width:18px;height:18px;border-radius:50%;background:var(--t-soft2);display:block;box-sizing:border-box}
  .hc-day.on i{background:var(--t-accent)}
  .hc-day.today{color:var(--t-ink);font-weight:700}
  .hc-day.today:not(.on) i{background:none;border:2px dashed var(--t-accent)}
  .hc-stats{flex:1;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
  .hc-stats div{display:flex;flex-direction:column}
  .hc-stats b{font-size:19px}
  .hc-stats span{font-size:13px;color:var(--t-muted)}
  .qa .step-h h3,.hc-card .step-h h3{margin:0;font-size:20px}
  .hc-card{background:var(--t-card);border-radius:18px;padding:24px 26px;display:flex;flex-direction:column;gap:20px}
  .hc-best{background:var(--t-accent-tint);border-radius:14px;padding:18px 20px;display:flex;align-items:center;gap:16px;flex-wrap:wrap}
  .hc-best-b{flex:1 1 240px;display:flex;flex-direction:column;gap:3px;min-width:0}
  .hc-eyebrow{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--t-accent)}
  .hc-best-t{font-size:19px;font-weight:700;line-height:1.3}
  .hc-best-s{font-size:15px}
  .hc-go{font-size:17px;padding:12px 28px;min-height:50px}
  .hc-sec{display:flex;flex-direction:column;gap:10px}
  .hc-label{font-size:15px;font-weight:700;color:var(--t-muted)}
  .hc-chips{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px}
  .hc-chip{border:none;background:var(--t-soft);border-radius:12px;padding:10px 14px;display:flex;flex-direction:column;gap:7px;text-align:left;font:inherit;color:var(--t-ink);cursor:pointer;min-width:0}
  .hc-chip:hover{background:var(--t-soft2)}
  .hc-chip b{font-size:15px;line-height:1.25}
  .hc-chip .hs-bar{margin-top:auto}
  .hc-chip .hs-bar{height:5px}
  .hc-chip:focus-visible,.hc-row:focus-visible{outline:3px solid var(--t-accent);outline-offset:2px}
  .hc-list{display:flex;flex-direction:column}
  .hc-row{display:flex;align-items:center;gap:14px;padding:12px 0;border:none;border-top:1px solid var(--t-soft2);background:none;font:inherit;color:var(--t-ink);text-align:left;cursor:pointer;width:100%}
  .hc-row:hover .hc-row-t{text-decoration:underline}
  .hc-row-b{flex:1;min-width:0;display:flex;flex-direction:column;gap:1px}
  .hc-row-t{font-size:16px;font-weight:700;line-height:1.35}
  .hc-row-s{font-size:14px;color:var(--t-muted)}
  @media (max-width:600px){.hc-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.hc-meta{align-items:flex-start}.hc-card,.qa{padding:20px 18px}.hc-go{width:100%}}
  .hs-empty{background:var(--t-card);border-radius:14px;padding:18px;color:var(--t-muted)}
  @media (max-width:700px){.hs-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.hs-stats{grid-template-columns:repeat(2,minmax(0,1fr))}}
  @media (max-width:600px){.hs-steps{min-width:0}.hs-steps-l{display:none}.hs-arrows i{width:12px;height:11px;margin-left:-2px}.hs-row{padding:12px 14px;gap:10px}.hs-row-t{font-size:16px}}
  @media (max-width:460px){.hs-grid{grid-template-columns:1fr}.hs-grid.tiles{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.hs-tile{padding:12px 14px;gap:6px}.hs-tile b{font-size:16px}}
  `;
  function addCss(){ if (document.getElementById("hs-css")) return; const s = document.createElement("style"); s.id = "hs-css"; s.textContent = css; document.head.appendChild(s); }
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
  const DAY = 86400000;
  const PRACTICE_TITLES = ["Flashcards Review", "Quiz Yourself", "Exam Practice"];
  const LEARN_MINUTES = { "Revision Guide": 5, "Video Overview": 8, "In-Depth Slide Deck": 15, "Audio Recap": 15, "Mind Map": 5 };
  const REFRESH_DAYS = 21;

  function startOfDay(d){ const x = new Date(d); x.setHours(0,0,0,0); return x; }
  function weekStart(d){ const x = startOfDay(d); const wd = (x.getDay() + 6) % 7; return new Date(x - wd * DAY); }
  function parseDate(s){ if (!s) return null; const [y,m,d] = String(s).slice(0,10).split("-").map(Number); return new Date(y, m-1, d); }
  function fmtDate(d){ return d.toLocaleDateString("en-IE", { weekday:"short", day:"numeric", month:"short" }).replace(",", ""); }
  function dayKey(d){ const x = new Date(d); return x.getFullYear() + "-" + (x.getMonth()+1) + "-" + x.getDate(); }
  function ago(d){
    const days = Math.round((startOfDay(new Date()) - startOfDay(d)) / DAY);
    if (days <= 0) return "today"; if (days === 1) return "yesterday";
    if (days < 7) return `${days} days ago`; if (days < 14) return "a week ago";
    if (days < 28) return `${Math.round(days/7)} weeks ago`; if (days < 45) return "a month ago";
    return `${Math.round(days/30)} months ago`;
  }
  function untilText(d){
    const days = Math.round((startOfDay(d) - startOfDay(new Date())) / DAY);
    if (days <= 0) return "today"; if (days === 1) return "tomorrow";
    if (days < 14) return `in ${days} days`; return `in ${Math.round(days/7)} weeks`;
  }
  function hm(sec){
    const m = Math.round(sec / 60);
    if (m < 60) return `${m} m`;
    return `${Math.floor(m/60)} h ${m % 60} m`;
  }
  const shortTitle = t => String(t || "").replace(/^Ch\s*\d+\s*:\s*/i, "");
  const inList = ids => ids.length ? "(" + ids.map(id => `"${id}"`).join(",") + ")" : '("00000000-0000-0000-0000-000000000000")';

  // ---- the rule for one chapter ----
  // stats: { total, tried, fixes, right, lastAt }  (tried/fixes/right count from fresh_since if set)
  function chapterStage(c){
    const { learnDone = 0, learnTotal = 0, classDone = false, freshSince = null, exam = null, stats = {} } = c;
    const total = stats.total || 0, tried = stats.tried || 0, fixes = stats.fixes || 0;
    const tested = total > 0 && tried >= Math.ceil(total * 0.8) && fixes === 0;
    const examDate = exam ? parseDate(exam.exam_date) : null;
    const today = startOfDay(new Date());
    const opensOn = examDate ? new Date(examDate - REFRESH_DAYS * DAY) : null;
    const refreshOpen = !!examDate && today >= opensOn && today <= examDate;
    let stage, done = false;
    if (refreshOpen && (freshSince || tested)) { stage = "refresh"; done = !!freshSince && tested; }
    else if (tried > 0 || (stats.triedEver || 0) > 0) { stage = "test"; done = tested; }
    else if (learnDone > 0) { stage = "learn"; done = learnTotal > 0 && learnDone >= learnTotal; }
    else stage = "none";
    return { stage, done, tested, refreshOpen, examDate, opensOn, learnDone, learnTotal, classDone, freshSince, stats };
  }

  function statusLine(s){
    const st = s.stats || {};
    if (s.stage === "refresh") {
      if (s.done) return "Exam ready";
      if (s.freshSince) return st.fixes ? `Exam prep · ${plural(st.fixes, "to fix", "to fix")}` : `Exam prep · ${plural((st.total||0) - (st.tried||0), "question", "questions")} to go`;
      return `Exams ${untilText(s.examDate)}${st.lastAt ? " · last tested " + ago(st.lastAt) : ""}`;
    }
    if (s.stage === "test") {
      if (!st.total) return "Questions coming soon";
      if (s.done) return st.lastAt ? `Tested · last time ${ago(st.lastAt)}` : "Tested";
      const parts = [];
      if (st.fixes) parts.push(`${st.fixes} to fix`);
      else if (!st.tried) parts.push("not tested yet");
      else parts.push(`${plural(st.total - st.tried, "question", "questions")} still to try`);
      return parts.join(" · ");
    }
    if (s.stage === "learn") {
      if (s.done) return "Learnt · ready for a quick test";
      return s.learnDone / Math.max(1, s.learnTotal) >= 0.5 ? "Over halfway learnt" : "Started learning";
    }
    return "Not started";
  }
  const TAG = { learn: "Learn", test: "Quick Tests", refresh: "Exam Prep" };
  // Three arrows: none lit = not started, 1 = learning, 2 = quick tests, 3 = exam prep
  function stepLevel(c){
    if (c.stage === "refresh" || c.tested) return [3, "Exam prep"];
    if (c.stage === "test") return [2, "Quick tests"];
    if (c.stage === "learn") return [1, "Learning"];
    return [0, "Not started"];
  }
  function stepsArrows(c){
    const [n, label] = stepLevel(c);
    return `<span class="hs-arrows" role="img" aria-label="Step ${n} of 3: ${label}">${[1,2,3].map(i => `<i${i <= n ? ' class="on"' : ""}></i>`).join("")}</span>`;
  }
  function stepsMark(c){
    const [n, label] = stepLevel(c);
    return `<span class="hs-steps" aria-label="Step ${n} of 3: ${label}"><span class="hs-arrows" aria-hidden="true">${[1,2,3].map(i => `<i${i <= n ? ' class="on"' : ""}></i>`).join("")}</span><span class="hs-steps-l">${label}</span></span>`;
  }
  const GO = { learn: "Keep learning ›", test: "Test myself ›", refresh: "Exam prep ›", none: "Start ›" };
  const TAB_FOR = { learn: "learn", test: "test", refresh: "refresh", none: "learn" };

  // ---- load everything the homepage and subject pages need ----
  async function loadOverview(sb, profile){
    const subjects = await sb(`subjects?select=id,title,description&user_id=eq.${profile.id}&order=title.asc`);
    const subjectIds = subjects.map(s => s.id);
    if (!subjectIds.length) return { subjects, topics: [] };
    const since = new Date(Date.now() - 400 * DAY).toISOString();
    const [topics, templatesAll, disabled, progress, status, exams, flags, timeRows] = await Promise.all([
      sb(`topics?select=id,title,order_num,subject_id&subject_id=in.${inList(subjectIds)}&order=order_num.asc`),
      sb(`nlm_checklist_templates?select=id,subject_id,step_order,title&subject_id=in.${inList(subjectIds)}`),
      sb(`nlm_disabled_steps?select=template_id&profile_id=eq.${profile.id}`),
      sb(`nlm_progress?select=topic_id,step_order,updated_at&profile_id=eq.${profile.id}&done=eq.true`),
      sb(`chapter_status?select=topic_id,class_done_at,fresh_since,test_on&profile_id=eq.${profile.id}`),
      sb(`exam_dates?select=subject_id,label,exam_date&profile_id=eq.${profile.id}`),
      sb(`topic_flags?select=topic_id,flag_type,note,updated_at&profile_id=eq.${profile.id}`),
      sb(`study_time?select=kind,seconds,created_at&profile_id=eq.${profile.id}&created_at=gte.${encodeURIComponent(since)}`)
    ]);
    const topicIds = topics.map(t => t.id);
    const questions = [];
    for (let i = 0; i < topicIds.length; i += 60) {
      const part = await sb(`quiz_questions?select=id,topic_id&topic_id=in.${inList(topicIds.slice(i, i + 60))}`);
      (part || []).forEach(q => questions.push(q));
    }
    const attempts = await sb(`quiz_attempts?select=question_id,result,created_at&profile_id=eq.${profile.id}&order=created_at.asc&limit=20000`);
    return { subjects, topics, templatesAll, disabled, progress, status, exams, flags, timeRows, questions, attempts };
  }

  function buildModel(raw){
    const { subjects, topics } = raw;
    const m = { subjects: [], topics: {}, bySubject: {}, week: null };
    if (!topics.length) { m.subjects = subjects.map(s => ({ ...s, chapters: [] })); return m; }
    const off = new Set((raw.disabled || []).map(r => r.template_id));
    const learnSteps = {}, minutes = {};
    (raw.templatesAll || []).forEach(t => {
      if (off.has(t.id) || PRACTICE_TITLES.includes(t.title)) return;
      (learnSteps[t.subject_id] = learnSteps[t.subject_id] || new Set()).add(t.step_order);
      minutes[t.subject_id + ":" + t.step_order] = LEARN_MINUTES[t.title] || 5;
    });
    const topicSubject = {}; topics.forEach(t => { topicSubject[t.id] = t.subject_id; });
    const learnDone = {}, learnEvents = [];
    (raw.progress || []).forEach(r => {
      const sid = topicSubject[r.topic_id];
      if (!sid || !(learnSteps[sid] && learnSteps[sid].has(r.step_order))) return;
      learnDone[r.topic_id] = (learnDone[r.topic_id] || 0) + 1;
      if (r.updated_at) learnEvents.push({ at: new Date(r.updated_at), min: minutes[sid + ":" + r.step_order] || 5 });
    });
    const status = {}; (raw.status || []).forEach(r => { status[r.topic_id] = r; });
    const exams = {}; (raw.exams || []).forEach(r => { exams[r.subject_id] = r; });
    const flags = {}; (raw.flags || []).forEach(r => { flags[r.topic_id] = r; });
    const qTopic = {}, qCount = {};
    (raw.questions || []).forEach(q => { qTopic[q.id] = q.topic_id; qCount[q.topic_id] = (qCount[q.topic_id] || 0) + 1; });

    // results per topic, honouring "start fresh"
    const latest = {}, latestEver = {}, lastAt = {};
    (raw.attempts || []).forEach(a => {
      const tid = qTopic[a.question_id]; if (!tid) return;
      const at = new Date(a.created_at);
      latestEver[a.question_id] = Number(a.result);
      lastAt[tid] = at;
      const fresh = status[tid] && status[tid].fresh_since ? new Date(status[tid].fresh_since) : null;
      if (!fresh || at >= fresh) latest[a.question_id] = Number(a.result);
    });
    const stats = {};
    Object.keys(qCount).forEach(tid => { stats[tid] = { total: qCount[tid], tried: 0, fixes: 0, right: 0, triedEver: 0, lastAt: lastAt[tid] || null }; });
    Object.keys(latest).forEach(qid => { const s = stats[qTopic[qid]]; s.tried++; if (latest[qid] < 1) s.fixes++; else s.right++; });
    Object.keys(latestEver).forEach(qid => { stats[qTopic[qid]].triedEver++; });

    subjects.forEach(s => { m.bySubject[s.id] = { ...s, chapters: [], exam: exams[s.id] || null }; });
    topics.forEach(t => {
      const sid = t.subject_id; if (!m.bySubject[sid]) return;
      const st = status[t.id] || {};
      const info = chapterStage({
        learnDone: learnDone[t.id] || 0, learnTotal: (learnSteps[sid] || new Set()).size,
        classDone: !!st.class_done_at, freshSince: st.fresh_since || null,
        exam: exams[sid] || null, stats: stats[t.id] || { total: 0, tried: 0, fixes: 0, right: 0, triedEver: 0 }
      });
      const ch = { ...t, ...info, flag: flags[t.id] || null, classDoneAt: st.class_done_at || null, testOn: st.test_on || null, line: "" };
      ch.line = statusLine(ch);
      m.topics[t.id] = ch;
      m.bySubject[sid].chapters.push(ch);
    });
    m.subjects = subjects.map(s => m.bySubject[s.id]);

    // this week
    const ws = weekStart(new Date());
    const thisWeek = d => d >= ws;
    let testSec = 0; (raw.timeRows || []).forEach(r => { if (r.kind === "test" && thisWeek(new Date(r.created_at))) testSec += r.seconds; });
    let learnMin = 0; learnEvents.forEach(e => { if (thisWeek(e.at)) learnMin += e.min; });
    (raw.timeRows || []).forEach(r => { if (r.kind === "learn" && thisWeek(new Date(r.created_at))) learnMin += r.seconds / 60; });
    let answered = 0, fixed = 0; const everWrong = new Set();
    (raw.attempts || []).forEach(a => {
      const at = new Date(a.created_at), r = Number(a.result);
      if (thisWeek(at)) { answered++; if (r >= 1 && everWrong.has(a.question_id)) { fixed++; everWrong.delete(a.question_id); } }
      if (r < 1) everWrong.add(a.question_id);
    });
    const days = new Set();
    (raw.attempts || []).forEach(a => days.add(dayKey(a.created_at)));
    (raw.timeRows || []).forEach(r => days.add(dayKey(r.created_at)));
    learnEvents.forEach(e => days.add(dayKey(e.at)));
    let streak = 0, d = startOfDay(new Date());
    if (!days.has(dayKey(d))) d = new Date(d - DAY);
    while (days.has(dayKey(d))) { streak++; d = new Date(d - DAY); }
    // minutes per day (testing, tutor and learning all count) and completed goal weeks
    const dayMin = {};
    const addMin = (d, mins) => { const k = dayKey(d); dayMin[k] = (dayMin[k] || 0) + mins; };
    (raw.timeRows || []).forEach(r => addMin(r.created_at, r.seconds / 60));
    learnEvents.forEach(e => addMin(e.at, e.min));
    const GOAL_MIN = 14, GOAL_DAYS = 5;
    const goodDaysIn = (start) => { let n = 0; for (let i = 0; i < 7; i++) if ((dayMin[dayKey(new Date(start.getTime() + i * DAY))] || 0) >= GOAL_MIN) n++; return n; };
    let weeksDone = 0;
    for (let k = 1; k <= 57; k++) { if (goodDaysIn(new Date(ws.getTime() - k * 7 * DAY)) >= GOAL_DAYS) weeksDone++; }
    const thisWeekGood = goodDaysIn(ws);
    if (thisWeekGood >= GOAL_DAYS) weeksDone++;
    // streaks of days with 14+ minutes, and all-time testing minutes
    const runs = []; let run = 0, streakNow = 0;
    for (let d = new Date(startOfDay(new Date()) - 400 * DAY); d <= new Date(); d = new Date(d.getTime() + DAY)) {
      if ((dayMin[dayKey(d)] || 0) >= GOAL_MIN) run++; else { if (run) runs.push(run); run = 0; }
    }
    if (run) runs.push(run);
    streakNow = run || ((dayMin[dayKey(new Date())] || 0) < GOAL_MIN && runs.length && (dayMin[dayKey(new Date(Date.now() - DAY))] || 0) >= GOAL_MIN ? runs[runs.length - 1] : 0);
    let testMin = 0; (raw.timeRows || []).forEach(r => { if (r.kind === "test") testMin += r.seconds / 60; });
    m.goal = { minutes: GOAL_MIN, days: GOAL_DAYS, dayMin, weeksDone, thisWeekGood, today: Math.round(dayMin[dayKey(new Date())] || 0), weekDone: thisWeekGood >= GOAL_DAYS, runs, streakNow, testMin: Math.round(testMin) };
    m.week = { testSec, learnMin, answered, fixed, days, ws, streak };
    return m;
  }

  // Most urgent first: refresh before an exam, things he pinned, questions to fix, then learning
  function revisionList(m){
    const items = [];
    Object.values(m.topics).forEach(c => {
      const active = c.stage !== "none" && !c.done;
      if (!active && !c.flag) return;
      let score;
      const testDays = c.testOn ? (parseDate(c.testOn) - startOfDay(new Date())) / DAY : null;
      if (testDays !== null && testDays >= 0) score = testDays;
      else if (c.stage === "refresh" && !c.done) score = 0 + Math.max(0, (c.examDate - new Date()) / DAY);
      else if (c.flag && c.flag.note) score = 40;
      else if (c.flag && c.stage === "none") score = 300;
      else if (c.stats.total && c.classDoneAt && !c.stats.tried && (Date.now() - new Date(c.classDoneAt)) / DAY <= 7) score = 60 + (Date.now() - new Date(c.classDoneAt)) / DAY;
      else if (c.stage === "test" && c.stats.fixes) score = 100 - c.stats.fixes;
      else if (c.stage === "test") score = c.stats.total ? 150 : 400;
      else if (c.stage === "learn" && !c.done) score = 200;
      else score = 250;
      items.push({ c, score });
    });
    items.sort((a, b) => a.score - b.score || (a.c.order_num || 0) - (b.c.order_num || 0));
    return items.map(i => i.c);
  }

  // ---- exam date box (subject pages and the Exam Prep tab) ----
  function examBox(el, { sb, profile, subjectId, exam, onChange, compact }){
    function paint(editing){
      const d = exam ? parseDate(exam.exam_date) : null;
      const opens = d ? new Date(d - REFRESH_DAYS * DAY) : null;
      const today = startOfDay(new Date());
      el.className = "hs-exam" + (d && today >= opens && today <= d ? " soon" : "");
      if (editing || !exam) {
        el.innerHTML = `<div class="hs-exam-text"><b>${exam ? "Change your exam date" : "When are your next exams?"}</b><span class="hs-sub">Your revision list puts exam prep first ${REFRESH_DAYS / 7} weeks before, so you're ready in time.</span></div>
          <form><input type="text" name="label" placeholder="e.g. Christmas exams" value="${esc(exam ? exam.label : "")}" aria-label="Which exams"><input type="date" name="date" value="${esc(exam ? exam.exam_date : "")}" aria-label="Exam date" required><button class="hs-btn" type="submit">Save</button>${exam ? `<button class="hs-btn ghost" type="button" data-cancel>Cancel</button><button class="hs-link" type="button" data-remove>Remove date</button>` : ""}</form>`;
        el.querySelector("form").onsubmit = async (e) => {
          e.preventDefault();
          const f = e.target, date = f.date.value, label = (f.label.value || "").trim() || "Exams";
          if (!date) return;
          f.querySelector("button[type=submit]").disabled = true;
          await sb("exam_dates", { method: "POST", prefer: "resolution=merge-duplicates,return=minimal", body: [{ profile_id: profile.id, subject_id: subjectId, label, exam_date: date, updated_at: new Date().toISOString() }] });
          exam = { label, exam_date: date }; paint(false); if (onChange) onChange(exam);
        };
        const c = el.querySelector("[data-cancel]"); if (c) c.onclick = () => paint(false);
        const r = el.querySelector("[data-remove]"); if (r) r.onclick = async () => {
          await sb(`exam_dates?profile_id=eq.${profile.id}&subject_id=eq.${subjectId}`, { method: "DELETE", prefer: "return=minimal" });
          exam = null; paint(false); if (onChange) onChange(null);
        };
        return;
      }
      const open = today >= opens;
      el.innerHTML = `<div class="hs-exam-text"><b>${esc(exam.label)} · ${esc(fmtDate(d))}</b><span class="hs-sub">${today > d ? "These exams are over. Set your next exam date." : open ? `Exams ${untilText(d)}. Time for exam prep.` : `Exam prep goes to the top of your list on ${esc(fmtDate(opens))}.`}</span></div><button class="hs-link" type="button" data-edit>Change date</button>`;
      el.querySelector("[data-edit]").onclick = () => paint(true);
    }
    paint(false);
  }

  async function markClassDone(sb, profile, topicId, on){
    await sb("chapter_status", { method: "POST", prefer: "resolution=merge-duplicates,return=minimal",
      body: [{ profile_id: profile.id, topic_id: topicId, class_done_at: on ? new Date().toISOString() : null, updated_at: new Date().toISOString() }] });
  }
  async function startFresh(sb, profile, topicId){
    await sb("chapter_status", { method: "POST", prefer: "resolution=merge-duplicates,return=minimal",
      body: [{ profile_id: profile.id, topic_id: topicId, fresh_since: new Date().toISOString(), updated_at: new Date().toISOString() }] });
  }

  function subjectBar(chs){
    const n = chs.length || 1;
    const tested = chs.filter(c => c.done && c.stage !== "learn").length;
    const testing = chs.filter(c => (c.stage === "test" || c.stage === "refresh") && !c.done).length;
    const learning = chs.filter(c => c.stage === "learn").length;
    const bar = `<div class="hs-bar" aria-hidden="true"><i style="width:${tested/n*100}%;background:var(--t-accent)"></i><i style="width:${testing/n*100}%;background:var(--t-accent-soft)"></i><i style="width:${learning/n*100}%;background:var(--t-ink)"></i></div>`;
    const refresh = chs.filter(c => c.stage === "refresh" && !c.done).length;
    const parts = [];
    if (refresh) parts.push(`${refresh} to refresh`);
    if (testing - refresh) parts.push(`${testing - refresh} to test`);
    if (tested) parts.push(`${tested} tested`);
    if (learning) parts.push(`${learning} learning`);
    return { bar, parts, tested, testing, learning };
  }

  function revCard(c, subjTitle){
    const tag = stepsMark(c);
    const note = c.flag && c.flag.note ? ` · ${esc(c.flag.note)}` : "";
    return `<button type="button" class="hs-card" data-open="${c.id}" data-tab="${TAB_FOR[c.stage]}">${tag}
      <span class="hs-sub">${esc(subjTitle)} · Ch ${esc(String(c.order_num ?? ""))}</span>
      <span class="t">${esc(shortTitle(c.title))}</span>
      ${c.stage === "none" && !note ? "" : `<span class="s">${esc(c.line)}${note}</span>`}
      <span class="go">${GO[c.stage]}</span></button>`;
  }

  // ---- "What's new at school?" ----
  const QA_MIC = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><path d="M12 17v5"/></svg>';
  function isoDay(d){ const x = new Date(d); return x.getFullYear() + "-" + String(x.getMonth()+1).padStart(2,"0") + "-" + String(x.getDate()).padStart(2,"0"); }
  function mountQuickAdd(el, m, { sb, profile, reload, state }){
    if (!el) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const subjTitle = id => (m.bySubject[id] || {}).title || "";
    const chOf = id => m.topics[id];
    const chName = c => `${subjTitle(c.subject_id)} · Ch ${c.order_num ?? ""}`;
    const STATE_WORD = c => ({ none: "not started", learn: "learning", test: "testing", refresh: "refreshing" })[c.stage] + (c.classDone ? ", done in class" : "");
    const guessChapter = (sid) => {
      const rev = revisionList(m).filter(c => c.subject_id === sid);
      if (rev.length) return rev[0].id;
      const chs = (m.bySubject[sid] || { chapters: [] }).chapters;
      return (chs.find(c => c.stage === "none") || chs[0] || {}).id || null;
    };
    function paintInput(msgHtml, value){
      el.innerHTML = `<div class="step-h"><span class="step-n" aria-hidden="true">1</span><div><h3>What's new at school?</h3><span class="hs-sub">Say or type what's coming up, what you did in class, or any tests.</span></div></div>
        <form class="qa-row"><div class="qa-box"><input type="text" name="t" autocomplete="off" aria-label="What's new at school" placeholder='e.g. "econ ch 3 coming up, we did polsoc ch 5, geog test friday"'>${SR ? `<button type="button" class="qa-mic" aria-label="Speak" title="Speak">${QA_MIC}</button>` : ""}</div><button class="hs-btn ghost" type="submit" style="min-height:48px;padding:10px 22px;font-size:16px">Add</button></form>
        <p class="qa-err" hidden></p>${msgHtml || ""}`;
      const form = el.querySelector("form"), input = form.t, err = el.querySelector(".qa-err");
      if (value) input.value = value;
      const mic = el.querySelector(".qa-mic");
      let rec = null;
      if (mic) mic.onclick = () => {
        if (rec) { try { rec.stop(); } catch (e) {} return; }
        rec = new SR(); rec.lang = "en-IE"; rec.interimResults = true; rec.continuous = true;
        const base = input.value ? input.value.replace(/\s*$/, " ") : "";
        rec.onresult = (e) => { let t = ""; for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript; input.value = (base + t).replace(/^\s+/, ""); };
        rec.onerror = (e) => { err.textContent = e.error === "not-allowed" ? "The browser blocked the microphone. Allow it for this site, or type instead." : "Didn't catch that. Try again or type it."; err.hidden = false; };
        rec.onend = () => { rec = null; mic.classList.remove("on"); };
        try { rec.start(); mic.classList.add("on"); err.hidden = true; } catch (e) { rec = null; }
      };
      const undo = el.querySelector("[data-undo]"); if (undo) undo.onclick = async () => { undo.disabled = true; undo.textContent = "Undoing…"; await state.qaUndo(); state.qaUndo = null; reload(); };
      form.onsubmit = async (e) => {
        e.preventDefault();
        if (rec) { try { rec.stop(); } catch (x) {} }
        const text = input.value.trim(); if (!text) { input.focus(); return; }
        const btn = form.querySelector("button[type=submit]"); btn.disabled = true; btn.textContent = "Reading…"; err.hidden = true;
        try {
          const now = new Date();
          const r = await fetch("/api/quick-add", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
            text, today: isoDay(now), weekday: now.toLocaleDateString("en-IE", { weekday: "long" }),
            subjects: m.subjects.map(s => ({ id: s.id, title: s.title })),
            chapters: Object.values(m.topics).map(c => ({ id: c.id, subject: subjTitle(c.subject_id), num: c.order_num, title: shortTitle(c.title), state: STATE_WORD(c) }))
          }) });
          const data = await r.json().catch(() => ({}));
          if (!r.ok || !Array.isArray(data.actions)) throw new Error(data.error || "Couldn't read that just now.");
          if (!data.actions.length) throw new Error("Nothing to change in that. Try naming the subject and chapter.");
          paintConfirm(text, data.actions);
        } catch (x) { err.textContent = x.message; err.hidden = false; btn.disabled = false; btn.textContent = "Add"; }
      };
    }
    function paintConfirm(text, actions){
      actions.forEach(a => { if ((a.type === "class_test" || a.type === "deadline") && !a.topic_id) a.topic_id = guessChapter(a.subject_id); if (!a.subject_id && a.topic_id && chOf(a.topic_id)) a.subject_id = chOf(a.topic_id).subject_id; });
      const item = (a, i) => {
        const c = a.topic_id ? chOf(a.topic_id) : null;
        const d = a.date ? fmtDate(parseDate(a.date)) : "";
        const chSelect = () => { const chs = (m.bySubject[a.subject_id] || { chapters: [] }).chapters.slice().sort((x, y) => (x.order_num || 0) - (y.order_num || 0));
          return `<select data-i="${i}" aria-label="Which chapter">${chs.map(x => `<option value="${x.id}"${x.id === a.topic_id ? " selected" : ""}>Ch ${x.order_num ?? ""}: ${esc(shortTitle(x.title))}</option>`).join("")}</select>`; };
        let ic, k, t, w;
        if (a.type === "class_done") { ic = ["done", "✓"]; k = chName(c); t = shortTitle(c.title); w = "Covered in class: added to your revision list for a quick test"; }
        else if (a.type === "coming_up") { ic = ["up", "›"]; k = chName(c); t = shortTitle(c.title); w = `Coming up${d ? " " + d : " in class"}: added to your revision list to learn ahead`; }
        else if (a.type === "class_test") { ic = ["date", "!"]; k = `${subjTitle(a.subject_id)} · class test`; t = d; w = `Which chapter? ${chSelect()}`; }
        else if (a.type === "deadline") { ic = ["date", "!"]; k = `${subjTitle(a.subject_id)} · ${esc(a.label || "deadline")}`; t = `Due ${d}`; w = `For ${chSelect()}`; }
        else if (a.type === "exam") { ic = ["date", "!"]; k = subjTitle(a.subject_id); t = `${esc(a.label || "Exams")} · ${d}`; w = "Sets the exam date, so exam prep starts 3 weeks before"; }
        else { ic = ["unclear", "?"]; k = "Not sure about this part"; t = `"${esc(a.said)}"`; w = esc(a.reason || "Couldn't match it to a chapter."); }
        const can = a.type !== "unclear";
        return `<div class="qa-item"><span class="qa-ic ${ic[0]}">${ic[1]}</span><span class="qa-b"><span class="k">${esc(k)}</span><span class="t">${a.type === "unclear" || a.type === "exam" || a.type === "deadline" ? t : esc(t)}</span><span class="w">${w}</span></span>${can ? `<input type="checkbox" class="qa-check" data-i="${i}" checked aria-label="Include this">` : ""}</div>`;
      };
      const usable = actions.some(a => a.type !== "unclear");
      el.innerHTML = `<div class="step-h"><span class="step-n" aria-hidden="true">1</span><div><h3>What's new at school?</h3><span class="hs-sub">You said: "${esc(text)}"</span></div></div>
        <b style="font-size:17px">Here's what I'll do</b>
        <div class="qa-list">${actions.map(item).join("")}</div>
        <div style="display:flex;gap:10px;flex-wrap:wrap">${usable ? `<button class="hs-btn" type="button" data-ok style="min-height:48px;padding:10px 24px;font-size:16px">Looks right</button>` : ""}<button class="hs-btn ghost" type="button" data-again style="min-height:48px;padding:10px 22px;font-size:16px">Start again</button></div>
        ${usable ? `<span class="hs-sub">Untick anything that's wrong.</span>` : ""}<p class="qa-err" hidden></p>`;
      el.querySelectorAll("select[data-i]").forEach(s => s.onchange = () => { actions[+s.dataset.i].topic_id = s.value; });
      el.querySelector("[data-again]").onclick = () => paintInput("", text);
      const ok = el.querySelector("[data-ok]");
      if (ok) ok.onclick = async () => {
        ok.disabled = true; ok.textContent = "Saving…";
        const chosen = actions.filter((a, i) => { const cb = el.querySelector(`.qa-check[data-i="${i}"]`); return a.type !== "unclear" && cb && cb.checked; });
        try { const summary = await applyActions(chosen); state.qaMsg = summary; reload(); }
        catch (x) { const e2 = el.querySelector(".qa-err"); e2.textContent = "Something didn't save. Try again."; e2.hidden = false; ok.disabled = false; ok.textContent = "Looks right"; }
      };
    }
    async function applyActions(list){
      const undo = [], said = [];
      const flagPrev = id => { const c = chOf(id); return c && c.flag ? { ...c.flag } : null; };
      const setFlag = (id, note) => sb("topic_flags", { method: "POST", prefer: "resolution=merge-duplicates,return=minimal", body: [{ topic_id: id, profile_id: profile.id, flag_type: "revise", note, updated_at: new Date().toISOString() }] });
      const restoreFlag = (id, prev) => prev ? sb("topic_flags", { method: "POST", prefer: "resolution=merge-duplicates,return=minimal", body: [{ topic_id: id, profile_id: profile.id, flag_type: prev.flag_type || "revise", note: prev.note || "", updated_at: new Date().toISOString() }] })
        : sb(`topic_flags?topic_id=eq.${id}&profile_id=eq.${profile.id}`, { method: "DELETE", prefer: "return=minimal" });
      const setStatus = (id, fields) => sb("chapter_status", { method: "POST", prefer: "resolution=merge-duplicates,return=minimal", body: [{ profile_id: profile.id, topic_id: id, ...fields, updated_at: new Date().toISOString() }] });
      for (const a of list) {
        const c = a.topic_id ? chOf(a.topic_id) : null;
        if (a.type === "class_done" && c) {
          const prevAt = c.classDoneAt, prevFlag = flagPrev(c.id);
          await setStatus(c.id, { class_done_at: new Date().toISOString() });
          await setFlag(c.id, "Covered in class · test yourself");
          undo.push(async () => { await setStatus(c.id, { class_done_at: prevAt }); await restoreFlag(c.id, prevFlag); });
          said.push(`${chName(c)} is on your revision list for a quick test`);
        } else if (a.type === "coming_up" && c) {
          const prevFlag = flagPrev(c.id);
          await setFlag(c.id, "Coming up in class" + (a.date ? " " + fmtDate(parseDate(a.date)) : ""));
          undo.push(() => restoreFlag(c.id, prevFlag));
          said.push(`${chName(c)} is on your revision list`);
        } else if ((a.type === "class_test" || a.type === "deadline") && c) {
          const prevFlag = flagPrev(c.id), prevOn = c.testOn;
          const note = a.type === "class_test" ? `Class test ${fmtDate(parseDate(a.date))}` : `${a.label || "Due"} ${fmtDate(parseDate(a.date))}`;
          await setStatus(c.id, { test_on: a.date }); await setFlag(c.id, note);
          undo.push(async () => { await setStatus(c.id, { test_on: prevOn }); await restoreFlag(c.id, prevFlag); });
          said.push(a.type === "class_test" ? `the ${subjTitle(c.subject_id)} test is on ${fmtDate(parseDate(a.date))}` : `${a.label || "your deadline"} is on ${fmtDate(parseDate(a.date))}`);
        } else if (a.type === "exam" && a.subject_id) {
          const prev = (m.bySubject[a.subject_id] || {}).exam || null;
          await sb("exam_dates", { method: "POST", prefer: "resolution=merge-duplicates,return=minimal", body: [{ profile_id: profile.id, subject_id: a.subject_id, label: a.label || "Exams", exam_date: a.date, updated_at: new Date().toISOString() }] });
          undo.push(() => prev ? sb("exam_dates", { method: "POST", prefer: "resolution=merge-duplicates,return=minimal", body: [{ profile_id: profile.id, subject_id: a.subject_id, label: prev.label, exam_date: prev.exam_date, updated_at: new Date().toISOString() }] })
            : sb(`exam_dates?profile_id=eq.${profile.id}&subject_id=eq.${a.subject_id}`, { method: "DELETE", prefer: "return=minimal" }));
          said.push(`${subjTitle(a.subject_id)} ${a.label || "exams"} set for ${fmtDate(parseDate(a.date))}`);
        }
      }
      state.qaUndo = async () => { for (const u of undo.reverse()) await u(); };
      if (!said.length) return "Nothing was changed.";
      const s = said.join(", ").replace(/, ([^,]*)$/, " and $1");
      return "Done. " + s.charAt(0).toUpperCase() + s.slice(1) + ".";
    }
    const msg = state.qaMsg ? `<div class="qa-msg"><span style="flex:1">${esc(state.qaMsg)}</span>${state.qaUndo ? `<button type="button" class="hs-link" data-undo>Undo</button>` : ""}</div>` : "";
    state.qaMsg = null;
    paintInput(msg);
  }

  // ---- homepage ----
  function renderHome(view, m, { profile, openChapter, openSubject, state, sb, reload, openSettings }){
    addCss();
    const w = m.week;
    const hour = new Date().getHours();
    const cele = window.Decor && m.goal ? Decor.celebration(m.goal) : null;
    const hello = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
    const letters = ["M","T","W","T","F","S","S"], todayKey = dayKey(new Date());
    const dots = letters.map((l, i) => {
      const d = new Date(w.ws.getTime() + i * DAY), k = dayKey(d);
      return `<span class="hc-day${w.days.has(k) ? " on" : ""}${k === todayKey ? " today" : ""}"><i></i>${l}</span>`;
    }).join("");
    const rev = revisionList(m);
    const best = rev[0] || null;
    const rest = rev;
    const showAll = state && state.homeShowAll;
    const subjTitle = id => (m.bySubject[id] || {}).title || "";
    const weekOpen = state && state.weekOpen;
    const chips = m.subjects.map(s => {
      const b = subjectBar(s.chapters);
      return `<button type="button" class="hc-chip" data-subject="${s.id}"><b>${esc(s.title)}</b>${b.bar}</button>`;
    }).join("");
    const bestNote = best ? [subjTitle(best.subject_id), best.flag && best.flag.note ? best.flag.note : "", best.line].filter(Boolean).join(" · ") : "";
    const row = c => `<button type="button" class="hc-row" data-open="${c.id}" data-tab="${TAB_FOR[c.stage]}">
        <span class="hc-row-b"><span class="hc-row-t">${esc(shortTitle(c.title))}</span><span class="hc-row-s">${esc(subjTitle(c.subject_id))} · ${esc(c.flag && c.flag.note ? c.flag.note : stepLevel(c)[1].toLowerCase())}</span></span>
        ${stepsArrows(c)}<span class="hs-chev" aria-hidden="true">›</span></button>`;
    view.innerHTML = `<div class="hs hc">
      <div class="hc-top">
        <div class="hc-hello"><h2>${hello}, ${esc(profile.name)}</h2><span>Learn it. Test it. Prep it for the exam.</span></div>
        <div class="hc-meta">
          ${m.goal ? `<span class="hc-streak" title="A streak day is ${m.goal.minutes} minutes or more">${m.goal.streakNow ? `${plural(m.goal.streakNow, "day", "day")} streak` : `Today: ${m.goal.today} of ${m.goal.minutes} min`}</span>` : ""}
          <button type="button" class="hs-link hc-weeklink" data-week aria-expanded="${!!weekOpen}">This week: ${hm(w.testSec)} testing</button>
        </div>
      </div>
      ${weekOpen ? `<div class="hc-week">
        <div class="hc-days" aria-label="Days studied this week">${dots}</div>
        <div class="hc-stats">
          <div><b>${hm(w.testSec)}</b><span>testing myself</span></div>
          <div><b>${w.learnMin ? "about " + hm(w.learnMin * 60) : "0 m"}</b><span>learning</span></div>
          <div><b>${w.answered}</b><span>questions answered</span></div>
          <div><b>${w.fixed}</b><span>answers fixed</span></div>
        </div>
        ${m.goal ? `<span class="hc-goal">A streak day is ${m.goal.minutes} minutes or more. Today: ${m.goal.today} of ${m.goal.minutes} minutes.${window.Decor ? (() => { const n = Decor.nextUp(m.goal)[0]; return n ? ` Next reward: ${n.name} (${n.have} of ${n.need} ${n.unit}).` : ""; })() : ""}</span>` : ""}</div>` : ""}
      ${cele ? `<div class="hc-cele"><span class="hc-cele-b"><b>Reward earned for ${esc(cele.why[cele.why.length - 1])}!</b><span>Choose one for your page${cele.left > 1 ? ` (${cele.left} to choose)` : ""}.</span></span><span class="hc-cele-btns"><button type="button" class="hs-btn" data-spend="sticker">+1 sticker</button><button type="button" class="hs-btn" data-spend="writing">+1 writing</button><button type="button" class="hs-btn" data-spend="photo">+1 photo</button></span></div>` : ""}
      <div class="qa" id="quickAdd"></div>
      <div class="hc-card">
        <div class="step-h"><span class="step-n" aria-hidden="true">2</span><h3>Where do you want to start?</h3></div>
        ${m.subjects.length ? `<div class="hc-sec"><span class="hc-label">Pick a subject</span><div class="hc-chips">${chips}</div></div>` : `<div class="hs-empty">No subjects yet.</div>`}
        ${rest.length ? `<div class="hc-sec"><span class="hc-label">Or choose a topic from your revision list</span>
          <div class="hc-list">${rest.slice(0, showAll ? rest.length : 3).map(row).join("")}</div>
          ${rest.length > 3 ? `<button type="button" class="hs-link" style="align-self:flex-start" data-all>${showAll ? "Show fewer" : `See all ${rest.length}`}</button>` : ""}</div>` : ""}
      </div>
    </div>`;
    view.querySelectorAll("[data-subject]").forEach(b => b.onclick = () => openSubject(b.dataset.subject));
    view.querySelectorAll("[data-open]").forEach(b => b.onclick = () => { const c = m.topics[b.dataset.open]; openChapter(c.id, c.subject_id, b.dataset.tab); });
    const again = () => renderHome(view, m, { profile, openChapter, openSubject, state, sb, reload, openSettings });
    const all = view.querySelector("[data-all]"); if (all) all.onclick = () => { state.homeShowAll = !showAll; again(); };
    view.querySelector("[data-week]").onclick = () => { state.weekOpen = !weekOpen; again(); };
    view.querySelectorAll("[data-spend]").forEach(b => b.onclick = async () => { b.disabled = true; await Decor.spend(sb, b.dataset.spend); if (openSettings) openSettings(); });
    if (sb) mountQuickAdd(view.querySelector("#quickAdd"), m, { sb, profile, reload, state });
  }

  // ---- subject page: a smart list that shows what matters now ----
  function rangeText(chs){
    const nums = chs.map(c => c.order_num).filter(n => n != null);
    const contiguous = nums.length === chs.length && nums.every((n, i) => i === 0 || n === nums[i-1] + 1);
    if (contiguous && nums.length > 1) return `Chapters ${nums[0]}–${nums[nums.length-1]}`;
    if (contiguous && nums.length === 1) return `Chapter ${nums[0]}`;
    return plural(chs.length, "chapter", "chapters");
  }
  function renderSubject(view, m, subjectId, { sb, profile, openChapter, goHome, reload, state }){
    addCss();
    const s = m.bySubject[subjectId];
    if (!s) { goHome(); return; }
    const chs = s.chapters.slice().sort((a, b) => (a.order_num || 0) - (b.order_num || 0));
    const isTested = c => c.done && (c.stage === "test" || c.stage === "refresh");
    const onTheGo = chs.filter(c => (c.stage !== "none" && !isTested(c)) || (c.flag && !isTested(c)));
    const tested = chs.filter(isTested);
    const reached = Math.max(-1, ...chs.map((c, i) => (c.stage !== "none" || c.flag) ? i : -1));
    const notStarted = chs.filter(c => c.stage === "none" && !c.flag);
    const comingUp = notStarted.filter(c => chs.indexOf(c) > reached).slice(0, 3);
    const later = notStarted.filter(c => !comingUp.includes(c));
    const open = state.subjectOpen = state.subjectOpen || {};
    const b = subjectBar(chs);

    const row = (c) => {
      const tag = isTested(c) ? "" : stepsMark(c);
      const classBtn = "";
      const note = c.flag && c.flag.note ? ` · ${esc(c.flag.note)}` : "";
      return `<button type="button" class="hs-row${c.stage === "none" ? " dim" : ""}" data-open="${c.id}" data-tab="${TAB_FOR[c.stage]}">
        <span class="hs-num${isTested(c) ? " ok" : ""}">${isTested(c) ? "✓" : esc(String(c.order_num ?? "-"))}</span>
        <span class="hs-row-b"><span class="hs-row-t">${esc(shortTitle(c.title))}</span><span class="hs-row-s">${esc(c.stage === "none" ? (comingUp.includes(c) ? "Coming up next" : "Not started") : c.line)}${note}</span>${classBtn ? `<span style="display:block;margin-top:6px">${classBtn}</span>` : ""}</span>
        ${tag}<span class="hs-chev" aria-hidden="true">›</span></button>`;
    };
    const fold = (key, title, sub, list, icon) => {
      if (!list.length) return "";
      const isOpen = !!open[subjectId + key];
      return `<button type="button" class="hs-row hs-fold" data-fold="${key}" aria-expanded="${isOpen}">
          <span class="hs-num${icon === "✓" ? " ok" : ""}">${icon}</span>
          <span class="hs-row-b"><span class="hs-row-t" style="font-size:16px">${esc(title)}</span><span class="hs-row-s">${esc(sub)}</span></span>
          <span class="hs-show">${isOpen ? "Hide" : "Show"}</span></button>${isOpen ? list.map(row).join("") : ""}`;
    };
    const opensSoon = s.exam ? (() => { const d = parseDate(s.exam.exam_date); return d ? `Exam prep from ${fmtDate(new Date(d - REFRESH_DAYS * DAY))}` : ""; })() : "";
    const testedSub = tested.some(c => c.stage === "refresh") ? "Exam ready" : (opensSoon || "Well done");
    let listHtml = "";
    listHtml += fold("tested", `${rangeText(tested)} · ${tested.length === 1 ? "tested" : "all tested"}`, testedSub, tested, "✓");
    if (onTheGo.length) listHtml += `<span class="hs-group">On the go</span>` + onTheGo.map(row).join("");
    if (comingUp.length) listHtml += `<span class="hs-group">Coming up</span>` + comingUp.map(row).join("");
    listHtml += fold("later", `${rangeText(later)} · not started`, later.length && comingUp.length ? "Later in the year" : "Start any time", later, "…");

    view.innerHTML = `<div class="hs">
      <button type="button" class="hs-back" data-home>← Home</button>
      <h1>${esc(s.title)}</h1>
      <div style="display:flex;flex-direction:column;gap:8px">${b.bar}<span class="hs-sub" style="font-size:16px">${esc([...b.parts, `${chs.filter(c => c.stage === "none").length} not started`].join(" · "))}</span></div>
      <div id="hsExam"></div>
      <div class="hs-head"><h3>Chapters</h3></div>
      ${chs.length ? `<div class="hs-list">${listHtml}</div>` : `<div class="hs-empty">No chapters yet.</div>`}
    </div>`;
    examBox(view.querySelector("#hsExam"), { sb, profile, subjectId, exam: s.exam, onChange: () => reload() });
    view.querySelector("[data-home]").onclick = goHome;
    view.querySelectorAll("[data-fold]").forEach(b2 => b2.onclick = () => { open[subjectId + b2.dataset.fold] = !open[subjectId + b2.dataset.fold]; renderSubject(view, m, subjectId, { sb, profile, openChapter, goHome, reload, state }); });
    view.querySelectorAll("[data-classdone]").forEach(el => {
      const act = async (e) => { e.stopPropagation(); e.preventDefault(); el.textContent = "Saving…"; await markClassDone(sb, profile, el.dataset.classdone, true); reload(); };
      el.addEventListener("click", act);
      el.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") act(e); });
    });
    view.querySelectorAll("[data-open]").forEach(b2 => b2.addEventListener("click", (e) => { if (e.target.closest("[data-classdone]")) return; openChapter(b2.dataset.open, subjectId, b2.dataset.tab); }));
  }

  window.Stages = { loadOverview, buildModel, renderHome, renderSubject, chapterStage, statusLine, examBox, markClassDone, startFresh, parseDate, fmtDate, untilText, REFRESH_DAYS, PRACTICE_TITLES, addCss };
})();
