const DOCS = [
  { id: 'DOC-001', titulo: 'Termo de Acordo — Maria das Graças S.', tipo: 'Acordo', data: '25/02/2025', caso: '#0045', status: 'Homologado', tamanho: '42 KB' },
  { id: 'DOC-002', titulo: 'Termo de Encerramento — José R. Ferreira', tipo: 'Sem Acordo', data: '20/02/2025', caso: '#0044', status: 'Arquivado', tamanho: '38 KB' },
  { id: 'DOC-003', titulo: 'Ata de Sessão — Ana Paula C. Lima', tipo: 'Ata', data: '25/02/2025', caso: '#0045', status: 'Gerado', tamanho: '55 KB' },
  { id: 'DOC-004', titulo: 'Termo de Acordo — Carlos H. Mendes', tipo: 'Acordo', data: '18/02/2025', caso: '#0043', status: 'Homologado', tamanho: '44 KB' },
]

const tipoColor = { 'Acordo': '#2d9b5a', 'Sem Acordo': '#e07b39', 'Ata': '#1a6b3c' }
const statusColor = { 'Homologado': '#2d9b5a', 'Arquivado': '#5a7060', 'Gerado': '#c8a84b' }

export default function Documents({ onNavigate }) {
  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', color: '#0f4526' }}>Documentos</h1>
        <p style={{ color: '#5a7060', marginTop: '4px' }}>Termos de acordo, atas e documentos gerados pelas sessões</p>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        {[['📄', 'Total', DOCS.length], ['🤝', 'Acordos', 2], ['✅', 'Homologados', 2], ['📋', 'Atas', 1]].map(([icon, label, n]) => (
          <div key={label} style={{
            background: '#fff', borderRadius: '10px', padding: '16px 20px', flex: 1,
            boxShadow: '0 2px 8px rgba(26,107,60,0.06)', textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>{icon}</div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', color: '#0f4526', fontWeight: 700 }}>{n}</div>
            <div style={{ fontSize: '12px', color: '#5a7060' }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(26,107,60,0.08)' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #d0ddd4' }}>
          <h3 style={{ fontFamily: 'Fraunces, serif', color: '#0f4526' }}>Todos os Documentos</h3>
        </div>
        {DOCS.map((doc, i) => (
          <div
            key={doc.id}
            style={{
              padding: '16px 24px', borderBottom: i < DOCS.length - 1 ? '1px solid #d0ddd4' : 'none',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: i % 2 === 0 ? '#fff' : '#fafbfa'
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{
                  padding: '2px 8px', borderRadius: '12px', fontSize: '11px',
                  background: tipoColor[doc.tipo] + '18', color: tipoColor[doc.tipo], fontWeight: 600
                }}>
                  {doc.tipo}
                </span>
                <span style={{ fontSize: '12px', color: '#5a7060' }}>{doc.id}</span>
              </div>
              <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '3px' }}>{doc.titulo}</div>
              <div style={{ fontSize: '12px', color: '#5a7060' }}>Caso {doc.caso} · {doc.data} · {doc.tamanho}</div>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{
                padding: '3px 10px', borderRadius: '12px', fontSize: '12px',
                background: statusColor[doc.status] + '18', color: statusColor[doc.status], fontWeight: 600
              }}>
                {doc.status}
              </span>
              <button style={{
                padding: '7px 14px', borderRadius: '6px', border: '1px solid #d0ddd4',
                background: '#fff', color: '#1a6b3c', fontSize: '12px', cursor: 'pointer', fontWeight: 600
              }}>
                📥 Baixar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
