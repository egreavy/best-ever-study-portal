// Marks a student's typed or photographed answer against the question's marking scheme
// and suggests improvements. Needs ANTHROPIC_API_KEY in Vercel's environment variables
// (plus ANTHROPIC_WORKSPACE_ID if the key isn't tied to a workspace).

const SUPABASE_URL = "https://dhxwajidrtyukyxmiyml.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoeHdhamlkcnR5dWt5eG1peW1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzMzYyNzQsImV4cCI6MjA1MTkxMjI3NH0.fnH1eI1vLtQASjII_6K0d6NZevD62tnthXe0uyMgh0s";
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";
const MAX_IMAGES = 3;

function sameSite(req) {
  const host = req.headers["x-forwarded-host"] || req.headers.host || "";
  const from = req.headers.origin || req.headers.referer || "";
  try { return !!from && new URL(from).host === host; } catch (e) { return false; }
}

async function getQuestion(id) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/quiz_questions?select=id,topic_id,qtype,topic_label,prompt,display,model_answer,marking_scheme,source,marks&id=eq.${encodeURIComponent(id)}`,
    { headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY } });
  const rows = r.ok ? await r.json() : [];
  return rows[0] || null;
}

// [[img: qimg/file.png | description]] lines in the question's layout -> absolute URLs on this site
function questionImages(q, req) {
  const host = req.headers["x-forwarded-host"] || req.headers.host || "";
  if (!q.display || !host) return [];
  const out = [];
  String(q.display).replace(/\[\[img:\s*([^|\]]+)/gi, (m, p) => { const path = p.trim().replace(/^\/+/, ""); if (/^qimg\/[\w.-]+$/.test(path)) out.push(`https://${host}/${path}`); return m; });
  return out.slice(0, 4);
}

async function subjectFor(topicId) {
  try {
    const h = { headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY } };
    const t = await (await fetch(`${SUPABASE_URL}/rest/v1/topics?select=subject_id&id=eq.${encodeURIComponent(topicId)}`, h)).json();
    if (!t[0]) return "";
    const s = await (await fetch(`${SUPABASE_URL}/rest/v1/subjects?select=title&id=eq.${t[0].subject_id}`, h)).json();
    return s[0] ? String(s[0].title).replace(/\s*\d+$/, "").replace(/\s*PolSoc$/i, "").trim() : "";
  } catch (e) { return ""; }
}

function instructions(q, hasImages, typed, subject) {
  const marks = q.marks || 5;
  return `You are an experienced Leaving Certificate Higher Level ${subject || "Politics and Society"} examiner, and a kind, encouraging tutor. The student is dyslexic.

Mark the student's answer to this question exactly as the State Examinations Commission would, using the marking scheme, then give feedback that helps them improve.

Question (${q.source || "practice question"}, ${marks} marks): ${q.prompt}

Marking scheme: ${q.marking_scheme || `Very good 4-5, good 2-3, fair 0-1 (out of ${marks}).`}

A full-marks model answer, for your reference only: ${q.model_answer || "(none)"}

${hasImages ? "The student's answer is in the attached photo(s) or screenshot(s). Read it carefully, including handwriting." : ""}${typed ? `\nThe student's typed answer:\n"""${typed}"""` : ""}

${q.qtype !== "exam" ? `IMPORTANT: this is a quick short-answer check, not an exam question. In "summary", "went_well", "to_improve", "example" and "next_step", never mention marks, scoring, full marks or losing marks. Just say plainly what is right and what is missing. (Still fill in the number fields.)

` : ""}Rules:
- Never take marks off for spelling, grammar or handwriting. Mark the ideas.
- Be specific: say which point earned marks and exactly what was missing.
- Feedback in plain, short sentences a 16-year-old can act on. No jargon. Calm and matter-of-fact: no exclamation marks, no gushing praise (great, amazing, excellent); say specifically what earned marks.
- Don't rewrite the whole answer for them. You may give one example sentence showing how to improve one point.
- If the photo can't be read or isn't an answer to this question, say so in "summary" and give 0 marks.

Reply with ONLY a JSON object, no other text:
{"transcription": "what the student wrote, as you read it (short; fix nothing)",
 "marks_awarded": number,
 "marks_available": ${marks},
 "summary": "one honest, calm sentence on the overall answer",
 "went_well": ["up to 3 specific things that earned marks; put the most important FIRST, as one short sentence"],
 "to_improve": ["up to 3 specific, actionable changes that would earn more marks, ordered by how many marks each would gain, biggest FIRST; each one short sentence"],
 "example": "one example sentence showing how to improve a point, or empty string",
 "next_step": "one short thing to practise next"}`;
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed" }); return; }
  if (!sameSite(req)) { res.status(403).json({ error: "This link only works from the study portal." }); return; }
  const key = (process.env.ANTHROPIC_API_KEY || "").trim().replace(/^["']|["']$/g, "");
  if (!key) { res.status(500).json({ error: "Answer feedback isn't set up yet: ANTHROPIC_API_KEY is missing in Vercel." }); return; }

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  body = body || {};
  const typed = String(body.answer_text || "").slice(0, 8000).trim();
  const images = (Array.isArray(body.images) ? body.images : []).slice(0, MAX_IMAGES)
    .map(s => String(s)).filter(s => /^data:image\/(jpeg|png|webp);base64,/.test(s));
  if (!typed && !images.length) { res.status(400).json({ error: "Type an answer or add a photo first." }); return; }

  const q = await getQuestion(String(body.question_id || ""));
  if (!q) { res.status(404).json({ error: "Question not found." }); return; }

  // Pictures that are part of the exam question itself (graphs, cartoons, maps) go first, labelled
  const content = [];
  const qImgs = questionImages(q, req);
  if (qImgs.length) {
    content.push({ type: "text", text: "The picture(s) below are part of the exam QUESTION (not the student's answer):" });
    qImgs.forEach(url => content.push({ type: "image", source: { type: "url", url } }));
  }
  if (images.length && qImgs.length) content.push({ type: "text", text: "The photo(s) below are the STUDENT'S ANSWER:" });
  images.forEach(d => {
    const [, mt, data] = d.match(/^data:(image\/\w+);base64,(.*)$/);
    content.push({ type: "image", source: { type: "base64", media_type: mt, data } });
  });
  const subject = await subjectFor(q.topic_id);
  content.push({ type: "text", text: instructions(q, images.length > 0, typed, subject) });

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: Object.assign(
        { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
        process.env.ANTHROPIC_WORKSPACE_ID ? { "anthropic-workspace-id": process.env.ANTHROPIC_WORKSPACE_ID.trim() } : {}
      ),
      body: JSON.stringify({ model: MODEL, max_tokens: 1500, messages: [{ role: "user", content }] }),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      console.error("mark-answer anthropic", r.status, JSON.stringify(data).slice(0, 500));
      const reason = data && data.error && data.error.message ? `: ${String(data.error.message).slice(0, 160)}` : "";
      res.status(502).json({ error: r.status === 401 ? `The Anthropic key was refused (401${reason}).` : `Feedback couldn't be generated (${r.status}${reason}).` });
      return;
    }
    const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("");
    const m = text.match(/\{[\s\S]*\}/);
    let fb = null;
    try { fb = m ? JSON.parse(m[0]) : null; } catch (e) { fb = null; }
    if (!fb || typeof fb.marks_awarded !== "number") { res.status(502).json({ error: "Feedback came back in the wrong shape. Try again." }); return; }
    const avail = Number(fb.marks_available) || q.marks || 5;
    fb.marks_available = avail;
    fb.marks_awarded = Math.max(0, Math.min(avail, Math.round(fb.marks_awarded * 2) / 2));
    ["went_well", "to_improve"].forEach(k => { fb[k] = (Array.isArray(fb[k]) ? fb[k] : []).slice(0, 3).map(String); });
    res.status(200).json({ feedback: fb });
  } catch (e) {
    console.error("mark-answer failed", e && e.message);
    res.status(502).json({ error: "Feedback couldn't be generated. Try again in a minute." });
  }
};
