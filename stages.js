// Learn it before class. Test it after. Refresh it before exams.
// Works out where each chapter is (Learn, Test or Refresh) and draws the homepage
// and the subject pages. Shared by every student page.
(function(){
  const css = `
  .hs{display:flex;flex-direction:column;gap:18px;font-family:'Atkinson Hyperlegible',Verdana,sans-serif;color:#1F2328}
  .hs a{color:#1F6F5C}
  .hs-hi{background:#1F2328;color:#fff;border-radius:18px;padding:22px 24px;display:flex;flex-direction:column;gap:16px}
  .hs-hi-top{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap}
  .hs-hi h2{margin:0;font-size:26px;line-height:1.2}
  .hs-tag-line{font-size:15px;color:#C9CFD6;margin:4px 0 0}
  .hs-streak{display:flex;align-items:center;gap:14px}
  .hs-days{display:flex;gap:6px}
  .hs-day{display:flex;flex-direction:column;align-items:center;gap:4px;font-size:12px;color:#C9CFD6}
  .hs-day i{width:20px;height:20px;border-radius:50%;background:#3A4149;display:block;box-sizing:border-box}
  .hs-day.on i{background:#7FC4AE}
  .hs-day.today{color:#fff;font-weight:700}
  .hs-day.today:not(.on) i{background:none;border:2px dashed #7FC4AE}
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
  .hs-link{background:none;border:none;padding:0;font:inherit;font-size:15px;font-weight:700;color:#1F6F5C;cursor:pointer;text-decoration:underline;text-underline-offset:3px}
  .hs-sub{font-size:14px;color:#5B6470}
  .hs-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
  .hs-tile{background:#fff;border:none;border-radius:14px;padding:16px 18px;display:flex;flex-direction:column;gap:8px;text-align:left;font:inherit;color:#1F2328;cursor:pointer;box-shadow:0 1px 2px rgba(0,0,0,.04)}
  .hs-tile:hover{box-shadow:0 2px 8px rgba(0,0,0,.08)}
  .hs-tile:focus-visible,.hs-card:focus-visible,.hs-row:focus-visible{outline:3px solid #1F6F5C;outline-offset:2px}
  .hs-tile b{font-size:17px}
  .hs-bar{height:8px;background:#DDE1E5;border-radius:99px;display:flex;overflow:hidden}
  .hs-bar i{display:block;height:100%}
  .hs-card{background:#fff;border:none;border-radius:14px;padding:16px 18px;display:flex;flex-direction:column;gap:6px;text-align:left;font:inherit;color:#1F2328;cursor:pointer;box-shadow:0 1px 2px rgba(0,0,0,.04)}
  .hs-card:hover{box-shadow:0 2px 8px rgba(0,0,0,.08)}
  .hs-card .t{font-size:16px;font-weight:700;line-height:1.35}
  .hs-card .s{font-size:14px;line-height:1.4}
  .hs-card .go{margin-top:auto;padding-top:8px;font-size:15px;font-weight:700;color:#1F6F5C}
  .hs-pill{align-self:flex-start;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;border-radius:999px;padding:3px 9px;flex:none}
  .hs-pill.learn{color:#1F2328;background:#EEF0F2}
  .hs-pill.test{color:#1F6F5C;background:#E3F1EC}
  .hs-pill.refresh{color:#8A5A00;background:#FBF0D9}
  .hs-back{background:none;border:none;padding:0;font:inherit;font-size:16px;font-weight:700;color:#1F6F5C;cursor:pointer;align-self:flex-start}
  .hs h1{margin:0;font-size:30px;line-height:1.2}
  .hs-exam{background:#fff;border-radius:14px;padding:14px 18px;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap}
  .hs-exam.soon{background:#FBF0D9}
  .hs-exam-text{display:flex;flex-direction:column;gap:3px}
  .hs-exam-text b{font-size:17px}
  .hs-exam form{display:flex;gap:8px;flex-wrap:wrap;align-items:center;width:100%}
  .hs-exam input{font:inherit;font-size:16px;border:2px solid #DDE1E5;border-radius:10px;padding:8px 10px;min-height:44px;box-sizing:border-box}
  .hs-exam input[type=text]{flex:1 1 180px}
  .hs-btn{border:2px solid #1F6F5C;background:#1F6F5C;color:#fff;border-radius:999px;padding:8px 18px;font:inherit;font-weight:700;font-size:15px;cursor:pointer;min-height:42px;white-space:nowrap}
  .hs-btn.ghost{background:#fff;color:#1F6F5C}
  .hs-btn.small{font-size:14px;padding:5px 14px;min-height:36px}
  .hs-list{background:#fff;border-radius:14px;overflow:hidden;display:flex;flex-direction:column}
  .hs-row{display:flex;align-items:center;gap:14px;padding:13px 18px;border:none;border-top:1px solid #DDE1E5;background:none;font:inherit;color:#1F2328;text-align:left;cursor:pointer;width:100%}
  .hs-list>:first-child{border-top:none}
  .hs-row:hover .hs-row-t{text-decoration:underline}
  .hs-row.dim{color:#5B6470}
  .hs-num{flex:none;width:34px;height:34px;border-radius:10px;background:#F4F5F6;display:grid;place-items:center;font-size:15px;font-weight:700;color:#5B6470}
  .hs-num.ok{background:#E3F1EC;color:#1F6F5C}
  .hs-row-b{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}
  .hs-row-t{font-size:17px;font-weight:700;line-height:1.35}
  .hs-row-s{font-size:14px;color:#5B6470;line-height:1.4}
  .hs-chev{flex:none;font-size:20px;color:#5B6470}
  .hs-fold{background:#F9FAFA}
  .hs-fold .hs-show{flex:none;font-size:15px;font-weight:700;color:#1F6F5C}
  .hs-group{display:block;padding:14px 18px 4px;border-top:1px solid #DDE1E5;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#5B6470}
  .hs-empty{background:#fff;border-radius:14px;padding:18px;color:#5B6470}
  @media (max-width:700px){.hs-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.hs-stats{grid-template-columns:repeat(2,minmax(0,1fr))}}
  @media (max-width:460px){.hs-grid{grid-template-columns:1fr}.hs-grid.tiles{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.hs-tile{padding:12px 14px;gap:6px}.hs-tile b{font-size:16px}.hs-row{padding:12px 14px;gap:10px;flex-wrap:wrap}.hs-row .hs-row-b{flex-basis:calc(100% - 60px)}}
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
    else if (classDone || tried > 0 || (stats.triedEver || 0) > 0) { stage = "test"; done = tested; }
    else if (learnDone > 0) { stage = "learn"; done = learnTotal > 0 && learnDone >= learnTotal; }
    else stage = "none";
    return { stage, done, tested, refreshOpen, examDate, opensOn, learnDone, learnTotal, classDone, freshSince, stats };
  }

  function statusLine(s){
    const st = s.stats || {};
    if (s.stage === "refresh") {
      if (s.done) return "Refreshed and ready";
      if (s.freshSince) return st.fixes ? `Refreshing · ${plural(st.fixes, "to fix", "to fix")}` : `Refreshing · ${plural((st.total||0) - (st.tried||0), "question", "questions")} to go`;
      return `Exams ${untilText(s.examDate)}${st.lastAt ? " · last tested " + ago(st.lastAt) : ""}`;
    }
    if (s.stage === "test") {
      if (!st.total) return s.classDone ? "Finished in class · questions coming soon" : "Questions coming soon";
      if (s.done) return st.lastAt ? `Tested · last time ${ago(st.lastAt)}` : "Tested";
      const parts = [];
      if (s.classDone) parts.push("Finished in class");
      if (st.fixes) parts.push(`${st.fixes} to fix`);
      else if (!st.tried) parts.push("not tested yet");
      else parts.push(`${plural(st.total - st.tried, "question", "questions")} still to try`);
      return parts.join(" · ");
    }
    if (s.stage === "learn") {
      if (s.done) return "Learnt · not done in class yet";
      return s.learnDone / Math.max(1, s.learnTotal) >= 0.5 ? "Over halfway learnt" : "Started learning";
    }
    return "Not started";
  }
  const TAG = { learn: "Learn", test: "Test", refresh: "Refresh" };
  const GO = { learn: "Keep learning ›", test: "Test myself ›", refresh: "Refresh ›", none: "Start ›" };
  const TAB_FOR = { learn: "learn", test: "test", refresh: "refresh", none: "learn" };

  // ---- load everything the homepage and subject pages need ----
  async function loadOverview(sb, profile){
    const subjects = await sb(`subjects?select=id,title,description&user_id=eq.${profile.id}&order=title.asc`);
    const subjectIds = subjects.map(s => s.id);
    if (!subjectIds.length) return { subjects, topics: [] };
    const since = new Date(Date.now() - 70 * DAY).toISOString();
    const [topics, templatesAll, disabled, progress, status, exams, flags, timeRows] = await Promise.all([
      sb(`topics?select=id,title,order_num,subject_id&subject_id=in.${inList(subjectIds)}&order=order_num.asc`),
      sb(`nlm_checklist_templates?select=id,subject_id,step_order,title&subject_id=in.${inList(subjectIds)}`),
      sb(`nlm_disabled_steps?select=template_id&profile_id=eq.${profile.id}`),
      sb(`nlm_progress?select=topic_id,step_order,updated_at&profile_id=eq.${profile.id}&done=eq.true`),
      sb(`chapter_status?select=topic_id,class_done_at,fresh_since&profile_id=eq.${profile.id}`),
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
      const ch = { ...t, ...info, flag: flags[t.id] || null, line: "" };
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
      if (c.stage === "refresh" && !c.done) score = 0 + Math.max(0, (c.examDate - new Date()) / DAY);
      else if (c.flag) score = 40;
      else if (c.stage === "test" && c.stats.fixes) score = 100 - c.stats.fixes;
      else if (c.stage === "test") score = c.stats.total ? 150 : 400;
      else if (c.stage === "learn" && !c.done) score = 200;
      else score = 250;
      items.push({ c, score });
    });
    items.sort((a, b) => a.score - b.score || (a.c.order_num || 0) - (b.c.order_num || 0));
    return items.map(i => i.c);
  }

  // ---- exam date box (homepage subject pages and the Refresh tab) ----
  function examBox(el, { sb, profile, subjectId, exam, onChange, compact }){
    function paint(editing){
      const d = exam ? parseDate(exam.exam_date) : null;
      const opens = d ? new Date(d - REFRESH_DAYS * DAY) : null;
      const today = startOfDay(new Date());
      el.className = "hs-exam" + (d && today >= opens && today <= d ? " soon" : "");
      if (editing || !exam) {
        el.innerHTML = `<div class="hs-exam-text"><b>${exam ? "Change your exam date" : "When are your next exams?"}</b><span class="hs-sub">Refresh opens ${REFRESH_DAYS / 7} weeks before, so you're ready in time.</span></div>
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
      el.innerHTML = `<div class="hs-exam-text"><b>${esc(exam.label)} · ${esc(fmtDate(d))}</b><span class="hs-sub">${today > d ? "These exams are over. Set your next exam date." : open ? `Refresh is open: exams ${untilText(d)}.` : `Refresh opens ${esc(fmtDate(opens))}.${compact ? "" : " You can start early if you like."}`}</span></div><button class="hs-link" type="button" data-edit>Change date</button>`;
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
    const bar = `<div class="hs-bar" aria-hidden="true"><i style="width:${tested/n*100}%;background:#1F6F5C"></i><i style="width:${testing/n*100}%;background:#7FC4AE"></i><i style="width:${learning/n*100}%;background:#1F2328"></i></div>`;
    const refresh = chs.filter(c => c.stage === "refresh" && !c.done).length;
    const parts = [];
    if (refresh) parts.push(`${refresh} to refresh`);
    if (testing - refresh) parts.push(`${testing - refresh} to test`);
    if (tested) parts.push(`${tested} tested`);
    if (learning) parts.push(`${learning} learning`);
    return { bar, parts, tested, testing, learning };
  }

  function revCard(c, subjTitle){
    const tag = c.stage === "none" ? "" : `<span class="hs-pill ${c.stage}">${TAG[c.stage]}</span>`;
    const note = c.flag && c.flag.note ? ` · ${esc(c.flag.note)}` : "";
    return `<button type="button" class="hs-card" data-open="${c.id}" data-tab="${TAB_FOR[c.stage]}">${tag}
      <span class="hs-sub">${esc(subjTitle)} · Ch ${esc(String(c.order_num ?? ""))}</span>
      <span class="t">${esc(shortTitle(c.title))}</span>
      <span class="s">${esc(c.line)}${note}</span>
      <span class="go">${GO[c.stage]}</span></button>`;
  }

  // ---- homepage ----
  function renderHome(view, m, { profile, openChapter, openSubject, state }){
    addCss();
    const w = m.week;
    const letters = ["M","T","W","T","F","S","S"], todayKey = dayKey(new Date());
    const dots = letters.map((l, i) => {
      const d = new Date(w.ws.getTime() + i * DAY), k = dayKey(d);
      return `<span class="hs-day${w.days.has(k) ? " on" : ""}${k === todayKey ? " today" : ""}"><i></i>${l}</span>`;
    }).join("");
    const rev = revisionList(m);
    const showAll = state && state.homeShowAll;
    const subjTitle = id => (m.bySubject[id] || {}).title || "";
    const tiles = m.subjects.map(s => {
      const b = subjectBar(s.chapters);
      const line = s.chapters.length ? `${plural(s.chapters.length, "chapter", "chapters")}${b.parts.length ? " · " + b.parts.slice(0, 2).join(" · ") : " · not started"}` : "No chapters yet";
      return `<button type="button" class="hs-tile" data-subject="${s.id}"><b>${esc(s.title)}</b>${b.bar}<span class="hs-sub">${esc(line)}</span></button>`;
    }).join("");
    view.innerHTML = `<div class="hs">
      <div class="hs-hi">
        <div class="hs-hi-top">
          <div><h2>Hi ${esc(profile.name)}</h2><p class="hs-tag-line">Learn it before class. Test it after. Refresh it before exams.</p></div>
          <div class="hs-streak"><div class="hs-days" aria-label="Days studied this week">${dots}</div><div class="hs-streak-n"><b>${w.streak}</b><span>day streak</span></div></div>
        </div>
        <div class="hs-week"><span class="hs-eyebrow">This week</span>
          <div class="hs-stats">
            <div class="hs-stat"><b>${hm(w.testSec)}</b><span>testing myself</span></div>
            <div class="hs-stat"><b>${w.learnMin ? "about " + hm(w.learnMin * 60) : "0 m"}</b><span>learning</span></div>
            <div class="hs-stat"><b>${w.answered}</b><span>questions answered</span></div>
            <div class="hs-stat"><b>${w.fixed}</b><span>answers fixed</span></div>
          </div></div>
      </div>
      <div class="hs-head"><h3>Where do you want to start today?</h3>${rev.length ? `<button type="button" class="hs-link" data-pick>Can't decide? Pick for me</button>` : ""}</div>
      ${m.subjects.length ? `<div class="hs-grid tiles">${tiles}</div>` : `<div class="hs-empty">No subjects yet.</div>`}
      ${rev.length ? `<div class="hs-head" style="margin-top:6px"><h3 style="font-size:17px">Or choose from your revision list</h3><span class="hs-sub">most urgent first</span></div>
      <div class="hs-grid">${rev.slice(0, showAll ? rev.length : 3).map(c => revCard(c, subjTitle(c.subject_id))).join("")}</div>
      ${rev.length > 3 ? `<button type="button" class="hs-link" data-all>${showAll ? "Show fewer" : `See all ${rev.length} on my revision list`}</button>` : ""}` : ""}
    </div>`;
    view.querySelectorAll("[data-subject]").forEach(b => b.onclick = () => openSubject(b.dataset.subject));
    view.querySelectorAll("[data-open]").forEach(b => b.onclick = () => { const c = m.topics[b.dataset.open]; openChapter(c.id, c.subject_id, b.dataset.tab); });
    const pick = view.querySelector("[data-pick]"); if (pick) pick.onclick = () => { const c = rev[0]; openChapter(c.id, c.subject_id, TAB_FOR[c.stage]); };
    const all = view.querySelector("[data-all]"); if (all) all.onclick = () => { state.homeShowAll = !showAll; renderHome(view, m, { profile, openChapter, openSubject, state }); };
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
      const tag = c.stage !== "none" && !isTested(c) ? `<span class="hs-pill ${c.stage}">${TAG[c.stage]}</span>` : "";
      const classBtn = c.stage === "learn" && !c.classDone ? `<span class="hs-btn ghost small" role="button" tabindex="0" data-classdone="${c.id}">Done in class?</span>` : "";
      const note = c.flag && c.flag.note ? ` · ${esc(c.flag.note)}` : "";
      return `<button type="button" class="hs-row${c.stage === "none" ? " dim" : ""}" data-open="${c.id}" data-tab="${TAB_FOR[c.stage]}">
        <span class="hs-num${isTested(c) ? " ok" : ""}">${isTested(c) ? "✓" : esc(String(c.order_num ?? "-"))}</span>
        <span class="hs-row-b"><span class="hs-row-t">${esc(shortTitle(c.title))}</span><span class="hs-row-s">${esc(c.stage === "none" ? (comingUp.includes(c) ? "Not started · learn ahead before class" : "Not started") : c.line)}${note}</span></span>
        ${classBtn}${tag}<span class="hs-chev" aria-hidden="true">›</span></button>`;
    };
    const fold = (key, title, sub, list, icon) => {
      if (!list.length) return "";
      const isOpen = !!open[subjectId + key];
      return `<button type="button" class="hs-row hs-fold" data-fold="${key}" aria-expanded="${isOpen}">
          <span class="hs-num${icon === "✓" ? " ok" : ""}">${icon}</span>
          <span class="hs-row-b"><span class="hs-row-t" style="font-size:16px">${esc(title)}</span><span class="hs-row-s">${esc(sub)}</span></span>
          <span class="hs-show">${isOpen ? "Hide" : "Show"}</span></button>${isOpen ? list.map(row).join("") : ""}`;
    };
    const opensSoon = s.exam ? (() => { const d = parseDate(s.exam.exam_date); return d ? `Refresh opens ${fmtDate(new Date(d - REFRESH_DAYS * DAY))}` : ""; })() : "";
    const testedSub = tested.some(c => c.stage === "refresh") ? "Refreshed and ready" : (opensSoon || "Well done");
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
