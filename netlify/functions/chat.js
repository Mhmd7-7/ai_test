const https = require('https');

exports.handler = async (event, context) => {
  const { message } = JSON.parse(event.body); // استلام الرسالة من المستخدم
  const apiKey = process.env.GROQ_API_KEY; // المفتاح من بيئة Netlify

  // التحقق من وجود المفتاح
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API key not found' })
    };
  }

  // إنشاء البيانات لإرسالها إلى API
  const data = JSON.stringify({
    model: "llama3-70b-8192",
    messages: [{ role: 'user', content: message }],  // إرسال الرسالة من المستخدم
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

  return new Promise((resolve, reject) => {
    // إرسال الطلب إلى Groq API
    const req = https.request(options, res => {
      let response = '';
      res.on('data', chunk => response += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(response);
          const reply = json.choices[0].message.content;  // استخراج الرد من JSON

          // إرسال الرد إلى الواجهة الأمامية
          resolve({
            statusCode: 200,
            body: JSON.stringify({ reply })
          });
        } catch (error) {
          resolve({
            statusCode: 500,
            body: JSON.stringify({ error: 'Error parsing response' })
          });
        }
      });
    });

    req.on('error', error => {
      resolve({
        statusCode: 500,
        body: JSON.stringify({ error: 'Request failed' })
      });
    });

    req.write(data);  // إرسال البيانات
    req.end();        // إنهاء الطلب
  });
};
