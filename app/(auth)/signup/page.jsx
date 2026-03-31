'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '../../../lib/supabase'
import { Brain, Loader2, CheckCircle } from 'lucide-react'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/dashboard`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-10 max-w-sm w-full text-center shadow-sm">
          <CheckCircle size={40} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-slate-900 text-xl font-bold mb-2">Check your email!</h2>
          <p className="text-slate-500 text-sm">
            We sent a confirmation link to{' '}
            <span className="font-medium text-slate-700">{email}</span>.
            Click it to activate your account.
          </p>
          <Link href="/login"
            className="inline-block mt-6 text-violet-600 hover:text-violet-700 text-sm font-medium">
            Back to sign in →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center shadow-sm">
              <Brain size={18} className="text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg">RetailMind AI</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
          <p className="text-slate-500 text-sm mt-1">Free forever. No credit card needed.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-7 shadow-sm">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-5 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
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
                minLength={6}
                autoComplete="new-password"
                className="w-full border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all"
                placeholder="Min 6 characters"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2 mt-1">
              {loading
                ? <><Loader2 size={16} className="animate-spin" /> Creating account...</>
                : 'Create Free Account'
              }
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-5">
            Already have an account?{' '}
            <Link href="/login" className="text-violet-600 hover:text-violet-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
