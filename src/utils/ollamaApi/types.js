const Message = {
  role: '',
  content: '',
};

const COMMENT_TYPE_MAP = {
  opinion: 'Ý kiến',
  suggestion: 'Gợi ý',
  complaint: 'Phàn nàn',
  question: 'Câu hỏi',
  spam: 'rác',
  review: 'Đánh giá',
  experience: 'Trải nghiệm',
  fashion_trend: 'Xu hướng thời trang',
  material_quality: 'Chất lượng chất liệu',
  irrelevant: 'Không liên quan',
  khác: 'Khác',
};

const TYPE_STYLE_MAP = {
  opinion: { bgcolor: '#E3F2FD', color: '#0D47A1' },
  suggestion: { bgcolor: '#E8F5E9', color: '#1B5E20' },
  complaint: { bgcolor: '#FFF9C4', color: '#F57F17' },
  question: { bgcolor: '#E0F7FA', color: '#006064' },
  spam: { bgcolor: '#FFEBEE', color: '#B71C1C' },
  irrelevant: { bgcolor: '#FFEBEE', color: '#B71C1C' },
  khác: { bgcolor: '#F5F5F5', color: '#424242' },
};

const Format = {
  type: 'object',
  properties: {
    sentiment: { type: 'string', enum: ['positive', 'neutral', 'negative'] },
    category: {
      type: 'string',
      enum: ['opinion', 'suggestion', 'complaint', 'question', 'spam', 'irrelevant'],
    },
    toxic: { type: 'boolean' },
    relevant: { type: 'boolean' },
  },
  required: ['sentiment', 'category', 'toxic', 'relevant'],
};

const Payload = {
  model: '',
  stream: false,
  messages: [Message],
  format: Format,
};

const OllamaResponse = {
  message: { content: '' },
};

module.exports = { Message, Format, Payload, OllamaResponse, COMMENT_TYPE_MAP, TYPE_STYLE_MAP };