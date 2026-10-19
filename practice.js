// Chapter practice: progress summary, quizzes, exam questions and answer feedback.
// All results go to quiz_attempts, which the voice tutor also reads and writes,
// so each one picks up from the other.
(function(){
  const css = `
  .pr-card{background:#fff;border:1px solid var(--card-border,#e6e3da);border-radius:18px;padding:20px;margin:16px 0;display:flex;flex-direction:column;gap:14px}
  .pr-card h3{margin:0;font-size:17px;font-weight:800}
  .pr-sub{margin:0;color:var(--sub,#6b6b64);font-size:14px}
  .pr-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px}
  .pr-stat{border-radius:14px;padding:12px 14px;display:flex;flex-direction:column;gap:2px}
  .pr-stat b{font-size:24px;font-variant-numeric:tabular-nums;line-height:1.1}
  .pr-stat span{font-size:13px;font-weight:700}
  .pr-g{background:#e3f3ea;color:#1a6b42}.pr-p{background:#fbf0dd;color:#8a5a12}.pr-n{background:#fbe4e4;color:#9b2c2c}.pr-u{background:var(--bg,#f3f1ec);color:var(--sub,#6b6b64)}
  .pr-topics{display:flex;flex-direction:column;gap:8px}
  .pr-trow{display:grid;grid-template-columns:1fr auto;gap:4px 10px;align-items:center;font-size:14px}
  .pr-bar{grid-column:1/-1;height:8px;background:var(--track,#e6e1d2);border-radius:99px;overflow:hidden}
  .pr-bar i{display:block;height:100%}
  .pr-pill{font-size:12px;font-weight:800;padding:2px 10px;border-radius:99px;font-variant-numeric:tabular-nums}
  .pr-list{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:8px;font-size:14.5px;line-height:1.5}
  .pr-list .pr-why{display:block;color:var(--sub,#6b6b64);font-size:13px}
  .pr-card details summary{cursor:pointer;font-weight:800;font-size:14.5px}
  .pr-modes{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px}
  .pr-mode{text-align:left;border:2px solid var(--card-border,#e6e3da);background:#fff;border-radius:14px;padding:14px 16px;cursor:pointer;display:flex;flex-direction:column;gap:3px;font:inherit;color:inherit}
  .pr-mode:hover{border-color:var(--accent,#0f6e5c)}
  .pr-mode.main{border-color:var(--accent,#0f6e5c);background:var(--accent-soft,#dcefe7)}
  .pr-mode strong{font-size:15px}.pr-mode span{font-size:13px;color:var(--sub,#6b6b64)}
  .pr-q{font-size:18px;font-weight:700;line-height:1.55;margin:0}
  .pr-meta{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;font-size:13px;color:var(--sub,#6b6b64)}
  .pr-tag{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:var(--accent,#0f6e5c);background:var(--accent-soft,#dcefe7);padding:3px 10px;border-radius:99px}
  .pr-progress{height:7px;background:var(--track,#e6e1d2);border-radius:99px;overflow:hidden}.pr-progress i{display:block;height:100%;background:var(--accent,#0f6e5c)}
  .pr-opts{display:flex;flex-direction:column;gap:10px}
  .pr-opt{text-align:left;border:2px solid var(--card-border,#e6e3da);background:#fff;border-radius:12px;padding:13px 15px;min-height:52px;display:flex;gap:12px;align-items:flex-start;cursor:pointer;font:inherit;font-size:16px;color:inherit;line-height:1.45}
  .pr-opt b{flex:none;width:26px;height:26px;border-radius:50%;background:var(--accent-soft,#dcefe7);color:var(--accent,#0f6e5c);display:grid;place-items:center;font-size:13px}
  .pr-opt:hover:not(:disabled){border-color:var(--accent,#0f6e5c)}
  .pr-opt.right{border-color:#1a7d4a;background:#e3f3ea}.pr-opt.wrong{border-color:#b91c1c;background:#fbe4e4}.pr-opt:disabled{cursor:default}
  .pr-fb{border-radius:12px;padding:13px 15px;display:flex;flex-direction:column;gap:6px;font-size:15px;line-height:1.5}
  .pr-fb.good{background:#e3f3ea}.pr-fb.bad{background:#fbe4e4}.pr-fb.info{background:var(--accent-soft,#dcefe7)}
  .pr-fb h4{margin:0;font-size:15px}
  .pr-fb ul{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:4px}
  .pr-scheme{border-left:4px solid var(--card-border,#e6e3da);padding-left:12px;color:var(--sub,#6b6b64);font-size:14px}
  .pr-row{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
  .pr-btn{border:2px solid var(--accent,#0f6e5c);background:var(--accent,#0f6e5c);color:#fff;border-radius:999px;padding:10px 20px;font-weight:800;font-size:14.5px;cursor:pointer;font-family:inherit;min-height:46px}
  .pr-btn.ghost{background:#fff;color:var(--accent,#0f6e5c)}
  .pr-btn[disabled]{opacity:.6;cursor:default}
  .pr-card textarea{width:100%;min-height:130px;font:inherit;font-size:16px;line-height:1.5;border:2px solid var(--card-border,#e6e3da);border-radius:12px;padding:12px;background:var(--bg,#f3f1ec);color:inherit;resize:vertical}
  .pr-tip{font-size:13.5px;color:var(--sub,#6b6b64);margin:0}
  .pr-thumbs{display:flex;gap:8px;flex-wrap:wrap}.pr-thumbs img{width:84px;height:84px;object-fit:cover;border-radius:10px;border:1px solid var(--card-border,#e6e3da)}
  .pr-rate{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
  .pr-rate button{border:2px solid;background:#fff;border-radius:12px;padding:11px 6px;font-weight:800;cursor:pointer;font:inherit;font-weight:800;min-height:50px}
  .pr-rate .g{border-color:#1a7d4a;color:#1a7d4a}.pr-rate .p{border-color:#a8670d;color:#a8670d}.pr-rate .n{border-color:#b91c1c;color:#b91c1c}
  .pr-score{font-size:40px;font-weight:800;line-height:1;font-variant-numeric:tabular-nums}
  .pr-err{color:#b91c1c;font-size:14px;margin:0}
  `;
  function addCss(){ if (document.getElementById("pr-css")) return; const s=document.createElement("style"); s.id="pr-css"; s.textContent=css; document.head.appendChild(s); }
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const h = html => { const t=document.createElement("template"); t.innerHTML=html.trim(); return t.content.firstElementChild; };
  const shuffle = a => { a=a.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]} return a; };
  const L = "ABCD";
  const isTouch = matchMedia("(pointer:coarse)").matches, isMac = /Mac/.test(navigator.platform||"");
  const speakTip = () => `<p class="pr-tip">To speak instead of typing: ${isTouch ? "tap the microphone on your keyboard" : isMac ? "press the Fn (Globe) key twice" : "press Windows + H"}.</p>`;
  const SRC = { quiz: "in a quiz", tutor: "with the tutor", written: "in a written answer" };

  // ---- data ----
  async function loadProgress(sb, profile, questions){
    const ids = questions.map(q => q.id);
    if (!ids.length) return { latest:{}, src:{}, reviews:{} };
    const inIds = ids.map(encodeURIComponent).join(",");
    const [att, rev] = await Promise.all([
      sb(`quiz_attempts?select=question_id,result,source,created_at&profile_id=eq.${profile.id}&question_id=in.(${inIds})&order=created_at.desc&limit=1000`),
      sb(`answer_reviews?select=question_id,marks_awarded,marks_available,feedback,created_at&profile_id=eq.${profile.id}&question_id=in.(${inIds})&order=created_at.desc&limit=200`)
    ]);
    const latest = {}, src = {}, reviews = {};
    (att||[]).forEach(a => { if (latest[a.question_id] === undefined) { latest[a.question_id] = Number(a.result); src[a.question_id] = a.source; } });
    (rev||[]).forEach(r => { if (!reviews[r.question_id]) reviews[r.question_id] = r; });
    return { latest, src, reviews };
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

  // ---- summary ----
  function summaryCard(questions, prog){
    const { latest, src } = prog;
    const tried = questions.filter(q => latest[q.id] !== undefined);
    const good = tried.filter(q => latest[q.id] >= 1), part = tried.filter(q => latest[q.id] > 0 && latest[q.id] < 1), miss = tried.filter(q => latest[q.id] === 0);
    const card = h(`<div class="pr-card" id="prSummary"><h3>How you're doing on this chapter</h3></div>`);
    if (!tried.length) {
      card.append(h(`<p class="pr-sub">Nothing yet. Do a quiz or talk to your tutor and your strengths and gaps will show up here.</p>`));
      return card;
    }
    card.append(h(`<div class="pr-stats">
      <div class="pr-stat pr-g"><b>${good.length}</b><span>Answered well</span></div>
      <div class="pr-stat pr-p"><b>${part.length}</b><span>Nearly there</span></div>
      <div class="pr-stat pr-n"><b>${miss.length}</b><span>To study</span></div>
      <div class="pr-stat pr-u"><b>${questions.length - tried.length}</b><span>Not tried yet</span></div></div>`));
    const by = {};
    tried.forEach(q => { (by[q.topic_label] = by[q.topic_label] || []).push(latest[q.id]); });
    const rows = Object.entries(by).map(([t,v]) => ({ t, p: Math.round(v.reduce((a,b)=>a+b,0)/v.length*100) })).sort((a,b)=>a.p-b.p);
    const col = p => p>=80 ? "#1a7d4a" : p>=50 ? "#c98a1b" : "#c0392b", cls = p => p>=80 ? "pr-g" : p>=50 ? "pr-p" : "pr-n";
    const strong = rows.filter(r => r.p >= 80).map(r => r.t);
    if (strong.length) card.append(h(`<p class="pr-sub"><strong style="color:#1a6b42">Strong on:</strong> ${esc(strong.join(", "))}.</p>`));
    const tl = h(`<div class="pr-topics"></div>`);
    rows.forEach(r => tl.append(h(`<div class="pr-trow"><span>${esc(r.t)}</span><span class="pr-pill ${cls(r.p)}">${r.p}%</span><div class="pr-bar"><i style="width:${Math.max(r.p,3)}%;background:${col(r.p)}"></i></div></div>`)));
    card.append(tl);
    const gaps = [...miss, ...part];
    if (gaps.length) {
      const d = h(`<details ${gaps.length <= 6 ? "open" : ""}><summary>Gaps to study (${gaps.length})</summary><ol class="pr-list" style="margin-top:10px"></ol></details>`);
      const ol = d.querySelector("ol");
      gaps.forEach(q => ol.append(h(`<li>${esc(q.prompt)}<span class="pr-why">${latest[q.id] === 0 ? "Missed" : "Partly right"} ${SRC[src[q.id]] || ""} · ${esc(q.topic_label)}</span></li>`)));
      card.append(d);
    }
    if (good.length) {
      const d = h(`<details><summary>Answered well (${good.length})</summary><ol class="pr-list" style="margin-top:10px"></ol></details>`);
      good.forEach(q => d.querySelector("ol").append(h(`<li>${esc(q.prompt)}</li>`)));
      card.append(d);
    }
    return card;
  }

  // ---- mount ----
  async function mountPractice(slot, { topic, profile, sb }){
    if (!slot || !topic) return;
    addCss();
    const questions = await sb(`quiz_questions?select=id,qtype,topic_label,difficulty,prompt,options,answer_index,explanation,model_answer,marking_scheme,source,marks&topic_id=eq.${topic.id}&order=id.asc`);
    if (!questions || !questions.length) return;
    let prog = await loadProgress(sb, profile, questions);
    const wrap = h(`<div></div>`);
    slot.replaceChildren(wrap);

    async function refresh(){ prog = await loadProgress(sb, profile, questions); home(); }
    window.addEventListener("study-progress", () => { if (wrap.isConnected && !session) refresh(); });

    let session = null;
    const mcq = questions.filter(q => q.qtype === "mcq"), rec = questions.filter(q => q.qtype === "recall"), ex = questions.filter(q => q.qtype === "exam");

    function home(){
      session = null;
      const weak = questions.filter(q => prog.latest[q.id] !== undefined && prog.latest[q.id] < 1);
      const untried = questions.filter(q => prog.latest[q.id] === undefined);
      const card = h(`<div class="pr-card"><h3>Practise this chapter</h3><p class="pr-sub">Test yourself first. Getting things wrong is how you find what to revise.</p><div class="pr-modes"></div></div>`);
      const modes = card.querySelector(".pr-modes");
      const add = (title, sub, list, main) => { const b = h(`<button type="button" class="pr-mode${main?" main":""}"><strong>${esc(title)}</strong><span>${esc(sub)}</span></button>`); b.onclick = () => start(title, list()); modes.append(b); };
      add("Start today's 10 minutes", weak.length ? "Your gaps first, then new questions" : "8 quick questions, 1 say-it-out-loud, 1 exam question", () => {
        const pick = [...shuffle(weak).slice(0,4)];
        const fill = (pool, n) => shuffle(pool.filter(q => !pick.includes(q))).slice(0, n).forEach(q => pick.push(q));
        fill(untried.filter(q=>q.qtype==="mcq").length ? untried.filter(q=>q.qtype==="mcq") : mcq, Math.max(0, 8 - pick.length));
        if (!pick.some(q=>q.qtype==="recall")) fill(rec, 1);
        if (!pick.some(q=>q.qtype==="exam")) fill(ex, 1);
        return pick;
      }, true);
      if (weak.length) add("Practise my gaps", `${weak.length} question${weak.length>1?"s":""} you missed or partly got`, () => shuffle(weak));
      add("Multiple choice", `${mcq.length} quick questions`, () => shuffle(mcq));
      if (rec.length) add("Say it out loud", `${rec.length} questions. Answer, then check`, () => shuffle(rec));
      if (ex.length) add("Exam questions", `${ex.length} past-paper questions. Write, type or photo your answer for feedback`, () => ex.slice());
      wrap.replaceChildren(summaryCard(questions, prog), card);
    }

    function start(name, list){
      session = { name, queue: list.map(q => ({ q, retry:false })), i:0, results:[], total:list.length };
      next();
    }

    function next(){
      if (session.i >= session.queue.length) return finish();
      const { q, retry } = session.queue[session.i];
      const card = h(`<div class="pr-card">
        <div class="pr-row" style="justify-content:space-between"><button type="button" class="pr-btn ghost" data-stop>Stop</button><span class="pr-sub" style="font-variant-numeric:tabular-nums">${retry ? "Second try" : `Question ${session.i+1} of ${session.total}`}</span></div>
        <div class="pr-progress"><i style="width:${Math.min(session.i,session.total)/session.total*100}%"></i></div>
        <div class="pr-meta"><span class="pr-tag">${esc(q.topic_label)}</span>${q.qtype==="exam" ? `<span>${esc(q.source)} · ${q.marks} marks</span>` : ""}</div>
        <p class="pr-q">${esc(q.prompt)}</p></div>`);
      card.querySelector("[data-stop]").onclick = () => session.results.length ? finish() : home();
      if (q.qtype === "mcq") mcqView(card, q, retry); else writtenView(card, q, retry);
      wrap.replaceChildren(card);
      card.scrollIntoView({ block:"start", behavior:"smooth" });
    }

    function nextBtn(card){
      const b = h(`<div class="pr-row"><button type="button" class="pr-btn">Next</button></div>`);
      b.querySelector("button").onclick = () => { session.i++; next(); };
      card.append(b); b.querySelector("button").focus({ preventScroll:true });
    }

    function mcqView(card, q, retry){
      const opts = h(`<div class="pr-opts"></div>`), order = shuffle((q.options||[]).map((o,i)=>i));
      order.forEach((oi, pos) => {
        const b = h(`<button type="button" class="pr-opt"><b>${L[pos]}</b><span>${esc(q.options[oi])}</span></button>`);
        b.onclick = async () => {
          const ok = oi === q.answer_index;
          opts.querySelectorAll(".pr-opt").forEach((x,p) => { x.disabled = true; if (order[p] === q.answer_index) x.classList.add("right"); });
          if (!ok) b.classList.add("wrong");
          if (!retry) { session.results.push({ q, v: ok?1:0 }); record(sb, profile, q.id, ok?1:0, "quiz"); }
          if (!ok && !retry) session.queue.push({ q, retry:true });
          card.append(h(`<div class="pr-fb ${ok?"good":"bad"}"><strong>${ok?"Correct.":"Not this time."}</strong><span>${esc(q.explanation||"")}</span>${!ok&&!retry?`<span class="pr-tip">This one will come back at the end.</span>`:""}</div>`));
          nextBtn(card);
        };
        opts.append(b);
      });
      card.append(opts);
    }

    function writtenView(card, q, retry){
      const images = [];
      const box = h(`<div style="display:flex;flex-direction:column;gap:10px">
        <p class="pr-tip">${q.qtype==="exam" ? "Write your answer on paper and take a photo, or type it here." : "Say your answer out loud or type it, then check."}</p>
        ${speakTip()}
        <textarea aria-label="Your answer" placeholder="Type your answer (optional if you add a photo)"></textarea>
        <div class="pr-thumbs"></div>
        <div class="pr-row">
          <label class="pr-btn ghost" style="display:inline-flex;align-items:center;gap:6px">Add a photo or screenshot<input type="file" accept="image/*" multiple hidden></label>
        </div>
        <div class="pr-row"><button type="button" class="pr-btn" data-fb>Get feedback</button><button type="button" class="pr-btn ghost" data-self>Just show the answer</button></div>
        <p class="pr-err" hidden></p></div>`);
      const ta = box.querySelector("textarea"), thumbs = box.querySelector(".pr-thumbs"), file = box.querySelector("input[type=file]"), err = box.querySelector(".pr-err");
      const fbBtn = box.querySelector("[data-fb]"), selfBtn = box.querySelector("[data-self]");
      file.onchange = async () => {
        err.hidden = true;
        for (const f of Array.from(file.files || []).slice(0, 3 - images.length)) {
          try { const d = await shrink(f); images.push(d); thumbs.append(h(`<img alt="Your answer photo ${images.length}" src="${d}">`)); }
          catch (e) { err.textContent = e.message; err.hidden = false; }
        }
        file.value = "";
      };
      const done = (v, source) => { if (!retry) { session.results.push({ q, v }); record(sb, profile, q.id, v, source); } };

      fbBtn.onclick = async () => {
        const text = ta.value.trim();
        if (!text && !images.length) { err.textContent = "Type an answer or add a photo first."; err.hidden = false; return; }
        fbBtn.disabled = selfBtn.disabled = true; fbBtn.textContent = "Reading your answer…"; err.hidden = true;
        try {
          const r = await fetch("/api/mark-answer", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ question_id: q.id, answer_text: text, images }) });
          const data = await r.json().catch(() => ({}));
          if (!r.ok || !data.feedback) throw new Error(data.error || "Feedback couldn't be generated.");
          const f = data.feedback, frac = f.marks_available ? f.marks_awarded / f.marks_available : 0;
          const v = frac >= 0.8 ? 1 : frac >= 0.4 ? 0.5 : 0;
          done(v, "written");
          sb("answer_reviews", { method:"POST", prefer:"return=minimal", body:[{ profile_id: profile.id, question_id: q.id, answer_text: text || f.transcription || null, marks_awarded: f.marks_awarded, marks_available: f.marks_available, feedback: f }] });
          box.remove();
          const list = a => a.length ? `<ul>${a.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>` : "";
          card.append(h(`<div class="pr-fb ${v===1?"good":v===0?"bad":"info"}">
            <div class="pr-row" style="gap:14px"><span class="pr-score">${f.marks_awarded}/${f.marks_available}</span><span>${esc(f.summary||"")}</span></div>
            ${f.went_well.length ? `<h4>What earned marks</h4>${list(f.went_well)}` : ""}
            ${f.to_improve.length ? `<h4>How to get more marks</h4>${list(f.to_improve)}` : ""}
            ${f.example ? `<h4>For example</h4><span>${esc(f.example)}</span>` : ""}
            ${f.next_step ? `<h4>Next</h4><span>${esc(f.next_step)}</span>` : ""}
          </div>`));
          card.append(h(`<details><summary>See the model answer${q.marking_scheme?" and marking scheme":""}</summary><div class="pr-fb info" style="margin-top:8px"><span>${esc(q.model_answer||"")}</span>${q.marking_scheme?`<span class="pr-scheme"><strong>Marking scheme:</strong> ${esc(q.marking_scheme)}</span>`:""}</div></details>`));
          nextBtn(card);
        } catch (e) {
          err.textContent = e.message + " You can still check it yourself with Just show the answer."; err.hidden = false;
          fbBtn.disabled = selfBtn.disabled = false; fbBtn.textContent = "Get feedback";
        }
      };

      selfBtn.onclick = () => {
        box.remove();
        card.append(h(`<div class="pr-fb info"><strong>${q.qtype==="exam"?"Model answer":"A good answer"}</strong><span>${esc(q.model_answer||"")}</span>${q.marking_scheme?`<span class="pr-scheme"><strong>Marking scheme:</strong> ${esc(q.marking_scheme)}</span>`:""}</div>`));
        const r = h(`<div style="display:flex;flex-direction:column;gap:8px"><strong>How did you do?</strong><div class="pr-rate"><button type="button" class="g">Got it</button><button type="button" class="p">Partly</button><button type="button" class="n">Not yet</button></div></div>`);
        [1, 0.5, 0].forEach((v, i) => r.querySelectorAll("button")[i].onclick = () => { done(v, "quiz"); session.i++; next(); });
        card.append(r);
      };
      card.append(box);
    }

    async function finish(){
      const R = session.results, pct = R.length ? Math.round(R.reduce((a,r)=>a+r.v,0)/R.length*100) : 0;
      const good = R.filter(r => r.v >= 1), gaps = R.filter(r => r.v < 1);
      prog = await loadProgress(sb, profile, questions);
      const card = h(`<div class="pr-card"><span class="pr-tag" style="align-self:flex-start">${esc(session.name)} · done</span>
        <div class="pr-row" style="gap:16px"><span class="pr-score">${pct}%</span><span>${R.length} question${R.length===1?"":"s"} answered. ${pct>=80?"Strong. Come back tomorrow to make it stick.":pct>=50?"Good start. Your gaps are below.":"This chapter needs another look. Start with the gaps below."}</span></div>
        ${good.length ? `<div class="pr-fb good"><h4>Answered well (${good.length})</h4><ul>${good.map(r=>`<li>${esc(r.q.prompt)}</li>`).join("")}</ul></div>` : ""}
        ${gaps.length ? `<div class="pr-fb bad"><h4>To study (${gaps.length})</h4><ul>${gaps.map(r=>`<li>${esc(r.q.prompt)}</li>`).join("")}</ul></div>` : ""}
        ${gaps.length ? `<p class="pr-tip">Your tutor will start with these next time you talk to it.</p>` : ""}
        <div class="pr-row"><button type="button" class="pr-btn">Back to the chapter</button></div></div>`);
      card.querySelector(".pr-btn").onclick = () => { home(); slot.scrollIntoView({ block:"start", behavior:"smooth" }); };
      session = null;
      wrap.replaceChildren(card);
      card.scrollIntoView({ block:"start", behavior:"smooth" });
    }

    home();
  }
  window.mountPractice = mountPractice;
})();
