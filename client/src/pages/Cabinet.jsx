import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import supabase from '../lib/supabase'
import { useAuth } from '../lib/auth.jsx'

export default function CabinetPage() {
  const { user, loading, signOut } = useAuth()
  const [orders, setOrders] = useState([])
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    const fetchOrders = async () => {
      if (!user) { setOrders([]); setFetching(false); return }
      setFetching(true)
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
    fetchOrders()
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

  return (
    <section className="section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Мои записи</h2>
        <button className="btn-link" onClick={() => signOut()}>Выйти</button>
      </div>
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








