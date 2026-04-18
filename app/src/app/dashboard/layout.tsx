import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import ResumoDiaModal from '@/components/ResumoDiaModal'
import TopBar from '@/components/TopBar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: config } = await supabase
    .from('configuracoes')
    .select('nome_estabelecimento')
    .single()

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f5f7' }}>
      <Sidebar nomeEstabelecimento={config?.nome_estabelecimento ?? 'Docy Esquina'} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopBar userEmail={user.email ?? ''} />
        <main style={{ flex: 1, padding: '32px 36px', overflowAuto: 'auto' } as React.CSSProperties}>
          {children}
        </main>
      </div>
      <ResumoDiaModal />
    </div>
  )
}
