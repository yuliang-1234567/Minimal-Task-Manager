const config = require('../config/config');

const callDeepSeek = async ({ messages, temperature = 0.2, maxTokens = 800 }) => {
  if (!config.ai.deepseekApiKey) {
    throw new Error('Missing DEEPSEEK_API_KEY');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.ai.timeoutMs);

  try {
    const response = await fetch(`${config.ai.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.ai.deepseekApiKey}`,
      },
      body: JSON.stringify({
        model: config.ai.model,
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`DeepSeek API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('DeepSeek response is empty');
    }

    return content;
  } finally {
    clearTimeout(timeout);
  }
};

module.exports = { callDeepSeek };
