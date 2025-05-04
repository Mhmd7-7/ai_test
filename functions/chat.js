const https = require('https');

exports.handler = async (event) => {
  const { messages } = JSON.parse(event.body);
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API key not found' })
    };
  }

  const data = JSON.stringify({
    model: "llama3-70b-8192",
    messages: messages,
    temperature: 0.7
  });

  const options = {
    hostname: 'api.groq.com',
    path: '/openai/v1/chat/completions',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  };

  return new Promise((resolve) => {
    const req = https.request(options, res => {
      let response = '';
      res.on('data', chunk => response += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(response);
          const reply = json.choices[0].message.content;
          resolve({
            statusCode: 200,
            body: JSON.stringify({ reply })
          });
        } catch {
          resolve({
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to parse response' })
          });
        }
      });
    });

    req.on('error', () => {
      resolve({
        statusCode: 500,
        body: JSON.stringify({ error: 'Request failed' })
      });
    });

    req.write(data);
    req.end();
  });
};
