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

function copyCode(btn) {
  const code = btn.closest('.code-block').querySelector('code').innerText;
  navigator.clipboard.writeText(code).then(() => {
    btn.innerText = "Copied!";
    setTimeout(() => btn.innerText = "Copy", 2000);
  });
}

function appendMessage(role, text) {
  const div = document.createElement('div');
  div.className = `message ${role}`;
  text = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
  text = text.replace(/```(.*?)```/gs, (_, code) => {
  const escaped = code
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  
  return `
    <div class="code-block">
      <div class="code-header">
        <button class="copy-btn" onclick="copyCode(this)">Copy</button>
      </div>
      <pre><code>${escaped}</code></pre>
    </div>
  `;
});

  div.innerHTML = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}
