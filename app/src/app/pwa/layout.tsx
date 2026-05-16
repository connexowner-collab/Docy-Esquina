import type { Metadata, Viewport } from 'next'
import PwaInstallBanner from './PwaInstallBanner'

export const metadata: Metadata = {
  title: 'Docy Esquina',
  description: 'Peça seu lanche favorito',
  manifest: '/pwa/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Docy Esquina' },
  icons: {
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    icon: [
      { url: '/LOGO.png', type: 'image/png' },
    ],
  },
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
      <PwaInstallBanner />
    </div>
  )
}
