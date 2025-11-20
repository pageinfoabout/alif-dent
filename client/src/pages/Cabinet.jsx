import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import supabase from '../lib/supabase'
import { useAuth } from '../lib/auth.jsx'
import PatientCardForm from './PatientCardForm.jsx'

export default function CabinetPage() {
  const { user, loading, signOut } = useAuth()
  const [orders, setOrders] = useState([])
  const [userData, setUserData] = useState(null)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  useEffect(() => {
    let mounted = true
    const fetchData = async () => {
      if (!user) { 
        setOrders([])
        setUserData(null)
        setFetching(false)
        return 
      }
      setFetching(true)
      
      // Загружаем данные пользователя
      const { data: userInfo, error: userError } = await supabase
        .from('users')
        .select('name, middle_name, last_name, age, number')
        .eq('id', user.id)
        .single()
      
      if (!mounted) return
      if (userError && userError.code !== 'PGRST116') {
        console.error('Error fetching user data:', userError)
      } else if (userInfo) {
        setUserData(userInfo)
      }
      
      // Загружаем историю записей
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('cabinet_id', user.id)
        .order('created_at', { ascending: false })
      
      if (!mounted) return
      if (error) setError(error.message)
      setOrders(Array.isArray(data) ? data : [])
      setFetching(false)
    }
    fetchData()
    return () => { mounted = false }
  }, [user])

  if (loading) return null
  if (!user) {
    return (
      <div className="section">
        <h2>Кабинет</h2>
        <p className="text">Войдите, чтобы видеть историю записей.</p>
        <p className="text" style={{ marginTop: 12 }}><Link to="/login" className="btn-link">Войти</Link></p>
      </div>
    )
  }

  // Формируем полное имя пользователя
  const getFullName = () => {
    if (!userData) return null
    const parts = []
    if (userData.last_name) parts.push(userData.last_name)
    if (userData.name) parts.push(userData.name)
    if (userData.middle_name) parts.push(userData.middle_name)
    return parts.length > 0 ? parts.join(' ') : null
  }

  const fullName = getFullName()
  const age = userData?.age

  const handleEditSuccess = async () => {
    setIsEditModalOpen(false)
    // Перезагружаем данные пользователя
    if (user) {
      const { data: userInfo } = await supabase
        .from('users')
        .select('name, middle_name, last_name, age, number')
        .eq('id', user.id)
        .single()
      if (userInfo) {
        setUserData(userInfo)
      }
    }
  }

  return (
    <section className="section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div style={{ flex: 1 }}>
          {fullName && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: age ? '8px' : '24px' }}>
              <h1 style={{ 
                fontSize: '36px', 
                fontWeight: '700', 
                margin: 0,
                color: 'var(--fg)'
              }}>
                {fullName}
              </h1>
              <button
                onClick={() => setIsEditModalOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.7,
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
                aria-label="Редактировать данные"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
            </div>
          )}
          {age && (
            <p style={{ 
              fontSize: '24px', 
              fontWeight: '400', 
              margin: 0, 
              marginBottom: '24px',
              color: 'var(--muted)'
            }}>
              Возраст: {age} {age === 1 ? 'год' : age < 5 ? 'года' : 'лет'}
            </p>
          )}
          {!fullName && !age && !fetching && (
            <p className="text" style={{ marginBottom: 24 }}>
              Заполните данные в карточке пациента
            </p>
          )}
        </div>
        <button className="btn-link" onClick={() => signOut()}>Выйти</button>
      </div>
      
      {isEditModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal login-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" aria-label="Закрыть" onClick={() => setIsEditModalOpen(false)}>×</button>
            <div className="modal-body center-login">
              <PatientCardForm 
                onSuccess={handleEditSuccess}
                initialData={userData}
              />
            </div>
          </div>
        </div>
      )}
      
      <h2 style={{ fontSize: '28px', fontWeight: '600', marginBottom: 16 }}>Мои записи</h2>
      
      {error && <div className="text" style={{ color: 'var(--brand)', marginTop: 12 }}>{error}</div>}
      {fetching ? (
        <p className="text" style={{ marginTop: 12 }}>Загрузка…</p>
      ) : orders.length === 0 ? (
        <p className="text" style={{ marginTop: 12 }}>Записей пока нет.</p>
      ) : (
        <div style={{ marginTop: 16, display: 'grid', gap: 12 }}>
          {orders.map(o => (
            <div key={o.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>{o.date} {o.time}</strong>
               


<span style={{ 
    color: o.status === 'new' ? '#FF6B35' : o.status === 'succeeded' ? '#4CAF50' : 'var(--muted)',
  fontWeight: (o.status === 'new' || o.status === 'succeeded') ? '100' : '50'
}}>
  {o.status === 'new' 
    ? 'Ожидаем...' 
    : o.status === 'succeeded' 
    ? 'Успешно' 
    : o.status}
</span>

              </div>
              <div className="text" style={{ marginTop: 6 }}>
                {Array.isArray(o.services) && o.services.length > 0
                  ? o.services.map(s => s.name).join(', ')
                  : 'Услуги не указаны'}
              </div>
              <div style={{ marginTop: 6 }}><strong>{(o.total || 0).toLocaleString('ru-RU')} ₽</strong></div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}








