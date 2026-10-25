// "My notes" on a chapter's Learn tab: a student adds their own notes (typed, photos or a PDF),
// the app writes questions from them (/api/notes), works out which course topics they cover, and
// offers three tests: the course topics the notes cover (default), just the notes, or both mixed.
// Notes are saved in student_notes (private to the student); questions in quiz_questions with
// ids "note-…" and source "From your notes", so they join Quick Tests, weak spots and progress.
(function(){
  const css = `
  .mn{display:flex;flex-direction:column;gap:12px}
  .mn-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap}
  .mn-head b{font-size:18px;display:block}.mn-head span{font-size:15px;color:var(--t-muted)}
  .mn-btn{border:2px solid var(--t-accent);background:var(--t-accent);color:var(--t-on-accent);border-radius:999px;padding:9px 18px;font:inherit;font-weight:700;font-size:15px;cursor:pointer;min-height:44px}
  .mn-btn.ghost{background:var(--t-card);color:var(--t-accent)}
  .mn-btn:disabled{opacity:.6;cursor:default}
  .mn-link{background:none;border:none;padding:6px 0;font:inherit;font-size:15px;font-weight:700;color:var(--t-accent);cursor:pointer;text-decoration:underline;text-underline-offset:3px}
  .mn-link.quiet{color:var(--t-muted);font-weight:400}
  .mn-note{border:1px solid var(--t-line);border-radius:14px;padding:14px 16px;display:flex;flex-direction:column;gap:8px}
  .mn-note .t{font-size:16px;font-weight:700}.mn-note .s{font-size:14px;color:var(--t-muted);line-height:1.4}
  .mn-acts{display:flex;align-items:center;gap:6px 16px;flex-wrap:wrap}
  .mn-form{display:flex;flex-direction:column;gap:10px;border:2px solid var(--t-accent-soft);border-radius:14px;padding:14px 16px}
  .mn-form textarea{font:inherit;font-size:16px;line-height:1.45;border:2px solid var(--t-line);border-radius:12px;padding:10px 12px;min-height:120px;resize:vertical;background:var(--t-card);color:var(--t-ink)}
  .mn-form textarea:focus{outline:none;border-color:var(--t-accent)}
  .mn-file{display:inline-flex;align-items:center;gap:8px;align-self:flex-start;border:2px dashed var(--t-line);border-radius:12px;padding:10px 14px;font-weight:700;font-size:15px;color:var(--t-accent);cursor:pointer}
  .mn-file input{position:absolute;width:1px;height:1px;opacity:0}
  .mn-file:focus-within{outline:3px solid var(--t-accent);outline-offset:2px}
  .mn-files{display:flex;gap:8px;flex-wrap:wrap}
  .mn-files img{width:72px;height:72px;object-fit:cover;border-radius:8px;border:1px solid var(--t-line)}
  .mn-files span{font-size:14px;background:var(--t-soft);border-radius:8px;padding:6px 10px}
  .mn-err{color:#a32020;font-size:14px;margin:0}
  .mn-ok{background:var(--t-accent-tint);border-radius:12px;padding:12px 14px;font-size:15px;line-height:1.45}
  .mn-warn{background:var(--t-warn-tint, #FDF1DF);border-radius:12px;padding:12px 14px;font-size:15px;line-height:1.45}
  .mn-warn b{display:block;margin-bottom:4px}
  .mn-choose{display:flex;flex-direction:column;gap:8px}
  .mn-opt{display:flex;flex-direction:column;gap:2px;text-align:left;border:2px solid var(--t-line);background:var(--t-card);border-radius:14px;padding:12px 14px;font:inherit;color:var(--t-ink);cursor:pointer}
  .mn-opt b{font-size:16px}.mn-opt span{font-size:14px;color:var(--t-muted)}
  .mn-opt.main{border-color:var(--t-accent);background:var(--t-accent-tint)}
  .mn-opt:disabled{opacity:.55;cursor:default}
  .mn-opt:focus-visible,.mn-btn:focus-visible,.mn-link:focus-visible{outline:3px solid var(--t-accent);outline-offset:2px}
  `;
  function addCss(){ if (document.getElementById("mn-css")) return; const s = document.createElement("style"); s.id = "mn-css"; s.textContent = css; document.head.appendChild(s); }
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const fmtDay = d => new Date(d).toLocaleDateString("en-IE", { weekday: "short", day: "numeric", month: "short" }).replace(",", "");
  const DAILY_LIMIT = 5;
  const NOTE_SRC = "From your notes";

  function shrink(file){
    return new Promise((resolve, reject) => {
      const img = new Image(), url = URL.createObjectURL(file);
      img.onload = () => { const max = 1600, s = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement("canvas"); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url); resolve(c.toDataURL("image/jpeg", 0.82)); };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error(`"${file.name}" isn't a photo we can read.`)); };
      img.src = url;
    });
  }
  const readAsDataUrl = file => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = () => rej(new Error("Couldn't read that file.")); r.readAsDataURL(file); });

  async function mountNotes(slot, { topic, profile, sb, subjectTitle, onTest }){
    if (!slot || !topic) return;
    addCss();
    let notes = [], qs = [], mode = "list", saved = "";
    async function load(){
      [notes, qs] = await Promise.all([
        sb(`student_notes?select=id,title,covered,question_ids,created_at&profile_id=eq.${profile.id}&topic_id=eq.${topic.id}&order=created_at.desc`).catch(() => []),
        sb(`quiz_questions?select=id,qtype,topic_label,prompt,options,answer_index,model_answer,source&topic_id=eq.${topic.id}&order=id.asc`).catch(() => [])
      ]);
      notes = notes || []; qs = qs || [];
    }
    const courseQs = () => qs.filter(q => q.source !== NOTE_SRC && (q.qtype === "mcq" || q.qtype === "recall"));
    const labels = () => [...new Set(courseQs().map(q => q.topic_label).filter(Boolean))];
    // The three tests for one set of notes
    function tests(n){
      const mine = (n.question_ids || []).filter(id => qs.some(q => q.id === id));
      const covered = new Set(((n.covered || {}).topics || []).map(t => t.toLowerCase()));
      const course = courseQs().filter(q => q.topic_label && covered.has(q.topic_label.toLowerCase())).map(q => q.id);
      return {
        course: shuffle(course.slice()).slice(0, 10),
        mine: mine.slice(0, 10),
        mixed: shuffle([...shuffle(mine.slice()).slice(0, 5), ...shuffle(course.slice()).slice(0, 5)]),
        nCourse: course.length, nMine: mine.length
      };
    }
    function bindRuns(scope, n){
      scope.querySelectorAll("[data-run]").forEach(b => b.onclick = () => {
        const t = tests(n), ids = t[b.dataset.run];
        if (ids.length) onTest(ids, b.dataset.run === "mine" ? "My notes" : b.dataset.run === "mixed" ? "My notes and the course" : "Course topics from my notes");
      });
    }

    function paint(){
      if (mode === "add") return paintAdd();
      slot.innerHTML = `<div class="mn">
        <div class="mn-head"><span><b>My notes</b><span>Add your class notes or your own notes, and get tested on them.</span></span><button type="button" class="mn-btn ghost" data-add>+ Add my notes</button></div>
        ${saved ? `<p class="mn-ok" role="status" style="margin:0">${esc(saved)}</p>` : ""}
        ${notes.map(n => { const tp = (n.covered || {}).topics || [];
          return `<div class="mn-note" data-note="${n.id}"><span class="t">${esc(n.title || "My notes")}</span>
            <span class="s">Added ${esc(fmtDay(n.created_at))} · ${(n.question_ids || []).length} questions${tp.length ? ` · covers ${esc(tp.slice(0, 3).join(", "))}${tp.length > 3 ? " and more" : ""}` : ""}</span>
            ${((n.covered || {}).conflicts || []).length ? `<span class="s">Worth checking with your teacher: ${((n.covered || {}).conflicts || []).map(k => `your notes say "${esc(k.notes_say)}", the course says "${esc(k.course_says)}"`).join("; ")}</span>` : ""}
            <div class="mn-acts"><button type="button" class="mn-btn" data-run="mine">Test me on my notes</button>${tests(n).nCourse ? `<button type="button" class="mn-link" data-run="course">Test me on the course topics they cover</button>` : ""}<button type="button" class="mn-link quiet" data-remove>Remove</button></div></div>`; }).join("")}
      </div>`;
      saved = "";
      slot.querySelector("[data-add]").onclick = () => { mode = "add"; paint(); };
      slot.querySelectorAll("[data-note]").forEach(el => {
        const n = notes.find(x => x.id === el.dataset.note);
        bindRuns(el, n);
        el.querySelector("[data-remove]").onclick = async (e) => {
          const b = e.currentTarget;
          if (b.dataset.sure !== "1") { b.dataset.sure = "1"; b.textContent = "Remove these notes and their questions?"; b.classList.remove("quiet"); return; }
          b.disabled = true; b.textContent = "Removing…";
          const ids = (n.question_ids || []).filter(id => /^note-/.test(id));
          try {
            if (ids.length) await sb(`quiz_questions?id=in.(${ids.map(encodeURIComponent).join(",")})`, { method: "DELETE", prefer: "return=minimal" });
            await sb(`student_notes?id=eq.${n.id}`, { method: "DELETE", prefer: "return=minimal" });
          } catch (x) {}
          await load(); paint();
        };
      });
    }

    function paintAdd(){
      const files = { images: [], pdf: null, names: [] };
      slot.innerHTML = `<div class="mn"><div class="mn-form">
        <b style="font-size:17px">Add my notes</b>
        <span style="font-size:15px;color:var(--t-muted)">Type or paste them, or add photos of your notes or a PDF. They stay private to you.</span>
        <textarea aria-label="Your notes" placeholder="Type or paste your notes here"></textarea>
        <label class="mn-file">+ Add photos or a PDF<input type="file" accept="image/*,application/pdf" multiple></label>
        <div class="mn-files"></div>
        <p class="mn-err" hidden></p>
        <div class="mn-acts"><button type="button" class="mn-btn" data-make="test">Test me on my notes</button><button type="button" class="mn-btn ghost" data-make="save">Save</button><button type="button" class="mn-link quiet" data-cancel>Cancel</button></div>
      </div></div>`;
      const ta = slot.querySelector("textarea"), inp = slot.querySelector("input[type=file]"), list = slot.querySelector(".mn-files"), err = slot.querySelector(".mn-err"), makes = slot.querySelectorAll("[data-make]");
      const fail = m => { err.textContent = m; err.hidden = false; };
      inp.onchange = async () => {
        err.hidden = true;
        for (const f of Array.from(inp.files || [])) {
          try {
            if (f.type === "application/pdf") {
              if (f.size > 3 * 1024 * 1024) { fail("That PDF is too big. Use one under 3 MB, or add photos of the pages."); continue; }
              files.pdf = await readAsDataUrl(f); list.append(Object.assign(document.createElement("span"), { textContent: f.name }));
            } else if (files.images.length < 6) {
              const d = await shrink(f); files.images.push(d); const im = document.createElement("img"); im.src = d; im.alt = `Notes photo ${files.images.length}`; list.append(im);
            } else fail("Up to 6 photos at a time.");
          } catch (x) { fail(x.message); }
        }
        inp.value = "";
      };
      slot.querySelector("[data-cancel]").onclick = () => { mode = "list"; paint(); };
      ta.focus();
      makes.forEach(make => make.onclick = async () => {
        const andTest = make.dataset.make === "test";
        const text = ta.value.trim();
        if (!text && !files.images.length && !files.pdf) { fail("Type or paste your notes, or add a photo or PDF first."); return; }
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const todays = await sb(`student_notes?select=id&profile_id=eq.${profile.id}&created_at=gte.${encodeURIComponent(today.toISOString())}`).catch(() => []);
        if ((todays || []).length >= DAILY_LIMIT) { fail(`You've added ${DAILY_LIMIT} sets of notes today. Add more tomorrow.`); return; }
        const label = make.textContent;
        makes.forEach(b => b.disabled = true); make.textContent = andTest ? "Reading your notes… (about 20 seconds)" : "Saving…"; err.hidden = true;
        try {
          const course = courseQs().slice(0, 60).map(q => ({ id: q.id, label: q.topic_label || "", prompt: q.prompt, answer: q.qtype === "mcq" ? ((q.options || [])[q.answer_index] || "") : (q.model_answer || "") }));
          const r = await fetch("/api/notes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
            text, images: files.images, pdf: files.pdf, chapter: topic.title, subject: subjectTitle || "", labels: labels(), course }) });
          const d = await r.json().catch(() => ({}));
          if (!r.ok) throw new Error(d.error || "Couldn't read your notes just now.");
          if (!d.questions || !d.questions.length) throw new Error(d.problem || "Couldn't find enough in those notes to make questions. Try clearer photos or more notes.");
          const noteId = crypto.randomUUID(), short = noteId.replace(/-/g, "").slice(0, 10);
          const rows = d.questions.map((q, i) => ({ id: `note-${short}-${String(i + 1).padStart(2, "0")}`, topic_id: topic.id, qtype: q.qtype, topic_label: q.label || null, difficulty: 1,
            prompt: q.prompt, options: q.qtype === "mcq" ? q.options : null, answer_index: q.qtype === "mcq" ? q.answer_index : null,
            explanation: q.explanation || null, model_answer: q.model_answer || null, source: NOTE_SRC }));
          const savedQs = await sb("quiz_questions", { method: "POST", prefer: "return=representation", body: rows });
          if (!Array.isArray(savedQs) || !savedQs.length) throw new Error("Your questions couldn't be saved. Try again.");
          const savedNote = await sb("student_notes", { method: "POST", prefer: "return=representation", body: [{ id: noteId, profile_id: profile.id, topic_id: topic.id, title: d.title, notes_text: d.notes_text,
            covered: { topics: d.covered || [], conflicts: d.conflicts || [] }, question_ids: rows.map(r => r.id) }] });
          if (!Array.isArray(savedNote) || !savedNote.length) {
            await sb(`quiz_questions?id=in.(${rows.map(r => encodeURIComponent(r.id)).join(",")})`, { method: "DELETE", prefer: "return=minimal" });
            throw new Error("Your notes couldn't be saved. Try again.");
          }
          await load();
          const n = notes.find(x => x.id === noteId);
          if (andTest && n) { onTest(tests(n).mine, "My notes"); return; }
          mode = "list"; saved = `Saved "${d.title}". ${rows.length} questions are ready whenever you want to test yourself.`; paint();
        } catch (x) { fail(x.message); makes.forEach(b => b.disabled = false); make.textContent = label; }
      });
    }


    await load();
    paint();
  }
  window.mountNotes = mountNotes;
})();
