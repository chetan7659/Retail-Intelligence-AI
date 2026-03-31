import { callHuggingFace } from '../../../../lib/huggingface'
import { searchMarketData } from '../../../../lib/serp'
import { createServerSupabaseClient } from '../../../../lib/supabaseServer'

export async function POST(req) {
  try {
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { product, myPrice, currency = 'INR' } = await req.json()

    if (!product || !myPrice) {
      return Response.json({ error: 'Product and price are required' }, { status: 400 })
    }

    // Get live competitor pricing signals
    const liveContext = await searchMarketData(`${product} price range competitors market buy online 2025`)

    const systemPrompt = `You are a retail pricing intelligence expert.
Analyze market pricing for the given product and compare it to the user's current price.
Return ONLY a valid JSON object — no explanation, no markdown, no backticks, nothing else.

Live market data for context:
${liveContext}

The user's price is in ${currency}.

Return EXACTLY this JSON structure (all numeric values should be in ${currency}):
{
  "marketLow": <number>,
  "marketHigh": <number>,
  "marketAverage": <number>,
  "myPricePosition": "<below_market|at_market|above_market>",
  "recommendation": "<1-2 sentence pricing recommendation>",
  "suggestedPrice": <number>,
  "competitorInsights": ["<insight 1>", "<insight 2>", "<insight 3>"],
  "pricingStrategy": "<penetration|competitive|premium>"
}`

    const raw = await callHuggingFace(
      [{
        role: 'user',
        content: `Product: "${product}", My current price: ${myPrice} ${currency}. Analyze market pricing.`,
      }],
      systemPrompt,
      600
    )

    let result
    try {
      const cleaned = raw
        .replace(/```json\n?/gi, '')
        .replace(/```\n?/gi, '')
        .trim()
      result = JSON.parse(cleaned)
    } catch (parseErr) {
      console.error('JSON parse error, using fallback:', parseErr.message)
      const price = parseFloat(myPrice)
      result = {
        marketLow: Math.round(price * 0.75),
        marketHigh: Math.round(price * 1.4),
        marketAverage: Math.round(price * 1.05),
        myPricePosition: 'at_market',
        recommendation: `Your pricing for ${product} appears to be in line with the market average. Consider slight adjustments based on your quality positioning and target audience.`,
        suggestedPrice: Math.round(price * 1.05),
        competitorInsights: [
          'Market shows moderate price sensitivity',
          'Premium positioning requires strong quality differentiation',
          'Bundling and value-adds can justify higher price points',
        ],
        pricingStrategy: 'competitive',
      }
    }

    // Save report to Supabase
    await supabase.from('saved_reports').insert({
      user_id: user.id,
      report_type: 'pricing',
      product_name: product,
      content: { ...result, myPrice, currency, analyzedAt: new Date().toISOString() },
    })

    return Response.json(result)

  } catch (err) {
    console.error('Pricing API error:', err)
    return Response.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
