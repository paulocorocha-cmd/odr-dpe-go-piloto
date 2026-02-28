export default function LandingPage({ onNavigate }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f4f6f4' }}>
      {/* Hero */}
      <header style={{
        background: 'linear-gradient(135deg, #0f4526 0%, #1a6b3c 60%, #2d9b5a 100%)',
        padding: '0 40px', minHeight: '100vh', display: 'flex', flexDirection: 'column'
      }}>
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '28px 0' }}>
          <div>
            <span style={{ fontFamily: 'Fraunces, serif', color: '#c8a84b', fontSize: '26px', fontWeight: 700 }}>
              CONCILIA
            </span>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginLeft: '12px', letterSpacing: '2px' }}>
              DPE-GO
            </span>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => onNavigate('login')}
              style={{
                padding: '10px 24px', borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.3)',
                background: 'transparent', color: '#fff', fontSize: '14px', cursor: 'pointer'
              }}
            >
              Entrar
            </button>
            <button
              onClick={() => onNavigate('login')}
              style={{
                padding: '10px 24px', borderRadius: '8px',
                background: '#c8a84b', border: 'none',
                color: '#0f4526', fontSize: '14px', fontWeight: 600, cursor: 'pointer'
              }}
            >
              Solicitar Atendimento
            </button>
          </div>
        </nav>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', maxWidth: '700px', paddingBottom: '80px' }}>
          <div>
            <div style={{
              display: 'inline-block', background: 'rgba(200,168,75,0.15)',
              border: '1px solid rgba(200,168,75,0.3)', borderRadius: '20px',
              padding: '6px 16px', color: '#c8a84b', fontSize: '13px', marginBottom: '24px'
            }}>
              Defensoria Pública do Estado de Goiás
            </div>
            <h1 style={{
              fontFamily: 'Fraunces, serif', color: '#fff',
              fontSize: 'clamp(36px, 5vw, 60px)', lineHeight: 1.1, marginBottom: '24px'
            }}>
              Acesso à Justiça<br />
              <span style={{ color: '#c8a84b' }}>sem fronteiras.</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '18px', lineHeight: 1.7, marginBottom: '40px' }}>
              Resolva seus conflitos de forma gratuita, rápida e sem precisar se deslocar.
              Atendimento por videochamada com Defensor Público, de qualquer comarca de Goiás.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button
                onClick={() => onNavigate('login')}
                style={{
                  padding: '16px 36px', borderRadius: '10px',
                  background: '#c8a84b', border: 'none',
                  color: '#0f4526', fontSize: '16px', fontWeight: 700, cursor: 'pointer'
                }}
              >
                Iniciar Atendimento Gratuito →
              </button>
              <button
                onClick={() => onNavigate('pids')}
                style={{
                  padding: '16px 36px', borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.3)',
                  background: 'transparent', color: '#fff', fontSize: '16px', cursor: 'pointer'
                }}
              >
                Encontrar PID na minha cidade
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Cards */}
      <section style={{ padding: '80px 40px', maxWidth: '1100px', margin: '0 auto' }}>
        <h2 style={{
          fontFamily: 'Fraunces, serif', fontSize: '36px',
          textAlign: 'center', color: '#0f4526', marginBottom: '48px'
        }}>
          Como funciona
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
          {[
            { num: '01', title: 'Cadastro Gratuito', desc: 'Registre-se com seus dados básicos. Nenhum custo.' },
            { num: '02', title: 'Descreva seu Caso', desc: 'Informe o tipo de conflito e selecione a comarca.' },
            { num: '03', title: 'Agende a Sessão', desc: 'Escolha data e horário disponíveis com o Defensor.' },
            { num: '04', title: 'Sessão por Vídeo', desc: 'Participe da mediação online com ata automática.' },
            { num: '05', title: 'Acordo Homologado', desc: 'Gere o Termo de Acordo com validade jurídica.' },
          ].map(step => (
            <div key={step.num} style={{
              background: '#fff', borderRadius: '12px', padding: '28px',
              boxShadow: '0 2px 12px rgba(26,107,60,0.08)',
              borderTop: '3px solid #1a6b3c'
            }}>
              <div style={{ color: '#c8a84b', fontSize: '13px', fontWeight: 700, marginBottom: '12px' }}>
                PASSO {step.num}
              </div>
              <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', color: '#0f4526', marginBottom: '8px' }}>
                {step.title}
              </h3>
              <p style={{ color: '#5a7060', fontSize: '14px', lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: '#0f4526', padding: '60px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '80px', flexWrap: 'wrap' }}>
          {[
            { n: '63', label: 'PIDs disponíveis em Goiás' },
            { n: '118', label: 'Comarcas a alcançar' },
            { n: '100%', label: 'Gratuito para o assistido' },
            { n: '5,9%', label: 'Cobertura atual DPE-GO' },
          ].map(stat => (
            <div key={stat.n} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Fraunces, serif', color: '#c8a84b', fontSize: '48px', fontWeight: 700 }}>
                {stat.n}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginTop: '4px' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0a2e18', padding: '32px 40px', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
          © 2025 Defensoria Pública do Estado de Goiás · Projeto Piloto ODR · PPGDP-UFG
        </p>
      </footer>
    </div>
  )
}
