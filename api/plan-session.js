// "Today's session" — turns what a student says they want to study today, like
// "revise evidence for jesus, test the consumer", into a list of chapters and
// what to do in each. Nothing is saved here: the page builds the session from it.
// Needs ANTHROPIC_API_KEY (and ANTHROPIC_WORKSPACE_ID if used).

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";

function sameSite(req) {
  const host = req.headers["x-forwarded-host"] || req.headers.host || "";
  const from = req.headers.origin || req.headers.referer || "";
  try { return !!from && new URL(from).host === host; } catch (e) { return false; }
}

function instructions({ text, subjects, chapters }) {
  return `A Leaving Certificate student in Ireland said what they want to study in this session. Turn it into a short list of chapters and what to do in each.

Their subjects (id | name):
${subjects.map(s => `${s.id} | ${s.title}`).join("\n")}

Their chapters (id | subject | chapter number | title | where they are now):
${chapters.map(c => `${c.id} | ${c.subject} | ${c.num ?? "-"} | ${c.title} | ${c.state}`).join("\n")}

What they said: """${text}"""

For each part, pick ONE of:
- "test": quiz or test themselves on a chapter ("test", "quiz me", "quick test", "practise", "questions on", "go over what I got wrong").
- "revise": go back over a chapter and then test it ("revise", "go over", "recap", "brush up on", "study").
- "learn": learn a chapter for the first time or read/watch the material ("learn", "read", "watch the video", "start", "new chapter").
- "exam": answer a real exam question on a chapter ("exam question", "past paper", "long question", "essay").
- "unclear": a part you can't match to one chapter confidently. Give "said", a short "reason", and subject_id if you know the subject.

Rules:
- Students use short forms: econ = Economics, polsoc / pol soc = Politics and Society, geog / geo = Geography, rel / RE = Religion, bio, chem, hist, eng, maths. "ch5", "chapter five", "c 5" = chapter 5. They often name a chapter by its topic or a key word in it ("the consumer one", "Plato", "evidence for Jesus").
- If a subject has more than one book (e.g. Religion 1 and Religion 2), use whichever book the words match. If it could be either, still pick your best match but set "sure": false.
- Set "sure": false whenever you matched by a loose key word rather than the chapter number or a clear title match.
- If they name a whole subject with no chapter ("do some econ"), pick the chapter from that subject that is furthest along in testing, with "sure": false.
- Never invent chapters or subjects that aren't in the lists. Use the exact ids. At most 6 items, in the order they said them.
- "said" is the short part of what they said that each item came from.

Reply with ONLY a JSON object, no other text:
{"items":[{"kind":"test|revise|learn|exam|unclear","topic_id":null,"subject_id":null,"sure":true,"said":"","reason":null}]}`;
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
  if (!text) { res.status(400).json({ error: "Say or type what you'd like to study first." }); return; }
  const subjects = (Array.isArray(body.subjects) ? body.subjects : []).slice(0, 40).map(s => ({ id: String(s.id), title: String(s.title).slice(0, 80) }));
  const chapters = (Array.isArray(body.chapters) ? body.chapters : []).slice(0, 600).map(c => ({ id: String(c.id), subject: String(c.subject).slice(0, 80), num: c.num, title: String(c.title).slice(0, 120), state: String(c.state || "").slice(0, 60) }));

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: Object.assign(
        { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
        process.env.ANTHROPIC_WORKSPACE_ID ? { "anthropic-workspace-id": process.env.ANTHROPIC_WORKSPACE_ID.trim() } : {}
      ),
      body: JSON.stringify({ model: MODEL, max_tokens: 1000, messages: [{ role: "user", content: instructions({ text, subjects, chapters }) }] }),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      console.error("plan-session anthropic", r.status, JSON.stringify(data).slice(0, 400));
      res.status(502).json({ error: `Couldn't read that just now (${r.status}). Try again.` });
      return;
    }
    const out = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("");
    const m = out.match(/\{[\s\S]*\}/);
    let parsed = null;
    try { parsed = m ? JSON.parse(m[0]) : null; } catch (e) { parsed = null; }
    if (!parsed || !Array.isArray(parsed.items)) { res.status(502).json({ error: "That didn't come back right. Try again." }); return; }
    const topicIds = new Set(chapters.map(c => c.id)), subjectIds = new Set(subjects.map(s => s.id));
    const KINDS = ["test", "revise", "learn", "exam", "unclear"];
    const items = parsed.items.slice(0, 6).map(a => ({
      kind: KINDS.includes(a.kind) ? a.kind : "unclear",
      topic_id: topicIds.has(String(a.topic_id)) ? String(a.topic_id) : null,
      subject_id: subjectIds.has(String(a.subject_id)) ? String(a.subject_id) : null,
      sure: a.sure !== false,
      said: String(a.said || "").slice(0, 120),
      reason: a.reason ? String(a.reason).slice(0, 160) : null
    })).map(a => (a.kind !== "unclear" && !a.topic_id) ? { ...a, kind: "unclear", reason: a.reason || "Couldn't tell which chapter." } : a);
    res.status(200).json({ items });
  } catch (e) {
    console.error("plan-session failed", e && e.message);
    res.status(502).json({ error: "Couldn't read that just now. Try again in a minute." });
  }
};
