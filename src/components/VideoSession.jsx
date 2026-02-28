import { useState, useEffect } from 'react'

const TRANSCRICAO_AUTO = [
  { tempo: '00:02', autor: 'Defensor', texto: 'Bom dia. Declaro aberta a sessão de mediação. Estão presentes as partes e seus representantes.' },
  { tempo: '00:45', autor: 'Defensor', texto: 'Informo que esta sessão será registrada em ata. As partes têm ciência e concordam com o procedimento?' },
  { tempo: '01:10', autor: 'Assistido', texto: 'Sim, concordo.' },
  { tempo: '01:30', autor: 'Parte Contrária', texto: 'Concordo também.' },
  { tempo: '02:15', autor: 'Defensor', texto: 'Passo a palavra ao assistido para expor seus pedidos e fundamentos.' },
  { tempo: '03:00', autor: 'Assistido', texto: 'Quero que seja fixada pensão alimentícia no valor de R$ 800,00 mensais para minha filha.' },
  { tempo: '04:20', autor: 'Parte Contrária', texto: 'Posso pagar até R$ 600,00, dado o meu salário atual.' },
  { tempo: '05:30', autor: 'Defensor', texto: 'Com base nas informações apresentadas, há possibilidade de acordo em R$ 700,00? Ambas as partes aceitam?' },
  { tempo: '06:10', autor: 'Assistido', texto: 'Aceito o valor de R$ 700,00.' },
  { tempo: '06:40', autor: 'Parte Contrária', texto: 'Aceito.' },
  { tempo: '07:00', autor: 'Defensor', texto: 'Excelente. Registramos o acordo. Vou gerar o Termo de Acordo para assinatura das partes.' },
]

export default function VideoSession({ onNavigate, caseData }) {
  const [fase, setFase] = useState('sessao') // 'sessao' | 'encerramento' | 'documento'
  const [chat, setChat] = useState([])
  const [msg, setMsg] = useState('')
  const [linhasTranscricao, setLinhasTranscricao] = useState([])
  const [timer, setTimer] = useState(0)
  const [ativo, setAtivo] = useState(true)
  const [resultado, setResultado] = useState('') // 'acordo' | 'sem-acordo'
  const [valorAcordo, setValorAcordo] = useState('')
  const [docGerado, setDocGerado] = useState(false)

  useEffect(() => {
    let idx = 0
    const interval = setInterval(() => {
      if (idx < TRANSCRICAO_AUTO.length) {
        setLinhasTranscricao(prev => [...prev, TRANSCRICAO_AUTO[idx]])
        idx++
      }
    }, 2500)
    const timerInterval = setInterval(() => {
      if (ativo) setTimer(t => t + 1)
    }, 1000)
    return () => { clearInterval(interval); clearInterval(timerInterval) }
  }, [])

  const formatTimer = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const enviarMsg = () => {
    if (!msg.trim()) return
    setChat(c => [...c, { autor: 'Você', texto: msg, hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) }])
    setMsg('')
  }

  const gerarDocumento = () => setDocGerado(true)

  const dataHoje = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })

  if (docGerado) return (
    <div style={{ maxWidth: '700px' }}>
      <div style={{ background: '#fff', borderRadius: '12px', padding: '40px', boxShadow: '0 2px 12px rgba(26,107,60,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px', borderBottom: '2px solid #0f4526', paddingBottom: '20px' }}>
          <div style={{ fontSize: '13px', color: '#5a7060', marginBottom: '4px', letterSpacing: '1px' }}>DEFENSORIA PÚBLICA DO ESTADO DE GOIÁS</div>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', color: '#0f4526', marginBottom: '4px' }}>
            {resultado === 'acordo' ? 'TERMO DE ACORDO EXTRAJUDICIAL' : 'TERMO DE ENCERRAMENTO SEM ACORDO'}
          </h2>
          <div style={{ fontSize: '12px', color: '#5a7060' }}>Núcleo de Atuação Extrajudicial — NAE</div>
        </div>

        <div style={{ fontSize: '14px', lineHeight: 2, color: '#1a2e1f', marginBottom: '24px' }}>
          <p style={{ marginBottom: '12px' }}>
            Aos {dataHoje}, realizou-se sessão de mediação extrajudicial via plataforma CONCILIA DPE-GO,
            referente ao processo administrativo nº {caseData?.id || '#0047'},
            envolvendo <strong>{caseData?.parte || 'Maria das Graças S.'}</strong> (Assistida)
            e a parte contrária, mediada pelo Defensor Público responsável.
          </p>
          {resultado === 'acordo' ? (
            <>
              <p style={{ marginBottom: '12px' }}>
                <strong>DO ACORDO:</strong> As partes, de livre e espontânea vontade, chegaram ao seguinte entendimento:
              </p>
              <div style={{
                background: '#f0f7f3', border: '1px solid #1a6b3c', borderRadius: '8px',
                padding: '16px', marginBottom: '12px'
              }}>
                {valorAcordo || 'Fixação de alimentos no valor de R$ 700,00 mensais, pagáveis até o 5º dia útil de cada mês.'}
              </div>
              <p>
                O presente acordo tem eficácia de título executivo extrajudicial nos termos do art. 784 do CPC
                e será encaminhado ao NAE para acompanhamento e homologação.
              </p>
            </>
          ) : (
            <p>
              Não foi possível chegar a um acordo entre as partes nesta sessão. O caso será encaminhado
              ao NAE para análise e adoção das medidas cabíveis, incluindo eventual ajuizamento de ação judicial.
            </p>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginTop: '40px', borderTop: '1px solid #d0ddd4', paddingTop: '20px' }}>
          {['Assistido(a)', 'Parte Contrária', 'Defensor Público'].map(p => (
            <div key={p} style={{ textAlign: 'center' }}>
              <div style={{ borderTop: '1px solid #333', paddingTop: '8px', fontSize: '12px', color: '#5a7060' }}>{p}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#f4f6f4', borderRadius: '8px', padding: '12px 16px', marginTop: '20px', fontSize: '12px', color: '#5a7060' }}>
          🔒 Documento gerado eletronicamente pela plataforma CONCILIA DPE-GO em {dataHoje}.
          Autenticidade verificável pelo código: ODR-{Math.random().toString(36).substr(2, 8).toUpperCase()}
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button
            onClick={() => onNavigate('documents')}
            style={{
              flex: 1, padding: '12px', borderRadius: '8px', border: 'none',
              background: '#1a6b3c', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer'
            }}
          >
            📥 Salvar Documento
          </button>
          <button
            onClick={() => onNavigate('cases')}
            style={{
              padding: '12px 20px', borderRadius: '8px', border: '1px solid #d0ddd4',
              background: '#fff', color: '#5a7060', fontSize: '14px', cursor: 'pointer'
            }}
          >
            Voltar aos Casos
          </button>
        </div>
      </div>
    </div>
  )

  if (fase === 'encerramento') return (
    <div style={{ maxWidth: '600px' }}>
      <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', color: '#0f4526', marginBottom: '24px' }}>
        Encerrar Sessão
      </h2>
      <div style={{ background: '#fff', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 12px rgba(26,107,60,0.08)' }}>
        <p style={{ color: '#5a7060', marginBottom: '20px' }}>Qual foi o resultado desta sessão?</p>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          {[
            { key: 'acordo', label: '🤝 Acordo Firmado', color: '#1a6b3c' },
            { key: 'sem-acordo', label: '❌ Sem Acordo', color: '#e07b39' }
          ].map(r => (
            <button
              key={r.key}
              onClick={() => setResultado(r.key)}
              style={{
                flex: 1, padding: '16px', borderRadius: '10px',
                border: `2px solid ${resultado === r.key ? r.color : '#d0ddd4'}`,
                background: resultado === r.key ? r.color + '12' : '#fff',
                color: resultado === r.key ? r.color : '#5a7060',
                fontSize: '15px', fontWeight: 600, cursor: 'pointer'
              }}
            >
              {r.label}
            </button>
          ))}
        </div>

        {resultado === 'acordo' && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', color: '#5a7060', marginBottom: '8px', display: 'block' }}>
              Descreva os termos do acordo:
            </label>
            <textarea
              value={valorAcordo}
              onChange={e => setValorAcordo(e.target.value)}
              placeholder="Ex: Fixação de alimentos no valor de R$ 700,00 mensais..."
              style={{
                width: '100%', padding: '12px', borderRadius: '8px',
                border: '1px solid #d0ddd4', fontSize: '14px', minHeight: '100px', resize: 'vertical'
              }}
            />
          </div>
        )}

        <div style={{ background: '#f4f6f4', borderRadius: '8px', padding: '14px', marginBottom: '20px', fontSize: '13px', color: '#5a7060' }}>
          📋 <strong>Ata da Sessão ({linhasTranscricao.length} registros)</strong> será anexada automaticamente ao documento.
          O caso será encaminhado ao NAE.
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setFase('sessao')}
            style={{
              padding: '11px 20px', borderRadius: '8px', border: '1px solid #d0ddd4',
              background: '#fff', color: '#5a7060', fontSize: '14px', cursor: 'pointer'
            }}
          >
            ← Voltar
          </button>
          <button
            disabled={!resultado}
            onClick={gerarDocumento}
            style={{
              flex: 1, padding: '11px', borderRadius: '8px', border: 'none',
              background: resultado ? '#1a6b3c' : '#d0ddd4',
              color: '#fff', fontSize: '14px', fontWeight: 600,
              cursor: resultado ? 'pointer' : 'not-allowed'
            }}
          >
            Gerar Documento →
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', color: '#0f4526' }}>
          Sessão de Mediação Online
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: '#ff4444', borderRadius: '20px', padding: '6px 14px',
            color: '#fff', fontSize: '13px', fontWeight: 600, display: 'flex', gap: '6px', alignItems: 'center'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff', display: 'inline-block' }} />
            AO VIVO · {formatTimer(timer)}
          </div>
          <button
            onClick={() => setFase('encerramento')}
            style={{
              padding: '8px 16px', borderRadius: '8px', border: 'none',
              background: '#e07b39', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer'
            }}
          >
            Encerrar Sessão
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        {/* Vídeo principal */}
        <div style={{
          background: '#1a2e1f', borderRadius: '12px', aspectRatio: '4/3',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '12px' }}>👨‍⚖️</div>
          <div style={{ color: '#c8a84b', fontFamily: 'Fraunces, serif', fontSize: '16px' }}>Dr. Carlos Eduardo Lima</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginTop: '4px' }}>Defensor Público</div>
          <div style={{
            position: 'absolute', bottom: '12px', left: '12px',
            background: 'rgba(0,0,0,0.5)', borderRadius: '6px', padding: '4px 10px',
            color: '#fff', fontSize: '11px'
          }}>
            🎤 Ativo
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '12px' }}>
          {[
            { icon: '👩', nome: caseData?.parte || 'Maria das Graças S.', label: 'Assistida', pid: caseData?.pid || 'PID - Fórum de Ceres' },
            { icon: '👨', nome: 'João da Silva', label: 'Parte Contrária', pid: 'PID - Fórum de Ceres' }
          ].map(p => (
            <div key={p.nome} style={{
              background: '#1a2e1f', borderRadius: '10px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px'
            }}>
              <div style={{ fontSize: '36px', marginBottom: '6px' }}>{p.icon}</div>
              <div style={{ color: '#fff', fontSize: '13px', fontWeight: 600 }}>{p.nome}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '2px' }}>{p.label}</div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', marginTop: '2px' }}>📍 {p.pid}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Painel inferior: Chat + Transcrição */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Chat */}
        <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(26,107,60,0.06)' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #d0ddd4', fontWeight: 600, fontSize: '14px', color: '#0f4526' }}>
            💬 Chat da Sessão
          </div>
          <div style={{ height: '160px', overflowY: 'auto', padding: '12px' }}>
            {chat.length === 0 && (
              <div style={{ color: '#5a7060', fontSize: '13px', textAlign: 'center', marginTop: '20px' }}>
                Nenhuma mensagem ainda
              </div>
            )}
            {chat.map((m, i) => (
              <div key={i} style={{ marginBottom: '8px', fontSize: '13px' }}>
                <span style={{ fontWeight: 600, color: '#1a6b3c' }}>{m.autor}</span>
                <span style={{ color: '#5a7060', fontSize: '11px', marginLeft: '6px' }}>{m.hora}</span>
                <div style={{ color: '#1a2e1f', marginTop: '2px' }}>{m.texto}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: '10px', borderTop: '1px solid #d0ddd4', display: 'flex', gap: '8px' }}>
            <input
              value={msg}
              onChange={e => setMsg(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && enviarMsg()}
              placeholder="Escreva uma mensagem..."
              style={{
                flex: 1, padding: '8px 12px', borderRadius: '6px',
                border: '1px solid #d0ddd4', fontSize: '13px'
              }}
            />
            <button
              onClick={enviarMsg}
              style={{
                padding: '8px 14px', borderRadius: '6px', border: 'none',
                background: '#1a6b3c', color: '#fff', fontSize: '13px', cursor: 'pointer'
              }}
            >
              ➤
            </button>
          </div>
        </div>

        {/* Transcrição */}
        <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(26,107,60,0.06)' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #d0ddd4', fontWeight: 600, fontSize: '14px', color: '#0f4526', display: 'flex', justifyContent: 'space-between' }}>
            <span>📝 Ata em Tempo Real</span>
            <span style={{ fontSize: '11px', color: '#2d9b5a', background: '#2d9b5a18', padding: '2px 8px', borderRadius: '10px' }}>
              {linhasTranscricao.length} registros
            </span>
          </div>
          <div style={{ height: '200px', overflowY: 'auto', padding: '12px' }}>
            {linhasTranscricao.map((l, i) => (
              <div key={i} style={{ marginBottom: '10px', fontSize: '12px' }}>
                <span style={{ color: '#c8a84b', fontWeight: 700 }}>[{l.tempo}]</span>
                <span style={{ color: '#1a6b3c', fontWeight: 600, marginLeft: '6px' }}>{l.autor}:</span>
                <span style={{ color: '#1a2e1f', marginLeft: '4px' }}>{l.texto}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
