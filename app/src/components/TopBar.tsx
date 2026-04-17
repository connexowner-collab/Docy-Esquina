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
      gap: 16,
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>
      {/* Search bar */}
      <div style={{ flex: 1, maxWidth: 360, position: 'relative' }}>
        <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <input
          type="text"
          placeholder="Search parameters..."
          style={{
            width: '100%',
            border: '1.5px solid #e8e8ee',
            borderRadius: 10,
            padding: '8px 12px 8px 36px',
            fontSize: 13,
            color: '#555',
            outline: 'none',
            background: '#fafafa',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 'auto' }}>
        {/* Notification bell */}
        <button style={{ width: 36, height: 36, background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, color: '#888', position: 'relative' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>
          <span style={{ position: 'absolute', top: 5, right: 5, width: 8, height: 8, background: '#C0392B', borderRadius: '50%', border: '2px solid #fff' }} />
        </button>

        {/* User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, background: '#1a1a2e', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{displayName}</span>
        </div>
      </div>
    </header>
  )
}
