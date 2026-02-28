const Card = ({ label, value, sub, color = '#1a6b3c' }) => (
  <div style={{
    background: '#fff', borderRadius: '12px', padding: '24px',
    boxShadow: '0 2px 12px rgba(26,107,60,0.08)', borderTop: `3px solid ${color}`
  }}>
    <div style={{ color: '#5a7060', fontSize: '13px', marginBottom: '8px' }}>{label}</div>
    <div style={{ fontFamily: 'Fraunces, serif', fontSize: '36px', color, fontWeight: 700 }}>{value}</div>
    {sub && <div style={{ color: '#5a7060', fontSize: '12px', marginTop: '4px' }}>{sub}</div>}
  </div>
)

const CASOS_RECENTES = [
  { id: '#0047', parte: 'Maria das Graças S.', tipo: 'Família - Alimentos', comarca: 'Ceres', status: 'Agendado', data: '03/03/2025' },
  { id: '#0046', parte: 'José R. Ferreira', tipo: 'Consumidor', comarca: 'Uruaçu', status: 'Em mediação', data: '27/02/2025' },
  { id: '#0045', parte: 'Ana Paula C. Lima', tipo: 'Família - Divórcio', comarca: 'Formosa', status: 'Acordo', data: '25/02/2025' },
  { id: '#0044', parte: 'Carlos H. Mendes', tipo: 'Saúde', comarca: 'Itumbiara', status: 'Encerrado', data: '20/02/2025' },
]

const statusColor = { 'Agendado': '#1a6b3c', 'Em mediação': '#c8a84b', 'Acordo': '#2d9b5a', 'Encerrado': '#5a7060' }

export default function Dashboard({ onNavigate, user }) {
  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', color: '#0f4526' }}>
          Bom dia, {user?.name?.split(' ')[0] || 'Usuário'} 👋
        </h1>
        <p style={{ color: '#5a7060', marginTop: '4px' }}>
          Aqui está o resumo da plataforma CONCILIA DPE-GO
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <Card label="Casos Ativos" value="12" sub="4 aguardando sessão" color="#1a6b3c" />
        <Card label="Acordos Firmados" value="8" sub="Este mês" color="#2d9b5a" />
        <Card label="Sessões Realizadas" value="23" sub="Fevereiro/2025" color="#c8a84b" />
        <Card label="Comarcas Atendidas" value="9" sub="Via plataforma ODR" color="#0f4526" />
      </div>

      {/* Alerta */}
      <div style={{
        background: 'linear-gradient(135deg, #0f4526, #1a6b3c)', borderRadius: '12px',
        padding: '24px 28px', marginBottom: '32px', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px'
      }}>
        <div>
          <div style={{ color: '#c8a84b', fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: 600 }}>
            EC nº 80/2014 — Meta de Interiorização
          </div>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginTop: '4px' }}>
            DPE-GO cobre apenas 5,9% das 118 comarcas. A plataforma ODR pode ampliar este alcance.
          </p>
        </div>
        <button
          onClick={() => onNavigate('new-case')}
          style={{
            padding: '12px 24px', borderRadius: '8px',
            background: '#c8a84b', border: 'none',
            color: '#0f4526', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          + Novo Caso
        </button>
      </div>

      {/* Tabela de casos */}
      <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 12px rgba(26,107,60,0.08)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #d0ddd4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontFamily: 'Fraunces, serif', color: '#0f4526', fontSize: '18px' }}>Casos Recentes</h3>
          <button
            onClick={() => onNavigate('cases')}
            style={{ background: 'none', border: 'none', color: '#1a6b3c', fontSize: '13px', cursor: 'pointer', fontWeight: 500 }}
          >
            Ver todos →
          </button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f4f6f4' }}>
              {['Nº', 'Parte', 'Tipo', 'Comarca', 'Status', 'Data'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '12px', color: '#5a7060', fontWeight: 600, letterSpacing: '0.5px' }}>
                  {h.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CASOS_RECENTES.map((c, i) => (
              <tr key={c.id} style={{ borderTop: '1px solid #d0ddd4', background: i % 2 === 0 ? '#fff' : '#fafbfa' }}>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#1a6b3c', fontWeight: 600 }}>{c.id}</td>
                <td style={{ padding: '12px 16px', fontSize: '14px' }}>{c.parte}</td>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#5a7060' }}>{c.tipo}</td>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#5a7060' }}>{c.comarca}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    padding: '3px 10px', borderRadius: '20px', fontSize: '12px',
                    background: statusColor[c.status] + '18', color: statusColor[c.status], fontWeight: 600
                  }}>
                    {c.status}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#5a7060' }}>{c.data}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
