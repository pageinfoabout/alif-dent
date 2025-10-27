import React, { createContext, useContext, useEffect, useState } from 'react'
import supabase from './supabase'
import bcrypt from 'bcryptjs'

const STORAGE_KEY = 'custom_auth_user'

const AuthContext = createContext({
  user: null,
  loading: true,
  signIn: async (_login, _password) => {},
  signUp: async (_payload) => {},
  signOut: () => {},
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setUser(JSON.parse(saved))
    } catch {}
    setLoading(false)
  }, [])

  const signIn = async (login, password) => {
    const { data, error } = await supabase
      .from('users')
      .select('id, login, username, password_hash')
      .eq('login', login)
      .maybeSingle()
    if (error) throw new Error(error.message)
    if (!data) throw new Error('Пользователь не найден')
    const ok = await bcrypt.compare(password, data.password_hash || '')
    if (!ok) throw new Error('Неверный пароль')
    const authUser = { id: data.id, login: data.login, username: data.username }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser))
    setUser(authUser)
    return authUser
  }

  const signUp = async ({ login, username, password }) => {
    const { data: exists, error: exErr } = await supabase
      .from('users')
      .select('id')
      .eq('login', login)
      .maybeSingle()
    if (exErr) throw new Error(exErr.message)
    if (exists) throw new Error('Логин уже занят')

    const password_hash = await bcrypt.hash(password, 10)
    const { data, error } = await supabase
      .from('users')
      .insert({ login, username, password_hash })
      .select('id, login, username')
      .single()
    if (error) throw new Error(error.message)
    const authUser = { id: data.id, login: data.login, username: data.username }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser))
    setUser(authUser)
    return authUser
  }

  const signOut = () => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  const value = { user, loading, signIn, signUp, signOut }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}


