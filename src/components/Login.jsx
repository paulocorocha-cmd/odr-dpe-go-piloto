import { useState } from 'react'

export default function Login({ onLogin, onNavigate }) {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [form, setForm] = useState({ name: '', cpf: '', email: '', renda: '', role: 'assistido' })

  const handleSubmit = (e) => {
    e.preventDefault()
    onLogin({ name: form.name || 'Usuário Teste', role: form.role === 'defensor' ? 'Defensor Público' : 'Assistido', email: form.email })
  }

  const input = (label, key, type = 'text', placeholder = '') => (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', fontSize: '13px', color: '#5a7060', marginBottom: '6px', fontWeight: 500 }}>
        {label}
      </label>
      <input
        type={type}
        value={form[key]}
        onChange={e => setForm({ ...form, [key]: e.target.value })}
        placeholder={placeholder}
        style={{
          width: '100%', padding: '11px 14px', borderRadius: '8px',
          border: '1px solid #d0ddd4', fontSize: '14px',
          outline: 'none', background: '#f9fbf9'
        }}
      />
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f4526, #1a6b3c)'
    }}>
      <div style={{
        background: '#fff', borderRadius: '16px', padding: '40px',
        width: '100%', maxWidth: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontFamily: 'Fraunces, serif', color: '#c8a84b', fontSize: '28px', fontWeight: 700 }}>
            CONCILIA DPE-GO
          </div>
          <p style={{ color: '#5a7060', fontSize: '14px', marginTop: '6px' }}>
            {mode === 'login' ? 'Acesse sua conta' : 'Crie sua conta gratuita'}
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', background: '#f4f6f4', borderRadius: '8px', padding: '4px', marginBottom: '28px' }}>
          {['login', 'register'].map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                flex: 1, padding: '8px', borderRadius: '6px', border: 'none',
                background: mode === m ? '#fff' : 'transparent',
                color: mode === m ? '#1a6b3c' : '#5a7060',
                fontWeight: mode === m ? 600 : 400, fontSize: '14px', cursor: 'pointer',
                boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              {m === 'login' ? 'Entrar' : 'Cadastrar'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'register' && input('Nome completo', 'name', 'text', 'Seu nome')}
          {input('CPF', 'cpf', 'text', '000.000.000-00')}
          {input('E-mail', 'email', 'email', 'seu@email.com')}
          {mode === 'login' && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: '#5a7060', marginBottom: '6px', fontWeight: 500 }}>
                Senha
              </label>
              <input
                type="password"
                placeholder="••••••••"
                style={{
                  width: '100%', padding: '11px 14px', borderRadius: '8px',
                  border: '1px solid #d0ddd4', fontSize: '14px', outline: 'none', background: '#f9fbf9'
                }}
              />
            </div>
          )}
          {mode === 'register' && (
            <>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#5a7060', marginBottom: '6px', fontWeight: 500 }}>
                  Renda familiar mensal
                </label>
                <select
                  value={form.renda}
                  onChange={e => setForm({ ...form, renda: e.target.value })}
                  style={{
                    width: '100%', padding: '11px 14px', borderRadius: '8px',
                    border: '1px solid #d0ddd4', fontSize: '14px', background: '#f9fbf9'
                  }}
                >
                  <option value="">Selecione</option>
                  <option>Até R$ 700</option>
                  <option>De R$ 700 a R$ 1.400</option>
                  <option>De R$ 1.400 a R$ 2.100</option>
                  <option>Acima de R$ 2.100</option>
                </select>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#5a7060', marginBottom: '6px', fontWeight: 500 }}>
                  Tipo de acesso
                </label>
                <select
                  value={form.role}
                  onChange={e => setForm({ ...form, role: e.target.value })}
                  style={{
                    width: '100%', padding: '11px 14px', borderRadius: '8px',
                    border: '1px solid #d0ddd4', fontSize: '14px', background: '#f9fbf9'
                  }}
                >
                  <option value="assistido">Assistido (Cidadão)</option>
                  <option value="defensor">Defensor Público / Servidor</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            style={{
              width: '100%', padding: '14px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #1a6b3c, #2d9b5a)',
              border: 'none', color: '#fff', fontSize: '15px', fontWeight: 600, cursor: 'pointer',
              marginTop: '8px'
            }}
          >
            {mode === 'login' ? 'Entrar no Sistema' : 'Criar Conta'}
          </button>
        </form>

        <button
          onClick={() => onNavigate('landing')}
          style={{
            display: 'block', width: '100%', textAlign: 'center',
            marginTop: '20px', color: '#5a7060', fontSize: '13px',
            background: 'none', border: 'none', cursor: 'pointer'
          }}
        >
          ← Voltar para a página inicial
        </button>
      </div>
    </div>
  )
}
