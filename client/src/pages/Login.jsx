import React, { useState } from 'react'
import { useAuth } from '../lib/auth.jsx'
import { toast } from 'react-hot-toast'

const Login = ({ onSuccess = () => {} }) => {
  const { signIn, signUp } = useAuth()

  const [state, setState] = useState('login')
  const [formData, setFormData] = useState({
    username: '',
    login: '',
    password: '',
  })
  const [submitting, setSubmitting] = useState(false)
 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  const [showPassword, setShowPassword] = useState(false) 
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      if (state === 'login') {
        if (!formData.login || !formData.password) {
          toast.error('Введите логин и пароль')
          setSubmitting(false)
          return
        }
        await signIn(formData.login.trim(), formData.password)
        toast.success('Добро пожаловать!')
        onSuccess()
      } else {
        if (!formData.username || !formData.login || !formData.password) {
          toast.error('Заполните все поля')
          setSubmitting(false)
          return
        }
        await signUp({
          login: formData.login.trim(),
          username: formData.username.trim(),
          password: formData.password,
        })
        toast.success('Регистрация успешна!')
        onSuccess()
      }
    } catch (err) {
      toast.error(err.message || 'Ошибка авторизации')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white">
      <h1 className="text-gray-900 text-3xl mt-10 font-medium">{state === 'login' ? 'Вход' : 'Регистрация'}</h1>
      <p className="text-gray-500 text-sm mt-2">
        {state === 'login' ? 'Пожалуйста, войдите, чтобы продолжить' : 'Пожалуйста, зарегистрируйтесь, чтобы продолжить'}
      </p>

      {state !== 'login' && (
        <div className="flex items-center mt-6 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-round-icon lucide-user-round"><circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 0 0-16 0" /></svg>
          <input
            type="text"
            name="username"
            placeholder="Имя"
            className="border-none outline-none ring-0"
            value={formData.username}
            onChange={handleChange}
            autoComplete="name"
            required
          />
        </div>
      )}
      <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail-icon lucide-mail"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" /><rect x="2" y="4" width="20" height="16" rx="2" /></svg>
        <input
          type="text"
          name="login"
          placeholder="Логин"
          className="border-none outline-none ring-0"
          value={formData.login}
          onChange={handleChange}
          autoComplete="username"
          required
        />
      </div>

      {/* ПОЛЕ ПАРОЛЯ С ИКОНКОЙ ГЛАЗА */}


<div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 pr-2 gap-2 relative">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock-icon lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
        <input
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Пароль"
          className="border-none outline-none ring-0 flex-1"
          value={formData.password}
          onChange={handleChange}
          autoComplete={state === 'login' ? 'current-password' : 'new-password'}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="p-1 hover:opacity-70 cursor-pointer"
          style={{ background: 'none', border: 'none', outline: 'none' }}
        >
          {showPassword ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
              <circle cx="12" cy="12" r="3"/>
              <path d="m14 10-4 4M10 10l4 4"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          )}
        </button>
      </div>

      <div className="mt-4 text-left text-indigo-500" />

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 w-full h-11 rounded-full text-white hover:opacity-90 transition-opacity disabled:opacity-70"
        style={{ background: 'var(--brand)' }}
      >
        {submitting ? 'Подождите…' : state === 'login' ? 'Войти' : 'Зарегистрироваться'}
      </button>

      <p
        onClick={() => setState((prev) => (prev === 'login' ? 'register' : 'login'))}
        className="text-gray-500 text-sm mt-3 mb-11 cursor-pointer select-none"
      >
        {state === 'login' ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
        <span className="text-indigo-500 hover:underline">нажмите здесь</span>
      </p>
    </form>
  )
}

export default Login