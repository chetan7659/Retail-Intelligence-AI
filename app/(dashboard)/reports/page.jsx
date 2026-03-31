'use client'
import { useEffect, useState } from 'react'
import { createClient } from '../../../lib/supabase'
import { FileText, TrendingUp, BarChart3, Trash2, Sparkles, X } from 'lucide-react'

export default function ReportsPage() {
  const [reports, setReports] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => { loadReports() }, [])

  const loadReports = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('saved_reports')
      .select('*')
      .order('created_at', { ascending: false })
    setReports(data || [])
    setLoading(false)
  }

  const deleteReport = async (id) => {
    await supabase.from('saved_reports').delete().eq('id', id)
    setReports(r => r.filter(x => x.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  const typeStyle = {
    demand: {
      cls: 'bg-blue-50 text-blue-700 border-blue-100',
      icon: <TrendingUp size={11} />,
    },
    pricing: {
      cls: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      icon: <BarChart3 size={11} />,
    },
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-7">
        <div className="flex items-center gap-2 mb-0.5">
          <Sparkles size={15} className="text-violet-500" />
          <span className="text-violet-600 text-sm font-medium">Reports</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900">Saved Reports</h1>
        <p className="text-slate-500 text-sm mt-1">
          {reports.length} {reports.length === 1 ? 'analysis' : 'analyses'} saved
        </p>
      </div>

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center shadow-sm">
          <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-xl p-16 text-center shadow-sm">
          <FileText size={32} className="text-slate-200 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">
            No reports yet. Run a demand or pricing analysis to get started.
          </p>
        </div>
      ) : (
        <div className={`grid gap-4 ${selected ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
          {/* List */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            {reports.map((r, i) => {
              const ts = typeStyle[r.report_type] || {
                cls: 'bg-slate-100 text-slate-600 border-slate-200',
                icon: null,
              }
              return (
                <div key={r.id}
                  onClick={() => setSelected(selected?.id === r.id ? null : r)}
                  className={`flex items-center justify-between px-4 py-3.5 cursor-pointer transition-colors ${
                    i !== reports.length - 1 ? 'border-b border-slate-100' : ''
                  } ${selected?.id === r.id ? 'bg-violet-50' : 'hover:bg-slate-50'}`}>
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium flex-shrink-0 ${ts.cls}`}>
                      {ts.icon} {r.report_type}
                    </span>
                    <span className="text-slate-800 text-sm font-medium truncate">
                      {r.product_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                    <span className="text-slate-400 text-xs hidden sm:block">
                      {new Date(r.created_at).toLocaleDateString()}
                    </span>
                    <button
                      onClick={e => { e.stopPropagation(); deleteReport(r.id) }}
                      className="text-slate-300 hover:text-red-500 transition-colors p-1 rounded">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Detail Panel */}
          {selected && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm h-fit">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">{selected.product_name}</h3>
                  <span className="text-xs text-slate-400 capitalize">{selected.report_type} report</span>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded transition-colors">
                  <X size={16} />
                </button>
              </div>
              <pre className="text-slate-600 text-xs overflow-auto whitespace-pre-wrap leading-relaxed bg-slate-50 rounded-lg p-4 max-h-96 border border-slate-100">
                {JSON.stringify(selected.content, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
