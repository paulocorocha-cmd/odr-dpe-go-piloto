import { useState } from 'react'
import LandingPage from './components/LandingPage'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Cases from './components/Cases'
import NewCase from './components/NewCase'
import Schedule from './components/Schedule'
import VideoSession from './components/VideoSession'
import Documents from './components/Documents'
import Notifications from './components/Notifications'
import PIDs from './components/PIDs'
import Questionnaires from './components/Questionnaires'
import Navbar from './components/Navbar'

export default function App() {
  const [page, setPage] = useState('landing')
  const [user, setUser] = useState(null)
  const [currentCase, setCurrentCase] = useState(null)

  const navigate = (p, data = null) => {
    setPage(p)
    if (data) setCurrentCase(data)
    window.scrollTo(0, 0)
  }

  const handleLogin = (userData) => {
    setUser(userData)
    navigate('dashboard')
  }

  const handleLogout = () => {
    setUser(null)
    navigate('landing')
  }

  if (page === 'landing') return <LandingPage onNavigate={navigate} />
  if (page === 'login') return <Login onLogin={handleLogin} onNavigate={navigate} />

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Navbar page={page} onNavigate={navigate} user={user} onLogout={handleLogout} />
      <main style={{ flex: 1, marginLeft: '240px', padding: '32px', maxWidth: '1100px' }}>
        {page === 'dashboard'       && <Dashboard onNavigate={navigate} user={user} />}
        {page === 'cases'           && <Cases onNavigate={navigate} />}
        {page === 'new-case'        && <NewCase onNavigate={navigate} />}
        {page === 'schedule'        && <Schedule onNavigate={navigate} caseData={currentCase} />}
        {page === 'video-session'   && <VideoSession onNavigate={navigate} caseData={currentCase} />}
        {page === 'documents'       && <Documents onNavigate={navigate} />}
        {page === 'notifications'   && <Notifications onNavigate={navigate} />}
        {page === 'pids'            && <PIDs onNavigate={navigate} />}
        {page === 'questionnaires'  && <Questionnaires onNavigate={navigate} />}
      </main>
    </div>
  )
}
