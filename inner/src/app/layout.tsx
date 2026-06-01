import type { Metadata } from 'next'
import './globals.css'
import { SiteConfigProvider } from '@/api/SiteConfigContext'
import { fetchGlobal } from '@/lib/cms'
import { CmsSiteConfig } from '@/api/types'

export const metadata: Metadata = {
  title: 'Coding for Change',
  description: 'Munich Student Club for Technology and Social Good',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const siteConfig = await fetchGlobal<CmsSiteConfig>('site-config')
  return (
    <html lang="en">
      <body>
        <SiteConfigProvider initialConfig={siteConfig}>
          {children}
        </SiteConfigProvider>
      </body>
    </html>
  )
}
