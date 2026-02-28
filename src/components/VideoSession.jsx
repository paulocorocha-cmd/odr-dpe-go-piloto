import { useState, useEffect, useRef } from 'react'

export default function VideoSession({ onNavigate, caseData }) {
  const [fase, setFase] = useState('pre') // 'pre' | 'sessao' | 'encerramento' | 'documento'
  const [ata, setAta] = useState([])
  const [novaLinha, setNovaLinha] = useState({ autor: 'Defensor', texto: '' })
  const [timer, setTimer] = useState(0)
  const [resultado, setResultado] = useState('')
  const [valorAcordo, setValorAcordo] = useState('')
  const [docGerado, setDocGerado] = useState(false)
  const timerRef = useRef(null)

  // Gerar nome de sala único por caso
  const salaJitsi = `CONCILIA-DPE-GO-${(caseData?.id || 'CASO001').replace('#', '')}-${Date.now().toString(36).toUpperCase()}`
  const linkJitsi = `https://meet.jit.si/${salaJitsi}`

  useEffect(() => {
    if (fase === 'sessao') {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000)
      // Adicionar abertura automática na ata
      setAta([{
        hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        autor: 'Sistema',
        texto: `Sessão iniciada. Sala: ${salaJitsi}`
      }])
    }
    return () => clearInterval(timerRef.current)
  }, [fase])

  const formatTimer = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const adicionarAta = () => {
    if (!novaLinha.texto.trim()) return
    setAta(a => [...a, {
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      autor: novaLinha.autor,
      texto: novaLinha.texto
    }])
    setNovaLinha(n => ({ ...n, texto: '' }))
  }

  const dataHoje = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
  const codigo = Math.random().toString(36).substr(2, 8).toUpperCase()

  // ── DOCUMENTO FINAL ────────────────────────────────────────────────
  if (docGerado) return (
    <div style={{ maxWidth: '720px' }}>
      <div style={{ background: '#fff', borderRadius: '12px', padding: '40px', boxShadow: '0 2px 12px rgba(26,107,60,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px', borderBottom: '2px solid #0f4526', paddingBottom: '20px' }}>
          <div style={{ fontSize: '12px', color: '#5a7060', letterSpacing: '1px', marginBottom: '4px' }}>
            DEFENSORIA PÚBLICA DO ESTADO DE GOIÁS
          </div>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', color: '#0f4526' }}>
            {resultado === 'acordo' ? 'TERMO DE ACORDO EXTRAJUDICIAL' : 'TERMO DE ENCERRAMENTO SEM ACORDO'}
          </h2>
          <div style={{ fontSize: '12px', color: '#5a7060', marginTop: '4px' }}>
            Núcleo de Atuação Extrajudicial — NAE · Plataforma CONCILIA DPE-GO
          </div>
        </div>

        <div style={{ fontSize: '14px', lineHeight: 2, color: '#1a2e1f', marginBottom: '20px' }}>
          <p style={{ marginBottom: '12px' }}>
            Aos {dataHoje}, realizou-se sessão de mediação extrajudicial via plataforma CONCILIA DPE-GO
            (Sala Jitsi: <code style={{ fontSize: '12px', background: '#f4f6f4', padding: '1px 6px', borderRadius: '4px' }}>{salaJitsi}</code>),
            referente ao processo administrativo nº <strong>{caseData?.id || '#0047'}</strong>,
            envolvendo <strong>{caseData?.parte || 'Parte Assistida'}</strong> e a parte contrária,
            mediada pelo Defensor Público responsável. Duração: <strong>{formatTimer(timer)}</strong>.
          </p>

          {resultado === 'acordo' ? (
            <>
              <p style={{ marginBottom: '8px' }}><strong>DO ACORDO:</strong> As partes acordaram o seguinte:</p>
              <div style={{ background: '#f0f7f3', border: '1px solid #1a6b3c', borderRadius: '8px', padding: '14px', marginBottom: '12px' }}>
                {valorAcordo || 'Termos definidos durante a sessão.'}
              </div>
              <p style={{ fontSize: '13px', color: '#5a7060' }}>
                Este acordo tem eficácia de título executivo extrajudicial (art. 784 CPC) e será encaminhado ao NAE.
              </p>
            </>
          ) : (
            <p>
              Não foi possível chegar a acordo nesta sessão. O caso será encaminhado ao NAE para análise
              e adoção das medidas cabíveis, incluindo eventual ajuizamento de ação judicial.
            </p>
          )}
        </div>

        {/* Ata resumida */}
        {ata.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f4526', marginBottom: '8px' }}>
              📋 ATA DA SESSÃO ({ata.length} registros)
            </div>
            <div style={{ background: '#f9fbf9', borderRadius: '8px', padding: '12px', maxHeight: '150px', overflowY: 'auto' }}>
              {ata.map((l, i) => (
                <div key={i} style={{ fontSize: '12px', marginBottom: '6px' }}>
                  <span style={{ color: '#c8a84b', fontWeight: 700 }}>[{l.hora}]</span>
                  <span style={{ color: '#1a6b3c', fontWeight: 600, marginLeft: '6px' }}>{l.autor}:</span>
                  <span style={{ color: '#1a2e1f', marginLeft: '4px' }}>{l.texto}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginTop: '32px', borderTop: '1px solid #d0ddd4', paddingTop: '20px' }}>
          {['Assistido(a)', 'Parte Contrária', 'Defensor Público'].map(p => (
            <div key={p} style={{ textAlign: 'center' }}>
              <div style={{ borderTop: '1px solid #333', paddingTop: '8px', fontSize: '11px', color: '#5a7060' }}>{p}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#f4f6f4', borderRadius: '8px', padding: '10px 14px', marginTop: '16px', fontSize: '11px', color: '#5a7060' }}>
          🔒 Gerado eletronicamente pela plataforma CONCILIA DPE-GO em {dataHoje}. Código: ODR-{codigo}
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
          <button onClick={() => window.print()} style={{
            flex: 1, padding: '12px', borderRadius: '8px', border: 'none',
            background: '#1a6b3c', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer'
          }}>
            🖨️ Imprimir / Salvar PDF
          </button>
          <button onClick={() => onNavigate('cases')} style={{
            padding: '12px 20px', borderRadius: '8px', border: '1px solid #d0ddd4',
            background: '#fff', color: '#5a7060', fontSize: '14px', cursor: 'pointer'
          }}>
            Voltar aos Casos
          </button>
        </div>
      </div>
    </div>
  )

  // ── ENCERRAMENTO ───────────────────────────────────────────────────
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
            <button key={r.key} onClick={() => setResultado(r.key)} style={{
              flex: 1, padding: '16px', borderRadius: '10px',
              border: `2px solid ${resultado === r.key ? r.color : '#d0ddd4'}`,
              background: resultado === r.key ? r.color + '12' : '#fff',
              color: resultado === r.key ? r.color : '#5a7060',
              fontSize: '15px', fontWeight: 600, cursor: 'pointer'
            }}>
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

        <div style={{ background: '#f4f6f4', borderRadius: '8px', padding: '12px', marginBottom: '20px', fontSize: '13px', color: '#5a7060' }}>
          📋 Ata com <strong>{ata.length} registros</strong> será anexada ao documento automaticamente.
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setFase('sessao')} style={{
            padding: '11px 20px', borderRadius: '8px', border: '1px solid #d0ddd4',
            background: '#fff', color: '#5a7060', fontSize: '14px', cursor: 'pointer'
          }}>← Voltar</button>
          <button disabled={!resultado} onClick={() => setDocGerado(true)} style={{
            flex: 1, padding: '11px', borderRadius: '8px', border: 'none',
            background: resultado ? '#1a6b3c' : '#d0ddd4',
            color: '#fff', fontSize: '14px', fontWeight: 600,
            cursor: resultado ? 'pointer' : 'not-allowed'
          }}>
            Gerar Documento Oficial →
          </button>
        </div>
      </div>
    </div>
  )

  // ── PRÉ-SESSÃO ─────────────────────────────────────────────────────
  if (fase === 'pre') return (
    <div style={{ maxWidth: '680px' }}>
      <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', color: '#0f4526', marginBottom: '8px' }}>
        Sessão de Mediação Online
      </h1>
      <p style={{ color: '#5a7060', marginBottom: '28px' }}>
        Caso {caseData?.id || '#0047'} — {caseData?.parte || 'Parte Assistida'}
      </p>

      {/* Card Jitsi */}
      <div style={{ background: '#fff', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 12px rgba(26,107,60,0.08)', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div style={{ fontSize: '40px' }}>📹</div>
          <div>
            <h3 style={{ fontFamily: 'Fraunces, serif', color: '#0f4526', fontSize: '18px', marginBottom: '6px' }}>
              Sala de Videochamada — Jitsi Meet
            </h3>
            <p style={{ color: '#5a7060', fontSize: '14px', lineHeight: 1.6 }}>
              A videochamada acontece via <strong>Jitsi Meet</strong> — gratuito, sem necessidade de cadastro.
              Compartilhe o link abaixo com todas as partes antes da sessão.
            </p>
          </div>
        </div>

        <div style={{ background: '#f0f7f3', borderRadius: '8px', padding: '14px 16px', marginBottom: '16px', border: '1px solid #c8e6d4' }}>
          <div style={{ fontSize: '11px', color: '#5a7060', marginBottom: '4px', fontWeight: 600 }}>LINK DA SALA (compartilhe com as partes):</div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <code style={{ flex: 1, fontSize: '13px', color: '#1a6b3c', wordBreak: 'break-all' }}>{linkJitsi}</code>
            <button
              onClick={() => navigator.clipboard.writeText(linkJitsi)}
              style={{
                padding: '6px 12px', borderRadius: '6px', border: '1px solid #1a6b3c',
                background: '#fff', color: '#1a6b3c', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap'
              }}
            >
              📋 Copiar
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <a
            href={linkJitsi}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1, padding: '12px', borderRadius: '8px', border: 'none',
              background: '#1a6b3c', color: '#fff', fontSize: '14px', fontWeight: 600,
              cursor: 'pointer', textDecoration: 'none', textAlign: 'center', display: 'block'
            }}
          >
            🎥 Abrir Videochamada (nova aba)
          </a>
          <button
            onClick={() => setFase('sessao')}
            style={{
              padding: '12px 20px', borderRadius: '8px', border: '1px solid #1a6b3c',
              background: '#fff', color: '#1a6b3c', fontSize: '14px', fontWeight: 600, cursor: 'pointer'
            }}
          >
            ✅ Sessão iniciada — Registrar Ata
          </button>
        </div>
      </div>

      {/* Instruções */}
      <div style={{ background: '#fff', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 2px 8px rgba(26,107,60,0.06)' }}>
        <h4 style={{ fontFamily: 'Fraunces, serif', color: '#0f4526', marginBottom: '12px' }}>
          📋 Checklist pré-sessão
        </h4>
        {[
          'Confirmar presença de todas as partes na sala Jitsi',
          'Verificar câmera e microfone de todos os participantes',
          'Informar às partes que a sessão será registrada em ata',
          'Confirmar identidade das partes com documento de identificação',
          'Registrar abertura formal da sessão na ata ao lado'
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '8px', fontSize: '14px', color: '#5a7060' }}>
            <span style={{ color: '#1a6b3c', fontWeight: 700 }}>✓</span>
            {item}
          </div>
        ))}
      </div>
    </div>
  )

  // ── SESSÃO ATIVA com ata manual ────────────────────────────────────
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', color: '#0f4526' }}>
          Sessão em Andamento — {caseData?.id || '#0047'}
        </h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{
            background: '#ff4444', borderRadius: '20px', padding: '6px 14px',
            color: '#fff', fontSize: '13px', fontWeight: 600, display: 'flex', gap: '6px', alignItems: 'center'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff', animation: 'pulse 1s infinite', display: 'inline-block' }} />
            AO VIVO · {formatTimer(timer)}
          </div>
          <button onClick={() => setFase('encerramento')} style={{
            padding: '8px 16px', borderRadius: '8px', border: 'none',
            background: '#e07b39', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer'
          }}>
            Encerrar Sessão
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Painel esquerdo: Jitsi embed + link */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            background: '#0f1a12', borderRadius: '12px', overflow: 'hidden',
            border: '2px solid #1a6b3c'
          }}>
            <iframe
              src={linkJitsi}
              allow="camera; microphone; fullscreen; display-capture; autoplay"
              style={{ width: '100%', height: '340px', border: 'none', display: 'block' }}
              title="Sessão de Mediação - Jitsi Meet"
            />
          </div>

          <div style={{
            background: '#fff', borderRadius: '10px', padding: '14px 16px',
            boxShadow: '0 2px 8px rgba(26,107,60,0.06)', fontSize: '13px'
          }}>
            <div style={{ color: '#5a7060', fontSize: '11px', marginBottom: '4px', fontWeight: 600 }}>
              LINK PARA COMPARTILHAR
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <code style={{ flex: 1, color: '#1a6b3c', fontSize: '11px', wordBreak: 'break-all' }}>{linkJitsi}</code>
              <button
                onClick={() => navigator.clipboard.writeText(linkJitsi)}
                style={{
                  padding: '4px 10px', borderRadius: '6px', border: '1px solid #1a6b3c',
                  background: '#fff', color: '#1a6b3c', fontSize: '11px', cursor: 'pointer', whiteSpace: 'nowrap'
                }}
              >
                Copiar
              </button>
            </div>
          </div>
        </div>

        {/* Painel direito: Ata em tempo real */}
        <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(26,107,60,0.06)', display: 'flex', flexDirection: 'column' }}>
          <div style={{
            padding: '14px 16px', borderBottom: '1px solid #d0ddd4',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <span style={{ fontWeight: 600, fontSize: '14px', color: '#0f4526' }}>📝 Ata da Sessão</span>
            <span style={{ fontSize: '11px', color: '#2d9b5a', background: '#2d9b5a18', padding: '2px 8px', borderRadius: '10px' }}>
              {ata.length} registros
            </span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '12px', minHeight: '200px', maxHeight: '260px' }}>
            {ata.length === 0 && (
              <div style={{ color: '#5a7060', fontSize: '13px', textAlign: 'center', marginTop: '24px' }}>
                Registre as falas das partes na ata abaixo
              </div>
            )}
            {ata.map((l, i) => (
              <div key={i} style={{ marginBottom: '10px', fontSize: '12px', paddingBottom: '8px', borderBottom: i < ata.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                <span style={{ color: '#c8a84b', fontWeight: 700 }}>[{l.hora}]</span>
                <span style={{
                  color: l.autor === 'Sistema' ? '#5a7060' : '#1a6b3c',
                  fontWeight: 600, marginLeft: '6px'
                }}>{l.autor}:</span>
                <span style={{ color: '#1a2e1f', marginLeft: '4px' }}>{l.texto}</span>
              </div>
            ))}
          </div>

          {/* Input da ata */}
          <div style={{ padding: '12px', borderTop: '1px solid #d0ddd4', background: '#fafbfa' }}>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
              {['Defensor', 'Assistido', 'Parte Contrária', 'Sistema'].map(a => (
                <button
                  key={a}
                  onClick={() => setNovaLinha(n => ({ ...n, autor: a }))}
                  style={{
                    padding: '4px 8px', borderRadius: '12px', border: 'none', fontSize: '11px',
                    background: novaLinha.autor === a ? '#1a6b3c' : '#e8ede9',
                    color: novaLinha.autor === a ? '#fff' : '#5a7060',
                    cursor: 'pointer'
                  }}
                >
                  {a}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                value={novaLinha.texto}
                onChange={e => setNovaLinha(n => ({ ...n, texto: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && adicionarAta()}
                placeholder={`Registrar fala de ${novaLinha.autor}...`}
                style={{
                  flex: 1, padding: '8px 10px', borderRadius: '6px',
                  border: '1px solid #d0ddd4', fontSize: '13px'
                }}
              />
              <button onClick={adicionarAta} style={{
                padding: '8px 14px', borderRadius: '6px', border: 'none',
                background: '#1a6b3c', color: '#fff', fontSize: '13px', cursor: 'pointer'
              }}>+</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
