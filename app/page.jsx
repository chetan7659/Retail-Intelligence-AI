'use client'
import Link from 'next/link'
import {
  TrendingUp, Brain, BarChart3, MessageSquare,
  Zap, Shield, ArrowRight, CheckCircle
} from 'lucide-react'

export default function LandingPage() {
  const features = [
    {
      icon: <MessageSquare size={22} className="text-violet-600" />,
      title: 'AI Market Chat',
      desc: 'Ask anything about retail trends, demand signals, and market shifts powered by live web data.',
    },
    {
      icon: <TrendingUp size={22} className="text-violet-600" />,
      title: 'Demand Forecasting',
      desc: 'Get AI demand scores and trend direction for any product — grounded in real-time market signals.',
    },
    {
      icon: <BarChart3 size={22} className="text-violet-600" />,
      title: 'Pricing Intelligence',
      desc: 'Understand competitor pricing landscape and get AI-backed pricing recommendations instantly.',
    },
    {
      icon: <Brain size={22} className="text-violet-600" />,
      title: 'Competitor Analysis',
      desc: 'Track what competitors are doing in your segment without manual research.',
    },
    {
      icon: <Zap size={22} className="text-violet-600" />,
      title: 'Instant Insights',
      desc: 'No waiting. AI synthesizes market data into actionable decisions in seconds.',
    },
    {
      icon: <Shield size={22} className="text-violet-600" />,
      title: 'Saved Reports',
      desc: 'All analyses saved, searchable, and ready to reference anytime from your dashboard.',
    },
  ]

  const perks = [
    'No credit card required',
    'Free to use',
    'Live market data',
    'Powered by Llama 3.1',
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Nav */}
      <nav className="border-b border-slate-200 px-6 py-4 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center shadow-sm">
              <Brain size={16} className="text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg">RetailMind AI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login"
              className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors">
              Sign in
            </Link>
            <Link href="/signup"
              className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-full px-4 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse" />
          <span className="text-violet-700 text-sm font-medium">Llama 3.1 × Live Market Data</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight tracking-tight mb-6">
          Retail intelligence,<br />
          <span className="text-violet-600">powered by AI</span>
        </h1>

        <p className="text-slate-500 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Real-time demand forecasting, pricing intelligence, and market insights —
          built for retail teams, marketplace sellers, and small businesses.
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap mb-10">
          <Link href="/signup"
            className="bg-violet-600 hover:bg-violet-700 text-white px-7 py-3.5 rounded-xl font-semibold text-base transition-all hover:shadow-lg hover:shadow-violet-200 flex items-center gap-2">
            Start for free <ArrowRight size={16} />
          </Link>
          <Link href="/login"
            className="border border-slate-200 hover:border-slate-300 bg-white text-slate-700 px-7 py-3.5 rounded-xl font-semibold text-base transition-colors">
            Sign in
          </Link>
        </div>

        {/* Perks row */}
        <div className="flex items-center justify-center gap-6 flex-wrap">
          {perks.map((p, i) => (
            <div key={i} className="flex items-center gap-1.5 text-slate-500 text-sm">
              <CheckCircle size={14} className="text-green-500" />
              {p}
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-slate-50 border-y border-slate-200 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              Everything a modern retailer needs
            </h2>
            <p className="text-slate-500">
              Intelligence tools previously only available to enterprise teams
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div key={i}
                className="bg-white border border-slate-200 hover:border-violet-300 hover:shadow-sm rounded-xl p-6 transition-all">
                <div className="w-10 h-10 bg-violet-50 rounded-lg flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="text-slate-900 font-semibold mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Ready to make smarter retail decisions?
        </h2>
        <p className="text-slate-500 mb-8">Join for free. No setup, no credit card.</p>
        <Link href="/signup"
          className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-8 py-3.5 rounded-xl font-semibold text-base transition-all hover:shadow-lg hover:shadow-violet-200">
          Get started free <ArrowRight size={16} />
        </Link>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 px-6 py-6 text-center text-slate-400 text-sm bg-white">
        RetailMind AI — Built with Next.js, Supabase & Meta Llama 3.1
      </footer>
    </div>
  )
}
