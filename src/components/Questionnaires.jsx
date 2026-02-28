import { useState } from 'react'

// ── APÊNDICE A — Membros e Servidores ─────────────────────────────
const FORM_A = {
  titulo: 'Questionário — Membros e Servidores DPE-GO',
  subtitulo: 'Apêndice A da pesquisa de mestrado PPGDP-UFG',
  secoes: [
    {
      letra: 'A', titulo: 'Perfil Funcional',
      perguntas: [
        {
          id: 'a1', texto: 'Qual é o seu cargo ou função na DPE-GO?', tipo: 'radio',
          opcoes: ['Defensor(a) Público(a)', 'Servidor(a)', 'Estagiário(a)']
        },
        {
          id: 'a2', texto: 'Tempo de atuação na DPE-GO:', tipo: 'radio',
          opcoes: ['Menos de 2 anos', 'Entre 2 e 5 anos', 'Entre 6 e 10 anos', 'Mais de 10 anos']
        },
        {
          id: 'a3', texto: 'Sua atuação principal se dá em qual área?', tipo: 'radio',
          opcoes: ['Atendimento Inicial', 'Atuação processual', 'Cível / Fazenda Pública', 'Família e Sucessões', 'Criminal / Execução Penal', 'Núcleos Especializados', 'Informática', 'Administrativa']
        },
      ]
    },
    {
      letra: 'B', titulo: 'Percepção sobre Inovação e Atuação Extrajudicial',
      perguntas: [
        {
          id: 'b1', texto: '"A atuação extrajudicial e a busca por soluções consensuais devem ser a principal prioridade estratégica da DPE-GO para interiorização a curto prazo."',
          tipo: 'escala', escala: 5, legenda: ['Discordo totalmente', 'Concordo totalmente']
        },
        {
          id: 'b2', texto: 'Na sua visão, o maior obstáculo para a expansão da Defensoria para o interior é:', tipo: 'radio',
          opcoes: ['Limitação orçamentária para novas estruturas', 'Dificuldade em alocar membros/servidores em comarcas distantes', 'Baixa demanda que não justifica o custo de uma unidade física', 'Falta de articulação com os poderes locais', 'Outros']
        },
      ]
    },
    {
      letra: 'C', titulo: 'Viabilidade e Aplicação da ODR na DPE-GO',
      perguntas: [
        {
          id: 'c1', texto: 'Qual o potencial de uma plataforma de resolução de conflitos online para ampliar o acesso à justiça em Goiás?', tipo: 'radio',
          opcoes: ['Muito alto', 'Alto', 'Moderado', 'Baixo', 'Muito baixo']
        },
        {
          id: 'c2', texto: 'Classifique as áreas do direito mais compatíveis com resolução online (1 = mais compatível, 5 = menos compatível):', tipo: 'ranking',
          opcoes: ['Direito de Família', 'Direito Civil Geral', 'Direito à Saúde', 'Direito do Consumidor', 'Direito Tributário']
        },
      ]
    },
    {
      letra: 'D', titulo: 'Desafios e Estratégias',
      perguntas: [
        {
          id: 'd1', texto: 'Avalie os desafios para implementação de ODR na DPE-GO:', tipo: 'multi-escala', escala: 5,
          itens: ['Conectividade à internet da população do interior', 'Letramento digital dos assistidos', 'Resistência da outra parte em participar', 'Garantia da segurança e sigilo dos dados']
        },
        {
          id: 'd2', texto: 'Qual estratégia você considera mais eficaz para superar a exclusão digital dos assistidos?', tipo: 'radio',
          opcoes: ['Utilização de Pontos de Inclusão Digital (PIDs) em parceria com o TJGO', 'Criação de convênios com prefeituras para uso de espaços públicos', 'Atendimento híbrido (parte online, parte presencial em mutirões)', 'Fornecimento de material educativo (cartilhas, vídeos)']
        },
      ]
    },
    {
      letra: 'E', titulo: 'Capacitação e Engajamento',
      perguntas: [
        {
          id: 'e1', texto: 'Avalie seu nível de preparo para utilizar ferramentas digitais de mediação e conciliação:', tipo: 'radio',
          opcoes: ['Totalmente preparado', 'Parcialmente preparado', 'Pouco preparado', 'Totalmente despreparado']
        },
        {
          id: 'e2', texto: 'Que tipo de treinamento seria mais útil para você?', tipo: 'radio',
          opcoes: ['Cursos sobre técnicas de mediação online', 'Treinamento prático no uso da plataforma (simulações)', 'Palestras sobre os aspectos legais e éticos da ODR']
        },
      ]
    }
  ]
}

// ── APÊNDICE B — População atendida nos mutirões ─────────────────
const FORM_B = {
  titulo: 'Questionário — População atendida nos mutirões',
  subtitulo: 'Apêndice B da pesquisa de mestrado PPGDP-UFG',
  secoes: [
    {
      letra: 'A', titulo: 'Perfil de Acesso Digital',
      perguntas: [
        {
          id: 'ba1', texto: 'O(a) senhor(a) possui um telefone celular que acessa a internet (WhatsApp, Facebook, etc.)?', tipo: 'radio',
          opcoes: ['Sim, e uso todos os dias', 'Sim, mas uso pouco', 'Sim, mas não uso', 'Não possuo']
        },
        {
          id: 'ba2', texto: 'Onde o(a) senhor(a) costuma acessar a internet?', tipo: 'radio',
          opcoes: ['Em casa (Wi-Fi ou plano de dados)', 'No trabalho', 'Em locais públicos com Wi-Fi gratuito', 'Apenas na casa de parentes/amigos', 'Não acesso a internet']
        },
      ]
    },
    {
      letra: 'B', titulo: 'Letramento e Confiança Digital',
      perguntas: [
        { id: 'bb1', texto: 'Eu me sinto seguro(a) para fazer uma chamada de vídeo sozinho(a) no WhatsApp.', tipo: 'escala', escala: 5, legenda: ['Discordo totalmente', 'Concordo totalmente'] },
        { id: 'bb2', texto: 'Eu acho fácil resolver problemas do dia a dia usando a internet (ex: pedir 2ª via de conta, agendar algo).', tipo: 'escala', escala: 5, legenda: ['Discordo totalmente', 'Concordo totalmente'] },
        { id: 'bb3', texto: 'Eu tenho dificuldade para entender como os aplicativos no celular funcionam.', tipo: 'escala', escala: 5, legenda: ['Discordo totalmente', 'Concordo totalmente'] },
        { id: 'bb4', texto: 'Eu me preocupo que meus dados pessoais não estejam seguros na internet.', tipo: 'escala', escala: 5, legenda: ['Discordo totalmente', 'Concordo totalmente'] },
      ]
    },
    {
      letra: 'C', titulo: 'Confiança em Serviços Digitais da Defensoria',
      perguntas: [
        { id: 'bc1', texto: 'O quanto se sente seguro(a) para colocar seus dados pessoais (CPF, endereço) em um site do governo ou da Defensoria?', tipo: 'escala', escala: 5, legenda: ['Nada seguro', 'Muito seguro'] },
        { id: 'bc2', texto: 'Confia que um problema resolvido por videochamada com a Defensoria tem a mesma validade que um resolvido pessoalmente?', tipo: 'escala', escala: 5, legenda: ['Não confio', 'Confio totalmente'] },
        { id: 'bc3', texto: 'Acredita que o atendimento por videochamada seria sigiloso e protegeria sua privacidade?', tipo: 'escala', escala: 5, legenda: ['Não acredito', 'Acredito totalmente'] },
      ]
    },
    {
      letra: 'D', titulo: 'Receptividade ao Atendimento Virtual',
      perguntas: [
        { id: 'bd1', texto: 'Acho que o atendimento por videochamada seria ótima ideia, pois economizaria meu tempo e dinheiro.', tipo: 'escala', escala: 5, legenda: ['Discordo totalmente', 'Concordo totalmente'] },
        { id: 'bd2', texto: 'Eu me sentiria à vontade para conversar com o Defensor por uma chamada de vídeo.', tipo: 'escala', escala: 5, legenda: ['Discordo totalmente', 'Concordo totalmente'] },
        { id: 'bd3', texto: 'Eu preferiria sempre o atendimento cara a cara, mesmo que o virtual fosse mais rápido.', tipo: 'escala', escala: 5, legenda: ['Discordo totalmente', 'Concordo totalmente'] },
      ]
    },
    {
      letra: 'E', titulo: 'Barreiras ao Acesso Virtual',
      perguntas: [
        { id: 'be1', texto: 'A qualidade da minha internet ou a falta de um plano de dados seria um problema.', tipo: 'escala', escala: 5, legenda: ['Nenhum problema', 'Grande problema'] },
        { id: 'be2', texto: 'Minha falta de prática para mexer no aplicativo de vídeo seria um problema.', tipo: 'escala', escala: 5, legenda: ['Nenhum problema', 'Grande problema'] },
        { id: 'be3', texto: 'A dificuldade de encontrar um lugar tranquilo e com privacidade para a chamada seria um problema.', tipo: 'escala', escala: 5, legenda: ['Nenhum problema', 'Grande problema'] },
        { id: 'be4', texto: 'A desconfiança de que o atendimento por vídeo realmente resolveria meu problema seria um obstáculo.', tipo: 'escala', escala: 5, legenda: ['Nenhum problema', 'Grande problema'] },
      ]
    },
    {
      letra: 'F', titulo: 'Avaliação de Soluções de Apoio',
      perguntas: [
        {
          id: 'bf1', texto: 'Se a Defensoria oferecesse um local na sua cidade (como no Fórum ou no CRAS) com computador e uma pessoa para ajudar a fazer essa videochamada com o Defensor, isso ajudaria?', tipo: 'radio',
          opcoes: ['Sim, ajudaria muito e eu usaria o serviço', 'Talvez ajudasse, mas ainda preferiria vir pessoalmente', 'Não, não faria diferença para mim']
        },
      ]
    }
  ]
}

// ── Componentes de perguntas ───────────────────────────────────────
const Escala = ({ id, max, legenda, valor, onChange }) => (
  <div>
    <div style={{ display: 'flex', gap: '10px', marginBottom: '6px' }}>
      {Array.from({ length: max }, (_, i) => i + 1).map(n => (
        <button
          key={n}
          onClick={() => onChange(id, n)}
          style={{
            width: '40px', height: '40px', borderRadius: '8px', border: '1px solid',
            borderColor: valor === n ? '#1a6b3c' : '#d0ddd4',
            background: valor === n ? '#1a6b3c' : '#fff',
            color: valor === n ? '#fff' : '#1a2e1f',
            fontSize: '15px', fontWeight: 600, cursor: 'pointer'
          }}
        >
          {n}
        </button>
      ))}
    </div>
    {legenda && (
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#5a7060' }}>
        <span>{legenda[0]}</span><span>{legenda[1]}</span>
      </div>
    )}
  </div>
)

const MultiEscala = ({ id, itens, max, valores, onChange }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
    {itens.map(item => (
      <div key={item} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '13px', color: '#1a2e1f', flex: 1 }}>{item}</span>
        <div style={{ display: 'flex', gap: '6px' }}>
          {Array.from({ length: max }, (_, i) => i + 1).map(n => (
            <button
              key={n}
              onClick={() => onChange(`${id}_${item}`, n)}
              style={{
                width: '32px', height: '32px', borderRadius: '6px', border: '1px solid',
                borderColor: valores[`${id}_${item}`] === n ? '#1a6b3c' : '#d0ddd4',
                background: valores[`${id}_${item}`] === n ? '#1a6b3c' : '#fff',
                color: valores[`${id}_${item}`] === n ? '#fff' : '#1a2e1f',
                fontSize: '13px', cursor: 'pointer'
              }}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    ))}
    <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '11px', color: '#5a7060', gap: '4px' }}>
      <span>1 = pouco relevante</span><span>·</span><span>5 = muito relevante</span>
    </div>
  </div>
)

const Ranking = ({ id, opcoes, valores, onChange }) => {
  const [ordem, setOrdem] = useState(opcoes)
  const mover = (idx, dir) => {
    const nova = [...ordem]
    const alvo = idx + dir
    if (alvo < 0 || alvo >= nova.length) return
    ;[nova[idx], nova[alvo]] = [nova[alvo], nova[idx]]
    setOrdem(nova)
    onChange(id, nova)
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {ordem.map((item, i) => (
        <div key={item} style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          background: '#f4f6f4', borderRadius: '8px', padding: '10px 14px'
        }}>
          <span style={{
            width: '24px', height: '24px', borderRadius: '50%', background: '#1a6b3c',
            color: '#fff', fontSize: '12px', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>{i + 1}</span>
          <span style={{ flex: 1, fontSize: '14px' }}>{item}</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button onClick={() => mover(i, -1)} disabled={i === 0}
              style={{ padding: '2px 8px', borderRadius: '4px', border: '1px solid #d0ddd4', background: '#fff', cursor: 'pointer', opacity: i === 0 ? 0.3 : 1 }}>▲</button>
            <button onClick={() => mover(i, 1)} disabled={i === ordem.length - 1}
              style={{ padding: '2px 8px', borderRadius: '4px', border: '1px solid #d0ddd4', background: '#fff', cursor: 'pointer', opacity: i === ordem.length - 1 ? 0.3 : 1 }}>▼</button>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Formulário principal ───────────────────────────────────────────
function Formulario({ form, onVoltar }) {
  const [respostas, setRespostas] = useState({})
  const [enviado, setEnviado] = useState(false)
  const [comarca, setComarca] = useState('')

  const set = (id, val) => setRespostas(r => ({ ...r, [id]: val }))

  const totalPerguntas = form.secoes.reduce((acc, s) => acc + s.perguntas.length, 0)
  const respondidas = Object.keys(respostas).filter(k => respostas[k] !== undefined && respostas[k] !== '').length

  if (enviado) return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
      <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', color: '#0f4526', marginBottom: '12px' }}>
        Respostas registradas!
      </h2>
      <p style={{ color: '#5a7060', marginBottom: '24px', fontSize: '15px' }}>
        Obrigado por participar da pesquisa. Suas respostas contribuem para o desenvolvimento
        da plataforma ODR da Defensoria Pública de Goiás.
      </p>
      <div style={{ background: '#f0f7f3', borderRadius: '10px', padding: '16px', marginBottom: '24px', fontSize: '13px', color: '#5a7060' }}>
        {respondidas} de {totalPerguntas} perguntas respondidas · Comarca: {comarca || 'Não informada'}
      </div>
      <button onClick={onVoltar} style={{
        padding: '12px 28px', borderRadius: '8px', border: 'none',
        background: '#1a6b3c', color: '#fff', fontSize: '15px', fontWeight: 600, cursor: 'pointer'
      }}>
        ← Voltar aos questionários
      </button>
    </div>
  )

  return (
    <div style={{ maxWidth: '760px' }}>
      <button onClick={onVoltar} style={{
        background: 'none', border: 'none', color: '#5a7060', fontSize: '14px',
        cursor: 'pointer', marginBottom: '20px', padding: 0
      }}>
        ← Voltar
      </button>
      <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', color: '#0f4526', marginBottom: '4px' }}>
        {form.titulo}
      </h2>
      <p style={{ color: '#5a7060', fontSize: '13px', marginBottom: '24px' }}>{form.subtitulo}</p>

      {/* Progresso */}
      <div style={{ background: '#fff', borderRadius: '10px', padding: '16px 20px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(26,107,60,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: '#5a7060' }}>
          <span>Progresso</span>
          <span>{respondidas}/{totalPerguntas} respondidas</span>
        </div>
        <div style={{ height: '6px', background: '#d0ddd4', borderRadius: '3px' }}>
          <div style={{ height: '100%', background: '#1a6b3c', borderRadius: '3px', width: `${(respondidas / totalPerguntas) * 100}%`, transition: 'width 0.3s' }} />
        </div>
      </div>

      {/* Comarca */}
      <div style={{ background: '#fff', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 2px 8px rgba(26,107,60,0.06)', marginBottom: '20px' }}>
        <label style={{ fontSize: '13px', color: '#5a7060', marginBottom: '6px', display: 'block', fontWeight: 600 }}>
          Comarca (opcional, para fins de pesquisa):
        </label>
        <input
          value={comarca}
          onChange={e => setComarca(e.target.value)}
          placeholder="Ex: Ceres, Formosa, Uruaçu..."
          style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d0ddd4', fontSize: '14px' }}
        />
      </div>

      {/* Seções */}
      {form.secoes.map(secao => (
        <div key={secao.letra} style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(26,107,60,0.06)', marginBottom: '16px' }}>
          <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', color: '#0f4526', marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #d0ddd4' }}>
            Seção {secao.letra}: {secao.titulo}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {secao.perguntas.map((p, qi) => (
              <div key={p.id}>
                <p style={{ fontSize: '14px', color: '#1a2e1f', marginBottom: '12px', fontWeight: 500, fontStyle: p.texto.startsWith('"') ? 'italic' : 'normal' }}>
                  {qi + 1}. {p.texto}
                </p>
                {p.tipo === 'radio' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {p.opcoes.map(op => (
                      <label key={op} style={{ display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer', fontSize: '14px', color: '#1a2e1f' }}>
                        <input
                          type="radio" name={p.id} value={op}
                          checked={respostas[p.id] === op}
                          onChange={() => set(p.id, op)}
                          style={{ accentColor: '#1a6b3c' }}
                        />
                        {op}
                      </label>
                    ))}
                  </div>
                )}
                {p.tipo === 'escala' && (
                  <Escala id={p.id} max={p.escala} legenda={p.legenda} valor={respostas[p.id]} onChange={set} />
                )}
                {p.tipo === 'multi-escala' && (
                  <MultiEscala id={p.id} itens={p.itens} max={p.escala} valores={respostas} onChange={set} />
                )}
                {p.tipo === 'ranking' && (
                  <Ranking id={p.id} opcoes={p.opcoes} valores={respostas} onChange={set} />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={() => setEnviado(true)}
        style={{
          width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
          background: 'linear-gradient(135deg, #1a6b3c, #2d9b5a)',
          color: '#fff', fontSize: '15px', fontWeight: 600, cursor: 'pointer', marginTop: '8px'
        }}
      >
        Enviar Respostas ✓
      </button>
    </div>
  )
}

// ── Tela principal de Questionários ───────────────────────────────
export default function Questionnaires({ onNavigate }) {
  const [ativo, setAtivo] = useState(null) // null | 'A' | 'B'

  if (ativo === 'A') return <Formulario form={FORM_A} onVoltar={() => setAtivo(null)} />
  if (ativo === 'B') return <Formulario form={FORM_B} onVoltar={() => setAtivo(null)} />

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', color: '#0f4526' }}>
          Questionários da Pesquisa
        </h1>
        <p style={{ color: '#5a7060', marginTop: '4px' }}>
          Instrumentos de coleta de dados — Mestrado PPGDP-UFG · Paulo César de Oliveira Rocha
        </p>
      </div>

      {/* Banner da pesquisa */}
      <div style={{
        background: 'linear-gradient(135deg, #0f4526, #1a6b3c)', borderRadius: '12px',
        padding: '24px 28px', marginBottom: '28px'
      }}>
        <div style={{ color: '#c8a84b', fontFamily: 'Fraunces, serif', fontSize: '18px', marginBottom: '8px' }}>
          Projeto de Pesquisa — PPGDP/UFG 2025
        </div>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', lineHeight: 1.6 }}>
          "Acesso à Justiça: Plataforma Piloto de Resolução de Conflitos Online (ODR) na Expansão da DPE-GO
          para Comarcas do Interior"
        </p>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginTop: '8px' }}>
          Orientador: Prof. Dr. Cleuler Barbosa das Neves
        </p>
      </div>

      {/* Cards dos questionários */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ background: '#fff', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 12px rgba(26,107,60,0.08)', borderTop: '4px solid #1a6b3c' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>👨‍⚖️</div>
          <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', color: '#0f4526', marginBottom: '8px' }}>
            Apêndice A
          </h3>
          <p style={{ fontSize: '14px', color: '#5a7060', marginBottom: '8px', fontWeight: 600 }}>
            Membros e Servidores DPE-GO
          </p>
          <p style={{ fontSize: '13px', color: '#5a7060', lineHeight: 1.6, marginBottom: '20px' }}>
            Questionário online destinado a Defensores Públicos, servidores e estagiários da instituição.
            Avalia percepção sobre inovação, viabilidade da ODR e desafios operacionais.
          </p>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {['5 seções', '11 perguntas', 'Escalas Likert', 'Múltipla escolha'].map(tag => (
              <span key={tag} style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '10px', background: '#f0f7f3', color: '#1a6b3c', fontWeight: 600 }}>
                {tag}
              </span>
            ))}
          </div>
          <button
            onClick={() => setAtivo('A')}
            style={{
              width: '100%', padding: '12px', borderRadius: '8px', border: 'none',
              background: '#1a6b3c', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer'
            }}
          >
            Responder Questionário A →
          </button>
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 12px rgba(26,107,60,0.08)', borderTop: '4px solid #c8a84b' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>👥</div>
          <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', color: '#0f4526', marginBottom: '8px' }}>
            Apêndice B
          </h3>
          <p style={{ fontSize: '14px', color: '#5a7060', marginBottom: '8px', fontWeight: 600 }}>
            População atendida nos Mutirões
          </p>
          <p style={{ fontSize: '13px', color: '#5a7060', lineHeight: 1.6, marginBottom: '20px' }}>
            Questionário simplificado aplicado por entrevistador via tablet nos eventos da Defensoria
            Itinerante. Avalia perfil digital, letramento e receptividade ao atendimento virtual.
          </p>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {['6 seções', '15 perguntas', 'Visual e simples', 'Tablet/entrevistador'].map(tag => (
              <span key={tag} style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '10px', background: '#fdf6e3', color: '#c8a84b', fontWeight: 600 }}>
                {tag}
              </span>
            ))}
          </div>
          <button
            onClick={() => setAtivo('B')}
            style={{
              width: '100%', padding: '12px', borderRadius: '8px', border: 'none',
              background: '#c8a84b', color: '#0f4526', fontSize: '14px', fontWeight: 700, cursor: 'pointer'
            }}
          >
            Responder Questionário B →
          </button>
        </div>
      </div>

      {/* Nota sobre Google Forms */}
      <div style={{ background: '#f4f6f4', borderRadius: '10px', padding: '20px 24px', marginTop: '24px', border: '1px solid #d0ddd4' }}>
        <h4 style={{ color: '#0f4526', marginBottom: '8px', fontSize: '14px' }}>💡 Integração com Google Forms</h4>
        <p style={{ color: '#5a7060', fontSize: '13px', lineHeight: 1.6, marginBottom: '8px' }}>
          Os questionários acima funcionam diretamente na plataforma. Para coletar dados externos e analisar
          resultados no Google Sheets automaticamente, você pode criar formulários paralelos no Google Forms
          com as mesmas perguntas e compartilhar os links com os participantes.
        </p>
        <p style={{ color: '#5a7060', fontSize: '13px' }}>
          <strong>Como criar:</strong> Acesse <strong>forms.google.com</strong> → "Em branco" → copie as perguntas de cada seção → compartilhe o link.
          As respostas aparecem automaticamente em uma planilha Google Sheets para análise estatística.
        </p>
      </div>
    </div>
  )
}
