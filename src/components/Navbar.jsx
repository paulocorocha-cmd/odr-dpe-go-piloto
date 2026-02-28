export default function Navbar({ page, onNavigate, user, onLogout }) {
  const items = [
    { id: 'dashboard',     label: 'Painel',         icon: '⊞' },
    { id: 'cases',         label: 'Casos',           icon: '📋' },
    { id: 'new-case',      label: 'Novo Caso',       icon: '＋' },
    { id: 'schedule',      label: 'Agenda',          icon: '📅' },
    { id: 'pids',          label: 'PIDs / TJGO',     icon: '📍' },
    { id: 'documents',     label: 'Documentos',      icon: '📄' },
    { id: 'notifications', label: 'Notificações',    icon: '🔔' },
  ]

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, height: '100vh', width: '240px',
      background: 'linear-gradient(180deg, #0f4526 0%, #1a6b3c 100%)',
      display: 'flex', flexDirection: 'column', zIndex: 100,
      boxShadow: '2px 0 20px rgba(0,0,0,0.15)'
    }}>
      {/* Logo */}
      <div style={{ padding: '28px 20px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontFamily: 'Fraunces, serif', color: '#c8a84b', fontSize: '20px', fontWeight: 700 }}>
          CONCILIA
        </div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', marginTop: '2px', letterSpacing: '2px' }}>
          DPE-GO · ODR
        </div>
      </div>

      {/* Menu */}
      <div style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px', borderRadius: '8px', border: 'none',
              background: page === item.id ? 'rgba(200,168,75,0.2)' : 'transparent',
              color: page === item.id ? '#c8a84b' : 'rgba(255,255,255,0.75)',
              fontSize: '14px', fontWeight: page === item.id ? 600 : 400,
              cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
              borderLeft: page === item.id ? '3px solid #c8a84b' : '3px solid transparent'
            }}
          >
            <span style={{ fontSize: '16px' }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      {/* User */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', marginBottom: '4px' }}>
          {user?.name || 'Usuário'}
        </div>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginBottom: '12px' }}>
          {user?.role || 'Assistido'}
        </div>
        <button
          onClick={onLogout}
          style={{
            width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.15)',
            background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: '12px', cursor: 'pointer'
          }}
        >
          Sair
        </button>
      </div>
    </nav>
  )
}
