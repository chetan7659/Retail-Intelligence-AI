/**
 * Search live market data via SerpAPI
 * Free tier: 100 searches/month at https://serpapi.com
 * @param {string} query - Search query
 * @returns {Promise<string>} - Formatted search context string
 */
export async function searchMarketData(query) {
  try {
    const url = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${process.env.SERP_API_KEY}&num=5&gl=us&hl=en`

    const res = await fetch(url, { next: { revalidate: 3600 } }) // cache 1hr
    if (!res.ok) throw new Error(`SerpAPI error: ${res.status}`)

    const data = await res.json()

    // Extract organic results as context
    const results = (data.organic_results || []).slice(0, 4).map(r => ({
      title: r.title || '',
      snippet: r.snippet || '',
      source: r.displayed_link || '',
    }))

    if (results.length === 0) {
      return 'No live market data found. Use your training knowledge to provide best estimates.'
    }

    return results
      .map(r => `[${r.source}] ${r.title}: ${r.snippet}`)
      .join('\n\n')

  } catch (error) {
    console.error('SerpAPI error:', error.message)
    // Graceful fallback — AI will use training knowledge
    return 'Live market data temporarily unavailable. Respond based on your training knowledge with appropriate caveats.'
  }
}
