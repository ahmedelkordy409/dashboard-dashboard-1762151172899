import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Create A Complete Dashboard',
  description: 'Interactive dashboard with 5 metrics and 3 dimensions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  )
}