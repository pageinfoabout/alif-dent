import './App.css'
import { useEffect, useMemo, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import Login from './pages/Login.jsx'
import supabase from './lib/supabase.js'
import { useAuth } from './lib/auth.jsx'

// Перечень услуг (лабораторные конструкции)
const SERVICES = [
  { id: 'serv-orthodontic-maintenance', name: 'Услуги по обслуживанию ортодонтических аппаратов', price: 1100 },
  { id: 'serv-removable-appliance-adjust', name: 'Коррекция съемного ортодонтического аппарата', price: 3000 },
  { id: 'serv-orthodontic-appliance-repair', name: 'Ремонт ортодонитческого аппарата', price: 1200 },
  { id: 'serv-cast-metal-tooth-fixed', name: 'Изготовление зуба литого металлического в несъемной конструкции протеза', price: 8000 },
  { id: 'serv-cast-tooth-paw', name: 'Изготовление лапки литого зуба', price: 650 },
  { id: 'serv-control-refractory-model', name: 'Изготовление контрольной, огнеупорной модели', price: 550 },
  { id: 'serv-plastic-simple-tooth', name: 'Изготовление зуба пластмассового простого', price: 1400 },
  { id: 'serv-soldering', name: 'Изготовление спайки', price: 950 },
  { id: 'serv-disassemblable-model', name: 'Изготовление разборной модели', price: 460 },
  { id: 'serv-bent-clasp-steel', name: 'Изготовление кламмера гнутого из стальной проволоки', price: 700 },
  { id: 'serv-refractory-model', name: 'Изготовление огнеупорной модели', price: 850 },
  { id: 'serv-cast-retentive-clasp', name: 'Изготовление литого опорно-удерживающего кламмера', price: 1500 },
  { id: 'serv-basis-limiter', name: 'Изготовление ограничителя базиса бюгельного протеза', price: 2500 },
  { id: 'serv-saddle-bugel-prosthesis', name: 'Изготовление седла бюгельного протеза', price: 4000 },
  { id: 'serv-shin-paw-bugel', name: 'Изготовление лапки шинирующей в бюгельном протезе', price: 1500 },
  { id: 'serv-control-model', name: 'Изготовление контрольной модели', price: 1500 },
  { id: 'serv-plastic-crown', name: 'Изготовление коронки пластмассовой', price: 2000 },
  { id: 'serv-reline-lab', name: 'Перебазировка съемного протеза лабораторным методом', price: 2000 },
  { id: 'serv-spot-weld-clasp', name: 'Приварка кламмера', price: 1000 },
  { id: 'serv-spot-weld-tooth', name: 'Приварка зуба', price: 1000 },
  { id: 'serv-fracture-repair', name: 'Починка перелома базиса самотвердеющей пластмассой', price: 2500 },
  { id: 'serv-two-fractures-repair', name: 'Починка двух переломов базиса самотвердеющей пластмассой', price: 4500 },
  { id: 'serv-elastic-liner', name: 'Изготовление эластической прокладки (лабораторный метод)', price: 1000 },
  { id: 'serv-one-element-plate', name: 'Изготовление одного элемента к съемной пластинке', price: 500 },
  { id: 'serv-wax-bite-rim', name: 'Изготовление воскового валика (шаблон для прикуса)', price: 2000 },
  { id: 'serv-attachment-implant', name: 'Установка крепления в конструкцию съемного протеза при протезировании на имплантатах', price: 2000 },
  { id: 'serv-aux-model', name: 'Изготовление вспомогательной модели', price: 600 },
  { id: 'serv-waxup', name: 'Изготовление модели восковой Wax-up (1 ед.)', price: 1000 },
  { id: 'serv-waxup-procera', name: 'Изготовление модели восковой Wax-up Procera (1 ед.)', price: 1500 },
  { id: 'serv-3d-print-model', name: 'Изготовление модели, выполненной методом 3D-печати', price: 4000 },
  { id: 'serv-surgical-guide', name: 'Изготовление хирургического шаблона', price: 5000 },
  { id: 'serv-silicone-key', name: 'Изготовление силиконового ключа', price: 1500 },
  { id: 'serv-individual-tray', name: 'Изготовление индивидуальной ложки', price: 1500 },
  { id: 'serv-bleaching-splint', name: 'Изготовление каппы для отбеливания, разобщающей', price: 3000 },
  { id: 'serv-bruxism-splint', name: 'Изготовление каппы при бруксизме', price: 5000 },
  { id: 'serv-sport-splint', name: 'Изготовление каппы спортивной', price: 10000 },
  { id: 'serv-ortho-splint', name: 'Изготовление каппы ортодонтической', price: 3500 },
  { id: 'serv-reline-clinic', name: 'Перебазировка съемного пластиночного протеза (клиническая)', price: 3000 },
  { id: 'serv-reline-lab-plate', name: 'Перебазировка съемного пластиночного протеза (лабораторная)', price: 3800 },
  { id: 'serv-clean-polish-prosthesis', name: 'Чистка и полировка протеза', price: 1500 },
  { id: 'serv-remove-cast-post', name: 'Извлечение литой культевой вкладки', price: 5500 },
  { id: 'serv-reinforce-plate-prosthesis', name: 'Армирование пластиночного протеза', price: 6000 },
  { id: 'serv-ceramic-gingiva', name: 'Изготовление керамической десны', price: 2500 },
  { id: 'serv-bar-on-implants', name: 'Изготовление балки на имплантатах (1 ед.)', price: 1500 },
  { id: 'serv-veneer-emax-zro', name: 'Облицовка E-max,ZrO', price: 10000 },
  { id: 'serv-veneer-chrome-cobalt', name: 'Облицовка КХС', price: 5500 },
  { id: 'serv-temp-crown-reline', name: 'Перебазировка временной коронки', price: 500 },
  { id: 'serv-correction-other-clinic', name: 'Коррекция протеза, изготовленного сторонней клиникой', price: 1000 },
]

// Supabase client is imported from ./lib/supabase.js

function formatDateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function generateHourlySlots(startHour = 9, endHour = 21) {
  // inclusive end: 09:00..21:00
  const slots = []
  for (let h = startHour; h <= endHour; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`)
  }
  return slots
}

function Header({ onOpenLogin }) {
  const [open, setOpen] = useState(false)
  const { user, signOut } = useAuth()

  return (
    <header className="header">
      <div className="header-inner homelo">
        <Link to="/" className="brand brand-left" aria-label="looks.Moscow">
          <img className="brand-mark" src="/logo(1).png" alt="looks.Moscow" />
        </Link>

        <nav className="nav nav-center" aria-label="Главное меню">
          <Link to="/">Главная</Link>
          <a href="/#materials">Услуги</a>
          <a href="/#services">Врачи</a>
          <a href="/#projects">Проекты</a>
          <Link to="/about">О нас</Link>
          <Link to="/contacts">Контакты</Link>
        </nav>

        {user ? (
          <div style={{ display: 'flex', gap: 8 }}>
            <Link to="/cabinet" className="contact-pill">Кабинет</Link>
            <button type="button" className="contact-pill" onClick={() => signOut()}>Выйти</button>
          </div>
        ) : (
          <button type="button" className="contact-pill" onClick={() => onOpenLogin && onOpenLogin()}>Войти</button>
        )}

        <button
          className={`menu-toggle${open ? ' is-open' : ''}`}
          aria-label="Открыть меню"
          aria-expanded={open}
          onClick={() => setOpen(o => !o)}
        >
          <span/><span/><span/>
        </button>
      </div>

      <div className={`mobile-menu${open ? ' open' : ''}`} onClick={() => setOpen(false)}>
        <div className="mobile-sheet" onClick={(e) => e.stopPropagation()}>
          <nav className="mobile-nav" aria-label="Мобильное меню">
            <Link to="/" onClick={() => setOpen(false)}>Главная</Link>
            <a href="/#materials" onClick={() => setOpen(false)}>Услуги</a>
            <a href="/#services" onClick={() => setOpen(false)}>Врачи</a>
            <a href="/#projects" onClick={() => setOpen(false)}>Проекты</a>
            <Link to="/about" onClick={() => setOpen(false)}>О нас</Link>
            <Link to="/contacts" onClick={() => setOpen(false)}>Контакты</Link>
            {user && <Link to="/cabinet" onClick={() => setOpen(false)}>Кабинет</Link>}
          </nav>

          {user ? (
            <div style={{ marginTop: 'auto', display: 'grid', gap: 8 }}>
              <Link to="/cabinet" className="contact-pill" style={{ width: '100%', textAlign: 'center' }} onClick={() => setOpen(false)}>
                Кабинет
              </Link>
              <button type="button" className="btn-link" onClick={() => { signOut(); setOpen(false); }}>
                Выйти
              </button>
            </div>
          ) : (
            <div style={{ marginTop: 'auto' }}>
              <button
                type="button"
                className="contact-pill"
                style={{ width: '100%', textAlign: 'center' }}
                onClick={() => { onOpenLogin && onOpenLogin(); setOpen(false); }}
              >
                Войти
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

function Hero({ onOpenBooking }) {
  return (
    <section id="top" className="hero homelo">
      <video className="hero-video" src="/561717044.mp4" autoPlay muted loop playsInline preload="metadata" aria-hidden="true" />
      <div className="hero-left">
        <img className="hero-logo-left" src="/logo(1).png" alt="ALIF DENT" />
        <ul className="bullets">
          <li>Место, где о вас по-настоящему заботятся.</li>
          <li>Опытные врачи, современное оборудование и комфортная атмосфера.</li>
          <li>Современная клиника с внимательным отношением к каждому пациенту.</li>
          <li>Ваше здоровье — наша забота.</li>
        </ul>
        <div className="chips">
        
        </div>
        <div className="hero-cta">
          <a className="btn-link primary" href="#book" onClick={(e) => { e.preventDefault(); onOpenBooking && onOpenBooking(); }}>Записаться на приём</a>
        </div>
      </div>
      <div className="hero-right curved" aria-hidden="true" />
    </section>
  )
}

function About() {
  const aboutImages = [
    '/info/XXXL%20(1).webp',
    '/info/XXXL%20(1).webp',
    '/info/XXXL%20(2).webp',
    '/info/XXXL%20(3).webp',
    '/info/XXXL%20(4).webp',
  ]

  const [aboutIndex, setAboutIndex] = useState(0)
  useEffect(() => {
    const id = setInterval(() => {
      setAboutIndex(i => (i + 1) % aboutImages.length)
    }, 4000)
    return () => clearInterval(id)
  }, [])

  return (
    <section id="about" className="section">
      <div className="about-grid">
        <div>
          <h2>О нас</h2>
          <p className="text">ALIF DENT — это пространство современной медицины, где технологии и человеческое внимание соединяются во имя вашего здоровья.</p>
          <p className="text">Мы работаем по международным стандартам и используем передовое оборудование для точной диагностики и эффективного лечения.</p>
          <p className="text">Наша команда врачей — специалисты высокого уровня, для которых важен каждый пациент.</p>
          <p className="text">Мы создаём атмосферу доверия, уюта и заботы, чтобы лечение проходило комфортно и спокойно.</p>
          <p className="text">Каждое обращение к нам — это шаг к здоровью, уверенности и гармонии.</p>
          <p className="text">ALIF DENT — место, где медицина будущего уже сегодня работает для вас.</p>
        </div>
        <div className="slider about-slider" role="region" aria-label="Фотографии клиники">
          <div className="slides" style={{ transform: `translateX(-${aboutIndex * 100}%)` }}>
            {aboutImages.map((src, i) => (
              <img key={i} className="slide" src={src} alt={`ALIF DENT ${i + 1}`} />
            ))}
          </div>
          <div className="slider-controls">
            {aboutImages.map((_, i) => (
              <span key={i} className={`dot${i === aboutIndex ? ' active' : ''}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Collections() {
  return (
    <section id="materials" className="section">
      <div className="kicker">Наши услуги</div>
      <h2>Выберите идеальное решение</h2>
      <div className="grid gallery">
        <div className="card">
          <div className="cover">
            <img src="/995acf1daaea98992a3227f803d62754.jpg" alt="Керамогранит — образец интерьера" />
          </div>
          <h3>Лечение кариеса</h3>
          <p className="text">Незаметные и высокоэстетичные пломбы
Современная анестезия
Рентген-контроль процедуры.</p>
        </div>
        <div className="card">
          <div className="cover">
            <img src="/c2adf943bcb06d2a4b63545ae6b3173b.jpg" alt="HPL‑панели — пример интерьера" />
          </div>
          <h3>Удаление зубов</h3>
          <p className="text">Безболезненные и атравматичные методы удаления
Удаление ретинированных и дистопированных зубов.</p>
        </div>
        <div className="card">
          <div className="cover">
            <img src="/6837735656.jpg" alt="Клинкер — фасад" />
          </div>
          <h3>Протезирование зубов коронками</h3>
          <p className="text">Изготавливаем коронки в срок от 1 дня
Гарантируем эстетичный и долговечный результат
Используем все виды материалов и конструкций.</p>
        </div>
      </div>
    </section>
  )
}

function WhyUs() {
  return (
    <section id="services" className="section">
      <div className="kicker">Наши врачи</div>
      <h2>Выберите лучшего специалиста</h2>
      <div className="grid doctors">
        <div className="doctor-card">
          <img
            className="doctor-photo"
            src="/VRACHI/955da23d030de4bb2311f0e45c8076d2.jpg"
            alt="Ирина Васильевна Чичкова"
          />
          <div className="doctor-info">
            <strong className="doctor-name">Ирина Васильевна Чичкова</strong>
            <p className="text">Специалист по лечению кариеса</p>
            <p className="text">Врач-стоматолог-хирург, челюстно-лицевой хирург</p>
          </div>
        </div>
        <div className="doctor-card">
          <img
            className="doctor-photo"
            src="/VRACHI/2df612c4e1992f701036f697b7bf16e2.jpg"
            alt="Сафронов Павел Валерьевич"
          />
          <div className="doctor-info">
            <strong className="doctor-name">Сафронов Павел Валерьевич</strong>
            <p className="text">Врач-стоматолог-хирург, имплантолог, пародонтолог.</p>
            <p className="text">Специалист по имплантации зубов и направленной костной регенерации.</p>
          </div>
        </div>
        <div className="doctor-card">
          <img
            className="doctor-photo"
            src="/VRACHI/5b62b5f287027706f5cd7b2bfaff462f%20(1).jpg"
            alt="Улик Кадыр Захманович"
          />
          <div className="doctor-info">
            <strong className="doctor-name">Улик Кадыр Захманович</strong>
            <p className="text">Врач-стоматолог-ортопед.</p>
            <p className="text">Специалист по эстетическим реставрациям зубов коронками и винирами.</p>
          </div>
        </div>
        <div className="doctor-card">
          <img
            className="doctor-photo"
            src="/VRACHI/a6c3da99453aa34f9152170295a1ddd4.jpg"
            alt="Залчикова Алина Александровна"
          />
          <div className="doctor-info">
            <strong className="doctor-name">Залчикова Алина Александровна</strong>
            <p className="text">Врач-ортодонт (взрослый и детский), гнатолог.</p>
            <p className="text">Специалист по исправлению прикуса, комплексному восстановлению функций ВНЧС.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Projects() {
  return (
    <section id="projects" className="section">
      <div className="kicker">Наши пациенты</div>
      <h2>Более 300 довольных пациентов</h2>
      <div className="slider" role="region" aria-label="Проекты">
        <div className="slides" style={{transform: 'translateX(0%)'}}>
          <img className="slide" src="/example.png" alt="Проект 1" />
        </div>
        <div className="slider-controls">
          <span className="dot active" />
          <span className="dot" />
          <span className="dot" />
        </div>
      </div>
    </section>
  )
}

function Contacts() {
  return (
    <section id="contacts" className="section">
      <h2>Контакты</h2>
      <div className="contacts">
        <iframe
          className="map"
          title="Yandex Map"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src="https://yandex.ru/map-widget/v1/?lang=ru_RU&ol=biz&oid=84811051954&z=16">
        </iframe>
        <div className="list">
          <div><strong>Стоматология ALIF DENT</strong></div>
          <div>Телефон: <a href="tel:+74957900699">+7 (495) 790-06-99</a></div>
          <div>Сайт: <a href="https://alif-dent.clients.site" target="_blank" rel="noreferrer">alif-dent.clients.site</a></div>
          <div className="socials">
            <a className="icon-btn" href="" target="_blank" rel="noreferrer" aria-label="Telegram">
              <img src="/icons8-telegram-app.svg" alt="Telegram" />
            </a>
            <a className="icon-btn" href="" target="_blank" rel="noreferrer" aria-label="Instagram">
              <img src="/inst.png" alt="Instagram" />
            </a>
            <a className="icon-btn" href="" target="_blank" rel="noreferrer" aria-label="WhatsApp">
              <img src="/icons8-whatsapp.svg" alt="WhatsApp" />
            </a>
          </div>
          <div>
            Адрес: Свободный просп., 28, Москва — <a href="https://yandex.ru/profile/84811051954?lang=ru" target="_blank" rel="noreferrer">Открыть на Яндекс Картах</a>
          </div>
        </div>
      </div>
    </section>
  )
}

function BookingModal({ open, onClose }) {
  const [servicesOpen, setServicesOpen] = useState(false)
  const [serviceQuery, setServiceQuery] = useState("")
  const [selectedServiceIds, setSelectedServiceIds] = useState([])
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date()
    d.setDate(1)
    d.setHours(0,0,0,0)
    return d
  })
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState("")
  const [busyMap, setBusyMap] = useState({}) // { 'YYYY-MM-DD': Set(['09:00', ...]) }
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const { user } = useAuth()

  const filteredServices = SERVICES.filter(s =>
    s.name.toLowerCase().includes(serviceQuery.toLowerCase())
  )

  const toggleService = (id) => {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const selectedServices = SERVICES.filter(s => selectedServiceIds.includes(s.id))
  const selectedSummary = selectedServices.length === 0
    ? 'Выберите услугу'
    : selectedServices.length === 1
      ? `${selectedServices[0].name} — ${selectedServices[0].price.toLocaleString('ru-RU')} ₽`
      : `Выбрано: ${selectedServices.length}`

  const monthLabel = useMemo(() => currentMonth.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' }), [currentMonth])
  const slots = useMemo(() => generateHourlySlots(9, 20), [])

  useEffect(() => {
    if (!open) return
    const fetchBusy = async () => {
      const start = new Date(currentMonth)
      const end = new Date(currentMonth)
      end.setMonth(end.getMonth() + 1)
      end.setDate(0) // last day of current month
      const from = formatDateKey(start)
      const to = formatDateKey(end)
      const { data, error } = await supabase
        .from('bookings')
        .select('date,time')
        .gte('date', from)
        .lte('date', to)
      if (!error && Array.isArray(data)) {
        const next = {}
        for (const row of data) {
          const k = typeof row.date === 'string' ? row.date : formatDateKey(new Date(row.date))
          if (!next[k]) next[k] = new Set()
          if (row.time) next[k].add(row.time)
        }
        setBusyMap(next)
      }
    }
    fetchBusy()
  }, [open, currentMonth])

  const monthDays = useMemo(() => {
    const firstDayIndex = currentMonth.getDay() === 0 ? 6 : currentMonth.getDay() - 1 // Monday-first
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
    const days = []
    for (let i = 0; i < firstDayIndex; i++) days.push(null)
    for (let d = 1; d <= daysInMonth; d++) days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d))
    return days
  }, [currentMonth])

  if (!open) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" aria-label="Закрыть" onClick={onClose}>×</button>
        <h3 className="modal-title">Запись на приём</h3>
        <p className="modal-note">Перезвоним в течение 15 минут (работаем по будням с 8 до 21, по выходным с 9 до 21)</p>
        <form
          className="form-grid"
          onSubmit={async (e) => {
            e.preventDefault()
            setSubmitError("")
            if (!name.trim()) { setSubmitError('Укажите ФИО'); return }
            if (!phone.trim()) { setSubmitError('Укажите телефон'); return }
            if (!selectedDate) { setSubmitError('Выберите дату'); return }
            if (!selectedTime) { setSubmitError('Выберите время'); return }
            if (selectedServiceIds.length === 0) { setSubmitError('Выберите услугу'); return }

            const selectedServices = SERVICES.filter(s => selectedServiceIds.includes(s.id))
            const payload = {
              name: name.trim(),
              phone: phone.trim(),
              date: formatDateKey(selectedDate),
              time: selectedTime,
              services: selectedServices.map(s => ({ id: s.id, name: s.name, price: s.price })),
              total: selectedServices.reduce((sum, s) => sum + (s.price || 0), 0),
              status: 'new',
              cabinet_id: user?.id || null,
            }

            try {
              setSubmitting(true)
              const { error } = await supabase.from('bookings').insert(payload)
              if (error) {
                setSubmitError(error.message || 'Не удалось отправить заявку')
                setSubmitting(false)
                return
              }
              // Update local busy map so the slot becomes disabled immediately
              const key = formatDateKey(selectedDate)
              setBusyMap((prev) => {
                const next = { ...prev }
                const set = new Set(next[key] ? Array.from(next[key]) : [])
                set.add(selectedTime)
                next[key] = set
                return next
              })
              toast.success('Ваша заявка успешно отправлена')
              onClose && onClose()
              setSubmitting(false)
            } catch (err) {
              setSubmitError('Произошла ошибка сети')
              setSubmitting(false)
            }
          }}
        >
          <label className="field">
            <span className="field-label">ФИО *</span>
            <input className="input" type="text" name="name" placeholder="Ваше имя" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label className="field">
            <span className="field-label">Номер телефона *</span>
            <input className="input" type="tel" name="phone" placeholder="+7-(999)-999-99-99" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </label>

          <div className="field">
            <span className="field-label">Выбор услуги</span>
            <button type="button" className={`selectlike ${servicesOpen ? 'open' : ''}`} aria-expanded={servicesOpen} onClick={() => setServicesOpen(o => !o)}>
              <span className="selectlike-text">{selectedSummary}</span>
              <span className="selectlike-caret" aria-hidden>▾</span>
            </button>
            {servicesOpen && (
              <div className="services-select">
                <input
                  className="input"
                  type="text"
                  placeholder="Поиск услуги"
                  value={serviceQuery}
                  onChange={(e) => setServiceQuery(e.target.value)}
                />
                <div className="services-list" role="listbox" aria-label="Перечень услуг">
                  {filteredServices.map((s) => (
                    <label key={s.id} className="service-item">
                      <input
                        type="checkbox"
                        checked={selectedServiceIds.includes(s.id)}
                        onChange={() => toggleService(s.id)}
                      />
                      <span className="service-name">{s.name}</span>
                      <span className="service-price">{s.price.toLocaleString('ru-RU')} ₽</span>
                    </label>
                  ))}
                  {filteredServices.length === 0 && (
                    <div className="service-empty">Ничего не найдено</div>
                  )}
                </div>
                {selectedServices.length > 0 && (
                  <div className="service-summary">Выбрано: {selectedServices.length}</div>
                )}
              </div>
            )}
          </div>

          <div className="field">
            <span className="field-label">Дата и время</span>
            <button type="button" className={`selectlike ${calendarOpen ? 'open' : ''}`} onClick={() => setCalendarOpen(o => !o)}>
              <span className="selectlike-text">{selectedDate ? `${selectedDate.toLocaleDateString('ru-RU')} ${selectedTime || ''}` : 'Выберите дату и время'}</span>
              <span className="selectlike-caret" aria-hidden>▾</span>
            </button>
            {calendarOpen && (
              <div className="calendar">
                <div className="cal-header">
                  <button type="button" className="cal-nav" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}>←</button>
                  <div className="cal-title">{monthLabel}</div>
                  <button type="button" className="cal-nav" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}>→</button>
                </div>
                <div className="cal-grid cal-weekdays">
                  <div>Пн</div><div>Вт</div><div>Ср</div><div>Чт</div><div>Пт</div><div>Сб</div><div>Вс</div>
                </div>
                <div className="cal-grid cal-days">
                  {monthDays.map((d, i) => {
                    if (!d) return <div key={i} />
                    const isPast = d < new Date(new Date().toDateString())
                    const key = formatDateKey(d)
                    const daySet = busyMap[key] || new Set()
                    const allowedBusyCount = slots.reduce((cnt, t) => cnt + (daySet.has(t) ? 1 : 0), 0)
                    const allBusy = allowedBusyCount >= slots.length
                    const disabled = isPast || allBusy
                    return (
                      <button
                        key={i}
                        type="button"
                        className={`cal-day${selectedDate && formatDateKey(selectedDate) === key ? ' selected' : ''}`}
                        disabled={disabled}
                        onClick={() => { setSelectedDate(d); setSelectedTime('') }}
                      >
                        {d.getDate()}
                      </button>
                    )
                  })}
                </div>
                {selectedDate && (
                  <div className="times">
                    {slots.map((t) => {
                      const busy = (busyMap[formatDateKey(selectedDate)] || new Set()).has(t)
                      return (
                        <button
                          key={t}
                          type="button"
                          className={`time${selectedTime === t ? ' selected' : ''}`}
                          disabled={busy}
                          onClick={() => setSelectedTime(t)}
                        >{t}</button>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          <label className="check">
            <input type="checkbox" required />
            <span>Я даю своё согласие на обработку компанией ООО "ALIF DENT" моих персональных данных в соответствии с требованиями ФЗ от 27.07.2006г. № 152-ФЗ «О персональных данных» и Политикой обработки и защиты персональных данных. *</span>
          </label>
          {submitError && <div className="text" style={{ color: 'var(--brand)' }}>{submitError}</div>}
          <div className="modal-actions">
            <button type="submit" className="btn primary" disabled={submitting}>{submitting ? 'Отправка…' : 'Отправить'}</button>
            <div className="modal-alt">
              <span>Другие способы связи:</span>
              <a className="icon-btn" href="" target="_blank" rel="noreferrer" aria-label="Telegram">
                <img src="/icons8-telegram-app.svg" alt="Telegram" />
              </a>
              <a className="icon-btn" href="" target="_blank" rel="noreferrer" aria-label="WhatsApp">
                <img src="/icons8-whatsapp.svg" alt="WhatsApp" />
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  return (
    <div className="site">
      <Header onOpenLogin={() => setIsLoginOpen(true)} />
      <ScrollManager />
      <main>
        <Outlet />
      </main>
      <footer className="footer">© {new Date().getFullYear()} ALIF DENT</footer>
            {isLoginOpen && (
  <div className="modal-backdrop" onClick={() => setIsLoginOpen(false)}>
    <div className="modal login-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
      <button className="modal-close" aria-label="Закрыть" onClick={() => setIsLoginOpen(false)}>×</button>
      <h3 className="modal-title">Войти</h3>
      <div className="modal-body center-login">
        <Login onSuccess={() => setIsLoginOpen(false)} />
      </div>
    </div>
  </div>
)}
    </div>
  )
}

// Pages
export function HomePage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  return (
    <>
      <Hero onOpenBooking={() => setIsBookingOpen(true)} />
      <Collections />
      <WhyUs />
      <Projects />
      <BookingModal open={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </>
  )
}

export function AboutPage() {
  const aboutImages = [
    '/info/XXXL.webp',
    '/info/XXXL%20(1).webp',
    '/info/XXXL%20(2).webp',
    '/info/XXXL%20(3).webp',
    '/info/XXXL%20(4).webp',
  ]
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % aboutImages.length), 4000)
    return () => clearInterval(id)
  }, [])

  return (
    <>
      <section className="about-hero" aria-label="Фотографии клиники">
        <div className="slider fullscreen" role="region">
          <div className="slides" style={{ transform: `translateX(-${index * 100}%)` }}>
            {aboutImages.map((src, i) => (
              <img key={i} className="slide" src={src} alt={`ALIF DENT ${i + 1}`} />
            ))}
          </div>
          <div className="slider-controls">
            {aboutImages.map((_, i) => (
              <span key={i} className={`dot${i === index ? ' active' : ''}`} />
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="section">
        <div>
          <h2>О нас</h2>
          <p className="text">ALIF DENT — это пространство современной медицины, где технологии и человеческое внимание соединяются во имя вашего здоровья.</p>
          <p className="text">Мы работаем по международным стандартам и используем передовое оборудование для точной диагностики и эффективного лечения.</p>
          <p className="text">Наша команда врачей — специалисты высокого уровня, для которых важен каждый пациент.</p>
          <p className="text">Мы создаём атмосферу доверия, уюта и заботы, чтобы лечение проходило комфортно и спокойно.</p>
          <p className="text">Каждое обращение к нам — это шаг к здоровью, уверенности и гармонии.</p>
          <p className="text">ALIF DENT — место, где медицина будущего уже сегодня работает для вас.</p>
        </div>
      </section>
    </>
  )
}

export function ContactsPage() {
  return (
    <>
      <Contacts />
    </>
  )
}

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1))
      if (target) {
        target.scrollIntoView()
        return
      }
    }
    window.scrollTo({ top: 0, left: 0 })
  }, [pathname, hash])
  return null
}
