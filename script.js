const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

let messages = [];

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (!message) return;

  appendMessage('user', message);
  input.value = '';

  messages.push({ role: 'user', content: message });

  const response = await fetch('/.netlify/functions/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages })
  });

  const data = await response.json();
  appendMessage('assistant', data.reply);
  messages.push({ role: 'assistant', content: data.reply });
});

function appendMessage(role, text) {
  const div = document.createElement('div');
  div.className = `message ${role}`;
  text = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
  text = text.replace(/```(.*?)```/gs, '<code>$1</code>');
  div.innerHTML = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}
