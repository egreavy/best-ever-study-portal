// Chapter Progress and Test tabs: progress steps, questions to fix, quizzes,
// short answers and past paper questions with marking.
// All results go to quiz_attempts, which the voice tutor also reads and writes,
// so each one picks up from the others.
(function(){
  const css = `
  .pr-card{background:#fff;border-radius:14px;padding:16px 20px;margin:0 0 10px;display:flex;flex-direction:column;gap:10px}
  .pr-card h3{margin:0;font-size:17px;font-weight:700;line-height:1.3}
  .pr-sub{margin:0;color:#5B6470;font-size:15px;line-height:1.45}
  .pr-small{margin:0;color:#5B6470;font-size:14px;line-height:1.45}
  .pr-steps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
  .pr-step{display:flex;flex-direction:column;gap:4px}
  .pr-step b{font-size:15px}
  .pr-step span{font-size:14px;color:#5B6470}
  .pr-bar{height:8px;border-radius:99px;background:#DDE1E5;overflow:hidden;margin-bottom:2px}
  .pr-bar i{display:block;height:100%;background:#1F2328;border-radius:99px}
  .pr-next{margin:0;font-size:15px;line-height:1.5}
  .pr-headrow{display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap}
  .pr-list{display:flex;flex-direction:column}
  .pr-li{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:10px 0;border-top:1px solid #DDE1E5}
  .pr-li:last-child{border-bottom:1px solid #DDE1E5}
  .pr-li-body{display:flex;flex-direction:column;gap:2px;min-width:0}
  .pr-li-title{font-size:16px;font-weight:700;line-height:1.4}
  .pr-li-note{font-size:14px;color:#5B6470;line-height:1.4}
  .pr-card details summary{cursor:pointer;font-weight:700;font-size:15px;padding:2px 0}
  .pr-card details ol{margin:8px 0 0;padding-left:22px;display:flex;flex-direction:column;gap:6px;font-size:14px;line-height:1.45;color:#3d454f}
  .pr-hero{flex-direction:row;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}
  .pr-hero-text{display:flex;flex-direction:column;gap:2px;min-width:0;flex:1 1 260px}
  .pr-pair{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:10px;margin:0 0 10px}
  .pr-pair>:empty{display:none}
  .pr-pair[hidden]{display:none}
  .pr-mic{border-color:#1F2328;color:#1F2328;background:#fff}
  .pr-mic.on{background:#1F2328;color:#fff;animation:prPulse 1.6s ease-out infinite}
  @keyframes prPulse{0%{box-shadow:0 0 0 0 rgba(31,35,40,.3)}100%{box-shadow:0 0 0 10px rgba(31,35,40,0)}}
  @media (prefers-reduced-motion:reduce){.pr-mic.on{animation:none}}
  .pr-pair .pr-paper{height:100%;box-sizing:border-box}
  .pr-side{gap:6px}
  .pr-side .pr-side-btn{margin-top:auto;padding-top:6px}
  .pr-mix{font-size:13px;color:#5B6470}
  .pr-mix summary{cursor:pointer;font-weight:400;font-size:13px}
  .pr-pair>.pr-card,.pr-pair>*{margin:0}
    .pr-eyebrow{font-size:12px;font-weight:700;color:#5B6470;text-transform:uppercase;letter-spacing:.06em}
  .pr-choose-label{font-size:14px;font-weight:700;color:#5B6470;margin:4px 0 6px}
  .pr-choices{background:#fff;border-radius:14px;padding:2px 20px;margin:0 0 10px;display:flex;flex-direction:column}
  .pr-choice{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:11px 0;border:none;border-bottom:1px solid #DDE1E5;background:none;text-align:left;font:inherit;color:inherit;cursor:pointer;width:100%}
  .pr-choice:last-child{border-bottom:none}
  .pr-choice:hover .pr-li-title{text-decoration:underline}
  .pr-choice[disabled]{opacity:.5;cursor:default}
  .pr-chev{font-size:20px;color:#5B6470;flex:none}
  .pr-btn{border:2px solid #1F6F5C;background:#1F6F5C;color:#fff;border-radius:999px;padding:8px 18px;font-weight:700;font-size:15px;cursor:pointer;font-family:inherit;min-height:40px;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;white-space:nowrap}
  .pr-btn.big{font-size:16px;padding:11px 24px;min-height:46px}
  .pr-btn.ghost{background:#fff;color:#1F6F5C}
  .pr-btn.dark{background:#1F2328;border-color:#1F2328}
  .pr-btn[disabled]{opacity:.6;cursor:default}
  .pr-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
  .pr-q{font-size:18px;font-weight:700;line-height:1.5;margin:0}
  .pr-meta{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;font-size:14px;color:#5B6470}
  .pr-progress{height:6px;background:#DDE1E5;border-radius:99px;overflow:hidden}.pr-progress i{display:block;height:100%;background:#1F2328}
  .pr-opts{display:flex;flex-direction:column;gap:8px}
  .pr-opt{text-align:left;border:2px solid #DDE1E5;background:#fff;border-radius:12px;padding:10px 14px;min-height:46px;display:flex;gap:12px;align-items:flex-start;cursor:pointer;font:inherit;font-size:16px;color:inherit;line-height:1.45}
  .pr-opt b{flex:none;width:24px;height:24px;border-radius:50%;background:#EEF0F2;display:grid;place-items:center;font-size:13px}
  .pr-opt:hover:not(:disabled){border-color:#1F2328}
  .pr-opt.right{border-color:#1F6F5C;background:#EAF3F0}.pr-opt.wrong{border-color:#1F2328;background:#F1F2F4}.pr-opt:disabled{cursor:default}
  .pr-fb{border-radius:12px;padding:12px 14px;display:flex;flex-direction:column;gap:6px;font-size:15px;line-height:1.5;background:#F4F5F6}
  .pr-fb.good{background:#EAF3F0}
  .pr-fb h4{margin:2px 0 0;font-size:15px}
  .pr-fb ul{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:3px}
  .pr-scheme{border-left:4px solid #DDE1E5;padding-left:10px;color:#5B6470;font-size:14px}
  .pr-card textarea{width:100%;box-sizing:border-box;min-height:110px;font:inherit;font-size:16px;line-height:1.5;border:2px solid #DDE1E5;border-radius:12px;padding:10px 12px;background:#F4F5F6;color:inherit;resize:vertical}
  .pr-card textarea:focus{outline:3px solid #1F6F5C;outline-offset:1px}
  .pr-tip{font-size:14px;color:#5B6470;margin:0;line-height:1.45}
  .pr-thumbs{display:flex;gap:8px;flex-wrap:wrap}.pr-thumbs img{width:72px;height:72px;object-fit:cover;border-radius:10px;border:1px solid #DDE1E5}
  .pr-thumbs:empty{display:none}
  .pr-rate{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
  .pr-rate button{border:2px solid #1F2328;background:#fff;border-radius:12px;padding:8px 6px;cursor:pointer;font:inherit;font-weight:700;font-size:15px;min-height:44px;color:#1F2328}
  .pr-score{font-size:30px;font-weight:700;line-height:1;font-variant-numeric:tabular-nums}
  .pr-err{color:#a32020;font-size:14px;margin:0}
  .pr-card button:focus-visible,.pr-choice:focus-visible,.pr-btn:focus-visible{outline:3px solid #1F6F5C;outline-offset:3px}
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
  function attachMic(row, ta, status){
    if (!SR) return false;
    const btn = h(`<button type="button" class="pr-btn pr-mic" aria-pressed="false">Speak my answer</button>`);
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
          : e.error === "no-speech" ? "Didn't hear anything. Tap Speak my answer and try again." : "Speaking didn't work this time. Try again, or type your answer.";
        status.hidden = false;
      };
      rec.onend = () => { rec = null; btn.classList.remove("on"); btn.textContent = "Speak my answer"; btn.setAttribute("aria-pressed", "false"); base = ta.value; };
      try {
        rec.start(); status.hidden = true;
        btn.classList.add("on"); btn.textContent = "Stop speaking"; btn.setAttribute("aria-pressed", "true");
      } catch (e) { rec = null; }
    };
    row._stopMic = stop;
    return true;
  }
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

  // ---- data ----
  async function loadProgress(sb, profile, questions){
    const ids = questions.map(q => q.id);
    if (!ids.length) return { latest:{}, src:{}, reviews:{} };
    const inIds = ids.map(encodeURIComponent).join(",");
    const [att, rev] = await Promise.all([
      sb(`quiz_attempts?select=question_id,result,source,created_at&profile_id=eq.${profile.id}&question_id=in.(${inIds})&order=created_at.desc&limit=1000`),
      sb(`answer_reviews?select=question_id,marks_awarded,marks_available,feedback,created_at&profile_id=eq.${profile.id}&question_id=in.(${inIds})&order=created_at.desc&limit=200`)
    ]);
    const latest = {}, src = {}, when = {}, reviews = {};
    (att||[]).forEach(a => { if (latest[a.question_id] === undefined) { latest[a.question_id] = Number(a.result); src[a.question_id] = a.source; when[a.question_id] = a.created_at; } });
    (rev||[]).forEach(r => { if (!reviews[r.question_id]) reviews[r.question_id] = r; });
    return { latest, src, when, reviews };
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
  const shortTitle = q => q.qtype === "exam" ? `Past paper: ${q.prompt}` : q.prompt;

  // ---- mount ----
  async function mountPractice(slot, opts){
    const { topic, profile, sb, progressSlot, moreSlot, paperSlot, goTo = () => {}, learn = () => ({ done:0, total:0 }), hideDuring = [] } = opts;
    if (!slot || !topic) return null;
    addCss();
    const questions = await sb(`quiz_questions?select=id,qtype,topic_label,difficulty,prompt,options,answer_index,explanation,model_answer,marking_scheme,source,marks&topic_id=eq.${topic.id}&order=id.asc`);
    if (!questions || !questions.length) return null;
    let prog = await loadProgress(sb, profile, questions);
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
      if (pick.some(q => q.qtype === "exam" && !fixes().includes(q))) parts.push("1 past paper question");
      return parts.join(" · ");
    }

    // ---- Progress tab ----
    function paintProgress(){
      if (!progressSlot) return;
      const l = learn(), fx = fixes(), kn = known(), tried = questions.length - untried().length;
      const learnWord = !l.total ? "Nothing to learn yet" : l.done === 0 ? "Not started" : l.done >= l.total ? "Done" : l.done / l.total >= 0.5 ? "Nearly done" : "Started";
      const testWord = tried === 0 ? "Not started" : tried >= questions.length ? "All tried" : tried / questions.length >= 0.5 ? "Well under way" : "Started";
      const knowRatio = kn.length / questions.length;
      const knowWord = knowRatio >= 0.8 ? "You know it" : knowRatio >= 0.4 ? "Getting there" : "Not yet";
      let next;
      const learnPart = l.total && l.done >= l.total ? "You've finished the learning. " : l.total && l.done / l.total >= 0.5 ? "You've read and watched most of it. " : "";
      if (!tried && l.total && l.done < l.total) next = "Start with Learn: read, watch or listen. Then test yourself to see what stuck.";
      else if (fx.length) next = `${learnPart}Next, try the ${fx.length === 1 ? "question" : fx.length + " questions"} below again, then some new ones.`;
      else if (untried().length) next = `${learnPart}Next, try some new questions to see what's stuck.`;
      else next = "You know this chapter well. A quick go now and then keeps it fresh.";
      const goLearn = !tried && l.total && l.done < l.total;
      const card = h(`<div class="pr-card">
        <h3>Where you are with this chapter</h3>
        <div class="pr-steps">
          <div class="pr-step"><div class="pr-bar"><i style="width:${l.total ? Math.round(l.done / l.total * 100) : 0}%"></i></div><b>1. Learn it</b><span>${learnWord}</span></div>
          <div class="pr-step"><div class="pr-bar"><i style="width:${Math.round(tried / questions.length * 100)}%"></i></div><b>2. Test it</b><span>${testWord}</span></div>
          <div class="pr-step"><div class="pr-bar"><i style="width:${Math.round(knowRatio * 100)}%"></i></div><b>3. Know it</b><span>${knowWord}</span></div>
        </div>
        <div class="pr-headrow"><p class="pr-next">${esc(next)}</p><button type="button" class="pr-btn" data-go>${goLearn ? "Go to Learn" : "Start my 10 minutes"}</button></div>
      </div>`);
      card.querySelector("[data-go]").onclick = () => { if (goLearn) goTo("learn"); else { goTo("test"); start("Your Daily Practice", todaysPick()); } };

      const fixCard = h(`<div class="pr-card"><div style="display:flex;flex-direction:column;gap:2px"><h3>Try Again</h3><p class="pr-sub">${fx.length ? "Get one right and it comes off this list." : tried ? "Nothing to try again right now. Nice work." : "Questions you get wrong or half right will show up here."}</p></div></div>`);
      if (fx.length) {
        const list = h(`<div class="pr-list"></div>`);
        fx.slice(0, 8).forEach(q => {
          const li = h(`<div class="pr-li"><div class="pr-li-body"><span class="pr-li-title">${esc(shortTitle(q))}</span><span class="pr-li-note">${esc(fixNote(q, prog))}</span></div><button type="button" class="pr-btn ghost">${prog.reviews[q.id] ? "Try again" : "Try it"}</button></div>`);
          li.querySelector("button").onclick = () => { goTo("test"); start("Try Again", [q, ...fixes().filter(x => x !== q)]); };
          list.append(li);
        });
        fixCard.append(list);
        if (fx.length > 8) fixCard.append(h(`<p class="pr-small">And ${fx.length - 8} more. "Try Again" on the Test tab goes through them all.</p>`));
      }
      if (kn.length) {
        const d = h(`<details><summary>Questions you've got right (${kn.length})</summary><ol></ol></details>`);
        kn.forEach(q => d.querySelector("ol").append(h(`<li>${esc(shortTitle(q))}</li>`)));
        fixCard.append(d);
      }
      progressSlot.replaceChildren(card, fixCard);
    }

    // ---- Test tab ----
    function setChrome(show){ hideDuring.forEach(el => { if (el) el.hidden = !show; }); }
    function home(){
      session = null; setChrome(true);
      const pick = todaysPick(), fx = fixes();
      const hero = h(`<div class="pr-card pr-hero">
        <div class="pr-hero-text">
          <span class="pr-eyebrow">Recommended · 10 minutes</span>
          <span class="pr-li-title" style="font-size:18px">Your Daily Practice</span>
          <span class="pr-small">A 10-minute mix of questions to refresh your knowledge and work on weaker areas.</span>
          <details class="pr-mix"><summary>What's in today's mix</summary>${esc(todaysCaption(pick))}</details>
        </div>
        <button type="button" class="pr-btn big" data-today>Start my 10 minutes</button></div>`);
      hero.querySelector("[data-today]").onclick = () => start("Your Daily Practice", pick);
      const nodes = [hero];
      if (ex.length) {
        const paper = h(`<div class="pr-card pr-paper pr-side">
          <span class="pr-eyebrow">${plural(ex.length, "question", "questions")} available</span>
          <span class="pr-li-title">Exam Question Practice</span>
          <span class="pr-li-note">Answer real Leaving Cert questions. Type, write or upload a photo of your answer for marks and feedback.</span>
          <div class="pr-side-btn"><button type="button" class="pr-btn ghost">Practise exam questions</button></div></div>`);
        paper.querySelector("button").onclick = () => start("Exam Question Practice", ex.slice());
        if (paperSlot) paperSlot.replaceChildren(paper); else nodes.push(paper);
      }
      slot.replaceChildren(...nodes);

      if (moreSlot) {
        const box = h(`<div><p class="pr-choose-label">Or choose</p><div class="pr-choices"></div></div>`);
        const list = box.querySelector(".pr-choices");
        const add = (title, note, fn, disabled) => {
          const b = h(`<button type="button" class="pr-choice"${disabled ? " disabled" : ""}><span class="pr-li-body"><span class="pr-li-title">${esc(title)}</span><span class="pr-li-note">${esc(note)}</span></span><span class="pr-chev" aria-hidden="true">›</span></button>`);
          b.onclick = fn; list.append(b);
        };
        add("Try Again", fx.length ? "Retry questions you got wrong or partly right and improve your answers." : "Nothing to retry right now. Questions you get wrong or partly right will appear here.", () => start("Try Again", fx), !fx.length);
        add("Quick Quiz", "Choose the correct answer from four options and check what you know.", () => start("Quick Quiz", shuffle(mcq)), !mcq.length);
        if (rec.length) add("Short Answer Practice", "Write a brief answer, then compare it with a model answer to see what you missed.", () => start("Short Answer Practice", shuffle(rec)));
        moreSlot.replaceChildren(box);
      }
    }

    function start(name, list){
      if (!list || !list.length) return;
      session = { name, queue: list.map(q => ({ q, retry:false })), i:0, results:[], total:list.length };
      setChrome(false);
      next();
    }

    function next(){
      if (session.i >= session.queue.length) return finish();
      const { q, retry } = session.queue[session.i];
      const label = q.qtype === "exam" ? `Past paper · ${esc(q.source || "")} · ${q.marks || 5} marks` : q.qtype === "recall" ? "Short answer" : "Quick quiz";
      const card = h(`<div class="pr-card">
        <div class="pr-row" style="justify-content:space-between"><button type="button" class="pr-btn ghost" data-stop>Stop</button><span class="pr-small" style="font-variant-numeric:tabular-nums">${retry ? "Second try" : `Question ${session.i+1} of ${session.total}`}</span></div>
        <div class="pr-progress"><i style="width:${Math.min(session.i,session.total)/session.total*100}%"></i></div>
        <div class="pr-meta"><span>${label}</span></div>
        <p class="pr-q">${esc(q.prompt)}</p></div>`);
      card.querySelector("[data-stop]").onclick = () => session.results.length ? finish() : home();
      if (q.qtype === "mcq") mcqView(card, q, retry); else writtenView(card, q, retry);
      slot.replaceChildren(card);
      card.scrollIntoView({ block:"start", behavior:"smooth" });
    }

    function nextBtn(card){
      const b = h(`<div class="pr-row"><button type="button" class="pr-btn">Next</button></div>`);
      b.querySelector("button").onclick = () => { session.i++; next(); };
      card.append(b); b.querySelector("button").focus({ preventScroll:true });
    }
    const save = async (qid, v, source) => { await record(sb, profile, qid, v, source); prog = await loadProgress(sb, profile, questions); paintProgress(); };

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
      const box = h(`<div style="display:flex;flex-direction:column;gap:12px">
        <p class="pr-tip">${isExam ? "Write your answer on paper and add a photo, speak it, or type it here." : "Speak or type your answer, then check it."}</p>
        ${SR ? "" : speakTip()}
        <textarea aria-label="Your answer" placeholder="${isExam ? "Type your answer (or add a photo below)" : "Type your answer (optional)"}"></textarea>
        <div class="pr-thumbs"></div>
        <div class="pr-row" data-inputs>${isExam ? `<label class="pr-btn ghost">Add a photo or screenshot<input type="file" accept="image/*" multiple hidden></label>` : ""}</div>
        <div class="pr-row"><button type="button" class="pr-btn" data-fb>${isExam ? "Mark my answer" : "Check my answer"}</button><button type="button" class="pr-btn ghost" data-self>Just show the answer</button></div>
        <p class="pr-err" hidden></p></div>`);
      const ta = box.querySelector("textarea"), thumbs = box.querySelector(".pr-thumbs"), file = box.querySelector("input[type=file]"), err = box.querySelector(".pr-err");
      const fbBtn = box.querySelector("[data-fb]"), selfBtn = box.querySelector("[data-self]");
      const inputsRow = box.querySelector("[data-inputs]");
      attachMic(inputsRow, ta, err);
      if (!inputsRow.children.length) inputsRow.remove();
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
        if (!text && !images.length) { err.textContent = isExam ? "Type an answer or add a photo first." : "Type your answer first, or use Just show the answer."; err.hidden = false; return; }
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
          fbBtn.disabled = selfBtn.disabled = false; fbBtn.textContent = isExam ? "Mark my answer" : "Check my answer";
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
        <div class="pr-row"><button type="button" class="pr-btn" data-home>Back to Test</button><button type="button" class="pr-btn ghost" data-prog>See my progress</button></div></div>`);
      card.querySelector("[data-home]").onclick = () => home();
      card.querySelector("[data-prog]").onclick = () => { home(); goTo("progress"); };
      session = null;
      slot.replaceChildren(card);
      card.scrollIntoView({ block:"start", behavior:"smooth" });
    }

    window.addEventListener("study-progress", async () => {
      if (!slot.isConnected) return;
      prog = await loadProgress(sb, profile, questions); paintProgress(); if (!session) home();
    });

    paintProgress();
    home();
    return { refresh: paintProgress, startToday: () => start("Your Daily Practice", todaysPick()) };
  }
  window.mountPractice = mountPractice;
})();
