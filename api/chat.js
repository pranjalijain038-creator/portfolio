import { buildPortfolioContext } from "../shared/portfolio.js";
import { localPortfolioAnswer } from "./local-answers.js";

const MAX_MESSAGE_LENGTH = 1000;
const MAX_MESSAGES = 16;

function readEnv(name, fallback = "") {
  return (process.env[name] || fallback).trim();
}

function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  return JSON.parse(raw);
}

function latestUserMessage(messages) {
  const userMessages = messages.filter((item) => item && item.role === "user");
  return userMessages[userMessages.length - 1]?.content || "";
}

async function callOpenAICompatible({ apiKey, url, model, messages, system }) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      messages: [{ role: "system", content: system }, ...messages],
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.error?.message || `The AI provider returned status ${response.status}.`;
    throw new Error(message);
  }
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error("The AI provider returned an empty response.");
  return text.trim();
}

async function callGemini({ apiKey, model, messages, system }) {
  const contents = messages.map((item) => ({
    role: item.role === "assistant" ? "model" : "user",
    parts: [{ text: item.content }],
  }));
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents,
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.error?.message || `Gemini returned status ${response.status}.`;
    throw new Error(message);
  }
  const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text).join("\n");
  if (!text) throw new Error("Gemini returned an empty response.");
  return text.trim();
}

async function generateReply(messages) {
  const provider = readEnv("AI_PROVIDER", "local").toLowerCase();
  const system = buildPortfolioContext();
  const question = latestUserMessage(messages);

  if (provider === "local" || provider === "") {
    return { reply: localPortfolioAnswer(question), mode: "local" };
  }

  if (provider === "openai") {
    const apiKey = readEnv("OPENAI_API_KEY");
    if (!apiKey) return { reply: localPortfolioAnswer(question), mode: "local", warning: "OPENAI_API_KEY is missing." };
    const reply = await callOpenAICompatible({
      apiKey,
      url: "https://api.openai.com/v1/chat/completions",
      model: readEnv("OPENAI_MODEL", "gpt-4o-mini"),
      messages,
      system,
    });
    return { reply, mode: "openai" };
  }

  if (provider === "groq") {
    const apiKey = readEnv("GROQ_API_KEY");
    if (!apiKey) return { reply: localPortfolioAnswer(question), mode: "local", warning: "GROQ_API_KEY is missing." };
    const reply = await callOpenAICompatible({
      apiKey,
      url: "https://api.groq.com/openai/v1/chat/completions",
      model: readEnv("GROQ_MODEL", "llama-3.1-8b-instant"),
      messages,
      system,
    });
    return { reply, mode: "groq" };
  }

  if (provider === "gemini") {
    const apiKey = readEnv("GEMINI_API_KEY");
    if (!apiKey) return { reply: localPortfolioAnswer(question), mode: "local", warning: "GEMINI_API_KEY is missing." };
    const reply = await callGemini({
      apiKey,
      model: readEnv("GEMINI_MODEL", "gemini-2.0-flash"),
      messages,
      system,
    });
    return { reply, mode: "gemini" };
  }

  throw new Error("Unsupported AI_PROVIDER. Use gemini, openai, groq, or local.");
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }
  if (req.method !== "POST") {
    json(res, 405, { error: "Use POST to send chatbot messages." });
    return;
  }

  try {
    const body = await readBody(req);
    const incoming = Array.isArray(body.messages) ? body.messages : [];
    if (!incoming.length) {
      json(res, 400, { error: "Send a messages array with at least one user message." });
      return;
    }

    const messages = incoming
      .filter((item) => item && (item.role === "user" || item.role === "assistant") && typeof item.content === "string")
      .slice(-MAX_MESSAGES)
      .map((item) => ({
        role: item.role,
        content: item.content.trim().slice(0, MAX_MESSAGE_LENGTH),
      }))
      .filter((item) => item.content);

    if (!messages.length || messages[messages.length - 1].role !== "user") {
      json(res, 400, { error: "The last message must be a non-empty user question." });
      return;
    }

    const result = await generateReply(messages);
    json(res, 200, result);
  } catch (error) {
    const safeMessage =
      error instanceof Error ? error.message : "The chatbot could not generate a reply.";
    json(res, 502, {
      error: `Chatbot error: ${safeMessage}`,
      reply: "The chatbot could not reach the AI service. Please try again after checking the API configuration.",
    });
  }
}
