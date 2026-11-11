// Study nudge by text message. Runs once a day from the Vercel cron (see vercel.json).
// If a student has recorded nothing for 48 hours, text them one small, specific thing to do.
// At most one text every 48 hours; after 3 unanswered texts, stop and text the parent instead.
//
// Vercel settings (Environment Variables):
//   TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM (the Twilio number, e.g. +15551234567)
//   NUDGE_STUDENTS  JSON, e.g. {"8d1d2f44-...":{"name":"Daniel","phone":"+35387...","page":"daniel.html"}}
//   NUDGE_PARENT_PHONE  e.g. +35386...
//   CRON_SECRET  any long random text; Vercel sends it with the daily run
// Manual check: /api/nudge?key=<CRON_SECRET>&dry=1 shows what would be sent without sending.
// Force one test text: /api/nudge?key=<CRON_SECRET>&test=<profile id>

const SUPABASE_URL = "https://dhxwajidrtyukyxmiyml.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoeHdhamlkcnR5dWt5eG1peW1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzMzYyNzQsImV4cCI6MjA1MTkxMjI3NH0.fnH1eI1vLtQASjII_6K0d6NZevD62tnthXe0uyMgh0s";
const SITE = "sosstudyspace.com";
const HOUR = 3600000, QUIET_HOURS = 48, MAX_UNANSWERED = 3;

const H = { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY };
async function get(path) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { headers: H });
  if (!r.ok) throw new Error(`read ${path.split("?")[0]} ${r.status}`);
  return r.json();
}
async function logNudge(row) {
  await fetch(`${SUPABASE_URL}/rest/v1/nudges`, { method: "POST", headers: Object.assign({ "Content-Type": "application/json", Prefer: "return=minimal" }, H), body: JSON.stringify([row]) }).catch(() => {});
}
const env = k => (process.env[k] || "").trim().replace(/^["']|["']$/g, "");

async function sendSms(to, body) {
  const sid = env("TWILIO_ACCOUNT_SID"), tok = env("TWILIO_AUTH_TOKEN"), from = env("TWILIO_FROM");
  if (!sid || !tok || !from) return { ok: false, error: "Twilio settings missing in Vercel" };
  const r = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: { Authorization: "Basic " + Buffer.from(`${sid}:${tok}`).toString("base64"), "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ To: to, From: from, Body: body }).toString(),
  });
  const d = await r.json().catch(() => ({}));
  return r.ok ? { ok: true, sid: d.sid } : { ok: false, error: `${d.code || r.status} ${d.message || ""}`.trim() };
}

const latest = rows => rows.reduce((m, r) => Math.max(m, new Date(r.at || r.created_at || r.updated_at).getTime() || 0), 0);
// "Ch 2: The Role of the State" -> "Ch 2"; untitled-number chapters keep a short name (plain characters only, so it stays one text)
const shortChapter = t => { const m = /^Ch\s*(\d+)/i.exec(String(t || "")); if (m) return "Ch " + m[1]; const s = String(t || "").replace(/[^\x20-\x7E]/g, ""); return s.length > 30 ? s.slice(0, 30).replace(/\s+\S*$/, "") : s; };
const subjectName = t => String(t || "").replace(/\s*\d+$/, "").replace(/\s*PolSoc$/i, "").trim();

// Work out the last activity and one small, specific suggestion
async function lookAt(id) {
  const since = new Date(Date.now() - 60 * 24 * HOUR).toISOString();
  const [time, attempts, learn, tutor, nudges] = await Promise.all([
    get(`study_time?select=created_at,topic_id&profile_id=eq.${id}&created_at=gte.${since}&order=created_at.desc&limit=50`),
    get(`quiz_attempts?select=created_at,question_id&profile_id=eq.${id}&created_at=gte.${since}&order=created_at.desc&limit=50`),
    get(`nlm_progress?select=updated_at,topic_id&profile_id=eq.${id}&done=eq.true&updated_at=gte.${since}&order=updated_at.desc&limit=50`),
    get(`tutor_sessions?select=created_at&profile_id=eq.${id}&created_at=gte.${since}&order=created_at.desc&limit=5`),
    get(`nudges?select=sent_at,audience,status&profile_id=eq.${id}&order=sent_at.desc&limit=20`),
  ]);
  const last = Math.max(latest(time), latest(attempts), latest(learn), latest(tutor));
  // The chapter he was last on: from testing time or learning steps (both carry a chapter)
  const recent = [...time.map(r => ({ t: r.created_at, topic: r.topic_id })), ...learn.map(r => ({ t: r.updated_at, topic: r.topic_id }))]
    .filter(r => r.topic).sort((a, b) => new Date(b.t) - new Date(a.t));
  let chapter = null, subject = null;
  if (recent[0]) {
    const tp = (await get(`topics?select=title,subject_id&id=eq.${recent[0].topic}`))[0];
    if (tp) { chapter = tp.title; const s = (await get(`subjects?select=title&id=eq.${tp.subject_id}`))[0]; subject = s ? subjectName(s.title) : null; }
  }
  if (!subject) {
    const s = (await get(`subjects?select=title&user_id=eq.${id}&order=title.asc&limit=1`))[0];
    subject = s ? subjectName(s.title) : null;
  }
  const sent = nudges.filter(n => n.status === "sent");
  const studentSince = sent.filter(n => n.audience === "student" && new Date(n.sent_at).getTime() > last);
  const parentSince = sent.filter(n => n.audience === "parent" && new Date(n.sent_at).getTime() > last);
  const lastStudent = sent.find(n => n.audience === "student");
  return { last, subject, chapter, unanswered: studentSince.length, parentTold: parentSince.length > 0, lastNudge: lastStudent ? new Date(lastStudent.sent_at).getTime() : 0 };
}

function studentText(st, info, n) {
  const what = info.chapter ? `10 quick questions on ${info.subject ? info.subject + " " : ""}${shortChapter(info.chapter)}` : info.subject ? `10 quick questions on ${info.subject}` : "one round of 10 quick questions";
  const open = ["Hi " + st.name + ", 15 mins today?", "Quick one " + st.name + ":", st.name + ", 15 mins tonight?"][n % 3];
  return `${open} Try ${what}. ${SITE}/${st.page}`;
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const secret = env("CRON_SECRET");
  const auth = req.headers.authorization || "";
  const key = (req.query && req.query.key) || "";
  if (!secret || (auth !== `Bearer ${secret}` && key !== secret)) { res.status(401).json({ error: "Not allowed" }); return; }

  let students = {};
  try { students = JSON.parse(env("NUDGE_STUDENTS") || "{}"); } catch (e) { res.status(500).json({ error: "NUDGE_STUDENTS isn't valid JSON" }); return; }
  const dry = !!(req.query && req.query.dry), test = (req.query && req.query.test) || "";
  const parentPhone = env("NUDGE_PARENT_PHONE");
  const now = Date.now(), report = [];

  for (const [id, st] of Object.entries(students)) {
    if (!st || !st.phone || (test && test !== id)) continue;
    st.name = st.name || "there"; st.page = st.page || "";
    try {
      const info = await lookAt(id);
      const idleH = info.last ? Math.round((now - info.last) / HOUR) : null;
      const out = { student: st.name, last_activity: info.last ? new Date(info.last).toISOString() : "none in 60 days", idle_hours: idleH, unanswered: info.unanswered };
      let audience = null, to = null, body = null;
      if (test) { audience = "student"; to = st.phone; body = studentText(st, info, info.unanswered); }
      else if (idleH !== null && idleH < QUIET_HOURS) out.action = "active recently, no text";
      else if (info.lastNudge && now - info.lastNudge < QUIET_HOURS * HOUR) out.action = "texted in the last 48 hours, waiting";
      else if (info.unanswered >= MAX_UNANSWERED) {
        if (info.parentTold || !parentPhone) out.action = "stopped after 3 texts" + (info.parentTold ? " (parent already told)" : "");
        else { audience = "parent"; to = parentPhone; body = `SOS Study Space: ${st.name} hasn't studied since ${info.last ? new Date(info.last).toLocaleDateString("en-IE", { weekday: "long", day: "numeric", month: "short", timeZone: "Europe/Dublin" }) : "a while"}. ${MAX_UNANSWERED} reminders sent, so the app has stopped texting. Worth a word?`; }
      } else { audience = "student"; to = st.phone; body = studentText(st, info, info.unanswered); }
      if (body) {
        out.text = body; out.to = audience;
        if (dry) out.action = "would send (dry run)";
        else {
          const r = await sendSms(to, body);
          out.action = r.ok ? "sent" : "failed: " + r.error;
          await logNudge({ profile_id: id, audience, body, status: r.ok ? (test ? "test" : "sent") : "failed" });
        }
      }
      report.push(out);
    } catch (e) { report.push({ student: st.name, action: "error: " + (e && e.message) }); }
  }
  res.status(200).json({ ran_at: new Date().toISOString(), dry, report });
};
