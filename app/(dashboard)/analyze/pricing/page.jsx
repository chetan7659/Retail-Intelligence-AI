'use client'
import { useState } from 'react'
import { Loader2, Sparkles, ArrowDown, ArrowUp, Minus } from 'lucide-react'

const currencies = ['INR', 'USD', 'GBP', 'EUR', 'AED']

export default function PricingPage() {
  const [product, setProduct] = useState('')
  const [myPrice, setMyPrice] = useState('')
  const [currency, setCurrency] = useState('INR')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const analyze = async () => {
    if (!product.trim() || !myPrice) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/analyze/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, myPrice: parseFloat(myPrice), currency }),
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

  const fmt = n => `${currency} ${Number(n).toLocaleString()}`

  const posConfig = {
    below_market: {
      label: 'Below Market',
      icon: <ArrowDown size={12} />,
      cls: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    at_market: {
      label: 'At Market',
      icon: <Minus size={12} />,
      cls: 'text-amber-700 bg-amber-50 border-amber-200',
    },
    above_market: {
      label: 'Above Market',
      icon: <ArrowUp size={12} />,
      cls: 'text-red-700 bg-red-50 border-red-200',
    },
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-7">
        <div className="flex items-center gap-2 mb-0.5">
          <Sparkles size={15} className="text-violet-500" />
          <span className="text-violet-600 text-sm font-medium">Pricing Intelligence</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900">Competitor Price Analysis</h1>
        <p className="text-slate-500 text-sm mt-1">
          Compare your price to the market and get AI-backed recommendations
        </p>
      </div>

      {/* Form */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-5 shadow-sm">
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Product Name</label>
            <input
              value={product}
              onChange={e => setProduct(e.target.value)}
              placeholder="e.g. Bluetooth Speaker, Yoga Mat..."
              className="w-full border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-50 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Currency</label>
            <select
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 outline-none bg-white">
              {currencies.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-slate-600 mb-1.5">
            Your Current Price ({currency})
          </label>
          <input
            type="number"
            value={myPrice}
            onChange={e => setMyPrice(e.target.value)}
            placeholder="e.g. 2499"
            className="w-full border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-50 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all"
          />
        </div>

        <button
          onClick={analyze}
          disabled={!product || !myPrice || loading}
          className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2">
          {loading
            ? <><Loader2 size={16} className="animate-spin" /> Analyzing pricing...</>
            : '💰 Analyze Pricing'
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
          {/* Price Range */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">
              Market Price Range
            </p>
            <div className="grid grid-cols-3 gap-3 text-center mb-4">
              <div>
                <div className="text-base font-bold text-emerald-600">{fmt(result.marketLow)}</div>
                <div className="text-xs text-slate-400 mt-0.5">Market Low</div>
              </div>
              <div>
                <div className="text-base font-bold text-amber-600">{fmt(result.marketAverage)}</div>
                <div className="text-xs text-slate-400 mt-0.5">Average</div>
              </div>
              <div>
                <div className="text-base font-bold text-red-500">{fmt(result.marketHigh)}</div>
                <div className="text-xs text-slate-400 mt-0.5">Market High</div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
              <span className="text-sm text-slate-600">
                Your price: <span className="font-semibold text-slate-800">{fmt(myPrice)}</span>
              </span>
              {result.myPricePosition && (() => {
                const cfg = posConfig[result.myPricePosition] || posConfig.at_market
                return (
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.cls}`}>
                    {cfg.icon} {cfg.label}
                  </span>
                )
              })()}
            </div>
          </div>

          {/* Suggested + Strategy */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-slate-200 rounded-xl p-4 text-center shadow-sm">
              <div className="text-xl font-bold text-violet-600">{fmt(result.suggestedPrice)}</div>
              <div className="text-xs text-slate-400 mt-1">AI Suggested Price</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 text-center shadow-sm">
              <div className="text-sm font-bold text-slate-800 capitalize">{result.pricingStrategy}</div>
              <div className="text-xs text-slate-400 mt-1">Recommended Strategy</div>
            </div>
          </div>

          {/* Competitor Insights */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
              Competitor Insights
            </p>
            <ul className="space-y-2">
              {result.competitorInsights?.map((insight, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 flex-shrink-0" />
                  {insight}
                </li>
              ))}
            </ul>
          </div>

          {/* Recommendation */}
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
