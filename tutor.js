// Voice tutor for a chapter: one tap to start a spoken conversation.
// Uses the chapter's questions, notes and the student's past results from Supabase,
// and saves each result back as the tutor marks it.
(function(){
  const LIB = "https://cdn.jsdelivr.net/npm/@elevenlabs/client@1.26.0/dist/lib.iife.js";
  let libPromise = null;
  function loadLib(){
    if (window.ElevenLabsClient) return Promise.resolve(window.ElevenLabsClient);
    if (libPromise) return libPromise;
    libPromise = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = LIB; s.async = true;
      s.onload = () => window.ElevenLabsClient ? resolve(window.ElevenLabsClient) : reject(new Error("Voice library did not load"));
      s.onerror = () => { libPromise = null; reject(new Error("Voice library did not load")); };
      document.head.appendChild(s);
    });
    return libPromise;
  }

  const css = `
  .tutor-card{background:#fff;border:1px solid var(--card-border,#e6e3da);border-radius:18px;padding:20px;margin:16px 0;display:flex;flex-direction:column;gap:14px;align-items:center;text-align:center}
  .tutor-card h3{margin:0;font-size:17px;font-weight:800}
  .tutor-card .tutor-sub{margin:0;color:var(--sub,#6b6b64);font-size:14px;max-width:46ch}
  .tutor-orb{width:112px;height:112px;border-radius:50%;border:none;cursor:pointer;background:var(--accent,#0f6e5c);color:#fff;font-weight:800;font-size:15px;display:flex;align-items:center;justify-content:center;text-align:center;padding:10px;line-height:1.25;box-shadow:0 0 0 0 rgba(15,110,92,.35);transition:transform .2s ease}
  .tutor-orb:focus-visible{outline:3px solid #7c3aed;outline-offset:4px}
  .tutor-orb[disabled]{opacity:.7;cursor:default}
  .tutor-orb.listening{animation:tutorPulse 1.8s ease-out infinite}
  .tutor-orb.speaking{transform:scale(1.08);background:#0b5546}
  @keyframes tutorPulse{0%{box-shadow:0 0 0 0 rgba(15,110,92,.35)}100%{box-shadow:0 0 0 22px rgba(15,110,92,0)}}
  @media (prefers-reduced-motion:reduce){.tutor-orb.listening{animation:none;box-shadow:0 0 0 6px rgba(15,110,92,.25)}.tutor-orb{transition:none}}
  .tutor-status{font-size:14px;font-weight:700;color:var(--accent,#0f6e5c);min-height:1.4em;margin:0}
  .tutor-end{border:1px solid var(--card-border,#e6e3da);background:#fff;color:#b91c1c;font-weight:800;font-size:14px;padding:10px 22px;border-radius:999px;cursor:pointer}
  .tutor-err{color:#b91c1c;font-size:13.5px;margin:0;max-width:46ch}
  .tutor-log{width:100%;text-align:left}
  .tutor-log summary{cursor:pointer;color:var(--sub,#6b6b64);font-size:13px;font-weight:700}
  .tutor-lines{display:flex;flex-direction:column;gap:6px;margin-top:8px;max-height:260px;overflow:auto;font-size:14px}
  .tutor-lines p{margin:0;padding:8px 12px;border-radius:12px;background:var(--bg,#f3f1ec)}
  .tutor-lines p.me{background:#eef4ff}
  .tutor-done{font-size:14px;color:var(--ink,#232323);margin:0}
  `;
  function addCss(){ if (document.getElementById("tutor-css")) return; const st=document.createElement("style"); st.id="tutor-css"; st.textContent=css; document.head.appendChild(st); }
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

  function buildPrompt(ctx){
    const { name, subject, title, notes, questions, latest, lastSession } = ctx;
    const gaps = questions.filter(q => latest[q.id] !== undefined && latest[q.id] < 1);
    const tried = questions.filter(q => latest[q.id] !== undefined).length;
    const fmt = q => {
      const ans = q.qtype === "mcq" ? `${(q.options||[])[q.answer_index] || ""}. ${q.explanation || ""}` : (q.model_answer || "");
      const extra = q.qtype === "exam" ? ` (Past paper: ${q.source}, ${q.marks} marks. Marking: ${q.marking_scheme || ""})` : "";
      const last = latest[q.id] === undefined ? "" : latest[q.id] >= 1 ? " [last time: got it]" : latest[q.id] > 0 ? " [last time: partly]" : " [last time: missed]";
      return `[${q.id}] (${q.topic_label}) ${q.prompt}${last} -> Answer: ${ans}${extra}`;
    };
    const plan = gaps.length
      ? `Start with the questions ${name} got wrong or only partly right last time (marked below), weakest topic first. Then mix in a few new ones.`
      : tried ? `${name} has done well so far. Ask harder "explain" and "apply it to Ireland" questions.`
      : `${name} hasn't practised this chapter yet. Start with an easy warm-up, then build up.`;
    let resume = "";
    if (lastSession && Array.isArray(lastSession.transcript) && lastSession.transcript.length) {
      const when = new Date(lastSession.created_at).toLocaleDateString("en-IE", { weekday: "long", day: "numeric", month: "long" });
      const tail = lastSession.transcript.slice(-40).map(l => `${l.role === "user" ? name : "Tutor"}: ${l.text}`).join("\n");
      resume = `\n\nLast session (${when}): this is how your previous conversation with ${name} on this chapter went (the end of it). Pick up where you left off: in your first reply, remind ${name} in one sentence what you covered last time, then carry on. Don't re-ask questions ${name} got right last time unless revising.\n${tail}`;
    }
    return `You are ${name}'s spoken revision tutor for Leaving Certificate Higher Level ${subject}, chapter "${title}". This is a live voice conversation. ${name} is dyslexic and can find it hard to get started, so be warm, encouraging and very clear.

How to speak:
- Talk like a friendly tutor on a call. One to three short sentences per turn. Plain everyday words.
- Never use lists, headings, symbols or anything that only works on screen.
- Ask ONE question at a time, then stop and wait.
- Make ${name} do the thinking. Ask, listen, then respond. Don't lecture first.
- Ask questions in your own natural words. For multiple-choice questions, ask them as open questions; only offer options if ${name} is stuck.
- If ${name} is right, say so briefly and add one extra detail that would earn marks.
- If wrong or stuck, give a small hint first. Explain fully only after a second try.
- Speech recognition can mishear names and terms. Judge the idea, not exact words.
- When useful, say how the exam marks it, for example "Section A is five marks, so two clear points with an example".
- Stay on this chapter. If ${name} goes off-topic, steer back kindly.
- Never write or recite a full essay for ${name} to memorise.
- After about ten questions, or if ${name} wants to stop, sum up in two sentences what went well and the one thing to revise, then say goodbye.

Saving progress: each time you have judged ${name}'s answer to a question from the list, call record_result with that question's id and got_it, partly or missed. Do this silently and never mention it.

Plan: ${plan}${resume}

Chapter notes (use only these facts; if unsure, say you'll check with the notes rather than guessing):
${notes || "(no notes for this chapter)"}

Question list:
${questions.map(fmt).join("\n")}`;
  }

  async function mountTutor(slot, { topic, profile, sb }){
    if (!slot || !topic) return;
    addCss();
    let questions = [], notesRow = [];
    try {
      [questions, notesRow] = await Promise.all([
        sb(`quiz_questions?select=id,qtype,topic_label,prompt,options,answer_index,explanation,model_answer,marking_scheme,source,marks&topic_id=eq.${topic.id}&order=id.asc`),
        sb(`topic_notes?select=notes&topic_id=eq.${topic.id}`)
      ]);
    } catch (e) { return; }
    if (!questions.length && !notesRow.length) return;

    const card = document.createElement("div");
    card.className = "tutor-card";
    card.innerHTML = `
      <h3>Talk it through with your tutor</h3>
      <p class="tutor-sub">Tap the button and just talk. Your tutor asks you questions out loud, listens, and helps with the bits you find tricky.</p>
      <button class="tutor-orb" type="button" id="tutorOrb">Tap to start talking</button>
      <p class="tutor-status" id="tutorStatus" aria-live="polite"></p>
      <button class="tutor-end" type="button" id="tutorEnd" hidden>End session</button>
      <p class="tutor-err" id="tutorErr" hidden></p>
      <details class="tutor-log" id="tutorLog" hidden><summary>Show what was said</summary><div class="tutor-lines" id="tutorLines"></div></details>`;
    slot.replaceChildren(card);

    const orb = card.querySelector("#tutorOrb"), status = card.querySelector("#tutorStatus"),
      endBtn = card.querySelector("#tutorEnd"), errEl = card.querySelector("#tutorErr"),
      log = card.querySelector("#tutorLog"), lines = card.querySelector("#tutorLines");
    let convo = null, results = { got_it:0, partly:0, missed:0 }, active = false, transcript = [], saved = false;

    function setIdle(msg){
      active = false; convo = null;
      orb.disabled = false; orb.className = "tutor-orb"; orb.textContent = "Tap to start talking";
      endBtn.hidden = true; status.textContent = msg || "";
    }
    function summaryText(){
      const n = results.got_it + results.partly + results.missed;
      if (!n) return transcript.length ? "Session saved. Next time the tutor will pick up where you left off." : "Session ended.";
      const parts = [];
      if (results.got_it) parts.push(`${results.got_it} right first time`);
      if (results.partly) parts.push(`${results.partly} right with a hint`);
      if (results.missed) parts.push(`${results.missed} to go over again`);
      return `You answered ${n} question${n === 1 ? "" : "s"}: ${parts.join(", ")}. Next time the tutor will pick up from here.`;
    }
    function saveSession(){
      if (saved || !transcript.length) return; saved = true;
      sb("tutor_sessions", { method: "POST", prefer: "return=minimal",
        body: [{ profile_id: profile.id, topic_id: topic.id, transcript: transcript.slice(-200), results }] });
    }
    function showErr(m){ errEl.textContent = m; errEl.hidden = !m; }
    function addLine(role, text){
      if (!text) return; log.hidden = false;
      transcript.push({ role: role === "user" ? "user" : "agent", text: String(text).slice(0, 2000) });
      const p = document.createElement("p"); if (role === "user") p.className = "me";
      p.textContent = (role === "user" ? "You: " : "Tutor: ") + text; lines.appendChild(p); lines.scrollTop = lines.scrollHeight;
    }

    orb.addEventListener("click", async () => {
      if (active) return;
      active = true; showErr("");
      orb.disabled = true; orb.textContent = "Starting…"; status.textContent = "Allow the microphone if your browser asks.";
      lines.replaceChildren(); log.hidden = true; results = { got_it:0, partly:0, missed:0 }; transcript = []; saved = false;
      try {
        const ids = questions.map(q => q.id);
        const attempts = ids.length
          ? await sb(`quiz_attempts?select=question_id,result,created_at&profile_id=eq.${profile.id}&question_id=in.(${ids.map(encodeURIComponent).join(",")})&order=created_at.desc&limit=500`)
          : [];
        const latest = {};
        attempts.forEach(a => { if (latest[a.question_id] === undefined) latest[a.question_id] = Number(a.result); });
        const lastRows = await sb(`tutor_sessions?select=transcript,created_at&profile_id=eq.${profile.id}&topic_id=eq.${topic.id}&order=created_at.desc&limit=1`);
        const lastSession = lastRows && lastRows[0] && (lastRows[0].transcript || []).length ? lastRows[0] : null;
        const prompt = buildPrompt({ name: profile.name, subject: topic.subject_title || "", title: topic.title, notes: (notesRow[0] || {}).notes || "", questions, latest, lastSession });
        const chapterName = topic.title.replace(/^Ch\s*\d+:\s*/i, "");
        const firstMessage = lastSession
          ? `Hi ${profile.name}, welcome back! Shall we pick up where we left off on ${chapterName}?`
          : `Hi ${profile.name}! Let's go over ${chapterName}. Ready for your first question?`;

        const [lib, tokRes] = await Promise.all([ loadLib(), fetch("/api/tutor-token", { method: "POST" }) ]);
        const tok = await tokRes.json().catch(() => ({}));
        if (!tokRes.ok || !tok.token) throw new Error(tok.error || "The voice tutor could not start.");

        convo = await lib.Conversation.startSession({
          conversationToken: tok.token,
          connectionType: "webrtc",
          overrides: { agent: { prompt: { prompt }, firstMessage } },
          clientTools: {
            record_result: async ({ question_id, result }) => {
              const map = { got_it: 1, partly: 0.5, missed: 0 };
              if (!(result in map) || !ids.includes(String(question_id))) return "ignored";
              results[result]++;
              try {
                await sb("quiz_attempts", { method: "POST", prefer: "return=minimal",
                  body: [{ profile_id: profile.id, question_id: String(question_id), result: map[result], source: "tutor" }] });
              } catch (e) {}
              return "saved";
            }
          },
          onConnect: () => { orb.disabled = false; endBtn.hidden = false; status.textContent = "Connected. Just talk."; },
          onModeChange: ({ mode }) => {
            orb.className = "tutor-orb " + (mode === "speaking" ? "speaking" : "listening");
            orb.textContent = mode === "speaking" ? "Tutor is talking" : "Listening…";
            status.textContent = mode === "speaking" ? "You can interrupt any time." : "Your turn. Just talk.";
          },
          onMessage: ({ message, role, source }) => addLine(role || (source === "ai" ? "agent" : "user"), message),
          onError: (m) => { showErr("Something went wrong with the connection. Tap to try again."); console.warn("tutor error", m); },
          onDisconnect: () => {
            saveSession();
            setIdle(summaryText());
          }
        });
      } catch (e) {
        const msg = /Permission|NotAllowed|denied/i.test(String(e && (e.name + e.message)))
          ? "The tutor needs your microphone. Allow it in your browser's settings for this site, then tap again."
          : (e && e.message) || "The voice tutor could not start.";
        showErr(msg); setIdle("");
      }
    });

    // End the call if the student leaves the chapter (the card is removed from the page)
    const watch = setInterval(() => {
      if (!card.isConnected) { clearInterval(watch); saveSession(); if (convo) convo.endSession(); }
    }, 1000);

    orb.addEventListener("keydown", e => { if (e.key === "Escape" && convo) convo.endSession(); });
    endBtn.addEventListener("click", async () => { if (convo) { endBtn.disabled = true; try { await convo.endSession(); } finally { endBtn.disabled = false; } } });
    window.addEventListener("pagehide", () => { saveSession(); if (convo) convo.endSession(); }, { once: true });
  }

  window.mountTutor = mountTutor;
})();
