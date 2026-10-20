// Chapter Test and Refresh tabs: quizzes, short answers and past paper questions
// with marking, the questions to fix, and the two ways to refresh before exams.
// All results go to quiz_attempts, which the voice tutor also reads and writes,
// so each one picks up from the others.
(function(){
  const css = `
  .pr-card{background:var(--t-card);border-radius:14px;padding:16px 20px;margin:0 0 10px;display:flex;flex-direction:column;gap:10px}
  .pr-card h3{margin:0;font-size:17px;font-weight:700;line-height:1.3}
  .pr-sub{margin:0;color:var(--t-muted);font-size:15px;line-height:1.45}
  .pr-small{margin:0;color:var(--t-muted);font-size:14px;line-height:1.45}
  .pr-steps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
  .pr-step{display:flex;flex-direction:column;gap:4px}
  .pr-step b{font-size:15px}
  .pr-step span{font-size:14px;color:var(--t-muted)}
  .pr-bar{height:8px;border-radius:99px;background:var(--t-line);overflow:hidden;margin-bottom:2px}
  .pr-bar i{display:block;height:100%;background:var(--t-ink);border-radius:99px}
  .pr-next{margin:0;font-size:15px;line-height:1.5}
  .pr-headrow{display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap}
  .pr-list{display:flex;flex-direction:column}
  .pr-li{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:10px 0;border-top:1px solid var(--t-line)}
  .pr-li:last-child{border-bottom:1px solid var(--t-line)}
  .pr-li-body{display:flex;flex-direction:column;gap:2px;min-width:0}
  .pr-li-title{font-size:16px;font-weight:700;line-height:1.4}
  .pr-li-note{font-size:14px;color:var(--t-muted);line-height:1.4}
  .pr-card details summary{cursor:pointer;font-weight:700;font-size:15px;padding:2px 0}
  .pr-refresh{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:10px;margin:0 0 10px}
  .pr-refresh .pr-card{margin:0}
  .pr-refresh .pr-side-btn{margin-top:auto;padding-top:6px}
  .pr-pill{align-self:flex-start;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--t-accent);background:var(--t-accent-tint);border-radius:999px;padding:3px 9px}
  .pr-right{background:var(--t-card);border-radius:14px;padding:12px 20px;margin:0 0 10px}
  .pr-card details ol,.pr-right ol{margin:8px 0 0;padding-left:22px;display:flex;flex-direction:column;gap:6px;font-size:14px;line-height:1.45;color:var(--t-muted)}
  .pr-hero{align-items:center;text-align:center;gap:8px;padding:24px 20px}
  .pr-hero-title{font-size:22px;font-weight:700;line-height:1.25}
  .pr-hero .pr-btn.big{margin-top:6px;font-size:18px;padding:14px 36px;min-height:54px}
  .ft{background:var(--t-card);border:2px solid var(--t-accent-border);border-radius:16px;padding:16px 18px;display:flex;align-items:center;gap:14px;text-align:left;font:inherit;color:var(--t-ink);cursor:pointer;width:100%;box-sizing:border-box;height:100%}
  .ft:hover{border-color:var(--t-accent)}
  .ft:focus-visible{outline:3px solid var(--t-accent);outline-offset:2px}
  .ft-icon{flex:none;width:50px;height:50px;border-radius:14px;background:var(--t-accent);color:var(--t-on-accent);display:grid;place-items:center}
  .ft-icon svg{width:24px;height:24px}
  .ft-body{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
  .ft-tag{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--t-accent)}
  .ft-title{font-size:17px;font-weight:700;line-height:1.25}
  .ft-line{font-size:14px;color:var(--t-muted);line-height:1.35}
  .ft-chev{flex:none;font-size:22px;color:var(--t-accent)}
  .pr-badge{flex:none;font-size:14px;font-weight:700;color:var(--t-accent);background:var(--t-accent-tint);border-radius:999px;padding:2px 10px}
  .pr-pair{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:10px;margin:0 0 10px}
  .pr-pair>:empty{display:none}
  .pr-pair[hidden]{display:none}
  .pr-answer{position:relative}
  .pr-answer textarea{padding-bottom:52px}
  .pr-tools{position:absolute;right:10px;bottom:12px;display:flex;gap:8px}
  .pr-icon{width:40px;height:40px;border-radius:50%;border:2px solid var(--t-ink);background:var(--t-card);color:var(--t-ink);display:grid;place-items:center;cursor:pointer;padding:0}
  .pr-icon svg{width:20px;height:20px}
  .pr-icon:focus-visible{outline:3px solid var(--t-accent);outline-offset:2px}
  .pr-icon:hover{background:var(--t-soft2)}
  .pr-icon.on{background:var(--t-ink);color:var(--t-on-accent);animation:prPulse 1.6s ease-out infinite}
  .pr-icon input{display:none}
  @keyframes prPulse{0%{box-shadow:0 0 0 0 rgba(31,35,40,.3)}100%{box-shadow:0 0 0 10px rgba(31,35,40,0)}}
  @media (prefers-reduced-motion:reduce){.pr-icon.on{animation:none}}
  .pr-pair .pr-paper{height:100%;box-sizing:border-box}
  .pr-side{gap:6px}
  .pr-side .pr-side-btn{margin-top:auto;padding-top:6px}
  .pr-mix{font-size:13px;color:var(--t-muted)}
  .pr-mix summary{cursor:pointer;font-weight:400;font-size:13px}
  .pr-pair>.pr-card,.pr-pair>*{margin:0}
    .pr-eyebrow{font-size:12px;font-weight:700;color:var(--t-muted);text-transform:uppercase;letter-spacing:.06em}
  .pr-choose-label{font-size:14px;font-weight:700;color:var(--t-muted);margin:4px 0 6px}
  .pr-choices{background:var(--t-card);border-radius:14px;padding:2px 20px;margin:0 0 10px;display:flex;flex-direction:column}
  .pr-choices .pr-choose-label{margin:12px 0 2px}
  .pr-choice{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:11px 0;border:none;border-bottom:1px solid var(--t-line);background:none;text-align:left;font:inherit;color:inherit;cursor:pointer;width:100%}
  .pr-choice:last-child{border-bottom:none}
  .pr-choice .pr-li-body{flex:1}
  .pr-choice:hover .pr-li-title{text-decoration:underline}
  .pr-choice[disabled]{opacity:.5;cursor:default}
  .pr-chev{font-size:20px;color:var(--t-muted);flex:none}
  .pr-btn{border:2px solid var(--t-accent);background:var(--t-accent);color:var(--t-on-accent);border-radius:999px;padding:8px 18px;font-weight:700;font-size:15px;cursor:pointer;font-family:inherit;min-height:40px;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;white-space:nowrap}
  .pr-btn.big{font-size:16px;padding:11px 24px;min-height:46px}
  .pr-btn.ghost{background:var(--t-card);color:var(--t-accent)}
  .pr-btn.dark{background:var(--t-ink);border-color:var(--t-ink)}
  .pr-btn[disabled]{opacity:.6;cursor:default}
  .pr-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
  .pr-q{font-size:18px;font-weight:700;line-height:1.5;margin:0}
  .pr-meta{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;font-size:14px;color:var(--t-muted)}
  .pr-progress{height:6px;background:var(--t-line);border-radius:99px;overflow:hidden}.pr-progress i{display:block;height:100%;background:var(--t-ink)}
  .pr-opts{display:flex;flex-direction:column;gap:8px}
  .pr-opt{text-align:left;border:2px solid var(--t-line);background:var(--t-card);border-radius:12px;padding:10px 14px;min-height:46px;display:flex;gap:12px;align-items:flex-start;cursor:pointer;font:inherit;font-size:16px;color:inherit;line-height:1.45}
  .pr-opt b{flex:none;width:24px;height:24px;border-radius:50%;background:var(--t-soft2);display:grid;place-items:center;font-size:13px}
  .pr-opt:hover:not(:disabled){border-color:var(--t-ink)}
  .pr-opt.right{border-color:var(--t-accent);background:var(--t-accent-tint)}.pr-opt.wrong{border-color:var(--t-ink);background:var(--t-soft2)}.pr-opt:disabled{cursor:default}
  .pr-fb{border-radius:12px;padding:12px 14px;display:flex;flex-direction:column;gap:6px;font-size:15px;line-height:1.5;background:var(--t-soft)}
  .pr-fb.good{background:var(--t-accent-tint)}
  .pr-fb h4{margin:2px 0 0;font-size:15px}
  .pr-fb ul{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:3px}
  .pr-scheme{border-left:4px solid var(--t-line);padding-left:10px;color:var(--t-muted);font-size:14px}
  .pr-card textarea{width:100%;box-sizing:border-box;min-height:110px;font:inherit;font-size:16px;line-height:1.5;border:2px solid var(--t-line);border-radius:12px;padding:10px 12px;background:var(--t-soft);color:inherit;resize:vertical}
  .pr-card textarea:focus{outline:3px solid var(--t-accent);outline-offset:1px}
  .pr-tip{font-size:14px;color:var(--t-muted);margin:0;line-height:1.45}
  .pr-thumbs{display:flex;gap:8px;flex-wrap:wrap}.pr-thumbs img{width:72px;height:72px;object-fit:cover;border-radius:10px;border:1px solid var(--t-line)}
  .pr-thumbs:empty{display:none}
  .pr-rate{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
  .pr-rate button{border:2px solid var(--t-ink);background:var(--t-card);border-radius:12px;padding:8px 6px;cursor:pointer;font:inherit;font-weight:700;font-size:15px;min-height:44px;color:var(--t-ink)}
  .pr-score{font-size:30px;font-weight:700;line-height:1;font-variant-numeric:tabular-nums}
  .pr-err{color:#a32020;font-size:14px;margin:0}
  .pr-card button:focus-visible,.pr-choice:focus-visible,.pr-btn:focus-visible{outline:3px solid var(--t-accent);outline-offset:3px}
  @media (max-width:600px){.pr-li{flex-direction:column;align-items:flex-start}.pr-card{padding:14px 16px}.pr-choices{padding:2px 16px}.pr-steps{gap:8px}}
  `;
  function addCss(){ if (document.getElementById("pr-css")) return; const s=document.createElement("style"); s.id="pr-css"; s.textContent=css; document.head.appendChild(s); }
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const h = html => { const t=document.createElement("template"); t.innerHTML=html.trim(); return t.content.firstElementChild; };
  const shuffle = a => { a=a.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]} return a; };
  const L = "ABCD";
  const isTouch = matchMedia("(pointer:coarse)").matches, isMac = /Mac/.test(navigator.platform||"");
  const speakTip = () => `<p class="pr-tip">To speak instead of typing: ${isTouch ? "tap the microphone on your keyboard" : isMac ? "press the Fn (Globe) key twice" : "press Windows + H"}.</p>`;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  // Adds a Speak my answer button that types what he says into the box (Chrome, Edge, Safari)
  const MIC_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><path d="M12 17v5"/></svg>';
  const PAPER_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/><path d="M8 13h8M8 17h5"/></svg>';
  const CAM_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>';
  function attachMic(row, ta, status){
    if (!SR) return false;
    const btn = h(`<button type="button" class="pr-icon" aria-pressed="false" aria-label="Speak your answer" title="Speak your answer">${MIC_SVG}</button>`);
    row.prepend(btn);
    let rec = null, base = "";
    const stop = () => { if (rec) { try { rec.stop(); } catch (e) {} } };
    btn.onclick = () => {
      if (rec) return stop();
      rec = new SR(); rec.lang = "en-IE"; rec.continuous = true; rec.interimResults = true;
      base = ta.value ? ta.value.replace(/\s*$/, " ") : "";
      rec.onresult = (e) => {
        let finalText = "", interim = "";
        for (let i = 0; i < e.results.length; i++) { const r = e.results[i]; if (r.isFinal) finalText += r[0].transcript; else interim += r[0].transcript; }
        ta.value = (base + finalText + interim).replace(/^\s+/, "");
      };
      rec.onerror = (e) => {
        status.textContent = e.error === "not-allowed" || e.error === "service-not-allowed"
          ? "The browser blocked the microphone. Allow it for this site (the icon in the address bar), then try again."
          : e.error === "no-speech" ? "Didn't hear anything. Tap the microphone and try again." : "Speaking didn't work this time. Try again, or type your answer.";
        status.hidden = false;
      };
      rec.onend = () => { rec = null; btn.classList.remove("on"); btn.setAttribute("aria-label", "Speak your answer"); btn.title = "Speak your answer"; btn.setAttribute("aria-pressed", "false"); base = ta.value; };
      try {
        rec.start(); status.hidden = true;
        btn.classList.add("on"); btn.setAttribute("aria-label", "Stop speaking"); btn.title = "Stop speaking"; btn.setAttribute("aria-pressed", "true");
      } catch (e) { rec = null; }
    };
    row._stopMic = stop;
    return true;
  }
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

  // ---- data ----
  async function loadProgress(sb, profile, questions, freshSince){
    const ids = questions.map(q => q.id);
    if (!ids.length) return { latest:{}, src:{}, reviews:{}, when:{}, everWeak:new Set(), lastAt:null };
    const inIds = ids.map(encodeURIComponent).join(",");
    const [att, rev] = await Promise.all([
      sb(`quiz_attempts?select=question_id,result,source,created_at&profile_id=eq.${profile.id}&question_id=in.(${inIds})&order=created_at.desc&limit=1000`),
      sb(`answer_reviews?select=question_id,marks_awarded,marks_available,feedback,created_at&profile_id=eq.${profile.id}&question_id=in.(${inIds})&order=created_at.desc&limit=200`)
    ]);
    const latest = {}, src = {}, when = {}, reviews = {}, everWeak = new Set(), ever = new Set();
    const fresh = freshSince ? new Date(freshSince) : null;
    (att||[]).forEach(a => {
      ever.add(a.question_id);
      if (Number(a.result) < 1) everWeak.add(a.question_id);
      if (fresh && new Date(a.created_at) < fresh) return;
      if (latest[a.question_id] === undefined) { latest[a.question_id] = Number(a.result); src[a.question_id] = a.source; when[a.question_id] = a.created_at; }
    });
    (rev||[]).forEach(r => { if (!reviews[r.question_id]) reviews[r.question_id] = r; });
    const lastAt = att && att[0] ? new Date(att[0].created_at) : null;
    return { latest, src, when, reviews, everWeak, ever, lastAt };
  }
  async function record(sb, profile, qid, result, source){
    await sb("quiz_attempts", { method:"POST", prefer:"return=minimal", body:[{ profile_id: profile.id, question_id: qid, result, source }] });
  }
  function shrink(file){
    return new Promise((resolve, reject) => {
      const img = new Image(), url = URL.createObjectURL(file);
      img.onload = () => {
        const max = 1600, s = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement("canvas"); c.width = Math.round(img.width*s); c.height = Math.round(img.height*s);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
        resolve(c.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("That file isn't an image we can read. Try a photo or screenshot.")); };
      img.src = url;
    });
  }

  // What went wrong last time, in plain words
  function fixNote(q, prog){
    const r = prog.reviews[q.id];
    const recentReview = r && prog.when[q.id] && Math.abs(new Date(r.created_at) - new Date(prog.when[q.id])) < 120000;
    if (recentReview) {
      const tip = ((r.feedback || {}).to_improve || [])[0];
      return `${r.marks_awarded} out of ${r.marks_available} marks.${tip ? " " + tip : ""}`;
    }
    const where = { quiz: "in a quiz", tutor: "with your tutor", written: "in a written answer" }[prog.src[q.id]] || "";
    return prog.latest[q.id] === 0 ? `You didn't know this one yet${where ? " (" + where + ")" : ""}` : `Half right${where ? " " + where : ""}. Nearly there.`;
  }
  const isPast = q => q.qtype === "exam" && !/^exam-style/i.test(q.source || "");
  const shortTitle = q => q.qtype === "exam" ? `${isPast(q) ? "Past paper" : "Exam question"}: ${q.prompt}` : q.prompt;

  // ---- mount ----
  async function mountPractice(slot, opts){
    const { topic, profile, sb, moreSlot, paperSlot, refreshSlot, rightSlot, goTo = () => {}, onStats = () => {}, onStartFresh = async () => {}, hideDuring = [] } = opts;
    const freshSince = typeof opts.freshSince === "function" ? opts.freshSince : () => opts.freshSince || null;
    if (!slot || !topic) return null;
    addCss();
    const questions = await sb(`quiz_questions?select=id,qtype,topic_label,difficulty,prompt,options,answer_index,explanation,model_answer,marking_scheme,source,marks&topic_id=eq.${topic.id}&order=id.asc`);
    if (!questions || !questions.length) return null;
    let prog = await loadProgress(sb, profile, questions, freshSince());
    let session = null;

    const mcq = questions.filter(q => q.qtype === "mcq"), rec = questions.filter(q => q.qtype === "recall"), ex = questions.filter(q => q.qtype === "exam");
    const fixes = () => questions.filter(q => prog.latest[q.id] !== undefined && prog.latest[q.id] < 1).sort((a, b) => prog.latest[a.id] - prog.latest[b.id]);
    const known = () => questions.filter(q => prog.latest[q.id] >= 1);
    const untried = () => questions.filter(q => prog.latest[q.id] === undefined);

    function todaysPick(){
      const pick = fixes().slice(0, 3);
      const fill = (pool, n) => shuffle(pool.filter(q => !pick.includes(q))).slice(0, n).forEach(q => pick.push(q));
      const newMcq = untried().filter(q => q.qtype === "mcq");
      const mcqN = Math.max(0, 8 - pick.length - 2);
      fill(newMcq.length >= mcqN ? newMcq : mcq, mcqN);
      if (!pick.some(q => q.qtype === "recall")) fill(rec, 1);
      if (!pick.some(q => q.qtype === "exam")) fill(ex, 1);
      return pick;
    }
    function todaysCaption(pick){
      const f = pick.filter(q => fixes().includes(q)).length;
      const m = pick.filter(q => q.qtype === "mcq" && !fixes().includes(q)).length;
      const parts = [];
      if (f) parts.push(`${f} to try again`);
      if (m) parts.push(`${m} new multiple choice`);
      if (pick.some(q => q.qtype === "recall" && !fixes().includes(q))) parts.push("1 short answer");
      if (pick.some(q => q.qtype === "exam" && !fixes().includes(q))) parts.push("1 exam question");
      return parts.join(" · ");
    }

    // ---- numbers for the tabs, and the Refresh tab ----
    const weakSpots = () => questions.filter(q => prog.everWeak.has(q.id) || !prog.ever.has(q.id));
    function paintStats(){
      const fx = fixes(), kn = known(), un = untried();
      onStats({ total: questions.length, tried: questions.length - un.length, fixes: fx.length, right: kn.length, triedEver: prog.ever.size, lastAt: prog.lastAt });
      paintRefresh();
    }
    function paintRefresh(){
      if (!refreshSlot) return;
      const ws = weakSpots(), hard = ws.filter(q => prog.everWeak.has(q.id)).length, never = ws.length - hard;
      const fresh = freshSince();
      const parts = [];
      if (hard) parts.push(`the ${plural(hard, "question", "questions")} you found hard before`);
      if (never) parts.push(`${plural(never, "question", "questions")} you never tried`);
      const weakDesc = parts.length ? parts.join(", plus ").replace(/^t/, "T") + "." + (ws.length > 15 ? " Up to 15 at a time, hardest first." : "") : "You've never got one wrong here. Try Start from scratch instead.";
      const wrap = h(`<div><p class="pr-choose-label" style="font-size:18px;color:var(--t-ink);margin:2px 0 8px">How do you want to refresh?</p><div class="pr-refresh">
        <div class="pr-card"><span class="pr-pill">Best when exams are close</span><h3 style="font-size:20px">Focus on weak spots</h3><p class="pr-sub">${esc(weakDesc)}</p><div class="pr-side-btn"><button type="button" class="pr-btn big" data-weak${ws.length ? "" : " disabled"}>Start</button></div></div>
        <div class="pr-card"><span class="pr-pill" style="visibility:hidden">.</span><h3 style="font-size:20px">Start from scratch</h3><p class="pr-sub">Every question comes back as new. Your first results are kept, so you'll see how much stuck.</p>${fresh ? `<p class="pr-small">You started fresh on ${esc(new Date(fresh).toLocaleDateString("en-IE", { day:"numeric", month:"short" }))}: ${plural(known().length, "right", "right")} so far, ${fixes().length} to fix, ${untried().length} to go.</p>` : ""}<div class="pr-side-btn"><button type="button" class="pr-btn big ghost" data-fresh>${fresh ? "Start fresh again" : "Start fresh"}</button></div></div>
      </div></div>`);
      wrap.querySelector("[data-weak]").onclick = () => {
        const hardOnes = shuffle(ws.filter(q => prog.everWeak.has(q.id))), newOnes = shuffle(ws.filter(q => !prog.everWeak.has(q.id)));
        goTo("test"); start("Weak Spots", hardOnes.concat(newOnes).slice(0, 15));
      };
      wrap.querySelector("[data-fresh]").onclick = async (e) => {
        e.target.disabled = true; e.target.textContent = "Starting…";
        await onStartFresh();
        prog = await loadProgress(sb, profile, questions, freshSince());
        paintStats(); home(); goTo("test"); start("Your Daily Practice", todaysPick());
      };
      refreshSlot.replaceChildren(wrap);
    }

    // ---- Test tab ----
    function setChrome(show){ hideDuring.forEach(el => { if (el) el.hidden = !show; }); }
    function home(){
      session = null; setChrome(true);
      const pick = todaysPick(), fx = fixes();
      const hero = h(`<div class="pr-card pr-hero">
          <span class="pr-hero-title">Your Daily Practice</span>
          <span class="pr-sub">10 minutes · ${esc(todaysCaption(pick))}</span>
          <button type="button" class="pr-btn big" data-today>Start my 10 minutes</button></div>`);
      hero.querySelector("[data-today]").onclick = () => start("Your Daily Practice", pick);
      const nodes = [hero];
      if (ex.length) {
        const paper = h(`<button type="button" class="ft">
          <span class="ft-icon">${PAPER_SVG}</span>
          <span class="ft-body"><span class="ft-tag">Marked like the real exam</span><span class="ft-title">Exam Question Practice</span><span class="ft-line">${ex.some(isPast) ? plural(ex.length, "past paper question", "past paper questions") : plural(ex.length, "exam-style question", "exam-style questions")}, with marks and tips</span></span>
          <span class="ft-chev" aria-hidden="true">›</span></button>`);
        paper.onclick = () => start("Exam Question Practice", ex.slice());
        if (paperSlot) paperSlot.replaceChildren(paper); else nodes.push(paper);
      }
      slot.replaceChildren(...nodes);

      if (moreSlot) {
        const box = h(`<div class="pr-choices"><p class="pr-choose-label">Quick options</p></div>`);
        const add = (title, note, fn, disabled, badge) => {
          const b = h(`<button type="button" class="pr-choice"${disabled ? " disabled" : ""}><span class="pr-li-body"><span class="pr-li-title">${esc(title)}</span><span class="pr-li-note">${esc(note)}</span></span>${badge ? `<span class="pr-badge">${badge}</span>` : ""}<span class="pr-chev" aria-hidden="true">›</span></button>`);
          b.onclick = fn; box.append(b);
        };
        add("Try Again", fx.length ? "Questions you got wrong last time" : "Nothing to fix right now", () => start("Try Again", fx), !fx.length, fx.length || "");
        add("Quick Quiz", "Multiple choice, one tap answers", () => start("Quick Quiz", shuffle(mcq)), !mcq.length);
        if (rec.length) add("Short Answer Practice", "Write a line or two, then compare", () => start("Short Answer Practice", shuffle(rec)));
        moreSlot.replaceChildren(box);
      }
      if (rightSlot) {
        const kn = known();
        rightSlot.replaceChildren();
        if (kn.length) {
          const d = h(`<div class="pr-right" style="padding:8px 0 0"><strong style="font-size:15px">Questions you've got right (${kn.length})</strong><ol></ol></div>`);
          kn.forEach(q => d.querySelector("ol").append(h(`<li>${esc(shortTitle(q))}</li>`)));
          rightSlot.append(d);
          const box2 = rightSlot.closest("details"); if (box2 && !session) box2.hidden = false;
        }
      }
    }

    function start(name, list){
      if (!list || !list.length) return;
      session = { name, queue: list.map(q => ({ q, retry:false })), i:0, results:[], total:list.length, t0: Date.now() };
      setChrome(false);
      next();
    }

    function next(){
      if (session.i >= session.queue.length) return finish();
      const { q, retry } = session.queue[session.i];
      const label = q.qtype === "exam" ? (isPast(q) ? `Past paper · ${esc(q.source || "")} · ${q.marks || 5} marks` : `Exam-style question · ${q.marks || 5} marks`) : q.qtype === "recall" ? "Short answer" : "Quick quiz";
      const card = h(`<div class="pr-card">
        <div class="pr-row" style="justify-content:space-between"><button type="button" class="pr-btn ghost" data-stop>Stop</button><span class="pr-small" style="font-variant-numeric:tabular-nums">${retry ? "Second try" : `Question ${session.i+1} of ${session.total}`}</span></div>
        <div class="pr-progress"><i style="width:${Math.min(session.i,session.total)/session.total*100}%"></i></div>
        <div class="pr-meta"><span>${label}</span></div>
        <p class="pr-q">${esc(q.prompt)}</p></div>`);
      card.querySelector("[data-stop]").onclick = () => session.results.length ? finish() : home();
      session.t0 = session.t0 || Date.now();
      if (q.qtype === "mcq") mcqView(card, q, retry); else writtenView(card, q, retry);
      slot.replaceChildren(card);
      card.scrollIntoView({ block:"start", behavior:"smooth" });
    }

    function nextBtn(card){
      const b = h(`<div class="pr-row"><button type="button" class="pr-btn">Next</button></div>`);
      b.querySelector("button").onclick = () => { session.i++; next(); };
      card.append(b); b.querySelector("button").focus({ preventScroll:true });
    }
    const save = async (qid, v, source) => { await record(sb, profile, qid, v, source); prog = await loadProgress(sb, profile, questions, freshSince()); paintStats(); };
    function logTime(s){
      if (!s || !s.results.length) return;
      const sec = Math.min(Math.round((Date.now() - s.t0) / 1000), s.results.length * 300 + 60, 7200);
      if (sec > 0) sb("study_time", { method:"POST", prefer:"return=minimal", body:[{ profile_id: profile.id, topic_id: topic.id, kind:"test", seconds: sec }] });
    }

    function mcqView(card, q, retry){
      const opts = h(`<div class="pr-opts"></div>`), order = shuffle((q.options||[]).map((o,i)=>i));
      order.forEach((oi, pos) => {
        const b = h(`<button type="button" class="pr-opt"><b>${L[pos]}</b><span>${esc(q.options[oi])}</span></button>`);
        b.onclick = () => {
          const ok = oi === q.answer_index;
          opts.querySelectorAll(".pr-opt").forEach((x,p) => { x.disabled = true; if (order[p] === q.answer_index) x.classList.add("right"); });
          if (!ok) b.classList.add("wrong");
          if (!retry) { session.results.push({ q, v: ok?1:0 }); save(q.id, ok?1:0, "quiz"); }
          if (!ok && !retry) session.queue.push({ q, retry:true });
          card.append(h(`<div class="pr-fb ${ok?"good":""}"><strong>${ok?"Correct.":"Not this one."}</strong><span>${esc(q.explanation||"")}</span>${!ok&&!retry?`<span class="pr-tip">You'll get another go at the end.</span>`:""}</div>`));
          nextBtn(card);
        };
        opts.append(b);
      });
      card.append(opts);
    }

    function writtenView(card, q, retry){
      const images = [], isExam = q.qtype === "exam";
      const box = h(`<div style="display:flex;flex-direction:column;gap:10px">
        <p class="pr-tip">Type your answer, tap the microphone to speak it, or add a photo of a written answer.</p>
        ${SR ? "" : speakTip()}
        <div class="pr-answer">
          <textarea aria-label="Your answer" placeholder="Your answer"></textarea>
          <div class="pr-tools" data-inputs><label class="pr-icon" title="Add a photo of your answer" aria-label="Add a photo of your answer">${CAM_SVG}<input type="file" accept="image/*" multiple></label></div>
        </div>
        <div class="pr-thumbs"></div>
        <div class="pr-row"><button type="button" class="pr-btn" data-fb>Check my answer</button><button type="button" class="pr-btn ghost" data-self>Just show the answer</button></div>
        <p class="pr-err" hidden></p></div>`);
      const ta = box.querySelector("textarea"), thumbs = box.querySelector(".pr-thumbs"), file = box.querySelector("input[type=file]"), err = box.querySelector(".pr-err");
      const fbBtn = box.querySelector("[data-fb]"), selfBtn = box.querySelector("[data-self]");
      const inputsRow = box.querySelector("[data-inputs]");
      attachMic(inputsRow, ta, err);
      const stopMic = () => { if (inputsRow._stopMic) inputsRow._stopMic(); };
      if (file) file.onchange = async () => {
        err.hidden = true;
        for (const f of Array.from(file.files || []).slice(0, 3 - images.length)) {
          try { const d = await shrink(f); images.push(d); thumbs.append(h(`<img alt="Your answer photo ${images.length}" src="${d}">`)); }
          catch (e) { err.textContent = e.message; err.hidden = false; }
        }
        file.value = "";
      };
      const done = (v, source) => { if (!retry) { session.results.push({ q, v }); save(q.id, v, source); } };
      const modelBlock = () => `<details><summary>${isExam ? "See the model answer and marking scheme" : "See a good answer"}</summary><div class="pr-fb" style="margin-top:8px"><span>${esc(q.model_answer||"")}</span>${q.marking_scheme?`<span class="pr-scheme"><strong>Marking scheme:</strong> ${esc(q.marking_scheme)}</span>`:""}</div></details>`;

      fbBtn.onclick = async () => {
        stopMic();
        const text = ta.value.trim();
        if (!text && !images.length) { err.textContent = "Type, speak or add a photo of your answer first, or use Just show the answer."; err.hidden = false; return; }
        fbBtn.disabled = selfBtn.disabled = true; fbBtn.textContent = "Reading your answer…"; err.hidden = true;
        try {
          const r = await fetch("/api/mark-answer", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ question_id: q.id, answer_text: text, images }) });
          const data = await r.json().catch(() => ({}));
          if (!r.ok || !data.feedback) throw new Error(data.error || "Feedback couldn't be generated.");
          const f = data.feedback, frac = f.marks_available ? f.marks_awarded / f.marks_available : 0;
          const v = frac >= 0.8 ? 1 : frac >= 0.4 ? 0.5 : 0;
          await sb("answer_reviews", { method:"POST", prefer:"return=minimal", body:[{ profile_id: profile.id, question_id: q.id, answer_text: text || f.transcription || null, marks_awarded: f.marks_awarded, marks_available: f.marks_available, feedback: f }] });
          done(v, "written");
          box.remove();
          const list = a => a.length ? `<ul>${a.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>` : "";
          card.append(h(`<div class="pr-fb ${v===1?"good":""}">
            <div class="pr-row" style="gap:16px">${isExam ? `<span class="pr-score">${f.marks_awarded}/${f.marks_available}</span>` : ""}<span>${esc(f.summary||"")}</span></div>
            ${f.went_well.length ? `<h4>What you got right</h4>${list(f.went_well)}` : ""}
            ${f.to_improve.length ? `<h4>${isExam ? "How to get more marks" : "To make it better"}</h4>${list(f.to_improve)}` : ""}
            ${f.example ? `<h4>For example</h4><span>${esc(f.example)}</span>` : ""}
          </div>`));
          card.append(h(modelBlock()));
          nextBtn(card);
        } catch (e) {
          err.textContent = e.message + " You can still check it yourself with Just show the answer."; err.hidden = false;
          fbBtn.disabled = selfBtn.disabled = false; fbBtn.textContent = "Check my answer";
        }
      };

      selfBtn.onclick = () => {
        stopMic();
        box.remove();
        card.append(h(`<div class="pr-fb"><strong>${isExam?"Model answer":"A good answer"}</strong><span>${esc(q.model_answer||"")}</span>${q.marking_scheme?`<span class="pr-scheme"><strong>Marking scheme:</strong> ${esc(q.marking_scheme)}</span>`:""}</div>`));
        const r = h(`<div style="display:flex;flex-direction:column;gap:10px"><strong style="font-size:17px">How did you do?</strong><div class="pr-rate"><button type="button">Got it</button><button type="button">Half right</button><button type="button">Not yet</button></div></div>`);
        [1, 0.5, 0].forEach((v, i) => r.querySelectorAll("button")[i].onclick = () => { done(v, "quiz"); session.i++; next(); });
        card.append(r);
      };
      card.append(box);
    }

    function finish(){
      const R = session.results, good = R.filter(r => r.v >= 1), gaps = R.filter(r => r.v < 1);
      const card = h(`<div class="pr-card"><h3>${esc(session.name)}: done</h3>
        <p class="pr-next">${R.length ? `You answered ${plural(R.length, "question", "questions")}. ${plural(good.length, "was", "were")} right${gaps.length ? `, and ${plural(gaps.length, "goes", "go")} on your Try Again list` : ""}.` : "No answers saved this time."}</p>
        ${gaps.length ? `<div class="pr-fb"><h4>To try again next time</h4><ul>${gaps.map(r=>`<li>${esc(shortTitle(r.q))}</li>`).join("")}</ul><span class="pr-tip">Your tutor will start with these too.</span></div>` : ""}
        <div class="pr-row"><button type="button" class="pr-btn" data-home>Back to Test</button></div></div>`);
      card.querySelector("[data-home]").onclick = () => home();
      logTime(session);
      session = null;
      slot.replaceChildren(card);
      card.scrollIntoView({ block:"start", behavior:"smooth" });
    }

    window.addEventListener("study-progress", async () => {
      if (!slot.isConnected) return;
      prog = await loadProgress(sb, profile, questions, freshSince()); paintStats(); if (!session) home();
    });

    paintStats();
    home();
    return { refresh: paintStats, startToday: () => start("Your Daily Practice", todaysPick()) };
  }
  window.mountPractice = mountPractice;
})();
