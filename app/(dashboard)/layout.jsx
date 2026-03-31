'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase'
import {
  Brain, LayoutDashboard, MessageSquare,
  TrendingUp, BarChart3, FileText, LogOut, Menu, X
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/chat', label: 'AI Chat', icon: MessageSquare },
  { href: '/analyze/demand', label: 'Demand Analysis', icon: TrendingUp },
  { href: '/analyze/pricing', label: 'Pricing Intel', icon: BarChart3 },
  { href: '/reports', label: 'Saved Reports', icon: FileText },
]

function Sidebar({ pathname, onNavigate, onLogout }) {
  return (
    <div className="h-full bg-white border-r border-slate-200 flex flex-col">
      <div className="px-5 py-5 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center shadow-sm">
            <Brain size={15} className="text-white" />
          </div>
          <span className="font-bold text-slate-900">RetailMind AI</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href} onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? 'bg-violet-50 text-violet-700 border border-violet-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}>
              <Icon size={17} className={active ? 'text-violet-600' : 'text-slate-400'} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-slate-100">
        <button onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium w-full transition-colors">
          <LogOut size={17} />
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default function DashboardLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="h-screen flex bg-slate-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-60 flex-shrink-0">
        <div className="w-full">
          <Sidebar pathname={pathname} onNavigate={() => {}} onLogout={handleLogout} />
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-60 flex-shrink-0">
            <Sidebar pathname={pathname} onNavigate={() => setMobileOpen(false)} onLogout={handleLogout} />
          </div>
          <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Top Bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center">
              <Brain size={14} className="text-white" />
            </div>
            <span className="font-bold text-slate-900 text-sm">RetailMind AI</span>
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-slate-500 hover:text-slate-700">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
