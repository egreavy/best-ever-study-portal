// "Improve it step by step": after an answer is marked, turn the feedback into up to three
// short steps (plan), then check the one sentence the student writes for each step (check).
// "Help me get started" (start): before a first attempt, the shape of the answer and a clue per point.
// Needs ANTHROPIC_API_KEY (and ANTHROPIC_WORKSPACE_ID if used).

const SUPABASE_URL = "https://dhxwajidrtyukyxmiyml.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoeHdhamlkcnR5dWt5eG1peW1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzMzYyNzQsImV4cCI6MjA1MTkxMjI3NH0.fnH1eI1vLtQASjII_6K0d6NZevD62tnthXe0uyMgh0s";
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";

function sameSite(req) {
  const host = req.headers["x-forwarded-host"] || req.headers.host || "";
  const from = req.headers.origin || req.headers.referer || "";
  try { return !!from && new URL(from).host === host; } catch (e) { return false; }
}
const H = { headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY } };
async function getJson(path) {
  try { const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, H); return r.ok ? await r.json() : []; } catch (e) { return []; }
}
const clip = (s, n) => String(s || "").slice(0, n);
// [[img: qimg/file.png | ...]] in the question's layout -> absolute URLs on this site
function questionImages(q, req) {
  const host = req.headers["x-forwarded-host"] || req.headers.host || "";
  if (!q.display || !host) return [];
  const out = [];
  String(q.display).replace(/\[\[img:\s*([^|\]]+)/gi, (m, p) => { const path = p.trim().replace(/^\/+/, ""); if (/^qimg\/[\w.-]+$/.test(path)) out.push(`https://${host}/${path}`); return m; });
  return out.slice(0, 4);
}

function context({ q, subject, notes, answer, f }) {
  return `Leaving Certificate Higher Level ${subject || ""} question (${q.source || "practice question"}, ${q.marks || 5} marks):
${q.prompt}

Marking scheme: ${q.marking_scheme || "-"}
Model answer (reference only; never copy it into your reply): ${q.model_answer || "-"}

The student's answer (they are dyslexic; ignore spelling):
${answer || "(answer was a photo)"}

How it was marked: ${f.marks_awarded}/${f.marks_available}. ${f.summary}
What to improve: ${f.to_improve.join(" | ")}

Chapter notes (use only these facts):
${clip(notes, 12000) || "(none)"}`;
}

function planPrompt(ctx) {
  return `${ctx}

Turn "What to improve" into at most 3 short steps the student can do one at a time, biggest gain in marks first. Each step asks the student to write ONE sentence they can add to their answer.

For each step give:
- "title": what to add, 2-6 plain words, e.g. "Add a second source"
- "why": one short sentence on why it earns marks, e.g. "The question asks for two sources, 20 marks each."
- "hint": one guiding question or clue that points to the right facts without giving the sentence, e.g. "Tacitus wrote the Annals. What did he say happened to Christus?"

Keep "why" and "hint" under 25 words each.

Reply with ONLY JSON: {"steps":[{"title":"","why":"","hint":""}]}`;
}

// "Help me get started": before the first attempt, show the shape of a full-mark answer and a
// clue for each point, without giving the answer away.
function startContext({ q, subject, notes }) {
  return `Leaving Certificate Higher Level ${subject || ""} question (${q.source || "practice question"}, ${q.marks || 5} marks):
${q.prompt}

Marking scheme: ${q.marking_scheme || "-"}
Model answer (reference only; never copy it or its facts into your reply): ${q.model_answer || "-"}

Chapter notes:
${clip(notes, 12000) || "(none)"}`;
}

function startPrompt(ctx) {
  return `${ctx}

A student (dyslexic, finds it hard to start a blank answer) hasn't written anything yet and asked for help getting started. Help them plan, not answer.

Give:
- "shape": one plain sentence on what a full-mark answer needs, worked out from the marking scheme, e.g. "Three explained points, about 5 marks each, plus a clear conclusion." Under 25 words.
- "points": the parts of the answer to write, in order, at most 5 (one per point or part the marking scheme rewards). For each:
  - "title": what this part does, 2-7 plain words, e.g. "First reason, with an example". Don't put the answer in the title.
  - "hint": one guiding question that points to the right area of the chapter without stating the fact, e.g. "What happened to food supplies in the cities during the war?" Under 25 words.
- "opener": the first few words of a possible opening sentence, ending in "…", that doesn't contain any of the answer's facts, e.g. "One reason the government acted was…". Under 12 words.

Never write a full sentence of the answer or name the key facts, dates, people or terms the student should recall. Calm, plain words; no exclamation marks.

Reply with ONLY JSON: {"shape":"","points":[{"title":"","hint":""}],"opener":""}`;
}

function checkPrompt(ctx, step, sentence) {
  return `${ctx}

The student is working on this step: "${step.title}" (${step.why})
The sentence they wrote to add to their answer:
"""${sentence}"""

Judge only whether this sentence does the step and would earn marks. Ignore spelling and grammar completely.
- "verdict": "good" if it earns the marks for this step, "close" if it's on the right track but missing something specific, "not_yet" if it misses the point or is wrong.
- "message": one or two short, calm, plain sentences. No exclamation marks and no words like great, awesome, amazing or perfect; be matter-of-fact. For "good", say what earns marks. For "close", name the ONE thing to add. For "not_yet", give a small clue. Never write the sentence for them.

Reply with ONLY JSON: {"verdict":"good|close|not_yet","message":""}`;
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed" }); return; }
  if (!sameSite(req)) { res.status(403).json({ error: "This only works from the study portal." }); return; }
  const key = (process.env.ANTHROPIC_API_KEY || "").trim().replace(/^["']|["']$/g, "");
  if (!key) { res.status(500).json({ error: "This isn't set up yet: ANTHROPIC_API_KEY is missing in Vercel." }); return; }

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  body = body || {};
  const action = ["check", "start"].includes(body.action) ? body.action : "plan";
  const rows = await getJson(`quiz_questions?select=id,topic_id,prompt,display,model_answer,marking_scheme,source,marks&id=eq.${encodeURIComponent(String(body.question_id || ""))}`);
  const q = rows[0];
  if (!q) { res.status(404).json({ error: "Question not found." }); return; }
  const fIn = body.feedback || {};
  const f = {
    marks_awarded: Number(fIn.marks_awarded) || 0, marks_available: Number(fIn.marks_available) || q.marks || 0,
    summary: clip(fIn.summary, 400),
    to_improve: (Array.isArray(fIn.to_improve) ? fIn.to_improve : []).slice(0, 3).map(x => clip(x, 400))
  };
  const answer = clip(body.answer, 6000);
  const [notesRow, topicRow] = await Promise.all([
    getJson(`topic_notes?select=notes&topic_id=eq.${q.topic_id}`),
    getJson(`topics?select=subject_id&id=eq.${q.topic_id}`)
  ]);
  let subject = "";
  if (topicRow[0]) { const s = await getJson(`subjects?select=title&id=eq.${topicRow[0].subject_id}`); subject = s[0] ? String(s[0].title).replace(/\s*\d+$/, "").replace(/\s*PolSoc$/i, "").trim() : ""; }
  const notes = (notesRow[0] || {}).notes || "";
  const ctx = action === "start" ? "" : context({ q, subject, notes, answer, f });

  let prompt;
  if (action === "start") prompt = startPrompt(startContext({ q, subject, notes }));
  else if (action === "plan") prompt = planPrompt(ctx);
  else {
    const st = body.step || {};
    const sentence = clip(body.sentence, 1500).trim();
    if (!sentence) { res.status(400).json({ error: "Write your sentence first." }); return; }
    prompt = checkPrompt(ctx, { title: clip(st.title, 120), why: clip(st.why, 300) }, sentence);
  }

  const qImgs = questionImages(q, req);
  const call = () => fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: Object.assign(
      { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      process.env.ANTHROPIC_WORKSPACE_ID ? { "anthropic-workspace-id": process.env.ANTHROPIC_WORKSPACE_ID.trim() } : {}
    ),
    body: JSON.stringify({ model: MODEL, max_tokens: 1500, messages: [{ role: "user", content: qImgs.length ? [{ type: "text", text: "The picture(s) below are part of the exam question:" }, ...qImgs.map(url => ({ type: "image", source: { type: "url", url } })), { type: "text", text: prompt }] : prompt }] }),
  });
  try {
    let parsed = null;
    for (let i = 0; i < 2 && !parsed; i++) {
      const r = await call();
      const data = await r.json().catch(() => ({}));
      if (!r.ok) { console.error("improve anthropic", r.status, JSON.stringify(data).slice(0, 300)); res.status(502).json({ error: "We couldn't do that just now. Please try again." }); return; }
      const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("");
      const m = text.match(/\{[\s\S]*\}/);
      try { parsed = m ? JSON.parse(m[0]) : null; } catch (e) { parsed = null; }
      if (!parsed) console.error("improve unreadable reply", data.stop_reason, text.slice(0, 300));
    }
    if (!parsed) { res.status(502).json({ error: "We couldn't do that just now. Please try again." }); return; }
    if (action === "start") {
      const points = (Array.isArray(parsed.points) ? parsed.points : []).slice(0, 5)
        .map(p => ({ title: clip(p.title, 90), hint: clip(p.hint, 240) })).filter(p => p.title);
      if (!points.length) { res.status(502).json({ error: "We couldn't do that just now. Please try again." }); return; }
      res.status(200).json({ shape: clip(parsed.shape, 240), points, opener: clip(parsed.opener, 120) });
    } else if (action === "plan") {
      const steps = (Array.isArray(parsed.steps) ? parsed.steps : []).slice(0, 3)
        .map(s => ({ title: clip(s.title, 80), why: clip(s.why, 240), hint: clip(s.hint, 300) })).filter(s => s.title);
      if (!steps.length) { res.status(502).json({ error: "We couldn't do that just now. Please try again." }); return; }
      res.status(200).json({ steps });
    } else {
      const verdict = ["good", "close", "not_yet"].includes(parsed.verdict) ? parsed.verdict : "close";
      res.status(200).json({ verdict, message: clip(parsed.message, 400) });
    }
  } catch (e) {
    console.error("improve failed", e && e.message);
    res.status(502).json({ error: "That didn't work just now. Try again in a minute." });
  }
};
