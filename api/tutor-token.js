// Hands the study portal a short-lived ElevenLabs session token for the voice tutor.
// The ElevenLabs API key stays here on the server (Vercel env var ELEVENLABS_API_KEY).
// On first use it creates the tutor agent in your ElevenLabs account (named "Study Portal Tutor").
// Set ELEVENLABS_AGENT_ID in Vercel to pin a specific agent instead.

const API = "https://api.elevenlabs.io/v1/convai";
const AGENT_NAME = "Study Portal Tutor";
let cachedAgentId = null;

const BASE_PROMPT =
  "You are a friendly, patient spoken revision tutor for Irish Leaving Certificate students. " +
  "Each session sends you the chapter notes, questions and the student's gaps. Keep replies short and conversational.";

function agentDefinition() {
  return {
    name: AGENT_NAME,
    tags: ["study-portal"],
    conversation_config: {
      agent: {
        first_message: "Hi! Ready to go over this chapter?",
        language: "en",
        prompt: {
          prompt: BASE_PROMPT,
          llm: "claude-sonnet-4-6",
          temperature: 0.4,
          tools: [
            {
              type: "client",
              name: "record_result",
              description:
                "Save how the student did on one question from the question list, as soon as you have judged their answer. Call it once per question you ask from the list. Never mention it to the student.",
              expects_response: false,
              parameters: {
                type: "object",
                required: ["question_id", "result"],
                properties: {
                  question_id: { type: "string", description: "The id in square brackets from the question list, e.g. polsoc-c1-05" },
                  result: {
                    type: "string",
                    enum: ["got_it", "partly", "missed"],
                    description: "got_it if right first time, partly if right after a hint or half right, missed if they needed the answer",
                  },
                },
              },
            },
          ],
        },
      },
      conversation: { max_duration_seconds: 1200 },
    },
    platform_settings: {
      auth: { enable_auth: true },
      overrides: {
        conversation_config_override: {
          agent: { first_message: true, prompt: { prompt: true } },
        },
      },
      call_limits: { daily_limit: 40 },
    },
  };
}

async function el(path, key, opts = {}) {
  const res = await fetch(API + path, {
    ...opts,
    headers: { "xi-api-key": key, "Content-Type": "application/json", ...(opts.headers || {}) },
  });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch (e) { data = { raw: text }; }
  if (!res.ok) {
    const err = new Error(`ElevenLabs ${res.status}`);
    err.detail = data;
    err.status = res.status;
    throw err;
  }
  return data;
}

async function getAgentId(key) {
  if (process.env.ELEVENLABS_AGENT_ID) return process.env.ELEVENLABS_AGENT_ID;
  if (cachedAgentId) return cachedAgentId;
  const list = await el(`/agents?search=${encodeURIComponent(AGENT_NAME)}&page_size=30`, key);
  const found = (list && list.agents || []).find(a => a.name === AGENT_NAME && !a.archived);
  if (found) { cachedAgentId = found.agent_id; return cachedAgentId; }
  const created = await el("/agents/create", key, { method: "POST", body: JSON.stringify(agentDefinition()) });
  cachedAgentId = created.agent_id;
  return cachedAgentId;
}

function sameSite(req) {
  const host = req.headers["x-forwarded-host"] || req.headers.host || "";
  const from = req.headers.origin || req.headers.referer || "";
  if (!from) return false;
  try { return new URL(from).host === host; } catch (e) { return false; }
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET" && req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  if (!sameSite(req)) {
    res.status(403).json({ error: "This link only works from the study portal." });
    return;
  }
  const key = (process.env.ELEVENLABS_API_KEY || "").trim().replace(/^["']|["']$/g, "");
  if (!key) {
    res.status(500).json({ error: "The voice tutor is not set up yet: ELEVENLABS_API_KEY is missing in Vercel." });
    return;
  }
  try {
    const agentId = await getAgentId(key);
    const data = await el(`/conversation/token?agent_id=${encodeURIComponent(agentId)}`, key);
    res.status(200).json({ token: data.token });
  } catch (e) {
    console.error("tutor-token failed", e.status, JSON.stringify(e.detail || e.message));
    const d = e.detail && (e.detail.detail || e.detail);
    const reason = String((d && (d.message || d.status)) || (typeof d === "string" ? d : "") || "").slice(0, 200);
    const msg = e.status === 401 || e.status === 403
      ? `ElevenLabs refused the key (${e.status}${reason ? ": " + reason : ""}).`
      : `The voice tutor could not start (ElevenLabs ${e.status || "error"}${reason ? ": " + reason : ""}).`;
    res.status(502).json({ error: msg });
  }
};
