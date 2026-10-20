// "Improve this with my tutor" (typed version): a short text chat that coaches the student
// to improve ONE answer that has just been marked. Much cheaper than the voice call.
// Needs ANTHROPIC_API_KEY (and ANTHROPIC_WORKSPACE_ID if used).

const SUPABASE_URL = "https://dhxwajidrtyukyxmiyml.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoeHdhamlkcnR5dWt5eG1peW1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzMzYyNzQsImV4cCI6MjA1MTkxMjI3NH0.fnH1eI1vLtQASjII_6K0d6NZevD62tnthXe0uyMgh0s";
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";
const MAX_TURNS = 14; // student messages per chat

function sameSite(req) {
  const host = req.headers["x-forwarded-host"] || req.headers.host || "";
  const from = req.headers.origin || req.headers.referer || "";
  try { return !!from && new URL(from).host === host; } catch (e) { return false; }
}
const H = { headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY } };
async function getJson(path) {
  try { const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, H); return r.ok ? await r.json() : []; } catch (e) { return []; }
}

function system({ q, subject, notes, name, answer, f }) {
  const score = f.marks_available ? `${f.marks_awarded} out of ${f.marks_available}` : "";
  return `You are ${name}'s tutor for Leaving Certificate Higher Level ${subject || "this subject"}. ${name} is dyslexic. This is a short typed chat about ONE answer ${name} has just written and had marked. Your job is to coach ${name} to improve it, not to give the answer.

The question (${q.source || "practice question"}, ${q.marks || 5} marks):
${q.prompt}

${name}'s answer:
${answer || "(the answer was a photo; use the marker's notes)"}

How it was marked${score ? `: ${score}` : ""}. ${f.summary || ""}
What went well: ${(f.went_well || []).join(" ") || "-"}
What to improve: ${(f.to_improve || []).join(" ") || "-"}
Marking scheme: ${q.marking_scheme || "-"}
Model answer (for YOU only, never paste or recite it): ${q.model_answer || "-"}

How to write:
- Very short messages: one to three short sentences. Plain everyday words. No headings, no bullet lists, no bold.
- Your first message: one specific thing ${name} did well, then the biggest missing point as a question that leads ${name} to it.
- Work through at most three missing points, one at a time. Ask, wait for ${name}'s reply, respond.
- If stuck, give a small hint. Only explain the point fully after a second try.
- When ${name} has the idea, help them turn it into one clear exam sentence and say "Add that to your answer."
- Never write the full answer or a full paragraph for ${name} to copy.
- Ignore spelling and typing mistakes completely. Judge the idea.
- Use only facts from the chapter notes below.
- When the main points are covered, or ${name} wants to stop, finish with one or two sentences on what to add, then: "Tap Try writing it again and add those points."

Chapter notes:
${notes || "(no notes for this chapter)"}`;
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
  const qid = String(body.question_id || "");
  const rows = await getJson(`quiz_questions?select=id,topic_id,prompt,model_answer,marking_scheme,source,marks&id=eq.${encodeURIComponent(qid)}`);
  const q = rows[0];
  if (!q) { res.status(404).json({ error: "Question not found." }); return; }
  const fIn = body.feedback || {};
  const f = {
    marks_awarded: Number(fIn.marks_awarded) || 0, marks_available: Number(fIn.marks_available) || 0,
    summary: String(fIn.summary || "").slice(0, 400),
    went_well: (Array.isArray(fIn.went_well) ? fIn.went_well : []).slice(0, 3).map(x => String(x).slice(0, 300)),
    to_improve: (Array.isArray(fIn.to_improve) ? fIn.to_improve : []).slice(0, 3).map(x => String(x).slice(0, 300))
  };
  const answer = String(body.answer || "").slice(0, 6000);
  const name = String(body.name || "the student").slice(0, 40);
  const msgs = (Array.isArray(body.messages) ? body.messages : []).slice(-30)
    .map(m => ({ role: m.role === "user" ? "user" : "assistant", content: String(m.text || "").slice(0, 2000) }))
    .filter(m => m.content.trim());
  if (msgs.filter(m => m.role === "user").length > MAX_TURNS) {
    res.status(200).json({ reply: "We've covered a lot. Tap Try writing it again and add the points we talked about.", done: true });
    return;
  }
  // The conversation must start with the student; the first call just asks the tutor to begin.
  const convo = [{ role: "user", content: "(I'm ready. Start the coaching.)" }, ...msgs];
  const merged = [];
  convo.forEach(m => { const last = merged[merged.length - 1]; if (last && last.role === m.role) last.content += "\n" + m.content; else merged.push({ ...m }); });
  if (merged[merged.length - 1].role !== "user") { res.status(400).json({ error: "Write a reply first." }); return; }

  const [notesRow, topicRow] = await Promise.all([
    getJson(`topic_notes?select=notes&topic_id=eq.${q.topic_id}`),
    getJson(`topics?select=subject_id&id=eq.${q.topic_id}`)
  ]);
  let subject = "";
  if (topicRow[0]) { const s = await getJson(`subjects?select=title&id=eq.${topicRow[0].subject_id}`); subject = s[0] ? String(s[0].title).replace(/\s*\d+$/, "").replace(/\s*PolSoc$/i, "").trim() : ""; }

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: Object.assign(
        { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
        process.env.ANTHROPIC_WORKSPACE_ID ? { "anthropic-workspace-id": process.env.ANTHROPIC_WORKSPACE_ID.trim() } : {}
      ),
      body: JSON.stringify({ model: MODEL, max_tokens: 400, system: system({ q, subject, notes: (notesRow[0] || {}).notes || "", name, answer, f }), messages: merged }),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      console.error("coach-chat anthropic", r.status, JSON.stringify(data).slice(0, 400));
      res.status(502).json({ error: `Your tutor couldn't reply just now (${r.status}). Try again.` });
      return;
    }
    const reply = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("").trim();
    if (!reply) { res.status(502).json({ error: "Your tutor didn't reply. Try again." }); return; }
    res.status(200).json({ reply, done: /Try writing it again/i.test(reply) });
  } catch (e) {
    console.error("coach-chat failed", e && e.message);
    res.status(502).json({ error: "Your tutor couldn't reply just now. Try again in a minute." });
  }
};
