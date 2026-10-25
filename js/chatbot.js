function appendBubble(log, role, text, extraClass = "") {
  const bubble = document.createElement("div");
  bubble.className = `bubble ${role} ${extraClass}`.trim();
  bubble.setAttribute("role", "article");
  bubble.textContent = text;
  log.appendChild(bubble);
  log.scrollTop = log.scrollHeight;
  return bubble;
}

export function initChatbot() {
  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat-input");
  const log = document.getElementById("chat-log");
  const status = document.getElementById("chat-status");
  const send = document.getElementById("chat-send");
  if (!form || !input || !log) return;

  const messages = [];

  appendBubble(
    log,
    "assistant",
    "Ask me about Pranjali Jain's studies, skills, or the five projects in this portfolio. I only answer from the information configured on this website."
  );

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    appendBubble(log, "user", text);
    messages.push({ role: "user", content: text });
    input.value = "";
    status.textContent = "Thinking...";
    send.disabled = true;

    const loading = appendBubble(log, "assistant", "Preparing a reply...");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });
      const data = await response.json().catch(() => ({}));
      const reply =
        data.reply ||
        data.error ||
        "The chatbot could not respond. Please try again later.";
      loading.textContent = reply;
      if (!response.ok) loading.classList.add("error");
      if (data.reply) messages.push({ role: "assistant", content: data.reply });
      if (data.mode === "local") {
        status.textContent =
          "Local portfolio answers are active because an AI API key is not configured.";
      } else if (!response.ok) {
        status.textContent = "The chatbot could not reach the AI service.";
      } else {
        status.textContent = "";
      }
    } catch {
      loading.textContent =
        "Network error: the chatbot could not send your question. Check that the local server or Vercel API route is running.";
      loading.classList.add("error");
      status.textContent = "Connection failed.";
    } finally {
      send.disabled = false;
      input.focus();
      log.scrollTop = log.scrollHeight;
    }
  });
}
