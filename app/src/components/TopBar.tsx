'use client'

export default function TopBar({ userEmail }: { userEmail: string }) {
  const displayName = userEmail.includes('@') ? 'Gerente Geral' : userEmail

  return (
    <header style={{
      height: 60,
      background: '#fff',
      borderBottom: '1px solid #e8e8ee',
      display: 'flex',
      alignItems: 'center',
      padding: '0 32px',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>
      {/* User — alinhado à direita */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
        <div style={{ width: 32, height: 32, background: '#1a1a2e', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{displayName}</span>
      </div>
    </header>
  )
}
