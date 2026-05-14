import type { Metadata } from 'next'
import { IBM_Plex_Sans_Arabic } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/shared/providers/auth-provider'

const font = IBM_Plex_Sans_Arabic({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['arabic'],
})

export const metadata: Metadata = {
  title: 'منصة الألعاب',
  description: 'منصة ألعاب تلفزيونية',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={font.className}>
      <body className="min-h-screen bg-zinc-950 text-white antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
