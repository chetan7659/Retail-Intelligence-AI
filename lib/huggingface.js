const HF_API_URL = 'https://router.huggingface.co/v1/chat/completions'
const MODEL = 'meta-llama/Llama-3.1-8B-Instruct'

/**
 * Call HuggingFace Inference API (OpenAI-compatible router)
 * @param {Array} messages - Array of {role, content} objects
 * @param {string} systemPrompt - System instruction
 * @param {number} maxTokens - Max tokens to generate
 * @returns {Promise<string>} - AI response text
 */
export async function callHuggingFace(messages, systemPrompt, maxTokens = 1024) {
  const response = await fetch(HF_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      max_tokens: maxTokens,
      temperature: 0.7,
      stream: false,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`HuggingFace API error (${response.status}): ${errorText}`)
  }

  const data = await response.json()

  if (!data.choices || !data.choices[0]) {
    throw new Error('Invalid response from HuggingFace API')
  }

  return data.choices[0].message.content
}
