async function callOllamaApi(
  messageContent,
  model = 'llama3.2:1b',
  ollamaUrl = 'http://localhost:11434/api/chat'
) {
  const payload = {
    model,
    stream: false,
    messages: [{ role: 'user', content: messageContent }],
    format: {
      type: 'object',
      properties: {
        sentiment: { type: 'string', enum: ['positive', 'neutral', 'negative'] },
        category: {
            type: 'string',
            enum: [
                'opinion',         // Ý kiến, cảm nghĩ
                'suggestion',      // Gợi ý cải thiện
                'complaint',       // Phàn nàn, không hài lòng
                'question',        // Câu hỏi
                'review',          // Đánh giá sản phẩm
                'experience',      // Chia sẻ trải nghiệm
                'fashion_trend',   // Thảo luận xu hướng
                'material_quality',// Về chất lượng chất liệu (vàng, bạc, đá...)
                'irrelevant',       // Không liên quan
                'spam'             // Rác, quảng cáo
            ],
        },
        toxic: { type: 'boolean' },
        relevant: { type: 'boolean' },
      },
      required: ['sentiment', 'category', 'toxic', 'relevant'],
    },
  };

  try {
    const response = await fetch(ollamaUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling Ollama API:', error);
    return null;
  }
}

function parseOllamaMessageContent(response) {
  try {
    if (!response || !response.message || !response.message.content) {
      throw new Error('Invalid response structure');
    }
    return JSON.parse(response.message.content);
  } catch (error) {
    console.error('Error parsing Ollama message content:', error);
    return null;
  }
}

module.exports = { callOllamaApi, parseOllamaMessageContent };