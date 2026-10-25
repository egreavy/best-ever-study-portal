// "Add my notes": reads a student's notes (typed, photos of handwriting, or a PDF), works out which parts
// of the chapter they cover, and writes quiz questions from them. Nothing is saved here: the page saves
// the notes and questions after this returns. Needs ANTHROPIC_API_KEY (and ANTHROPIC_WORKSPACE_ID if used).

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";
const MAX_IMAGES = 6;

function sameSite(req) {
  const host = req.headers["x-forwarded-host"] || req.headers.host || "";
  const from = req.headers.origin || req.headers.referer || "";
  try { return !!from && new URL(from).host === host; } catch (e) { return false; }
}

function instructions({ text, chapter, subject, labels, course, hasFiles }) {
  return `A Leaving Certificate student in Ireland has added their own notes for a chapter. Read them, work out which parts of the course they cover, and write quiz questions from them.

Subject: ${subject || "unknown"}
Chapter: ${chapter || "unknown"}

The course topics in this chapter (use these exact words in "covered"):
${labels.length ? labels.map(l => `- ${l}`).join("\n") : "(none listed)"}

What the course says, as a sample of its questions and answers (id | topic | question | answer):
${course.length ? course.map(c => `${c.id} | ${c.label} | ${c.prompt} | ${c.answer}`).join("\n") : "(none)"}

${hasFiles ? "The notes are in the attached photo(s) or PDF. Read handwriting carefully." : ""}${text ? `\nTyped notes:\n"""${text}"""` : ""}

Do this:
1. "notes_text": the notes as plain text, as written (tidy obvious typos only). Keep it under 6000 characters.
2. "title": a short name for these notes, 2 to 6 words (e.g. "Class notes: law of demand").
3. "covered": which of the course topics listed above these notes cover. Only use topics from the list. Leave it empty if none match.
4. "questions": 8 multiple choice and 2 short answer questions, ONLY about what is in the notes. Leaving Cert standard, plain words, one idea per question.
   - multiple choice: 4 options, one clearly right, 3 believable wrong ones; "explanation" is one sentence saying why the answer is right.
   - short answer: needs a 1 to 3 sentence answer; "model_answer" is a full answer in plain words.
   - "label" is the course topic it belongs to (from the list) or a short label of your own.
   If the notes are too short for 10 good questions, write fewer. Never invent facts that aren't in the notes.
5. "conflicts": anything in the notes that disagrees with the course answers above or is clearly wrong, as {"notes_say": "...", "course_says": "..."}. Usually none. Don't nitpick wording.
6. If the photos or file aren't readable notes, return empty questions and say why in "problem".

Reply with ONLY a JSON object, no other text:
{"title":"","notes_text":"","covered":[],"questions":[{"qtype":"mcq","prompt":"","options":["","","",""],"answer_index":0,"explanation":"","label":""},{"qtype":"recall","prompt":"","model_answer":"","label":""}],"conflicts":[],"problem":null}`;
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
  const text = String(body.text || "").slice(0, 12000).trim();
  const images = (Array.isArray(body.images) ? body.images : []).slice(0, MAX_IMAGES).map(String).filter(s => /^data:image\/(jpeg|png|webp);base64,/.test(s));
  const pdf = /^data:application\/pdf;base64,/.test(String(body.pdf || "")) ? String(body.pdf) : "";
  if (!text && !images.length && !pdf) { res.status(400).json({ error: "Type, photograph or upload your notes first." }); return; }
  const labels = (Array.isArray(body.labels) ? body.labels : []).slice(0, 40).map(l => String(l).slice(0, 80)).filter(Boolean);
  const course = (Array.isArray(body.course) ? body.course : []).slice(0, 60).map(c => ({ id: String(c.id).slice(0, 60), label: String(c.label || "").slice(0, 80), prompt: String(c.prompt || "").slice(0, 220), answer: String(c.answer || "").slice(0, 220) }));

  const content = [];
  if (pdf) content.push({ type: "document", source: { type: "base64", media_type: "application/pdf", data: pdf.split(",")[1] } });
  images.forEach(d => { const [, mt, data] = d.match(/^data:(image\/\w+);base64,(.*)$/); content.push({ type: "image", source: { type: "base64", media_type: mt, data } }); });
  content.push({ type: "text", text: instructions({ text, chapter: String(body.chapter || "").slice(0, 120), subject: String(body.subject || "").slice(0, 60), labels, course, hasFiles: !!(pdf || images.length) }) });

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: Object.assign(
        { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
        process.env.ANTHROPIC_WORKSPACE_ID ? { "anthropic-workspace-id": process.env.ANTHROPIC_WORKSPACE_ID.trim() } : {}
      ),
      body: JSON.stringify({ model: MODEL, max_tokens: 6000, messages: [{ role: "user", content }] }),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      console.error("notes anthropic", r.status, JSON.stringify(data).slice(0, 400));
      res.status(502).json({ error: `Couldn't read your notes just now (${r.status}). Try again.` });
      return;
    }
    const out = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("");
    const m = out.match(/\{[\s\S]*\}/);
    let p = null;
    try { p = m ? JSON.parse(m[0]) : null; } catch (e) { p = null; }
    if (!p) { res.status(502).json({ error: "That didn't come back right. Try again." }); return; }
    const labelSet = new Set(labels.map(l => l.toLowerCase()));
    const questions = (Array.isArray(p.questions) ? p.questions : []).slice(0, 12).map(q => {
      const label = String(q.label || "").slice(0, 80);
      if (q.qtype === "mcq") {
        const options = (Array.isArray(q.options) ? q.options : []).slice(0, 4).map(o => String(o).slice(0, 200));
        const ai = Number(q.answer_index);
        if (options.length !== 4 || !(ai >= 0 && ai <= 3) || !q.prompt) return null;
        return { qtype: "mcq", prompt: String(q.prompt).slice(0, 400), options, answer_index: ai, explanation: String(q.explanation || "").slice(0, 400), label };
      }
      if (!q.prompt || !q.model_answer) return null;
      return { qtype: "recall", prompt: String(q.prompt).slice(0, 400), model_answer: String(q.model_answer).slice(0, 800), label };
    }).filter(Boolean);
    res.status(200).json({
      title: String(p.title || "My notes").slice(0, 80),
      notes_text: String(p.notes_text || text).slice(0, 8000),
      covered: (Array.isArray(p.covered) ? p.covered : []).map(String).filter(l => labelSet.has(l.toLowerCase())).slice(0, 20),
      questions,
      conflicts: (Array.isArray(p.conflicts) ? p.conflicts : []).slice(0, 5).map(c => ({ notes_say: String(c.notes_say || "").slice(0, 300), course_says: String(c.course_says || "").slice(0, 300) })).filter(c => c.notes_say),
      problem: p.problem ? String(p.problem).slice(0, 200) : null
    });
  } catch (e) {
    console.error("notes failed", e && e.message);
    res.status(502).json({ error: "Couldn't read your notes just now. Try again in a minute." });
  }
};
