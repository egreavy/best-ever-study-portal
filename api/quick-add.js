// "What's new at school?" — turns a quick spoken or typed note like
// "econ ch 3 coming up, we did polsoc ch5, geog test friday" into a list of
// suggested changes. Nothing is saved here: the page shows the list and the
// student confirms it first. Needs ANTHROPIC_API_KEY (and ANTHROPIC_WORKSPACE_ID if used).

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";

function sameSite(req) {
  const host = req.headers["x-forwarded-host"] || req.headers.host || "";
  const from = req.headers.origin || req.headers.referer || "";
  try { return !!from && new URL(from).host === host; } catch (e) { return false; }
}

function instructions({ text, today, weekday, subjects, chapters }) {
  return `A Leaving Certificate student in Ireland typed or spoke a quick note about school. Work out what it means for their study planner.

Today is ${weekday} ${today}.

Their subjects (id | name):
${subjects.map(s => `${s.id} | ${s.title}`).join("\n")}

Their chapters (id | subject | chapter number | title | where they are now):
${chapters.map(c => `${c.id} | ${c.subject} | ${c.num ?? "-"} | ${c.title} | ${c.state}`).join("\n")}

The note: """${text}"""

Possible changes:
- "class_done": they covered a chapter in class ("we did", "finished", "covered", "done in class"). Needs topic_id.
- "coming_up": a chapter is coming up or starting in class soon ("coming up", "starting", "next week we're doing"). Needs topic_id. Add "date" (YYYY-MM-DD) only if they said when.
- "class_test": a class test, quiz or assessment on a chapter or subject. Needs "date". Add topic_id if they named a chapter or topic; otherwise leave topic_id null and give subject_id.
- "exam": a bigger exam period for a whole subject (Christmas exams, summer exams, mocks, house exams). Needs subject_id, "date" and a short "label" such as "Christmas exams".
- "deadline": homework, project or essay due. Needs subject_id, "date", a short "label", and topic_id if it's about a chapter.
- "unclear": a part you can't match confidently. Give "said" and a short "reason".

Rules:
- Students use short forms: econ = Economics, polsoc / pol soc = Politics and Society, geog / geo = Geography, rel / RE = Religion, bio, chem, hist, eng, maths. "ch5", "chapter five", "c 5" = chapter 5. They may name a chapter by its topic ("the consumer one").
- If a subject has more than one book (e.g. Religion 1 and Religion 2) and it isn't clear which, use "unclear".
- Dates: "friday" means the next Friday on or after today; "next week" means Monday of next week; "tomorrow" is today + 1. Always return YYYY-MM-DD.
- Never invent chapters or subjects that aren't in the lists. Use the exact ids.
- "said" is the short part of the note each change came from.

Reply with ONLY a JSON object, no other text:
{"actions":[{"type":"class_done|coming_up|class_test|exam|deadline|unclear","topic_id":null,"subject_id":null,"date":null,"label":null,"said":"","reason":null}]}`;
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
  const text = String(body.text || "").slice(0, 1000).trim();
  if (!text) { res.status(400).json({ error: "Say or type what's new first." }); return; }
  const subjects = (Array.isArray(body.subjects) ? body.subjects : []).slice(0, 40).map(s => ({ id: String(s.id), title: String(s.title).slice(0, 80) }));
  const chapters = (Array.isArray(body.chapters) ? body.chapters : []).slice(0, 600).map(c => ({ id: String(c.id), subject: String(c.subject).slice(0, 80), num: c.num, title: String(c.title).slice(0, 120), state: String(c.state || "").slice(0, 40) }));
  const today = /^\d{4}-\d{2}-\d{2}$/.test(body.today || "") ? body.today : new Date().toISOString().slice(0, 10);
  const weekday = String(body.weekday || "").slice(0, 12);

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: Object.assign(
        { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
        process.env.ANTHROPIC_WORKSPACE_ID ? { "anthropic-workspace-id": process.env.ANTHROPIC_WORKSPACE_ID.trim() } : {}
      ),
      body: JSON.stringify({ model: MODEL, max_tokens: 1200, messages: [{ role: "user", content: instructions({ text, today, weekday, subjects, chapters }) }] }),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      console.error("quick-add anthropic", r.status, JSON.stringify(data).slice(0, 400));
      res.status(502).json({ error: `Couldn't read that just now (${r.status}). Try again.` });
      return;
    }
    const out = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("");
    const m = out.match(/\{[\s\S]*\}/);
    let parsed = null;
    try { parsed = m ? JSON.parse(m[0]) : null; } catch (e) { parsed = null; }
    if (!parsed || !Array.isArray(parsed.actions)) { res.status(502).json({ error: "That didn't come back right. Try again." }); return; }
    const topicIds = new Set(chapters.map(c => c.id)), subjectIds = new Set(subjects.map(s => s.id));
    const TYPES = ["class_done", "coming_up", "class_test", "exam", "deadline", "unclear"];
    const actions = parsed.actions.slice(0, 12).map(a => ({
      type: TYPES.includes(a.type) ? a.type : "unclear",
      topic_id: topicIds.has(String(a.topic_id)) ? String(a.topic_id) : null,
      subject_id: subjectIds.has(String(a.subject_id)) ? String(a.subject_id) : null,
      date: /^\d{4}-\d{2}-\d{2}$/.test(a.date || "") ? a.date : null,
      label: a.label ? String(a.label).slice(0, 60) : null,
      said: String(a.said || "").slice(0, 120),
      reason: a.reason ? String(a.reason).slice(0, 160) : null
    })).map(a => {
      if ((a.type === "class_done" || a.type === "coming_up") && !a.topic_id) return { ...a, type: "unclear", reason: a.reason || "Couldn't tell which chapter." };
      if ((a.type === "class_test" || a.type === "exam" || a.type === "deadline") && !a.date) return { ...a, type: "unclear", reason: a.reason || "Couldn't tell which day." };
      if ((a.type === "exam" || a.type === "class_test" || a.type === "deadline") && !a.subject_id && !a.topic_id) return { ...a, type: "unclear", reason: a.reason || "Couldn't tell which subject." };
      return a;
    });
    res.status(200).json({ actions });
  } catch (e) {
    console.error("quick-add failed", e && e.message);
    res.status(502).json({ error: "Couldn't read that just now. Try again in a minute." });
  }
};
