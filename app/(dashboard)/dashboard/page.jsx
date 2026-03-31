'use client'
import { useEffect, useState } from 'react'
import { createClient } from '../../../lib/supabase'
import Link from 'next/link'
import { MessageSquare, TrendingUp, BarChart3, FileText, ArrowRight, Sparkles } from 'lucide-react'

export default function DashboardPage() {
  const [reports, setReports] = useState([])
  const [user, setUser] = useState(null)
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      const { data } = await supabase
        .from('saved_reports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)
      setReports(data || [])
    }
    load()
  }, [])

  const quickActions = [
    { href: '/chat', icon: MessageSquare, label: 'Ask AI a market question', sub: 'Chat with live data', color: 'violet' },
    { href: '/analyze/demand', icon: TrendingUp, label: 'Analyze product demand', sub: 'Get demand scores', color: 'blue' },
    { href: '/analyze/pricing', icon: BarChart3, label: 'Check competitor pricing', sub: 'Pricing intelligence', color: 'emerald' },
    { href: '/reports', icon: FileText, label: 'View saved reports', sub: `${reports.length} reports saved`, color: 'orange' },
  ]

  const colorCls = {
    violet: { border: 'border-violet-100 hover:border-violet-300', icon: 'text-violet-600 bg-violet-100' },
    blue: { border: 'border-blue-100 hover:border-blue-300', icon: 'text-blue-600 bg-blue-100' },
    emerald: { border: 'border-emerald-100 hover:border-emerald-300', icon: 'text-emerald-600 bg-emerald-100' },
    orange: { border: 'border-orange-100 hover:border-orange-300', icon: 'text-orange-600 bg-orange-100' },
  }

  const typeStyle = {
    demand: 'bg-blue-50 text-blue-700 border border-blue-100',
    pricing: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={15} className="text-violet-500" />
          <span className="text-violet-600 text-sm font-medium">Dashboard</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          Good to see you{user?.email ? `, ${user.email.split('@')[0]}` : ''} 👋
        </h1>
        <p className="text-slate-500 mt-1 text-sm">What market intelligence do you need today?</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
        {quickActions.map((a, i) => {
          const Icon = a.icon
          const cls = colorCls[a.color]
          return (
            <Link key={i} href={a.href}
              className={`bg-white border rounded-xl p-4 flex items-center justify-between group transition-all hover:shadow-sm ${cls.border}`}>
              <div className="flex items-center gap-3.5">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${cls.icon}`}>
                  <Icon size={17} />
                </div>
                <div>
                  <div className="text-slate-800 font-medium text-sm">{a.label}</div>
                  <div className="text-slate-400 text-xs mt-0.5">{a.sub}</div>
                </div>
              </div>
              <ArrowRight size={15} className="text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all" />
            </Link>
          )
        })}
      </div>

      {/* Recent Reports */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-900">Recent Reports</h2>
          <Link href="/reports" className="text-violet-600 hover:text-violet-700 text-sm font-medium">
            View all →
          </Link>
        </div>

        {reports.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-200 rounded-xl p-10 text-center shadow-sm">
            <FileText size={28} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No reports yet. Run your first analysis to get started.</p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            {reports.map((r, i) => (
              <div key={r.id}
                className={`flex items-center justify-between px-5 py-4 ${i !== reports.length - 1 ? 'border-b border-slate-100' : ''}`}>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${typeStyle[r.report_type] || 'bg-slate-100 text-slate-600'}`}>
                    {r.report_type}
                  </span>
                  <span className="text-slate-800 text-sm font-medium">{r.product_name}</span>
                </div>
                <span className="text-slate-400 text-xs">{new Date(r.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
