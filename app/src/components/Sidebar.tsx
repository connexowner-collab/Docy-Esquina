'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navItems = [
  { href: '/dashboard/novo-pedido', label: 'Novo Pedido', icon: '🛵' },
  { href: '/dashboard/historico', label: 'Histórico', icon: '📋' },
  { href: '/dashboard/clientes', label: 'Clientes', icon: '👥' },
  { href: '/dashboard/cardapio', label: 'Cardápio', icon: '🍽️' },
  { href: '/dashboard/configuracoes', label: 'Configurações', icon: '⚙️' },
]

export default function Sidebar({ nomeEstabelecimento }: { nomeEstabelecimento: string }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col min-h-screen">
      <div className="px-6 py-5 border-b border-gray-700">
        <h1 className="text-lg font-bold text-red-400">{nomeEstabelecimento}</h1>
        <p className="text-xs text-gray-400 mt-0.5">Gestão de Pedidos</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(item => {
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                active
                  ? 'bg-red-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 pb-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition"
        >
          <span>🚪</span>
          Sair
        </button>
      </div>
    </aside>
  )
}
