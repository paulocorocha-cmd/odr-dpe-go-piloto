import { useState } from 'react'

const TODOS_CASOS = [
  { id: '#0047', parte: 'Maria das Graças S.', cpf: '***.***.011-20', tipo: 'Família - Alimentos', comarca: 'Ceres', pid: 'Fórum de Ceres', status: 'Agendado', data: '03/03/2025', descricao: 'Revisão de pensão alimentícia para filho menor.' },
  { id: '#0046', parte: 'José R. Ferreira', cpf: '***.***.043-11', tipo: 'Consumidor', comarca: 'Uruaçu', pid: 'Fórum de Uruaçu', status: 'Em mediação', data: '27/02/2025', descricao: 'Cobrança indevida em contrato de serviços.' },
  { id: '#0045', parte: 'Ana Paula C. Lima', cpf: '***.***.078-33', tipo: 'Família - Divórcio', comarca: 'Formosa', pid: 'Fórum de Formosa', status: 'Acordo', data: '25/02/2025', descricao: 'Divórcio consensual com partilha de bens.' },
  { id: '#0044', parte: 'Carlos H. Mendes', cpf: '***.***.091-55', tipo: 'Saúde', comarca: 'Itumbiara', pid: 'Fórum de Itumbiara', status: 'Encerrado', data: '20/02/2025', descricao: 'Fornecimento de medicamento de alto custo.' },
  { id: '#0043', parte: 'Francisca T. Souza', cpf: '***.***.102-66', tipo: 'Família - Guarda', comarca: 'Catalão', pid: 'Fórum de Catalão', status: 'Agendado', data: '05/03/2025', descricao: 'Regulamentação de guarda compartilhada.' },
  { id: '#0042', parte: 'Pedro A. Rodrigues', cpf: '***.***.115-77', tipo: 'Consumidor', comarca: 'Jataí', pid: 'Fórum de Jataí', status: 'Aguardando parte', data: '18/02/2025', descricao: 'Negativação indevida no SPC.' },
]

const statusColor = { 'Agendado': '#1a6b3c', 'Em mediação': '#c8a84b', 'Acordo': '#2d9b5a', 'Encerrado': '#5a7060', 'Aguardando parte': '#e07b39' }

export default function Cases({ onNavigate }) {
  const [filtro, setFiltro] = useState('Todos')
  const [busca, setBusca] = useState('')
  const [selecionado, setSelecionado] = useState(null)

  const statusFiltros = ['Todos', 'Agendado', 'Em mediação', 'Acordo', 'Encerrado']
  const casos = TODOS_CASOS.filter(c =>
    (filtro === 'Todos' || c.status === filtro) &&
    (busca === '' || c.parte.toLowerCase().includes(busca.toLowerCase()) || c.comarca.toLowerCase().includes(busca.toLowerCase()))
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', color: '#0f4526' }}>Gerenciar Casos</h1>
        <button
          onClick={() => onNavigate('new-case')}
          style={{
            padding: '10px 22px', borderRadius: '8px',
            background: '#1a6b3c', border: 'none', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer'
          }}
        >
          + Novo Caso
        </button>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          placeholder="Buscar por parte ou comarca..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          style={{
            padding: '9px 14px', borderRadius: '8px', border: '1px solid #d0ddd4',
            fontSize: '14px', flex: '1', minWidth: '200px', background: '#fff'
          }}
        />
        <div style={{ display: 'flex', gap: '6px' }}>
          {statusFiltros.map(s => (
            <button
              key={s}
              onClick={() => setFiltro(s)}
              style={{
                padding: '8px 14px', borderRadius: '20px', border: '1px solid',
                borderColor: filtro === s ? '#1a6b3c' : '#d0ddd4',
                background: filtro === s ? '#1a6b3c' : '#fff',
                color: filtro === s ? '#fff' : '#5a7060',
                fontSize: '13px', cursor: 'pointer'
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Lista */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {casos.map(c => (
          <div
            key={c.id}
            onClick={() => setSelecionado(selecionado?.id === c.id ? null : c)}
            style={{
              background: '#fff', borderRadius: '12px', padding: '20px 24px',
              boxShadow: '0 2px 8px rgba(26,107,60,0.06)',
              border: selecionado?.id === c.id ? '2px solid #1a6b3c' : '2px solid transparent',
              cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ color: '#1a6b3c', fontWeight: 700, fontSize: '14px' }}>{c.id}</span>
                  <span style={{
                    padding: '2px 10px', borderRadius: '20px', fontSize: '11px',
                    background: statusColor[c.status] + '18', color: statusColor[c.status], fontWeight: 600
                  }}>
                    {c.status}
                  </span>
                </div>
                <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>{c.parte}</div>
                <div style={{ fontSize: '13px', color: '#5a7060' }}>{c.tipo} · {c.comarca} · {c.data}</div>
              </div>
              {(c.status === 'Agendado' || c.status === 'Em mediação') && (
                <button
                  onClick={e => { e.stopPropagation(); onNavigate('video-session', c) }}
                  style={{
                    padding: '8px 16px', borderRadius: '8px',
                    background: '#1a6b3c', border: 'none', color: '#fff',
                    fontSize: '13px', fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  📹 Iniciar Sessão
                </button>
              )}
            </div>

            {selecionado?.id === c.id && (
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #d0ddd4' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#5a7060', fontWeight: 600, marginBottom: '3px' }}>CPF (mascarado)</div>
                    <div style={{ fontSize: '14px' }}>{c.cpf}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#5a7060', fontWeight: 600, marginBottom: '3px' }}>PID Vinculado</div>
                    <div style={{ fontSize: '14px' }}>{c.pid}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#5a7060', fontWeight: 600, marginBottom: '3px' }}>Comarca</div>
                    <div style={{ fontSize: '14px' }}>{c.comarca}</div>
                  </div>
                </div>
                <div style={{ marginTop: '12px' }}>
                  <div style={{ fontSize: '11px', color: '#5a7060', fontWeight: 600, marginBottom: '3px' }}>Descrição</div>
                  <div style={{ fontSize: '14px', color: '#1a2e1f' }}>{c.descricao}</div>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                  <button
                    onClick={e => { e.stopPropagation(); onNavigate('schedule', c) }}
                    style={{
                      padding: '8px 16px', borderRadius: '8px',
                      border: '1px solid #1a6b3c', background: 'transparent',
                      color: '#1a6b3c', fontSize: '13px', cursor: 'pointer'
                    }}
                  >
                    📅 Agendar
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); onNavigate('documents') }}
                    style={{
                      padding: '8px 16px', borderRadius: '8px',
                      border: '1px solid #d0ddd4', background: 'transparent',
                      color: '#5a7060', fontSize: '13px', cursor: 'pointer'
                    }}
                  >
                    📄 Documentos
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
