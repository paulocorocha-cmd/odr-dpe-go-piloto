import { useState } from 'react'
import { PIDS_TJGO } from '../data/pids'

const nivelColor = { 'Avançado': '#1a6b3c', 'Intermediário': '#c8a84b', 'Básico': '#5a7060' }

export default function PIDs({ onNavigate }) {
  const [busca, setBusca] = useState('')
  const [nivel, setNivel] = useState('Todos')

  const pids = PIDS_TJGO.filter(p =>
    (nivel === 'Todos' || p.nivel === nivel) &&
    (busca === '' || p.comarca.toLowerCase().includes(busca.toLowerCase()))
  )

  const contagem = { Avançado: PIDS_TJGO.filter(p => p.nivel === 'Avançado').length, Intermediário: PIDS_TJGO.filter(p => p.nivel === 'Intermediário').length, Básico: PIDS_TJGO.filter(p => p.nivel === 'Básico').length }

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', color: '#0f4526' }}>
          Pontos de Inclusão Digital
        </h1>
        <p style={{ color: '#5a7060', marginTop: '4px' }}>
          {PIDS_TJGO.length} PIDs instalados pelo TJGO em todo o Estado de Goiás (CNJ Resolução nº 508/2023)
        </p>
      </div>

      {/* Stats por nível */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {Object.entries(contagem).map(([n, c]) => (
          <div key={n} style={{
            background: '#fff', borderRadius: '10px', padding: '16px 24px',
            boxShadow: '0 2px 8px rgba(26,107,60,0.06)', borderTop: `3px solid ${nivelColor[n]}`
          }}>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', color: nivelColor[n], fontWeight: 700 }}>{c}</div>
            <div style={{ fontSize: '13px', color: '#5a7060' }}>Nível {n}</div>
          </div>
        ))}
        <div style={{
          background: 'linear-gradient(135deg, #0f4526, #1a6b3c)', borderRadius: '10px', padding: '16px 24px',
          color: '#fff', flex: '1', minWidth: '160px'
        }}>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: '13px', color: '#c8a84b', marginBottom: '4px' }}>
            Parceria Estratégica
          </div>
          <div style={{ fontSize: '13px', lineHeight: 1.5 }}>
            Os PIDs do TJGO permitem que cidadãos sem acesso à internet participem das sessões ODR da DPE-GO.
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          placeholder="Buscar por comarca..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          style={{
            padding: '9px 14px', borderRadius: '8px', border: '1px solid #d0ddd4',
            fontSize: '14px', flex: '1', minWidth: '200px', background: '#fff'
          }}
        />
        {['Todos', 'Avançado', 'Intermediário', 'Básico'].map(n => (
          <button
            key={n}
            onClick={() => setNivel(n)}
            style={{
              padding: '8px 14px', borderRadius: '20px',
              border: `1px solid ${nivel === n ? (nivelColor[n] || '#1a6b3c') : '#d0ddd4'}`,
              background: nivel === n ? (nivelColor[n] || '#1a6b3c') : '#fff',
              color: nivel === n ? '#fff' : '#5a7060',
              fontSize: '13px', cursor: 'pointer'
            }}
          >
            {n} {n !== 'Todos' && `(${contagem[n]})`}
          </button>
        ))}
      </div>

      {/* Grid de PIDs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
        {pids.map(p => (
          <div
            key={p.id}
            style={{
              background: '#fff', borderRadius: '10px', padding: '16px 18px',
              boxShadow: '0 2px 8px rgba(26,107,60,0.06)',
              borderLeft: `3px solid ${nivelColor[p.nivel]}`
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ fontWeight: 700, fontSize: '15px', color: '#0f4526' }}>
                📍 {p.comarca}
              </div>
              <span style={{
                fontSize: '11px', padding: '2px 8px', borderRadius: '10px',
                background: nivelColor[p.nivel] + '18', color: nivelColor[p.nivel], fontWeight: 600
              }}>
                {p.nivel}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#5a7060', marginBottom: '4px' }}>{p.endereco}</div>
            {p.telefone && (
              <div style={{ fontSize: '12px', color: '#1a6b3c', fontWeight: 500 }}>☎ {p.telefone}</div>
            )}
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', padding: '20px', color: '#5a7060', fontSize: '13px' }}>
        Exibindo {pids.length} de {PIDS_TJGO.length} PIDs
      </div>
    </div>
  )
}
