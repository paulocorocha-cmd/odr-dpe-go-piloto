import { useState, useEffect, useRef } from 'react'

// ── Sala Jitsi única por sessão ───────────────────────────────────
function useSalaJitsi(caseData) {
  const ref = useRef(
    `CONCILIA-DPE-GO-${(caseData?.id || 'CASO001').replace('#', '')}-${Date.now().toString(36).toUpperCase()}`
  )
  return ref.current
}

// ── Hook: Web Speech API (reconhecimento de voz em pt-BR) ─────────
function useSpeechRecognition({ onFinalizado, ativo, falante }) {
  const recRef = useRef(null)
  const ativoRef = useRef(ativo)
  ativoRef.current = ativo
  const falanteRef = useRef(falante)
  falanteRef.current = falante

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return

    const rec = new SR()
    rec.lang = 'pt-BR'
    rec.continuous = true
    rec.interimResults = false

    rec.onresult = (e) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          const texto = e.results[i][0].transcript.trim()
          if (texto) onFinalizado(texto, falanteRef.current)
        }
      }
    }

    rec.onerror = (e) => { if (e.error !== 'no-speech' && e.error !== 'aborted') console.warn(e.error) }
    rec.onend = () => { if (ativoRef.current) { try { rec.start() } catch (_) {} } }

    recRef.current = rec
    if (ativo) { try { rec.start() } catch (_) {} }

    return () => { try { rec.stop() } catch (_) {} }
  }, [])

  useEffect(() => {
    const rec = recRef.current
    if (!rec) return
    if (ativo) { try { rec.start() } catch (_) {} }
    else { try { rec.stop() } catch (_) {} }
  }, [ativo])
}

// ── Formatar ata com Claude IA ────────────────────────────────────
async function formatarAtaComIA(linhas, caseData) {
  if (!linhas.length) return ''

  const textoRaw = linhas.map(l => `[${l.hora}] ${l.autor}: ${l.texto}`).join('\n')

  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `Você é assistente jurídico da Defensoria Pública de Goiás.
Abaixo está a transcrição bruta (por reconhecimento de voz) de uma sessão de mediação extrajudicial.

Dados do caso:
- Número: ${caseData?.id || '#0047'}
- Parte assistida: ${caseData?.parte || 'Parte Assistida'}
- Tipo: ${caseData?.tipo || 'Mediação'}

TRANSCRIÇÃO BRUTA:
${textoRaw}

Sua tarefa:
1. Corrija erros típicos de reconhecimento de voz em português
2. Mantenha os horários e identifique os participantes
3. Formate como ata jurídica formal e concisa
4. Destaque propostas e eventuais acordos
5. Retorne SOMENTE a ata formatada, sem introduções ou explicações`
      }]
    })
  })

  const data = await resp.json()
  return data.content?.find(b => b.type === 'text')?.text?.trim() || textoRaw
}

// ── COMPONENTE PRINCIPAL ──────────────────────────────────────────
export default function VideoSession({ onNavigate, caseData }) {
  const salaJitsi = useSalaJitsi(caseData)
  const linkJitsi = `https://meet.jit.si/${salaJitsi}`

  const [fase, setFase] = useState('pre') // pre | sessao | encerramento | documento
  const [ataLinhas, setAtaLinhas] = useState([])
  const [ataIA, setAtaIA] = useState('')
  const [processando, setProcessando] = useState(false)
  const [timer, setTimer] = useState(0)
  const [micAtivo, setMicAtivo] = useState(false)
  const [falante, setFalante] = useState('Defensor')
  const [resultado, setResultado] = useState('')
  const [termoAcordo, setTermoAcordo] = useState('')
  const [docPronto, setDocPronto] = useState(false)
  const [temVoz, setTemVoz] = useState(true)
  const timerRef = useRef(null)
  const codigoRef = useRef(Math.random().toString(36).substr(2, 8).toUpperCase())

  useEffect(() => { setTemVoz(!!(window.SpeechRecognition || window.webkitSpeechRecognition)) }, [])

  useEffect(() => {
    if (fase === 'sessao') {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000)
      setAtaLinhas([{
        hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        autor: 'Sistema',
        texto: `Sessão aberta. Sala Jitsi: ${salaJitsi}`
      }])
    }
    return () => clearInterval(timerRef.current)
  }, [fase])

  const formatTimer = (s) => `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`

  const adicionarFala = (texto, autor) => {
    setAtaLinhas(prev => [...prev, {
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      autor,
      texto
    }])
  }

  useSpeechRecognition({ onFinalizado: adicionarFala, ativo: micAtivo && fase === 'sessao', falante })

  const encerrarSessao = async () => {
    setMicAtivo(false)
    setFase('encerramento')
    if (ataLinhas.length > 1) {
      setProcessando(true)
      try {
        const resultado = await formatarAtaComIA(ataLinhas, caseData)
        setAtaIA(resultado)
      } catch (_) {
        setAtaIA(ataLinhas.map(l => `[${l.hora}] ${l.autor}: ${l.texto}`).join('\n'))
      } finally {
        setProcessando(false)
      }
    }
  }

  const dataHoje = new Date().toLocaleDateString('pt-BR', { day:'2-digit', month:'long', year:'numeric' })

  // ── DOCUMENTO ─────────────────────────────────────────────────
  if (docPronto) return (
    <div style={{ maxWidth: '720px' }}>
      <div style={{ background:'#fff', borderRadius:'12px', padding:'40px', boxShadow:'0 2px 12px rgba(26,107,60,0.08)' }}>
        <div style={{ textAlign:'center', marginBottom:'24px', borderBottom:'2px solid #0f4526', paddingBottom:'16px' }}>
          <div style={{ fontSize:'11px', color:'#5a7060', letterSpacing:'1.5px', marginBottom:'6px' }}>
            DEFENSORIA PÚBLICA DO ESTADO DE GOIÁS
          </div>
          <h2 style={{ fontFamily:'Fraunces, serif', fontSize:'20px', color:'#0f4526', marginBottom:'4px' }}>
            {resultado === 'acordo' ? 'TERMO DE ACORDO EXTRAJUDICIAL' : 'TERMO DE ENCERRAMENTO SEM ACORDO'}
          </h2>
          <div style={{ fontSize:'12px', color:'#5a7060' }}>
            Núcleo de Atuação Extrajudicial — NAE · Plataforma CONCILIA DPE-GO
          </div>
        </div>

        <p style={{ fontSize:'14px', lineHeight:2, marginBottom:'16px' }}>
          Aos {dataHoje}, realizou-se sessão de mediação extrajudicial via plataforma CONCILIA DPE-GO
          (Sala: <code style={{ fontSize:'12px', background:'#f4f6f4', padding:'1px 6px', borderRadius:'4px' }}>{salaJitsi}</code>),
          referente ao processo nº <strong>{caseData?.id || '#0047'}</strong>,
          envolvendo <strong>{caseData?.parte || 'Parte Assistida'}</strong>.
          Duração total: <strong>{formatTimer(timer)}</strong>.
        </p>

        {resultado === 'acordo' ? (
          <div style={{ marginBottom:'20px' }}>
            <p style={{ fontSize:'14px', fontWeight:700, marginBottom:'8px' }}>DO ACORDO:</p>
            <div style={{ background:'#f0f7f3', border:'1px solid #1a6b3c', borderRadius:'8px', padding:'14px', fontSize:'14px', lineHeight:1.7 }}>
              {termoAcordo || 'Termos definidos durante a sessão conforme ata.'}
            </div>
            <p style={{ fontSize:'12px', color:'#5a7060', marginTop:'8px' }}>
              Título executivo extrajudicial (art. 784 CPC). Encaminhado ao NAE para acompanhamento.
            </p>
          </div>
        ) : (
          <p style={{ fontSize:'14px', marginBottom:'20px' }}>
            Não foi possível chegar a acordo nesta sessão. O caso será encaminhado ao NAE para análise
            e adoção das medidas cabíveis, incluindo eventual ajuizamento de ação judicial.
          </p>
        )}

        {/* Ata gerada por IA */}
        <div style={{ marginBottom:'20px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px' }}>
            <span style={{ fontSize:'13px', fontWeight:700, color:'#0f4526' }}>📋 ATA DA SESSÃO</span>
            <span style={{ fontSize:'11px', background:'#1a6b3c18', color:'#1a6b3c', padding:'2px 8px', borderRadius:'10px', fontWeight:600 }}>
              🤖 Gerada por IA (Claude)
            </span>
          </div>
          <div style={{
            background:'#f9fbf9', borderRadius:'8px', padding:'16px',
            maxHeight:'200px', overflowY:'auto', fontFamily:'monospace',
            fontSize:'12px', lineHeight:1.8, border:'1px solid #d0ddd4',
            whiteSpace:'pre-wrap', color:'#1a2e1f'
          }}>
            {ataIA || ataLinhas.map(l=>`[${l.hora}] ${l.autor}: ${l.texto}`).join('\n')}
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'20px', borderTop:'1px solid #d0ddd4', paddingTop:'20px', marginBottom:'16px' }}>
          {['Assistido(a)', 'Parte Contrária', 'Defensor Público'].map(p => (
            <div key={p} style={{ textAlign:'center' }}>
              <div style={{ borderTop:'1px solid #333', paddingTop:'8px', fontSize:'11px', color:'#5a7060' }}>{p}</div>
            </div>
          ))}
        </div>

        <div style={{ background:'#f4f6f4', borderRadius:'8px', padding:'10px 14px', fontSize:'11px', color:'#5a7060', marginBottom:'20px' }}>
          🤖 Ata gerada automaticamente por reconhecimento de voz (Web Speech API) e processada por IA (Claude).
          Código de autenticidade: ODR-{codigoRef.current} · {dataHoje}
        </div>

        <div style={{ display:'flex', gap:'12px' }}>
          <button onClick={() => window.print()} style={{
            flex:1, padding:'12px', borderRadius:'8px', border:'none',
            background:'#1a6b3c', color:'#fff', fontSize:'14px', fontWeight:600, cursor:'pointer'
          }}>🖨️ Imprimir / Salvar PDF</button>
          <button onClick={() => onNavigate('cases')} style={{
            padding:'12px 20px', borderRadius:'8px', border:'1px solid #d0ddd4',
            background:'#fff', color:'#5a7060', fontSize:'14px', cursor:'pointer'
          }}>Voltar</button>
        </div>
      </div>
    </div>
  )

  // ── ENCERRAMENTO ───────────────────────────────────────────────
  if (fase === 'encerramento') return (
    <div style={{ maxWidth:'640px' }}>
      <h2 style={{ fontFamily:'Fraunces, serif', fontSize:'24px', color:'#0f4526', marginBottom:'24px' }}>Encerrar Sessão</h2>

      {processando && (
        <div style={{
          background:'linear-gradient(135deg,#0f4526,#1a6b3c)', borderRadius:'12px',
          padding:'24px', marginBottom:'20px', display:'flex', gap:'16px', alignItems:'center'
        }}>
          <div style={{ fontSize:'36px' }}>⚙️</div>
          <div>
            <div style={{ color:'#c8a84b', fontWeight:600, marginBottom:'4px' }}>IA processando a ata...</div>
            <div style={{ color:'rgba(255,255,255,0.7)', fontSize:'13px' }}>
              Claude está revisando a transcrição por voz e formatando o documento jurídico oficial
            </div>
          </div>
        </div>
      )}

      {!processando && ataIA && (
        <div style={{ background:'#fff', borderRadius:'12px', padding:'20px', boxShadow:'0 2px 8px rgba(26,107,60,0.06)', marginBottom:'20px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px' }}>
            <span style={{ fontWeight:700, color:'#0f4526', fontSize:'14px' }}>🤖 Ata gerada pela IA</span>
            <span style={{ fontSize:'11px', color:'#2d9b5a', background:'#2d9b5a18', padding:'2px 8px', borderRadius:'10px' }}>Pronta ✓</span>
          </div>
          <div style={{
            background:'#f9fbf9', borderRadius:'8px', padding:'12px', maxHeight:'150px',
            overflowY:'auto', fontSize:'12px', fontFamily:'monospace',
            lineHeight:1.8, whiteSpace:'pre-wrap', color:'#1a2e1f'
          }}>
            {ataIA}
          </div>
        </div>
      )}

      {!processando && ataLinhas.length <= 1 && (
        <div style={{ background:'#fff8e6', borderRadius:'10px', padding:'14px 16px', marginBottom:'20px', border:'1px solid #f0c040', fontSize:'13px', color:'#7a5f00' }}>
          ⚠️ Nenhuma fala foi captada pelo microfone. A ata conterá apenas a abertura da sessão.
        </div>
      )}

      <div style={{ background:'#fff', borderRadius:'12px', padding:'28px', boxShadow:'0 2px 12px rgba(26,107,60,0.08)' }}>
        <p style={{ color:'#5a7060', marginBottom:'20px' }}>Qual foi o resultado desta sessão?</p>
        <div style={{ display:'flex', gap:'12px', marginBottom:'24px' }}>
          {[{key:'acordo',label:'🤝 Acordo Firmado',color:'#1a6b3c'},{key:'sem-acordo',label:'❌ Sem Acordo',color:'#e07b39'}].map(r => (
            <button key={r.key} onClick={() => setResultado(r.key)} style={{
              flex:1, padding:'16px', borderRadius:'10px',
              border:`2px solid ${resultado===r.key ? r.color : '#d0ddd4'}`,
              background:resultado===r.key ? r.color+'12' : '#fff',
              color:resultado===r.key ? r.color : '#5a7060',
              fontSize:'15px', fontWeight:600, cursor:'pointer'
            }}>{r.label}</button>
          ))}
        </div>

        {resultado === 'acordo' && (
          <div style={{ marginBottom:'20px' }}>
            <label style={{ fontSize:'13px', color:'#5a7060', marginBottom:'8px', display:'block' }}>
              Confirme os termos do acordo:
            </label>
            <textarea
              value={termoAcordo}
              onChange={e => setTermoAcordo(e.target.value)}
              placeholder="Ex: Fixação de alimentos em R$ 700,00 mensais..."
              style={{ width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #d0ddd4', fontSize:'14px', minHeight:'90px', resize:'vertical' }}
            />
          </div>
        )}

        <div style={{ display:'flex', gap:'12px' }}>
          <button onClick={() => setFase('sessao')} style={{
            padding:'11px 20px', borderRadius:'8px', border:'1px solid #d0ddd4',
            background:'#fff', color:'#5a7060', fontSize:'14px', cursor:'pointer'
          }}>← Continuar</button>
          <button
            disabled={!resultado || processando}
            onClick={() => setDocPronto(true)}
            style={{
              flex:1, padding:'11px', borderRadius:'8px', border:'none',
              background: resultado && !processando ? '#1a6b3c' : '#d0ddd4',
              color:'#fff', fontSize:'14px', fontWeight:600,
              cursor: resultado && !processando ? 'pointer' : 'not-allowed'
            }}
          >
            {processando ? 'Aguarde a IA...' : 'Gerar Documento Oficial →'}
          </button>
        </div>
      </div>
    </div>
  )

  // ── PRÉ-SESSÃO ─────────────────────────────────────────────────
  if (fase === 'pre') return (
    <div style={{ maxWidth:'680px' }}>
      <h1 style={{ fontFamily:'Fraunces, serif', fontSize:'28px', color:'#0f4526', marginBottom:'8px' }}>Sessão de Mediação Online</h1>
      <p style={{ color:'#5a7060', marginBottom:'28px' }}>Caso {caseData?.id || '#0047'} — {caseData?.parte || 'Parte Assistida'}</p>

      <div style={{ background:'#fff', borderRadius:'12px', padding:'28px', boxShadow:'0 2px 12px rgba(26,107,60,0.08)', marginBottom:'20px' }}>
        <h3 style={{ fontFamily:'Fraunces, serif', color:'#0f4526', fontSize:'18px', marginBottom:'16px' }}>📹 Sala Jitsi Meet</h3>
        <div style={{ background:'#f0f7f3', borderRadius:'8px', padding:'14px', marginBottom:'16px', border:'1px solid #c8e6d4' }}>
          <div style={{ fontSize:'11px', color:'#5a7060', fontWeight:600, marginBottom:'4px' }}>LINK — COMPARTILHE COM TODAS AS PARTES:</div>
          <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
            <code style={{ flex:1, fontSize:'12px', color:'#1a6b3c', wordBreak:'break-all' }}>{linkJitsi}</code>
            <button onClick={() => navigator.clipboard.writeText(linkJitsi)} style={{
              padding:'6px 12px', borderRadius:'6px', border:'1px solid #1a6b3c',
              background:'#fff', color:'#1a6b3c', fontSize:'12px', cursor:'pointer', whiteSpace:'nowrap'
            }}>📋 Copiar</button>
          </div>
        </div>
        <div style={{ display:'flex', gap:'12px' }}>
          <a href={linkJitsi} target="_blank" rel="noopener noreferrer" style={{
            flex:1, padding:'12px', borderRadius:'8px', background:'#1a6b3c',
            color:'#fff', fontSize:'14px', fontWeight:600, textDecoration:'none', textAlign:'center'
          }}>🎥 Abrir Videochamada</a>
          <button onClick={() => setFase('sessao')} style={{
            padding:'12px 20px', borderRadius:'8px', border:'1px solid #1a6b3c',
            background:'#fff', color:'#1a6b3c', fontSize:'14px', fontWeight:600, cursor:'pointer'
          }}>✅ Sessão iniciada →</button>
        </div>
      </div>

      <div style={{ background:'linear-gradient(135deg,#0f4526,#1a6b3c)', borderRadius:'12px', padding:'24px 28px' }}>
        <div style={{ color:'#c8a84b', fontFamily:'Fraunces, serif', fontSize:'18px', marginBottom:'10px' }}>
          🤖 Ata Automática por Inteligência Artificial
        </div>
        <p style={{ color:'rgba(255,255,255,0.8)', fontSize:'14px', lineHeight:1.7, marginBottom:'12px' }}>
          Durante a sessão, ative o microfone na plataforma. O dispositivo captura as falas em tempo real
          via Web Speech API. Ao encerrar, a IA (Claude) revisa a transcrição e gera a ata jurídica formatada.
        </p>
        <div style={{ background:'rgba(0,0,0,0.2)', borderRadius:'8px', padding:'10px 14px', fontSize:'12px', color:'rgba(255,255,255,0.6)' }}>
          ⚠️ Melhor desempenho no <strong style={{ color:'#fff' }}>Google Chrome</strong> ou <strong style={{ color:'#fff' }}>Microsoft Edge</strong>.
          {!temVoz && <span style={{ color:'#ff8888' }}> Este navegador não suporta reconhecimento de voz.</span>}
        </div>
      </div>
    </div>
  )

  // ── SESSÃO ATIVA ───────────────────────────────────────────────
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px', flexWrap:'wrap', gap:'12px' }}>
        <h1 style={{ fontFamily:'Fraunces, serif', fontSize:'22px', color:'#0f4526' }}>
          Sessão em Andamento — {caseData?.id || '#0047'}
        </h1>
        <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
          <div style={{ background:'#ff4444', borderRadius:'20px', padding:'6px 14px', color:'#fff', fontSize:'13px', fontWeight:600, display:'flex', gap:'6px', alignItems:'center' }}>
            <span style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#fff', display:'inline-block' }} />
            AO VIVO · {formatTimer(timer)}
          </div>
          <button onClick={encerrarSessao} style={{
            padding:'8px 16px', borderRadius:'8px', border:'none',
            background:'#e07b39', color:'#fff', fontSize:'13px', fontWeight:600, cursor:'pointer'
          }}>Encerrar Sessão</button>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        {/* Jitsi embed */}
        <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
          <div style={{ background:'#0f1a12', borderRadius:'12px', overflow:'hidden', border:'2px solid #1a6b3c' }}>
            <iframe
              src={linkJitsi}
              allow="camera; microphone; fullscreen; display-capture; autoplay"
              style={{ width:'100%', height:'320px', border:'none', display:'block' }}
              title="Sessão de Mediação — Jitsi Meet"
            />
          </div>
          <div style={{ background:'#fff', borderRadius:'10px', padding:'12px 16px', boxShadow:'0 2px 8px rgba(26,107,60,0.06)' }}>
            <div style={{ fontSize:'11px', color:'#5a7060', fontWeight:600, marginBottom:'4px' }}>LINK DA SALA</div>
            <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
              <code style={{ flex:1, color:'#1a6b3c', fontSize:'11px', wordBreak:'break-all' }}>{linkJitsi}</code>
              <button onClick={() => navigator.clipboard.writeText(linkJitsi)} style={{
                padding:'4px 10px', borderRadius:'6px', border:'1px solid #1a6b3c',
                background:'#fff', color:'#1a6b3c', fontSize:'11px', cursor:'pointer', whiteSpace:'nowrap'
              }}>Copiar</button>
            </div>
          </div>
        </div>

        {/* Transcrição IA */}
        <div style={{ background:'#fff', borderRadius:'12px', overflow:'hidden', boxShadow:'0 2px 8px rgba(26,107,60,0.06)', display:'flex', flexDirection:'column' }}>
          <div style={{ padding:'14px 16px', borderBottom:'1px solid #d0ddd4', background: micAtivo ? '#f0f7f3' : '#fff' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px' }}>
              <span style={{ fontWeight:600, fontSize:'14px', color:'#0f4526' }}>🤖 Transcrição por IA</span>
              <span style={{ fontSize:'11px', color:'#2d9b5a', background:'#2d9b5a18', padding:'2px 8px', borderRadius:'10px' }}>
                {ataLinhas.length} falas
              </span>
            </div>

            {/* Controle do microfone */}
            <div style={{ display:'flex', gap:'8px', alignItems:'center', flexWrap:'wrap' }}>
              {temVoz ? (
                <button
                  onClick={() => setMicAtivo(a => !a)}
                  style={{
                    padding:'7px 14px', borderRadius:'20px', border:'none',
                    background: micAtivo ? '#e07b39' : '#1a6b3c',
                    color:'#fff', fontSize:'12px', fontWeight:600, cursor:'pointer',
                    display:'flex', gap:'6px', alignItems:'center'
                  }}
                >
                  {micAtivo ? '⏹ Pausar microfone' : '🎤 Ativar microfone'}
                </button>
              ) : (
                <span style={{ fontSize:'12px', color:'#e07b39' }}>⚠️ Use Chrome/Edge para transcrição automática</span>
              )}

              {micAtivo && (
                <div style={{ display:'flex', gap:'4px', flexWrap:'wrap' }}>
                  {['Defensor','Assistido','Parte Contrária'].map(f => (
                    <button key={f} onClick={() => setFalante(f)} style={{
                      padding:'4px 8px', borderRadius:'12px', border:'none',
                      background: falante===f ? '#1a6b3c' : '#e8ede9',
                      color: falante===f ? '#fff' : '#5a7060',
                      fontSize:'11px', cursor:'pointer', whiteSpace:'nowrap'
                    }}>{f}</button>
                  ))}
                </div>
              )}
            </div>

            {micAtivo && (
              <div style={{ marginTop:'8px', fontSize:'12px', color:'#1a6b3c', display:'flex', gap:'6px', alignItems:'center' }}>
                <span style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#e07b39', display:'inline-block' }} />
                Gravando como: <strong>{falante}</strong>
              </div>
            )}
          </div>

          {/* Lista de falas transcritas */}
          <div style={{ flex:1, overflowY:'auto', padding:'12px', minHeight:'200px', maxHeight:'260px' }}>
            {ataLinhas.length === 0 && (
              <div style={{ textAlign:'center', color:'#5a7060', fontSize:'13px', marginTop:'32px' }}>
                <div style={{ fontSize:'36px', marginBottom:'10px' }}>🎤</div>
                {temVoz
                  ? 'Clique em "Ativar microfone" e comece a falar. A IA transcreve automaticamente em português.'
                  : 'Reconhecimento de voz não disponível. Use Chrome ou Edge.'
                }
              </div>
            )}
            {ataLinhas.map((l, i) => (
              <div key={i} style={{ marginBottom:'8px', fontSize:'12px', paddingBottom:'8px', borderBottom: i < ataLinhas.length-1 ? '1px solid #f0f0f0' : 'none' }}>
                <span style={{ color:'#c8a84b', fontWeight:700 }}>[{l.hora}]</span>
                <span style={{ color: l.autor==='Sistema' ? '#5a7060' : '#1a6b3c', fontWeight:600, marginLeft:'6px' }}>{l.autor}:</span>
                <span style={{ color:'#1a2e1f', marginLeft:'4px' }}>{l.texto}</span>
              </div>
            ))}
          </div>

          <div style={{ padding:'10px 14px', borderTop:'1px solid #d0ddd4', background:'#fafbfa', fontSize:'11px', color:'#5a7060' }}>
            Ao encerrar, a IA (Claude) formata automaticamente a ata jurídica oficial.
          </div>
        </div>
      </div>
    </div>
  )
}
