import { useState } from 'react'

const NOTIFS = [
  { id: 1, tipo: 'sessao', titulo: 'Sessão agendada para amanhã', corpo: 'Caso #0047 — Maria das Graças S. Sessão às 10:00 no PID de Ceres.', tempo: 'Há 2 horas', lida: false },
  { id: 2, tipo: 'acordo', titulo: 'Acordo homologado com sucesso', corpo: 'O Termo de Acordo do caso #0045 foi homologado e encaminhado ao NAE.', tempo: 'Há 1 dia', lida: false },
  { id: 3, tipo: 'novo', titulo: 'Nova demanda registrada', corpo: 'Caso #0048 foi registrado e aguarda designação de defensor.', tempo: 'Há 2 dias', lida: true },
  { id: 4, tipo: 'alerta', titulo: 'Parte contrária ainda não confirmou', corpo: 'Caso #0046 — A parte contrária não confirmou presença na sessão de 27/02.', tempo: 'Há 3 dias', lida: true },
  { id: 5, tipo: 'sistema', titulo: 'Bem-vindo ao CONCILIA DPE-GO', corpo: 'Sua conta foi criada com sucesso. Acesse o painel para registrar seu primeiro caso.', tempo: 'Há 5 dias', lida: true },
]

const tipoIcon = { sessao: '📅', acordo: '✅', novo: '📋', alerta: '⚠️', sistema: '🔔' }
const tipoColor = { sessao: '#1a6b3c', acordo: '#2d9b5a', novo: '#c8a84b', alerta: '#e07b39', sistema: '#5a7060' }

export default function Notifications({ onNavigate }) {
  const [notifs, setNotifs] = useState(NOTIFS)

  const marcarLida = (id) => {
    setNotifs(n => n.map(x => x.id === id ? { ...x, lida: true } : x))
  }

  const naoLidas = notifs.filter(n => !n.lida).length

  return (
    <div style={{ maxWidth: '700px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', color: '#0f4526' }}>Notificações</h1>
          {naoLidas > 0 && (
            <p style={{ color: '#5a7060', marginTop: '4px' }}>{naoLidas} não lida{naoLidas > 1 ? 's' : ''}</p>
          )}
        </div>
        {naoLidas > 0 && (
          <button
            onClick={() => setNotifs(n => n.map(x => ({ ...x, lida: true })))}
            style={{
              padding: '8px 16px', borderRadius: '8px', border: '1px solid #d0ddd4',
              background: '#fff', color: '#5a7060', fontSize: '13px', cursor: 'pointer'
            }}
          >
            Marcar todas como lidas
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {notifs.map(n => (
          <div
            key={n.id}
            style={{
              background: n.lida ? '#fff' : '#f0f7f3',
              borderRadius: '12px', padding: '18px 20px',
              boxShadow: '0 2px 8px rgba(26,107,60,0.06)',
              borderLeft: `3px solid ${n.lida ? '#d0ddd4' : tipoColor[n.tipo]}`,
              display: 'flex', gap: '14px', alignItems: 'flex-start'
            }}
          >
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
              background: tipoColor[n.tipo] + '18',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'
            }}>
              {tipoIcon[n.tipo]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontWeight: n.lida ? 400 : 700, fontSize: '14px' }}>{n.titulo}</span>
                <span style={{ fontSize: '12px', color: '#5a7060' }}>{n.tempo}</span>
              </div>
              <p style={{ fontSize: '13px', color: '#5a7060', lineHeight: 1.5 }}>{n.corpo}</p>
              {!n.lida && (
                <button
                  onClick={() => marcarLida(n.id)}
                  style={{
                    marginTop: '8px', padding: '4px 12px', borderRadius: '6px',
                    border: 'none', background: 'transparent', color: '#1a6b3c',
                    fontSize: '12px', cursor: 'pointer', fontWeight: 500
                  }}
                >
                  Marcar como lida
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
