import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Docy Esquina',
  description: 'Peça seu lanche favorito',
  manifest: '/pwa/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Docy Esquina' },
}

export const viewport: Viewport = {
  themeColor: '#C0392B',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function PwaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pwa-root">
      {children}
    </div>
  )
}
