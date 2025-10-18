import './App.css'
import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

function Header() {
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
        <Link to="/contacts" className="contact-pill">Связаться</Link>
      </div>
    </header>
  )
}

function Hero({ onOpenBooking }) {
  return (
    <section id="top" className="hero homelo">
      <div className="bg-word" aria-hidden="true">CLINIC</div>
      <div className="hero-left">
        <img className="hero-logo" src="/logo(1).png" alt="ALIF DENT" />
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
      <div className="hero-right curved" aria-hidden="true">
        <img className="hero-photo" src="/main.png" alt="Вентфасад" />
      </div>
    </section>
  )
}

function About() {
  const aboutImages = [
    '/info/XXXL.webp',
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
  if (!open) return null
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" aria-label="Закрыть" onClick={onClose}>×</button>
        <h3 className="modal-title">Запись на приём</h3>
        <p className="modal-note">Перезвоним в течение 15 минут (работаем по будням с 8 до 21, по выходным с 9 до 21)</p>
        <form className="form-grid" onSubmit={(e) => { e.preventDefault(); onClose && onClose(); }}>
          <label className="field">
            <span className="field-label">ФИО *</span>
            <input className="input" type="text" name="name" placeholder="Ваше имя" required />
          </label>
          <label className="field">
            <span className="field-label">Номер телефона *</span>
            <input className="input" type="tel" name="phone" placeholder="+7-(999)-999-99-99" required />
          </label>
          <label className="check">
            <input type="checkbox" required />
            <span>Я даю своё согласие на обработку компанией ООО "ALIF DENT" моих персональных данных в соответствии с требованиями ФЗ от 27.07.2006г. № 152-ФЗ «О персональных данных» и Политикой обработки и защиты персональных данных. *</span>
          </label>
          <div className="modal-actions">
            <button type="submit" className="btn primary">Отправить</button>
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
  return (
    <div className="site">
      <Header />
      <ScrollManager />
      <main>
        <Outlet />
      </main>
      <footer className="footer">© {new Date().getFullYear()} ALIF DENT</footer>
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
