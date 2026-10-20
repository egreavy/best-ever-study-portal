// Learn it before class. Test it after. Refresh it before exams.
// Works out where each chapter is (Learn, Test or Refresh) and draws the homepage
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
  .qa{border:2px solid var(--t-accent-border);background:var(--t-card);border-radius:18px;padding:20px 22px;display:flex;flex-direction:column;gap:12px}
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
  .hs-empty{background:var(--t-card);border-radius:14px;padding:18px;color:var(--t-muted)}
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
  // Four arrows: not started > learning >> done in class >>> testing >>>>
  function stepLevel(c){
    if (c.stage === "refresh") return [4, "Refreshing"];
    if (c.stage === "test") return (c.stats && (c.stats.tried || c.stats.triedEver)) ? [4, "Testing"] : [3, "Done in class"];
    if (c.stage === "learn") return [2, "Learning"];
    return [1, "Not started"];
  }
  function stepsMark(c){
    const [n, label] = stepLevel(c);
    return `<span class="hs-steps" aria-label="Step ${n} of 4: ${label}"><span class="hs-arrows" aria-hidden="true">${[1,2,3,4].map(i => `<i${i <= n ? ' class="on"' : ""}></i>`).join("")}</span><span class="hs-steps-l">${label}</span></span>`;
  }
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
        <form class="qa-row step-in"><div class="qa-box"><input type="text" name="t" autocomplete="off" aria-label="What's new at school" placeholder='e.g. "econ ch 3 coming up, we did polsoc ch 5, geog test friday"'>${SR ? `<button type="button" class="qa-mic" aria-label="Speak" title="Speak">${QA_MIC}</button>` : ""}</div><button class="hs-btn" type="submit" style="min-height:48px;padding:10px 22px;font-size:16px">Add</button></form>
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
        if (a.type === "class_done") { ic = ["done", "✓"]; k = chName(c); t = shortTitle(c.title); w = "Done in class: moves on to Test"; }
        else if (a.type === "coming_up") { ic = ["up", "›"]; k = chName(c); t = shortTitle(c.title); w = `Coming up${d ? " " + d : " in class"}: added to your revision list to learn ahead`; }
        else if (a.type === "class_test") { ic = ["date", "!"]; k = `${subjTitle(a.subject_id)} · class test`; t = d; w = `Which chapter? ${chSelect()}`; }
        else if (a.type === "deadline") { ic = ["date", "!"]; k = `${subjTitle(a.subject_id)} · ${esc(a.label || "deadline")}`; t = `Due ${d}`; w = `For ${chSelect()}`; }
        else if (a.type === "exam") { ic = ["date", "!"]; k = subjTitle(a.subject_id); t = `${esc(a.label || "Exams")} · ${d}`; w = "Sets the exam date, so Refresh opens 3 weeks before"; }
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
          if (prevFlag && /^coming up/i.test(prevFlag.note || "")) await sb(`topic_flags?topic_id=eq.${c.id}&profile_id=eq.${profile.id}`, { method: "DELETE", prefer: "return=minimal" });
          undo.push(async () => { await setStatus(c.id, { class_done_at: prevAt }); if (prevFlag) await restoreFlag(c.id, prevFlag); });
          said.push(`${chName(c)} moved on to Test`);
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
  function renderHome(view, m, { profile, openChapter, openSubject, state, sb, reload }){
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
      <div class="qa" id="quickAdd"></div>
      <div class="step2"><div class="hs-head step2-h"><div class="step-h"><span class="step-n" aria-hidden="true">2</span><h3>Where do you want to start today?</h3></div>${rev.length ? `<button type="button" class="hs-link" data-pick>Can't decide? Pick for me</button>` : ""}</div>
      ${m.subjects.length ? `<div class="hs-grid tiles">${tiles}</div>` : `<div class="hs-empty">No subjects yet.</div>`}
      ${rev.length ? `<div class="hs-head" style="margin-top:6px"><h3 style="font-size:17px">Or choose from your revision list</h3><span class="hs-sub">most urgent first</span></div>
      <div class="hs-grid">${rev.slice(0, showAll ? rev.length : 3).map(c => revCard(c, subjTitle(c.subject_id))).join("")}</div>
      ${rev.length > 3 ? `<button type="button" class="hs-link" style="align-self:flex-start;padding:0" data-all>${showAll ? "Show fewer" : `See all ${rev.length} on my revision list`}</button>` : ""}` : ""}</div>
    </div>`;
    view.querySelectorAll("[data-subject]").forEach(b => b.onclick = () => openSubject(b.dataset.subject));
    view.querySelectorAll("[data-open]").forEach(b => b.onclick = () => { const c = m.topics[b.dataset.open]; openChapter(c.id, c.subject_id, b.dataset.tab); });
    const pick = view.querySelector("[data-pick]"); if (pick) pick.onclick = () => { const c = rev[0]; openChapter(c.id, c.subject_id, TAB_FOR[c.stage]); };
    const all = view.querySelector("[data-all]"); if (all) all.onclick = () => { state.homeShowAll = !showAll; renderHome(view, m, { profile, openChapter, openSubject, state, sb, reload }); };
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
