// "Improve it step by step": after an answer is marked, turn the feedback into up to three
// short steps (plan), then check the one sentence the student writes for each step (check).
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

Reply with ONLY JSON: {"steps":[{"title":"","why":"","hint":""}]}`;
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
  const action = body.action === "check" ? "check" : "plan";
  const rows = await getJson(`quiz_questions?select=id,topic_id,prompt,model_answer,marking_scheme,source,marks&id=eq.${encodeURIComponent(String(body.question_id || ""))}`);
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
  const ctx = context({ q, subject, notes: (notesRow[0] || {}).notes || "", answer, f });

  let prompt;
  if (action === "plan") prompt = planPrompt(ctx);
  else {
    const st = body.step || {};
    const sentence = clip(body.sentence, 1500).trim();
    if (!sentence) { res.status(400).json({ error: "Write your sentence first." }); return; }
    prompt = checkPrompt(ctx, { title: clip(st.title, 120), why: clip(st.why, 300) }, sentence);
  }

  const call = () => fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: Object.assign(
      { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      process.env.ANTHROPIC_WORKSPACE_ID ? { "anthropic-workspace-id": process.env.ANTHROPIC_WORKSPACE_ID.trim() } : {}
    ),
    body: JSON.stringify({ model: MODEL, max_tokens: 700, messages: [{ role: "user", content: prompt }] }),
  });
  try {
    let parsed = null;
    for (let i = 0; i < 2 && !parsed; i++) {
      const r = await call();
      const data = await r.json().catch(() => ({}));
      if (!r.ok) { console.error("improve anthropic", r.status, JSON.stringify(data).slice(0, 300)); res.status(502).json({ error: `That didn't work just now (${r.status}). Try again.` }); return; }
      const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("");
      const m = text.match(/\{[\s\S]*\}/);
      try { parsed = m ? JSON.parse(m[0]) : null; } catch (e) { parsed = null; }
    }
    if (!parsed) { res.status(502).json({ error: "That came back in the wrong shape. Try again." }); return; }
    if (action === "plan") {
      const steps = (Array.isArray(parsed.steps) ? parsed.steps : []).slice(0, 3)
        .map(s => ({ title: clip(s.title, 80), why: clip(s.why, 240), hint: clip(s.hint, 300) })).filter(s => s.title);
      if (!steps.length) { res.status(502).json({ error: "Couldn't work out the steps. Try again." }); return; }
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
