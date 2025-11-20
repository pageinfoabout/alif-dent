import React, { useState, useEffect } from 'react'
import { useAuth } from '../lib/auth.jsx'
import supabase from '../lib/supabase.js'
import { toast } from 'react-hot-toast'

// Функция форматирования номера телефона
const formatPhoneNumber = (value) => {
  // Проверяем и преобразуем в строку
  if (!value) return ''
  const strValue = String(value)
  
  // Удаляем все нецифровые символы
  const numbers = strValue.replace(/\D/g, '')
  
  // Если номер начинается с 8, заменяем на 7
  let formatted = numbers
  if (formatted.startsWith('8')) {
    formatted = '7' + formatted.slice(1)
  }
  
  // Ограничиваем до 11 цифр (7 + 10 цифр)
  if (formatted.length > 11) {
    formatted = formatted.slice(0, 11)
  }
  
  // Форматируем: +7 (XXX) XXX-XX-XX
  if (formatted.length === 0) return ''
  if (formatted.length <= 1) return `+${formatted}`
  if (formatted.length <= 4) return `+${formatted[0]} (${formatted.slice(1)}`
  if (formatted.length <= 7) return `+${formatted[0]} (${formatted.slice(1, 4)}) ${formatted.slice(4)}`
  if (formatted.length <= 9) return `+${formatted[0]} (${formatted.slice(1, 4)}) ${formatted.slice(4, 7)}-${formatted.slice(7)}`
  return `+${formatted[0]} (${formatted.slice(1, 4)}) ${formatted.slice(4, 7)}-${formatted.slice(7, 9)}-${formatted.slice(9)}`
}

const getPhoneNumbers = (formattedPhone) => {
  // Извлекаем только цифры из отформатированного номера
  if (!formattedPhone) return ''
  return String(formattedPhone).replace(/\D/g, '')
}

const PatientCardForm = ({ onSuccess = () => {}, initialData = null }) => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    middle_name: initialData?.middle_name || '',
    last_name: initialData?.last_name || '',
    age: initialData?.age ? String(initialData.age) : '',
    number: initialData?.number ? formatPhoneNumber(initialData.number) : '',
  })
  const [submitting, setSubmitting] = useState(false)

  const isEditMode = !!initialData

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        middle_name: initialData.middle_name || '',
        last_name: initialData.last_name || '',
        age: initialData.age ? String(initialData.age) : '',
        number: initialData.number ? formatPhoneNumber(initialData.number) : '',
      })
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    
    if (name === 'number') {
      // Форматируем номер телефона
      const formatted = formatPhoneNumber(value)
      setFormData({ ...formData, [name]: formatted })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.last_name || !formData.age || !formData.number) {
      toast.error('Заполните все обязательные поля')
      return
    }

    if (!user || !user.id) {
      toast.error('Пользователь не авторизован')
      return
    }

    try {
      setSubmitting(true)
      
      const { data, error } = await supabase
        .from('users')
        .update({
          name: formData.name.trim(),
          middle_name: formData.middle_name.trim() || null,
          last_name: formData.last_name.trim(),
          age: parseInt(formData.age) || null,
          number: getPhoneNumbers(formData.number), // Сохраняем только цифры
        })
        .eq('id', user.id)
        .select()
        .single()

      if (error) {
        throw new Error(error.message || 'Ошибка при сохранении данных пациента')
      }

      toast.success(isEditMode ? 'Данные пациента успешно обновлены!' : 'Данные пациента успешно сохранены!')
      onSuccess()
    } catch (err) {
      toast.error(err.message || 'Ошибка при сохранении данных пациента')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white">
      <h1 className="text-gray-900 text-3xl mt-10 font-medium">
        {isEditMode ? 'Редактирование карточки пациента' : 'Создание карточки пациента'}
      </h1>
      <p className="text-gray-500 text-sm mt-2">
        {isEditMode ? 'Исправьте данные пациента' : 'Пожалуйста, заполните данные пациента'}
      </p>

      <div className="flex items-center mt-6 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-round-icon lucide-user-round"><circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 0 0-16 0" /></svg>
        <input
          type="text"
          name="name"
          placeholder="Имя *"
          className="border-none outline-none ring-0 flex-1"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-round-icon lucide-user-round"><circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 0 0-16 0" /></svg>
        <input
          type="text"
          name="middle_name"
          placeholder="Отчество"
          className="border-none outline-none ring-0 flex-1"
          value={formData.middle_name}
          onChange={handleChange}
        />
      </div>

      <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-round-icon lucide-user-round"><circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 0 0-16 0" /></svg>
        <input
          type="text"
          name="last_name"
          placeholder="Фамилия *"
          className="border-none outline-none ring-0 flex-1"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <input
          type="number"
          name="age"
          placeholder="Возраст *"
          className="border-none outline-none ring-0 flex-1"
          value={formData.age}
          onChange={handleChange}
          min="0"
          max="150"
          required
        />
      </div>

      <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        <input
          type="tel"
          name="number"
          placeholder="+7 (___) ___-__-__"
          className="border-none outline-none ring-0 flex-1"
          value={formData.number}
          onChange={handleChange}
          required
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 w-full h-11 rounded-full text-white hover:opacity-90 transition-opacity disabled:opacity-70"
        style={{ background: 'var(--brand)' }}
      >
        {submitting 
          ? (isEditMode ? 'Сохранение...' : 'Создание...') 
          : (isEditMode ? 'Сохранить изменения' : 'Создать карточку')}
      </button>

      <p className="text-gray-500 text-xs mt-3 mb-11">
        * - обязательные поля
      </p>
    </form>
  )
}

export default PatientCardForm

