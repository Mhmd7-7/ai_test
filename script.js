const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

let messages = [];

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (!message) return;

  // إضافة الرسالة من المستخدم إلى المصفوفة
  appendMessage('user', message);
  messages.push({ role: 'user', content: message });
  input.value = '';

  // إرسال الرسائل إلى دالة Netlify
  const response = await fetch('/.netlify/functions/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }) // إرسال جميع الرسائل
  });

  const data = await response.json();
  appendMessage('assistant', data.reply);
  messages.push({ role: 'assistant', content: data.reply });
});

function appendMessage(role, text) {
  const div = document.createElement('div');
  div.className = `message ${role}`;
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}
