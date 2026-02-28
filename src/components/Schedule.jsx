import { useState } from 'react'

const HORARIOS = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']
const DEFENSORES = [
  { nome: 'Dr. Carlos Eduardo Lima', area: 'Família e Sucessões', disponivel: true },
  { nome: 'Dra. Ana Flávia Borges', area: 'Consumidor e Cível', disponivel: true },
  { nome: 'Dr. Rodrigo Santana', area: 'Saúde e Educação', disponivel: false },
]

export default function Schedule({ onNavigate, caseData }) {
  const [defensor, setDefensor] = useState('')
  const [data, setData] = useState('')
  const [hora, setHora] = useState('')
  const [confirmado, setConfirmado] = useState(false)

  const hoje = new Date().toISOString().split('T')[0]

  if (confirmado) return (
    <div style={{ maxWidth: '500px', margin: '60px auto', textAlign: 'center' }}>
      <div style={{ fontSize: '72px', marginBottom: '24px' }}>✅</div>
      <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', color: '#0f4526', marginBottom: '12px' }}>
        Sessão Agendada!
      </h2>
      <p style={{ color: '#5a7060', fontSize: '16px', marginBottom: '8px' }}>
        Sua sessão de mediação foi agendada com sucesso.
      </p>
      <div style={{
        background: '#f4f6f4', borderRadius: '12px', padding: '24px', margin: '24px 0', textAlign: 'left'
      }}>
        {[
          ['Data', data], ['Horário', hora], ['Defensor', defensor],
          ['Local', caseData?.pid || 'PID - Fórum da Comarca']
        ].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
            <span style={{ color: '#5a7060' }}>{k}:</span>
            <span style={{ fontWeight: 600, color: '#1a2e1f' }}>{v}</span>
          </div>
        ))}
      </div>
      <p style={{ fontSize: '13px', color: '#5a7060', marginBottom: '28px' }}>
        Um e-mail de confirmação será enviado. No dia da sessão, dirija-se ao PID com documento de identificação.
      </p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button
          onClick={() => onNavigate('cases')}
          style={{
            padding: '12px 24px', borderRadius: '8px', border: '1px solid #d0ddd4',
            background: '#fff', color: '#5a7060', fontSize: '14px', cursor: 'pointer'
          }}
        >
          Ver Casos
        </button>
        <button
          onClick={() => onNavigate('video-session', caseData)}
          style={{
            padding: '12px 24px', borderRadius: '8px', border: 'none',
            background: '#1a6b3c', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer'
          }}
        >
          📹 Simular Sessão
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: '680px' }}>
      <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', color: '#0f4526', marginBottom: '8px' }}>
        Agendar Sessão
      </h1>
      {caseData?.parte && (
        <p style={{ color: '#5a7060', marginBottom: '28px' }}>Caso: {caseData.parte} — {caseData.tipo}</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Defensor */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(26,107,60,0.06)' }}>
          <h3 style={{ fontFamily: 'Fraunces, serif', color: '#0f4526', marginBottom: '16px' }}>Defensor Público</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {DEFENSORES.map(d => (
              <div
                key={d.nome}
                onClick={() => d.disponivel && setDefensor(d.nome)}
                style={{
                  padding: '14px 16px', borderRadius: '8px',
                  border: `1px solid ${defensor === d.nome ? '#1a6b3c' : '#d0ddd4'}`,
                  background: defensor === d.nome ? '#f0f7f3' : d.disponivel ? '#fff' : '#f9f9f9',
                  cursor: d.disponivel ? 'pointer' : 'not-allowed',
                  opacity: d.disponivel ? 1 : 0.5,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{d.nome}</div>
                  <div style={{ fontSize: '12px', color: '#5a7060', marginTop: '2px' }}>{d.area}</div>
                </div>
                <span style={{
                  fontSize: '11px', padding: '3px 10px', borderRadius: '20px',
                  background: d.disponivel ? '#2d9b5a18' : '#d0ddd4',
                  color: d.disponivel ? '#2d9b5a' : '#5a7060'
                }}>
                  {d.disponivel ? 'Disponível' : 'Indisponível'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Data */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(26,107,60,0.06)' }}>
          <h3 style={{ fontFamily: 'Fraunces, serif', color: '#0f4526', marginBottom: '16px' }}>Data da Sessão</h3>
          <input
            type="date"
            min={hoje}
            value={data}
            onChange={e => setData(e.target.value)}
            style={{
              width: '100%', padding: '11px 14px', borderRadius: '8px',
              border: '1px solid #d0ddd4', fontSize: '14px', background: '#f9fbf9'
            }}
          />
        </div>

        {/* Horário */}
        {data && (
          <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(26,107,60,0.06)' }}>
            <h3 style={{ fontFamily: 'Fraunces, serif', color: '#0f4526', marginBottom: '16px' }}>Horário</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              {HORARIOS.map(h => (
                <button
                  key={h}
                  onClick={() => setHora(h)}
                  style={{
                    padding: '12px', borderRadius: '8px',
                    border: `1px solid ${hora === h ? '#1a6b3c' : '#d0ddd4'}`,
                    background: hora === h ? '#1a6b3c' : '#fff',
                    color: hora === h ? '#fff' : '#1a2e1f',
                    fontSize: '14px', fontWeight: hora === h ? 600 : 400, cursor: 'pointer'
                  }}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Confirmar */}
        <button
          disabled={!defensor || !data || !hora}
          onClick={() => setConfirmado(true)}
          style={{
            padding: '14px', borderRadius: '10px', border: 'none',
            background: defensor && data && hora ? '#1a6b3c' : '#d0ddd4',
            color: '#fff', fontSize: '15px', fontWeight: 600,
            cursor: defensor && data && hora ? 'pointer' : 'not-allowed'
          }}
        >
          Confirmar Agendamento ✓
        </button>
      </div>
    </div>
  )
}
