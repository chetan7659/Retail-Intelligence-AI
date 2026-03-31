'use client'
import { useState } from 'react'
import { TrendingUp, TrendingDown, Minus, Loader2, Sparkles } from 'lucide-react'

const regions = ['India', 'USA', 'UK', 'Global', 'Southeast Asia', 'Middle East']

export default function DemandPage() {
  const [product, setProduct] = useState('')
  const [region, setRegion] = useState('India')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const analyze = async () => {
    if (!product.trim()) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/analyze/demand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, region }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const trendConfig = {
    rising: {
      icon: <TrendingUp size={14} />,
      cls: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    stable: {
      icon: <Minus size={14} />,
      cls: 'text-amber-700 bg-amber-50 border-amber-200',
    },
    declining: {
      icon: <TrendingDown size={14} />,
      cls: 'text-red-700 bg-red-50 border-red-200',
    },
  }

  const confidenceColor = {
    high: 'text-emerald-600',
    medium: 'text-amber-600',
    low: 'text-red-600',
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-7">
        <div className="flex items-center gap-2 mb-0.5">
          <Sparkles size={15} className="text-violet-500" />
          <span className="text-violet-600 text-sm font-medium">Demand Analysis</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900">Product Demand Analyzer</h1>
        <p className="text-slate-500 text-sm mt-1">
          AI-powered demand forecasting grounded in live market data
        </p>
      </div>

      {/* Form */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-5 shadow-sm">
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Product / Category
            </label>
            <input
              value={product}
              onChange={e => setProduct(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && analyze()}
              placeholder="e.g. Wireless Earbuds, Organic Skincare..."
              className="w-full border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-50 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Region</label>
            <select
              value={region}
              onChange={e => setRegion(e.target.value)}
              className="w-full border border-slate-200 focus:border-violet-500 rounded-lg px-3 py-2.5 text-sm text-slate-800 outline-none bg-white">
              {regions.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
        </div>

        <button
          onClick={analyze}
          disabled={!product.trim() || loading}
          className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2">
          {loading
            ? <><Loader2 size={16} className="animate-spin" /> Analyzing with live data...</>
            : '🔍 Analyze Demand'
          }
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-5 text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-3">
          {/* Score + Trend + Confidence */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white border border-slate-200 rounded-xl p-4 text-center shadow-sm">
              <div className="text-3xl font-bold text-violet-600 mb-0.5">{result.demandScore}</div>
              <div className="text-xs text-slate-500 mb-2">Demand Score</div>
              <div className="h-1.5 bg-slate-100 rounded-full">
                <div
                  className="h-1.5 bg-violet-500 rounded-full transition-all duration-700"
                  style={{ width: `${result.demandScore}%` }}
                />
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center shadow-sm">
              {result.trendDirection && (() => {
                const cfg = trendConfig[result.trendDirection] || trendConfig.stable
                return (
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold border ${cfg.cls}`}>
                    {cfg.icon}
                    <span className="capitalize">{result.trendDirection}</span>
                  </div>
                )
              })()}
              <div className="text-xs text-slate-500 mt-2">Trend</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center shadow-sm">
              <div className={`text-sm font-bold capitalize ${confidenceColor[result.confidence] || 'text-slate-600'}`}>
                {result.confidence}
              </div>
              <div className="text-xs text-slate-500 mt-1">Confidence</div>
            </div>
          </div>

          {/* Seasonality */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
              Seasonality
            </p>
            <p className="text-slate-700 text-sm">{result.seasonality}</p>
          </div>

          {/* Key Insights */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
              Key Insights
            </p>
            <ul className="space-y-2">
              {result.keyInsights?.map((insight, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 flex-shrink-0" />
                  {insight}
                </li>
              ))}
            </ul>
          </div>

          {/* AI Recommendation */}
          <div className="bg-violet-50 border border-violet-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-violet-600 uppercase tracking-wide mb-1.5">
              AI Recommendation
            </p>
            <p className="text-slate-700 text-sm leading-relaxed">{result.recommendation}</p>
          </div>

          <p className="text-center text-slate-400 text-xs py-1">
            ✓ Report auto-saved to your dashboard
          </p>
        </div>
      )}
    </div>
  )
}
