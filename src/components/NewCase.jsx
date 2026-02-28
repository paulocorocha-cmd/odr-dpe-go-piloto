import { useState } from 'react'
import { PIDS_TJGO } from '../data/pids'

export default function NewCase({ onNavigate }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    nome: '', cpf: '', email: '', telefone: '', renda: '',
    tipo: '', comarca: '', pid: '', descricao: '', urgencia: 'normal',
    temCelular: '', acessaInternet: ''
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const pidsFiltrados = PIDS_TJGO.filter(p => form.comarca ? p.comarca === form.comarca : true)

  const StepHeader = ({ n, title, sub }) => (
    <div style={{ marginBottom: '28px' }}>
      <div style={{ color: '#c8a84b', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
        PASSO {n} DE 4
      </div>
      <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', color: '#0f4526' }}>{title}</h2>
      {sub && <p style={{ color: '#5a7060', fontSize: '14px', marginTop: '4px' }}>{sub}</p>}
    </div>
  )

  const Field = ({ label, children }) => (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', fontSize: '13px', color: '#5a7060', marginBottom: '6px', fontWeight: 500 }}>
        {label}
      </label>
      {children}
    </div>
  )

  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: '8px',
    border: '1px solid #d0ddd4', fontSize: '14px', background: '#fff', outline: 'none'
  }

  return (
    <div style={{ maxWidth: '680px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', color: '#0f4526' }}>Novo Caso</h1>
      </div>

      {/* Progress */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '36px' }}>
        {[1, 2, 3, 4].map(n => (
          <div
            key={n}
            style={{
              flex: 1, height: '4px', borderRadius: '2px',
              background: n <= step ? '#1a6b3c' : '#d0ddd4',
              transition: 'background 0.3s'
            }}
          />
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 12px rgba(26,107,60,0.08)' }}>

        {/* Step 1 */}
        {step === 1 && (
          <>
            <StepHeader n={1} title="Dados Pessoais" sub="Informações do assistido" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Field label="Nome completo *">
                <input style={inputStyle} value={form.nome} onChange={e => set('nome', e.target.value)} placeholder="Seu nome completo" />
              </Field>
              <Field label="CPF *">
                <input style={inputStyle} value={form.cpf} onChange={e => set('cpf', e.target.value)} placeholder="000.000.000-00" />
              </Field>
              <Field label="E-mail">
                <input style={inputStyle} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="seu@email.com" />
              </Field>
              <Field label="Telefone / WhatsApp">
                <input style={inputStyle} value={form.telefone} onChange={e => set('telefone', e.target.value)} placeholder="(62) 99999-9999" />
              </Field>
            </div>
            <Field label="Renda familiar mensal *">
              <select style={inputStyle} value={form.renda} onChange={e => set('renda', e.target.value)}>
                <option value="">Selecione</option>
                <option>Até R$ 700</option>
                <option>De R$ 700 a R$ 1.400</option>
                <option>De R$ 1.400 a R$ 2.100</option>
              </select>
            </Field>
          </>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <>
            <StepHeader n={2} title="Tipo de Conflito" sub="Descreva o problema que deseja resolver" />
            <Field label="Área do Direito *">
              <select style={inputStyle} value={form.tipo} onChange={e => set('tipo', e.target.value)}>
                <option value="">Selecione a área</option>
                <option>Família - Alimentos</option>
                <option>Família - Divórcio</option>
                <option>Família - Guarda</option>
                <option>Direito do Consumidor</option>
                <option>Direito à Saúde</option>
                <option>Civil - Cobranças</option>
                <option>Vizinhança</option>
              </select>
            </Field>
            <Field label="Descrição do caso *">
              <textarea
                style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
                value={form.descricao}
                onChange={e => set('descricao', e.target.value)}
                placeholder="Descreva brevemente o conflito e o que você deseja resolver..."
              />
            </Field>
            <Field label="Urgência">
              <div style={{ display: 'flex', gap: '10px' }}>
                {['normal', 'urgente'].map(u => (
                  <button
                    key={u}
                    onClick={() => set('urgencia', u)}
                    style={{
                      padding: '8px 20px', borderRadius: '8px',
                      border: `1px solid ${form.urgencia === u ? '#1a6b3c' : '#d0ddd4'}`,
                      background: form.urgencia === u ? '#1a6b3c' : '#fff',
                      color: form.urgencia === u ? '#fff' : '#5a7060',
                      fontSize: '13px', cursor: 'pointer', textTransform: 'capitalize'
                    }}
                  >
                    {u === 'urgente' ? '🚨 Urgente' : '📋 Normal'}
                  </button>
                ))}
              </div>
            </Field>
          </>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <>
            <StepHeader n={3} title="Localização e PID" sub="Selecione sua comarca e o Ponto de Inclusão Digital mais próximo" />
            <Field label="Comarca *">
              <select style={inputStyle} value={form.comarca} onChange={e => { set('comarca', e.target.value); set('pid', '') }}>
                <option value="">Selecione a comarca</option>
                {PIDS_TJGO.map(p => (
                  <option key={p.id} value={p.comarca}>{p.comarca}</option>
                ))}
              </select>
            </Field>
            {form.comarca && (
              <Field label="Ponto de Inclusão Digital (PID) *">
                <select style={inputStyle} value={form.pid} onChange={e => set('pid', e.target.value)}>
                  <option value="">Selecione o PID</option>
                  {pidsFiltrados.map(p => (
                    <option key={p.id} value={p.endereco}>{p.endereco} — Nível {p.nivel}</option>
                  ))}
                </select>
              </Field>
            )}
            {form.pid && (
              <div style={{
                background: '#f4f6f4', borderRadius: '8px', padding: '16px',
                marginTop: '8px', borderLeft: '3px solid #1a6b3c'
              }}>
                <div style={{ fontSize: '13px', color: '#5a7060' }}>
                  ℹ️ No dia da sessão, dirija-se ao PID selecionado com documento de identificação.
                  Um funcionário estará disponível para auxiliá-lo no acesso à videochamada.
                </div>
              </div>
            )}
          </>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <>
            <StepHeader n={4} title="Acesso Digital" sub="Avaliamos como melhor apoiá-lo no atendimento virtual" />
            <Field label="Você possui celular com acesso à internet?">
              <div style={{ display: 'flex', gap: '10px' }}>
                {['Sim', 'Não', 'Às vezes'].map(v => (
                  <button
                    key={v}
                    onClick={() => set('temCelular', v)}
                    style={{
                      padding: '8px 18px', borderRadius: '8px',
                      border: `1px solid ${form.temCelular === v ? '#1a6b3c' : '#d0ddd4'}`,
                      background: form.temCelular === v ? '#1a6b3c' : '#fff',
                      color: form.temCelular === v ? '#fff' : '#5a7060',
                      fontSize: '13px', cursor: 'pointer'
                    }}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Você sabe fazer videochamada?">
              <div style={{ display: 'flex', gap: '10px' }}>
                {['Sim', 'Não', 'Com ajuda'].map(v => (
                  <button
                    key={v}
                    onClick={() => set('acessaInternet', v)}
                    style={{
                      padding: '8px 18px', borderRadius: '8px',
                      border: `1px solid ${form.acessaInternet === v ? '#1a6b3c' : '#d0ddd4'}`,
                      background: form.acessaInternet === v ? '#1a6b3c' : '#fff',
                      color: form.acessaInternet === v ? '#fff' : '#5a7060',
                      fontSize: '13px', cursor: 'pointer'
                    }}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </Field>

            {/* Resumo */}
            <div style={{ background: '#f4f6f4', borderRadius: '10px', padding: '20px', marginTop: '20px' }}>
              <h4 style={{ fontFamily: 'Fraunces, serif', color: '#0f4526', marginBottom: '12px' }}>Resumo do Caso</h4>
              {[
                ['Nome', form.nome], ['Tipo', form.tipo], ['Comarca', form.comarca], ['PID', form.pid]
              ].map(([k, v]) => v && (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                  <span style={{ color: '#5a7060' }}>{k}:</span>
                  <span style={{ color: '#1a2e1f', fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Botões */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px' }}>
          <button
            onClick={() => step > 1 ? setStep(s => s - 1) : onNavigate('cases')}
            style={{
              padding: '11px 24px', borderRadius: '8px', border: '1px solid #d0ddd4',
              background: '#fff', color: '#5a7060', fontSize: '14px', cursor: 'pointer'
            }}
          >
            {step > 1 ? '← Voltar' : 'Cancelar'}
          </button>
          <button
            onClick={() => step < 4 ? setStep(s => s + 1) : onNavigate('schedule', form)}
            style={{
              padding: '11px 28px', borderRadius: '8px', border: 'none',
              background: '#1a6b3c', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer'
            }}
          >
            {step < 4 ? 'Continuar →' : 'Registrar e Agendar ✓'}
          </button>
        </div>
      </div>
    </div>
  )
}
