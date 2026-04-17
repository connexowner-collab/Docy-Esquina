import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import ResumoDiaModal from '@/components/ResumoDiaModal'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: config } = await supabase
    .from('configuracoes')
    .select('nome_estabelecimento')
    .single()

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar nomeEstabelecimento={config?.nome_estabelecimento ?? 'Docy Esquina'} />
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
      <ResumoDiaModal />
    </div>
  )
}
