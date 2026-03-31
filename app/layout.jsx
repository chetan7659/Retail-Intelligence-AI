import './globals.css'

export const metadata = {
  title: 'RetailMind AI — Market Intelligence Copilot',
  description: 'AI-powered retail market intelligence for smarter decisions. Demand forecasting, pricing intelligence, and competitor analysis.',
  keywords: 'retail intelligence, AI market analysis, demand forecasting, pricing intelligence',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  )
}
