'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '../../../lib/supabase'
import { Brain, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center shadow-sm">
              <Brain size={18} className="text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg">RetailMind AI</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="text-slate-500 text-sm mt-1">Sign in to your account</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-7 shadow-sm">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-5 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2 mt-1">
              {loading
                ? <><Loader2 size={16} className="animate-spin" /> Signing in...</>
                : 'Sign In'
              }
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-5">
            No account?{' '}
            <Link href="/signup" className="text-violet-600 hover:text-violet-700 font-medium">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
