import { callHuggingFace } from '../../../lib/huggingface'
import { searchMarketData } from '../../../lib/serp'
import { createServerSupabaseClient } from '../../../lib/supabaseServer'

export async function POST(req) {
  try {
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { messages, sessionId } = await req.json()

    if (!messages || messages.length === 0) {
      return Response.json({ error: 'No messages provided' }, { status: 400 })
    }

    const lastUserMsg = messages[messages.length - 1].content

    // Fetch live market context via SerpAPI
    const liveContext = await searchMarketData(`${lastUserMsg} retail market 2025`)

    const systemPrompt = `You are RetailMind AI, an expert retail market intelligence analyst with deep knowledge of global commerce, e-commerce trends, consumer behavior, pricing strategies, and supply chain dynamics.

You help retailers, sellers, and business owners make smarter, data-driven decisions.

LIVE MARKET CONTEXT (use this to ground your answer with current data):
${liveContext}

Guidelines:
- Be concise, practical, and business-focused
- Always provide actionable insights the user can act on today
- Use bullet points for clarity when listing multiple points
- Reference the live context above when relevant
- If asked about trends, tie your answer to real market signals
- Format numbers and percentages clearly
- Keep responses focused — avoid filler text`

    const aiResponse = await callHuggingFace(messages, systemPrompt, 800)

    // Persist messages to Supabase
    if (sessionId) {
      await supabase.from('chat_messages').insert([
        { session_id: sessionId, role: 'user', content: lastUserMsg },
        { session_id: sessionId, role: 'assistant', content: aiResponse },
      ])
    }

    return Response.json({ message: aiResponse })

  } catch (err) {
    console.error('Chat API error:', err)
    return Response.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
