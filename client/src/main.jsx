import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App, { HomePage, AboutPage, ContactsPage } from './App.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login.jsx'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './lib/auth.jsx'
import CabinetPage from './pages/Cabinet.jsx'

function LoginScreen() {
  return (
    <div className="min-h-[100vh] bg-white flex items-center justify-center p-4">
      <Login />
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/" element={<App />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contacts" element={<ContactsPage />} />
            <Route path="cabinet" element={<CabinetPage />} />
            <Route path="*" element={<HomePage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)