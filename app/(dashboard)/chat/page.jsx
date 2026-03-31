'use client'
import { useState, useRef, useEffect } from 'react'
import { createClient } from '../../../lib/supabase'
import { Send, Loader2, Bot, User, Plus, Sparkles } from 'lucide-react'

const SUGGESTED = [
  "What are the top trending categories in Indian e-commerce right now?",
  "How is the D2C beauty market performing in 2025?",
  "What pricing strategies work best for electronics on Amazon?",
  "Analyze demand for sustainable/eco-friendly products globally",
]

export default function ChatPage() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)
  const supabase = createClient()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const createSession = async (firstMsg) => {
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase
      .from('chat_sessions')
      .insert({ user_id: user.id, title: firstMsg.slice(0, 50) })
      .select()
      .single()
    return data?.id
  }

  const sendMessage = async (text) => {
    const userText = text || input.trim()
    if (!userText || loading) return
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'

    const newMessages = [...messages, { role: 'user', content: userText }]
    setMessages(newMessages)
    setLoading(true)

    let sid = sessionId
    if (!sid) {
      sid = await createSession(userText)
      setSessionId(sid)
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, sessionId: sid }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setMessages([...newMessages, { role: 'assistant', content: data.message }])
    } catch (err) {
      setMessages([...newMessages, {
        role: 'assistant',
        content: `⚠️ Error: ${err.message}. Please check your API keys and try again.`,
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleTextarea = (e) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
  }

  const newChat = () => {
    setMessages([])
    setSessionId(null)
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  return (
    <div className="max-w-2xl mx-auto h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Sparkles size={15} className="text-violet-500" />
            <span className="text-violet-600 text-sm font-medium">AI Market Chat</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Market Intelligence</h1>
        </div>
        <button onClick={newChat}
          className="flex items-center gap-1.5 border border-slate-200 hover:border-slate-300 bg-white text-slate-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus size={14} /> New chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto min-h-0 space-y-5 pb-2">
        {messages.length === 0 && (
          <div className="py-10">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-12 h-12 bg-violet-100 rounded-2xl flex items-center justify-center mb-3">
                <Bot size={24} className="text-violet-600" />
              </div>
              <h3 className="text-slate-900 font-semibold mb-1">RetailMind AI</h3>
              <p className="text-slate-400 text-sm">
                Ask me about market trends, demand signals, or pricing intelligence
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SUGGESTED.map((s, i) => (
                <button key={i} onClick={() => sendMessage(s)}
                  className="bg-white border border-slate-200 hover:border-violet-300 hover:bg-violet-50 text-slate-600 hover:text-violet-700 text-xs text-left p-3.5 rounded-xl transition-all">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
              m.role === 'user' ? 'bg-violet-600' : 'bg-slate-100 border border-slate-200'
            }`}>
              {m.role === 'user'
                ? <User size={13} className="text-white" />
                : <Bot size={13} className="text-slate-500" />
              }
            </div>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
              m.role === 'user'
                ? 'bg-violet-600 text-white rounded-tr-sm'
                : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm'
            }`}>
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center mt-0.5">
              <Bot size={13} className="text-slate-500" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1 items-center">
                {[0, 1, 2].map(i => (
                  <span key={i}
                    className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <div className="pt-4 border-t border-slate-100 mt-4">
        <div className="flex gap-2 items-end bg-white border border-slate-200 rounded-xl p-2 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-50 transition-all">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleTextarea}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
            placeholder="Ask about retail trends, demand, pricing..."
            rows={1}
            className="flex-1 text-sm text-slate-800 placeholder-slate-400 outline-none resize-none px-2 py-1.5 bg-transparent"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors flex-shrink-0">
            <Send size={15} />
          </button>
        </div>
        <p className="text-slate-400 text-xs text-center mt-2">
          Powered by Llama 3.1 × Live web search
        </p>
      </div>
    </div>
  )
}
