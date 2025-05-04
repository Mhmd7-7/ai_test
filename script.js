const chat = document.getElementById('chat-box');
const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');

let messages = [];

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  messages.push({ role: 'user', content: userMessage });
  input.value = '';

  try {
    const res = await fetch('/netlify/functions/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages })
    });
    const data = await res.json();
    const aiReply = data.reply;

    appendMessage('assistant', aiReply);
    messages.push({ role: 'assistant', content: aiReply });
  } catch (err) {
    appendMessage('assistant', 'حدث خطأ في الاتصال 😢');
    console.error(err);
  }
});

function appendMessage(role, text) {
  const div = document.createElement('div');
  div.className = role;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}
