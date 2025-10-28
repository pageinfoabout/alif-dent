import './App.css'
import { useEffect, useMemo, useState } from 'react'
import { Link, Outlet, useLocation, useOutletContext} from 'react-router-dom'
import { toast } from 'react-hot-toast'
import Login from './pages/Login.jsx'
import supabase from './lib/supabase.js'
import { useAuth } from './lib/auth.jsx'

// Лабораторные конструкции
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
  // --- Ортодонтия ---
  { id: 'serv-diagnosis-plan', name: 'Диагностика с составлением плана лечения', price: 4500 },
  { id: 'serv-braces-h4-fixation-one-arch', name: 'Фиксация самолигирующей брекет-системы H4 (1 зубной ряд)', price: 45000 },
  { id: 'serv-braces-activation-level1', name: 'Активация брекет-системы 1 степени сложности', price: 6000 },
  { id: 'serv-braces-activation-level2', name: 'Активация брекет-системы 2 степени сложности', price: 7000 },
  { id: 'serv-braces-activation-level3', name: 'Активация брекет-системы 3 степени сложности', price: 8000 },
  { id: 'serv-retention-plate', name: 'Ретенционная пластинка', price: 15000 },
  { id: 'serv-retainer-repair-one-link', name: 'Починка ретейнера (1 звено)', price: 1000 },
  { id: 'serv-rapid-palatal-expansion', name: 'Ортодонтическое лечение несъемным аппаратом для быстрого небного расширени (Haas, Marco-Rossa)', price: 30000 },
  { id: 'serv-followup-removable-fixed-appliance', name: 'Повторный прием на этапе лечения со съемным, несъемным ортодонтическим аппаратом', price: 2000 },
  { id: 'serv-trg-interpretation', name: 'Описание и интерпретация рентгенографических изображений ТРГ (1 снимок)', price: 1100 },
  { id: 'serv-ortho-correction-fixed-appliance', name: 'Ортодонтическая коррекция несъемным ортодонтическим аппаратом', price: 5000 },
  { id: 'serv-ortho-correction-fixed-appliance-ring-spacer', name: 'Ортодонтическая коррекция несъемным ортодонтическим аппаратом кольцо с распоркой', price: 8500 },
  { id: 'serv-remove-braces-with-retainer', name: 'Снятие брекет-системы (с фиксацией ретейнера)', price: 10000 },
  { id: 'serv-retainer-single-tooth', name: 'Ортодонтическая коррекция несъемным ортодонтическим аппаратом: фиксация ретейнера на 1 зуб', price: 1000 },
  { id: 'serv-ortho-correction-removable-single-arch', name: 'Ортодонтическая коррекция съемным ортодонтическим аппаратом одночелюстным', price: 15000 },
  { id: 'serv-ortho-correction-removable-twin-block', name: 'Ортодонтическая коррекция съемным ортодонтическим аппаратом двухчелюстным (Twin Block)', price: 30000 },
  { id: 'serv-ortho-correction-trainer', name: 'Ортодонтическая коррекция съемным ортодонтическим аппаратом ТРЕЙНЕРОМ', price: 10000 },
  { id: 'serv-ortho-correction-stabilizing-cap-ret-plate', name: 'Ортодонтическая коррекция съемным ортодонтическим аппаратом: стабилизирующая ортодонтическая каппа, ретенционная пластинка', price: 4000 },
  { id: 'serv-ortho-activation-removable', name: 'Ортодонтическая коррекция :активация съемного аппарата', price: 600 },
  { id: 'serv-ortho-metal-braces', name: 'Ортодонтическая коррекция с применением брекет-системы металлической (система BioMim, MBT (USA))', price: 60000 },
  { id: 'serv-clarity-advance', name: 'Ортодонтическая коррекция с применением брекет-системы Clarity Advance', price: 110000 },
  { id: 'serv-h4-selfligating', name: 'Ортодонтическая коррекция с применением брекет-системы H4 (самолигирующие)', price: 90000 },
  { id: 'serv-damon-q', name: 'Ортодонтическая коррекция с применением брекет-системы Damon Q (самолигирующие брекеты)', price: 100000 },
  { id: 'serv-damon-clear', name: 'Ортодонтическая коррекция с применением брекет-системы Damon Clear (самолигирующие брекеты)', price: 140000 },
  { id: 'serv-damon-combined-clear-q', name: 'Ортодонтическая коррекция с применением брекет-системы комбинированной (Damon Clear/Damon Q)', price: 120000 },
  { id: 'serv-combined-idlogical-biomim-6upper', name: 'Ортодонтическая коррекция с применением брекет-системы комбинированной (ID-Logical+BioMim) (6 зубов верхней челюсти)', price: 90000 },
  { id: 'serv-activation-level1-one-arch', name: 'Ортодонтическая коррекция :активация брекет-системы 1 степени сложности (одна челюсть)', price: 1500 },
  { id: 'serv-activation-level1-two-arch', name: 'Ортодонтическая коррекция :активация брекет-системы 1 степени сложности (две челюсти)', price: 3000 },
  { id: 'serv-activation-level2-one-arch', name: 'Ортодонтическая коррекция :активация брекет-системы 2 степени сложности (одна челюсть)', price: 2000 },
  { id: 'serv-activation-level2-two-arch', name: 'Ортодонтическая коррекция :активация брекет-системы 2 степени сложности (две челюсти)', price: 4000 },
  { id: 'serv-activation-level3-one-arch', name: 'Ортодонтическая коррекция :активация брекет-системы 3 степени сложности (одна челюсть)', price: 2500 },
  { id: 'serv-activation-level3-two-arch', name: 'Ортодонтическая коррекция :активация брекет-системы 3 степени сложности (две челюсти)', price: 5000 },
  { id: 'serv-refix-bracket-foreign-clinic', name: 'Ортодонтическая коррекция: повторная фиксация элемента брекет-системы (для сторонних клиник)', price: 2500 },
  { id: 'serv-lingual-button-install', name: 'Ортодонтическая коррекция с установкой лингвальной кнопки', price: 1000 },
  { id: 'serv-ring-install', name: 'Ортодонтическая коррекция с установкой кольца', price: 2000 },
  { id: 'serv-intermaxillary-elastics', name: 'Ортодонтическая коррекция прикуса с использованием межчелюстной тяги', price: 500 },
  { id: 'serv-fake-tooth-on-arch', name: 'Ортодонтическая коррекция с фиксацией искусственного зуба на дугу', price: 3500 },
  { id: 'serv-ortho-ring-fabrication', name: 'Изготовление кольца ортодонтического', price: 8500 },
  { id: 'serv-vestibular-plate', name: 'Изготовление пластинки вестибулярной', price: 12500 },
  { id: 'serv-tongue-crib-plate', name: 'Изготовление пластинки с заслоном для языка (без кламмеров)', price: 22000 },
  { id: 'serv-occlusal-ramp-plate', name: 'Изготовление пластинки с окклюзионными накладками', price: 19500 },
  { id: 'serv-positioner', name: 'Изготовление позиционера', price: 22000 },
  { id: 'serv-aligner-fabrication', name: 'Изготовление элайнера', price: 9500 },
  { id: 'serv-removable-plate-inclined-plane', name: 'Изготовление съемной пластинки с наклонной плоскостью', price: 23000 },
  { id: 'serv-appliance-saw-through-screw', name: 'Распил ортодонтического аппарата через винт', price: 1500 },
  { id: 'serv-ortho-polishing', name: 'Полирование ортодонтической конструкции', price: 500 },
  // --- Детская стоматология / гигиена ---
  { id: 'peds-tooth-vital-stain', name: 'Витальное окрашивание твердых тканей зуба (1 зуб)', price: 200 },
  { id: 'peds-mucosa-medication', name: 'Аппликация лекарственного препарата на слизистую оболочку полости рта у детей', price: 250 },
  { id: 'peds-remineralization-local', name: 'Местное применение реминерализующих препаратов в области зуба у детей', price: 200 },
  { id: 'peds-deep-fluoridation', name: 'Глубокое фторирование эмали зуба у детей', price: 1000 },
  { id: 'peds-oral-hygiene-training', name: 'Обучение гигиене полости рта и зубов индивидуальное, подбор средств и предметов гигиены полости рта у детей', price: 500 },
  { id: 'peds-pro-hygiene-both-arches', name: 'Профессиональная гигиена полости рта и зубов временных зубов (обе челюсти)', price: 2500 },
  { id: 'peds-plaque-removal-one-tooth', name: 'Профессиональная гигиена полости рта и зубов временных зубов (снятие мягкого налета с одного зуба)', price: 100 },
  { id: 'peds-psych-prevent-school', name: 'Школа психологической профилактики для пациентов и родственников (адаптивный прием)', price: 500 },
  { id: 'peds-fissure-sealant-invasive', name: 'Запечатывание фиссур герметиком инвазивным методом (за один зуб) у детей', price: 2500 },
  { id: 'peds-fissure-sealant-noninvasive', name: 'Запечатывание фиссуры зуба герметиком неинвазивным методом (за один зуб) у детей', price: 2000 },
  { id: 'peds-restoration-temporary-gic-1-5-6', name: 'Восстановление зуба временного пломбой I,V,VI класс по Блэку с использованием стеклоиномерных цементов у детей', price: 1200 },
  { id: 'peds-restoration-temporary-gic-2-3', name: 'Восстановление зуба временного пломбой II,III класс по Блэку с использованием стеклоиномерных цементов у детей', price: 1400 },
  { id: 'peds-restoration-temporary-gic-4', name: 'Восстановление зуба временного пломбой IV класс по Блэку с использованием стеклоиномерных цементов у детей', price: 1600 },
  { id: 'peds-restoration-temporary-composite-1-5-6', name: 'Восстановление зуба временного пломбой I, V, VI класс по Блэку с использованием материалов из фотополимеров у детей', price: 2000 },
  { id: 'peds-restoration-temporary-composite-2-3-contact', name: 'Восстановление зуба временного пломбой с нарушением контактного пункта II, III класс по Блэку с использованием материалов из фотополимеров у детей', price: 2000 },
  { id: 'peds-restoration-temporary-composite-4', name: 'Восстановление зуба временного пломбой IV класс по Блэку с использованием материалов из фотополимеров у детей', price: 2200 },
  { id: 'peds-restoration-permanent-composite-1-5-6', name: 'Восстановление зуба постоянного пломбой I,V,VI класс по Блэку с использованием материалов из фотополимеров у детей', price: 2700 },
  { id: 'peds-restoration-permanent-composite-2-3', name: 'Восстановление зуба постоянного пломбой II,III класс по Блэку с использованием материалов из фотополимеров у детей', price: 2900 },
  { id: 'peds-restoration-permanent-composite-4', name: 'Восстановление зуба постоянного пломбой IV класс по Блэку с использованием материалов из фотополимеров у детей', price: 3100 },
  { id: 'peds-temp-filling', name: 'Наложение временной пломбы у детей', price: 300 },
  { id: 'peds-devital-paste', name: 'Наложение девитализирующей пасты у детей', price: 300 },
  { id: 'peds-extirpation-pulp', name: 'Экстирпация пульпы', price: 1200 },
  { id: 'peds-pulpotomy-medicine', name: 'Пульпотомия (ампутация коронковой пульпы) временного зуба с наложением лекарственного вещества', price: 3500 },
  { id: 'peds-pulpotomy-vital', name: 'Пульпотомия (ампутация коронковой пульпы): лечение пульпита временного зуба методом витальной ампутации', price: 3500 },
  { id: 'peds-pulpotomy-devital', name: 'Пульпотомия (ампутация коронковой пульпы): лечение пульпита временного зуба методом девитальной ампутации', price: 1300 },
  { id: 'peds-ultrasound-canal-widening', name: 'Ультразвуковое расширение корневого канала зуба', price: 400 },
  { id: 'peds-gutta-canal-unfill-paste', name: 'Распломбировка корневого канала ранее леченного пастой', price: 900 },
  { id: 'peds-unfill-phosphate-resorcinol', name: 'Распломбировка корневого канала ранее леченного фосфат-цементом/ резорцин-формальдегидным методом', price: 1300 },
  { id: 'peds-instrument-medication-canal', name: 'Инструментальная и медикаментозная обработка корневого канала у детей', price: 500 },
  { id: 'peds-instrument-medication-good', name: 'Инструментальная и медикаментозная обработка хорошо проходимого корневого канала у детей', price: 1520 },
  { id: 'peds-instrument-medication-bad', name: 'Инструментальная и медикаментозная обработка плохо проходимого корневого канала у детей', price: 1700 },
  { id: 'peds-gutta-hybrid', name: 'Пломбирование корневого канала зуба гуттаперчей гибридным методом у детей', price: 1300 },
  { id: 'peds-gutta-vertical', name: 'Пломбирование корневого канала зуба гуттаперчей вертикальной конденсацией у детей', price: 1400 },
  { id: 'peds-canal-perf-repair', name: 'Закрытие перфорации стенки корневого канала зуба у детей', price: 900 },
  { id: 'peds-canal-paste', name: 'Пломбирование корневого канала зуба пастой у детей', price: 400 },
  { id: 'peds-canal-temp-med', name: 'Временное пломбирование лекарственным препаратом корневого канала зуба у детей', price: 600 },
  // --- Хирургия / пародонтология ---
  { id: 'surg-oral-dressing', name: 'Наложение повязки при операциях в полости рта', price: 800 },
  { id: 'surg-extract-primary', name: 'Удаление временного зуба', price: 2500 },
  { id: 'surg-extract-permanent', name: 'Удаление постоянного зуба', price: 3500 },
  { id: 'surg-extract-complicated-root-separation', name: 'Удаление зуба сложное с разъединением корней', price: 5000 },
  { id: 'surg-extract-complicated-socket-conservation', name: 'Удаление зуба сложное с консервацией лунки', price: 6000 },
  { id: 'surg-remove-mobile-wall', name: 'Удаление подвижной стенки постоянного зуба', price: 1000 },
  { id: 'surg-apicoectomy', name: 'Резекция верхушки корня', price: 12000 },
  { id: 'surg-incision-submucosal', name: 'Вскрытие подслизистого или поднадкостничного очага воспаления в полости рта', price: 1500 },
  { id: 'surg-incision-drain-abscess', name: 'Вскрытие и дренирование одонтогенного абсцесса', price: 1500 },
  { id: 'surg-delayed-curettage', name: 'Отсроченный кюретаж лунки удаленного зуба', price: 1000 },
  { id: 'surg-cystotomy-cystectomy', name: 'Цистотомия или цистэктомия', price: 8000 },
  { id: 'surg-alveolar-process-plasty', name: 'Пластика альвеолярного отростка', price: 15000 },
  { id: 'surg-impacted-tooth-removal-simple', name: 'Операция удаления ретинированного, дистопированного или сверхкомплектного зуба (простая)', price: 5000 },
  { id: 'surg-impacted-tooth-removal-complex', name: 'Операция удаления ретинированного, дистопированного или сверхкомплектного зуба (сложная)', price: 10000 },
  { id: 'perio-gingivectomy', name: 'Гингивэктомия', price: 1500 },
  { id: 'perio-open-curettage', name: 'Открытый кюретаж при заболеваниях пародонта в области зуба', price: 3000 },
  { id: 'perio-closed-curettage', name: 'Закрытый кюретаж при заболеваниях пародонта в области зуба', price: 2000 },
  { id: 'perio-flap-surgery', name: 'Лоскутная операция в полости рта', price: 12000 },
  { id: 'surg-bone-graft-bioresorbable-05g', name: 'Костная пластика челюстно-лицевой области с применением биодеградируемых материалов 1 ед (0,5гр)', price: 15000 },
  { id: 'surg-bone-graft-membrane', name: 'Костная пластика челюстно-лицевой области с применением биодеградируемых материалов (мембрана) 1 ед.', price: 18000 },
  { id: 'surg-bone-graft-ridge-split', name: 'Костная пластика челюстно-лицевой области :расщепление альвеолярного гребня.', price: 15000 },
  { id: 'surg-exostosis-removal', name: 'Костная пластика (удаление экзостоза)', price: 2000 },
  { id: 'surg-autobone-scraper', name: 'Костная пластика: забор аутокости с помощью костного скребка', price: 25000 },
  { id: 'surg-frenulum-upper-lip', name: 'Пластика уздечки верхней губы', price: 5000 },
  { id: 'surg-frenulum-lower-lip', name: 'Пластика уздечки нижней губы', price: 5000 },
  { id: 'surg-frenulum-tongue', name: 'Пластика уздечки языка', price: 4000 },
  { id: 'surg-vestibuloplasty-segment', name: 'Вестибулопластика (сегмент)', price: 12000 },
  { id: 'surg-sinus-lift-closed', name: 'Синус-лифтинг закрытый', price: 20000 },
  { id: 'surg-sinus-lift-open', name: 'Синус-лифтинг открытый', price: 30000 },
  { id: 'surg-pericoronitis-treatment', name: 'Лечение перикоронорита (промывание, рассечение и/или иссечение капюшона)', price: 3000 },
  { id: 'perio-gingivoplasty', name: 'Гингивопластика', price: 9000 },
  { id: 'perio-gingivotomy', name: 'Гингивотомия', price: 4000 },
  { id: 'surg-socket-bleeding-stop', name: 'Остановка луночного кровотечения без наложения швов с использованием гемостатических материалов', price: 1000 },
  { id: 'surg-maxillary-sinus-perforation-plasty', name: 'Пластика перфорации верхнечелюстной пазухи', price: 11000 },
  { id: 'surg-oral-mucosa-suture', name: 'Наложение шва на слизистую оболочку рта', price: 1000 },
  //наложение пасты 
  { "id": "endo-devital-paste", "name": "Наложение девитализирующей пасты", "price": 800 },
  { "id": "endo-ultrasound-expansion", "name": "Ультразвуковое расширение корневого канала зуба", "price": 1500 },
  { "id": "endo-unfill-paste", "name": "Распломбировка корневого канала ранее леченного пастой", "price": 2000 },
  { "id": "endo-unfill-phosphate-resorcin", "name": "Распломбировка корневого канала ранее леченного фосфат-цементом/резорцин-формальдегидным методом", "price": 3000 },
  { "id": "endo-unfill-guttapercha", "name": "Распломбировка корневого канала ранее запломбированного гуттаперчей", "price": 2000 },
  { "id": "endo-partial-unfill", "name": "Частичная распломбировка корневого канала", "price": 800 },
  { "id": "endo-cleaning-basic", "name": "Инструментальная и медикаментозная обработка корневого канала", "price": 1000 },
  { "id": "endo-cleaning-easy", "name": "Инструментальная и медикаментозная обработка хорошо проходимого корневого канала", "price": 2000 },
  { "id": "endo-cleaning-hard", "name": "Инструментальная и медикаментозная обработка плохо проходимого корневого канала", "price": 3000 },
  { "id": "endo-temp-filling", "name": "Временное пломбирование лекарственным препаратом корневого канала", "price": 1000 },
  { "id": "endo-saf-primary", "name": "Инструментальная и медикаментозная обработка корневого канала SAF-системой первично", "price": 2500 },
  { "id": "endo-saf-secondary", "name": "Инструментальная и медикаментозная обработка корневого канала SAF-системой повторно", "price": 1000 },
  { "id": "endo-laser-treatment", "name": "Инструментальная и медикаментозная обработка корневого канала с использованием диодного лазера", "price": 2000 },
  { "id": "endo-cofferdam", "name": "Инструментальная и медикаментозная обработка корневого канала с использованием системы изоляции коффердам", "price": 1000 },
  { "id": "endo-optragate", "name": "Инструментальная и медикаментозная обработка корневого канала с использованием системы изоляции оптрагейт", "price": 800 },
  { "id": "endo-filling-paste", "name": "Пломбирование корневого канала зуба пастой", "price": 1000 },
  { "id": "endo-filling-guttapercha", "name": "Пломбирование корневого канала зуба гуттаперчивыми штифтами", "price": 2000 },
  { "id": "endo-perforation-repair", "name": "Закрытие перфорации стенки корневого канала зуба", "price": 1500 },
  { "id": "endo-vertical-filling", "name": "Пломбирование корневого канала зуба вертикальным методом", "price": 2000 },
  { "id": "endo-post-fixation", "name": "Фиксация внутриканального штифта/вкладки", "price": 1500 },
  { "id": "endo-post-removal", "name": "Удаление внутриканального штифта/вкладки", "price": 2000 },
  { "id": "endo-temp-filling-removal", "name": "Снятие временной пломбы", "price": 200 },
  { "id": "endo-permanent-filling-removal", "name": "Снятие постоянной пломбы", "price": 500 },

  //пломбирование зубов
  { "id": "restoration-filling-basic", "name": "Восстановление зуба пломбой", "price": 3000 },
  { "id": "restoration-filling-class4-gi", "name": "Восстановление зуба пломбой IV класс по Блэку с использованием стеклоиномерных цементов", "price": 3500 },
  { "id": "restoration-temp-filling", "name": "Наложение временной пломбы", "price": 500 },
  { "id": "restoration-filling-class1-5-6-photo", "name": "Восстановление зуба пломбой I, V, VI класс по Блэку с использованием материалов из фотополимеров", "price": 3000 },
  { "id": "restoration-filling-class2-3-photo", "name": "Восстановление зуба пломбой с нарушением контактного пункта II, III класс по Блэку с использованием материалов из фотополимеров", "price": 3500 },
  { "id": "restoration-filling-class4-photo", "name": "Восстановление зуба пломбой IV класс по Блэку с использованием материалов из фотополимеров", "price": 3500 },
  { "id": "restoration-preendo-photo", "name": "Восстановление стенок зуба фотополимерной пломбой перед эндодонтическим лечением", "price": 1500 },
  { "id": "restoration-icon", "name": "Восстановление зуба по технологии ICON", "price": 5000 },
  { "id": "restoration-base-isolation", "name": "Использование изолирующей прокладки", "price": 500 },
  { "id": "restoration-base-medicinal", "name": "Использование лечебной прокладки (прямое или непрямое покрытие пульпы зуба)", "price": 1000 },
  { "id": "restoration-cofferdam", "name": "Восстановление зуба пломбой с использованием системы изоляции коффердам", "price": 1000 },
  { "id": "restoration-optragate", "name": "Восстановление зуба пломбой с использованием системы изоляции оптрагейт", "price": 800 },
  { "id": "restoration-inlay-veneer-photo", "name": "Восстановление зуба вкладками, виниром, полукоронкой из фотополимерного материала прямым методом", "price": 10000 },
  { "id": "restoration-polishing", "name": "Избирательное полирование зуба", "price": 800 },
  { "id": "restoration-post-filling", "name": "Восстановление зуба пломбировочными материалами с использованием штифтов", "price": 4000 },
  { "id": "restoration-trepanation", "name": "Трепанация зуба, искусственной коронки", "price": 800 },
  { "id": "restoration-skyce", "name": "Фиксация скайса", "price": 2500 },
  //восстановление зубов с использованием штифтов
  { "id": "ortho-tooth-prep", "name": "Сошлифовывание твердых тканей зуба для последующего восстановления вкладкой, накладкой, полукоронкой, коронкой, виниром", "price": 1500 },
  { "id": "ortho-temp-crown-direct", "name": "Восстановление зуба коронкой временной прямым методом", "price": 2000 },
  { "id": "ortho-temp-crown-cadcam", "name": "Восстановление зуба коронкой временной композитной фрезерованной лабораторным методом", "price": 4000 },
  { "id": "ortho-metalceramic-standard", "name": "Восстановление зуба коронкой постоянной металлокерамической стандартной", "price": 10000 },
  { "id": "ortho-metalceramic-aesthetic", "name": "Восстановление зуба коронкой постоянной металлокерамической с плечевой массой и индивидуальным воспроизведением эстетики на зубы в линии улыбки", "price": 12000 },
  { "id": "ortho-zirconia-standard", "name": "Восстановление зуба коронкой постоянной безметалловой из диоксида циркония стандартная эстетика (метод окрашивания)", "price": 18000 },
  { "id": "ortho-zirconia-emax", "name": "Восстановление зуба коронкой постоянной безметалловой цельнокерамической диоксид циркония или Е-мах с индивидуальной эстетикой (метод нанесения)", "price": 20000 },
  { "id": "ortho-cast-crown", "name": "Восстановление зуба коронкой цельнолитой", "price": 4000 },
  { "id": "ortho-longterm-plastic-crown", "name": "Восстановление зуба долговременной пластмассовой композитной коронкой", "price": 5000 },
  { "id": "ortho-inlay-veneer-emax", "name": "Восстановление зуба вкладками, виниром из материала Е-мах, диоксида циркония", "price": 20000 },
  { "id": "ortho-temp-veneer", "name": "Восстановление зуба временным виниром", "price": 2000 },
  { "id": "ortho-aesthetic-veneer", "name": "Восстановление зуба виниром, полукоронкой, коронкой в области эстетически-значимой зоны из материала Е-мах, диоксида циркония", "price": 25000 },
  { "id": "ortho-cast-core-crown", "name": "Восстановление зуба коронкой с использованием цельнолитой культевой вкладки", "price": 3000 },
  { "id": "ortho-cast-core-emax", "name": "Восстановление зуба коронкой с использованием цельнолитой культевой вкладки, облицованной керамикой Е-мах", "price": 4000 },
  { "id": "ortho-fluorination", "name": "Глубокое фторирование твердых тканей зубов для сохранения витальности при сошлифовывании твердых тканей под ортопедическую конструкцию (1 зуб)", "price": 800 },
  { "id": "ortho-cast-post-tooth", "name": "Изготовление литого штифтового зуба", "price": 9000 },
  //Исследования и диагностика

  { "id": "diag-biopsy-oral", "name": "Взятие образца биологического материала из очагов поражения органов рта", "price": 2500 },
  { "id": "diag-oral-hygiene-index", "name": "Определение индексов гигиены полости рта", "price": 1000 },
  { "id": "diag-tooth-thermodiagnosis", "name": "Термодиагностика зуба", "price": 500 },
  { "id": "diag-jaw-models", "name": "Исследование на диагностических моделях челюстей", "price": 1000 },
  { "id": "diag-anthropometric-photo", "name": "Антропометрические исследования (медицинское фотографирование)", "price": 1000 },
  { "id": "diag-xray-intraoral", "name": "Прицельная внутриротовая контактная рентгенография", "price": 350 },
  { "id": "diag-orthopantomogram", "name": "Ортопантомография", "price": 1300 },
  { "id": "diag-orthopantomogram-repeat", "name": "Ортопантомография повторная", "price": 900 },
  { "id": "diag-teleradiography-jaw", "name": "Телерентгенография челюстей", "price": 1300 },
  { "id": "diag-ct-maxillofacial-2jaw", "name": "Компьютерная томография челюстно-лицевой области 2-х челюстей", "price": 4000 },
  { "id": "diag-ct-maxillofacial-repeat", "name": "Компьютерная томография челюстно-лицевой области повторная (после лечебных манипуляций)", "price": 2000 },
  { "id": "diag-ct-maxillofacial-regular", "name": "Компьютерная томография челюстно-лицевой области для постоянных пациентов", "price": 2000 },
  { "id": "diag-teleradiography-lateral", "name": "Телерентгенография черепа в боковой проекции", "price": 1300 },
  { "id": "diag-3d-intraoral-scan", "name": "3D внутриротовое сканирование", "price": 4000 },


  //Съемные протезы
  { "id": "prosthesis-partial-acrylic-6", "name": "Протезирование частичными съемными пластиночными протезами (Акрил): не более 6 искусственных зубов в протезе", "price": 18000 },
  { "id": "prosthesis-partial-acrylic-cosmetic-3", "name": "Протезирование частичными съемными пластиночными протезами Акрил (косметический протез до 3х искусственных зубов)", "price": 5000 },
  { "id": "prosthesis-partial-acryfree-6plus", "name": "Протезирование зубов частичными съемными пластиночными протезами (Acry free): более 6 искусственных зубов в протезе", "price": 25000 },
  { "id": "prosthesis-full-acrylic", "name": "Протезирование зубов полными съемными пластиночными протезами (Акрил)", "price": 18000 },
  { "id": "prosthesis-bugel-clasp", "name": "Протезирование съемными бюгельными протезами с кламмерной фиксацией (1 челюсть): 2 опорно-удерживающих кламмера", "price": 45000 },
  { "id": "prosthesis-bugel-arch", "name": "Протезирование съемным бюгельным протезом: дуга протеза", "price": 18000 },
  { "id": "prosthesis-bugel-base", "name": "Протезирование съемным бюгельным протезом: базис", "price": 5000 },
  { "id": "prosthesis-bugel-tooth-plastic", "name": "Протезирование съемным бюгельным протезом: зуб пластмассовый (1 ед.)", "price": 1500 },
  { "id": "prosthesis-bugel-tooth-composite", "name": "Протезирование съемным бюгельным протезом: зуб композитный", "price": 2500 },
  { "id": "prosthesis-bugel-lock", "name": "Протезирование съемными бюгельными протезами с замковой фиксацией: фрикционный штифт, СЕКА, рельсовые (1 ед.)", "price": 8000 },
  { "id": "prosthesis-bugel-attachment-sae", "name": "Протезирование съемным бюгельным протезом :поворотные аттачмены SAE (1 ед.)", "price": 10000 },
  { "id": "prosthesis-bugel-telescope", "name": "Протезирование съемными бюгельными протезами с телескопической фиксацией (1 ед. без облицовки)", "price": 13000 },
  { "id": "prosthesis-bugel-lock-facing", "name": "Протезирование съемным бюгельным протезом (облицовка вторичной части замка)", "price": 8000 },
  { "id": "prosthesis-periodontic-shining", "name": "Постоянное шинирование цельнолитыми съемными конструкциями при заболеваниях пародонта (шинирующий бюгель на 1 челюсть)", "price": 35000 },

  //Имплантация зубов
  { "id": "implant-zirconia-screw-standard", "name": "Протезирование зуба с использованием имплантата коронкой постоянной безметалловой из диоксида циркония с винтовой фиксацией (стандартная эстетика)", "price": 25000 },
  { "id": "implant-zirconia-screw-individual", "name": "Протезирование зуба с использованием имплантата коронкой постоянной безметалловой из диоксида циркония с винтовой фиксацией (индивидуальная эстетика)", "price": 30000 },
  { "id": "implant-emax-screw-standard", "name": "Протезирование зуба с использованием имплантата коронкой постоянной безметалловой цельнокерамической Е-мах (стандартная эстетика)", "price": 28000 },
  { "id": "implant-emax-cement-titan", "name": "Протезирование зуба с использованием имплантата, коронкой постоянной безметалловой цельнокерамической Е-мах (индивидуальная эстетика) с цементной фиксацией на титановом абатменте", "price": 34000 },
  { "id": "implant-emax-cement-zirconia", "name": "Протезирование зуба с использованием имплантата коронкой постоянной безметалловой цельнокерамической Е-мах с цементной фиксацией (индивидуальная эстетика) на циркониевом абатменте", "price": 25000 },
  { "id": "implant-metalceramic", "name": "Протезирование зуба с использованием имплантата коронкой металлокерамической", "price": 20000 },
  { "id": "implant-abutment-individual-osstem", "name": "Протезирование зуба с использованием имплантата индивидуальным циркониевым абатментом, индивидуальным титановым абатментом (без стоимости коронки) Osstem, Dentium (Ю.Корея), ИННО Имплант (Cowellmedi)", "price": 12000 },
  { "id": "implant-abutment-standard-osstem", "name": "Протезирование зуба с использованием имплантата стандартным титановым абатментом (без стоимости коронки) Osstem, Dentium (Ю.Корея), ИННО Имплатн (Cowellmedi)", "price": 10000 },
  { "id": "implant-temp-crown", "name": "Протезирование зуба с использованием имплантата временной коронкой с винтовой или цементной фиксацией (1 ед.)", "price": 8000 },
  { "id": "implant-temp-abutment-osstem", "name": "Протезирование зуба с использованием имплантата временным абатментом Osstem, Dentium (Ю.Корея), ИННО Имплант (Cowellmedi) (без стоимости коронки)", "price": 5000 },
  { "id": "implant-temp-abutment-straumann", "name": "Протезирование зуба с использованием имплантата временным абатментом (со стоимостью коронки) Straumann (Швейцария), Astra Tech", "price": 18000 },
  { "id": "implant-abutment-individual-straumann", "name": "Протезирование зуба с использованием имплантата индивидуальным титановым, циркониевым абатментом (без стоимости коронки) Straumann (Швейцария), Astra Tech", "price": 25000 },
  { "id": "implant-abutment-standard-straumann", "name": "Протезирование зуба с использованием имплантата стандартным абатментом (без стоимости коронки) Straumann (Швейцария), Astra Tech", "price": 15000 },
  //Профилактика и гигиена
  { "id": "hygiene-medication-application", "name": "Аппликация лекарственного препарата на слизистую оболочку полости рта", "price": 500 },
  { "id": "hygiene-remineralization-fluorlac", "name": "Местное применение реминерализующих препаратов в области зуба (Фторлак)", "price": 200 },
  { "id": "hygiene-deep-fluorination", "name": "Глубокое фторирование эмали зуба", "price": 500 },
  { "id": "hygiene-education", "name": "Обучение гигиене полости рта и зубов индивидуальное, подбор средств и предметов гигиены полости рта", "price": 800 },
  { "id": "hygiene-ultrasound-scaling-tooth", "name": "Ультразвуковое удаление наддесневых и поддесневых зубных отложений в области зуба", "price": 100 },
  { "id": "hygiene-professional-basic", "name": "Профессиональная гигиена полости рта и зубов (снятие мягкого налета с одного зуба)", "price": 100 },
  { "id": "hygiene-professional-simple", "name": "Профессиональная гигиена полости рта и зубов (простая: применение ультразвука и полировка зубов)", "price": 3500 },
  { "id": "hygiene-professional-complex", "name": "Профессиональная гигиена полости рта и зубов (сложная: применение ультразвука, полировка зубов, использование Air Flow)", "price": 5000 },
  { "id": "hygiene-airflow-tooth", "name": "Профессиональная гигиена полости рта и зубов (снятие зубных отложений с одного зуба методом Air Flow)", "price": 200 },
  { "id": "hygiene-fissure-sealing-invasive", "name": "Запечатывание фиссуры зуба герметиком инвазивным методом (за один зуб)", "price": 3000 },
  { "id": "hygiene-fissure-sealing-noninvasive", "name": "Запечатывание фиссуры зуба герметиком неинвазивным методом (за один зуб)", "price": 2000 },
  //Ортопедические работы и фиксация конструкций
  { "id": "orthopedic-remove-fixed-unit", "name": "Снятие несъемной ортопедической конструкции (1 ед.)", "price": 1000 },
  { "id": "orthopedic-trepanation", "name": "Трепанация зуба, искусственной коронки", "price": 800 },
  { "id": "orthopedic-selective-grinding", "name": "Избирательное пришлифовывание твердых тканей зубов (1 ед.)", "price": 500 },
  { "id": "orthopedic-selective-polishing", "name": "Избирательное полирование зуба", "price": 500 },
  { "id": "orthopedic-refix-permanent-cement", "name": "Повторная фиксация на постоянный цемент несъемных ортопедических конструкций", "price": 500 },
  { "id": "orthopedic-fix-permanent-cement", "name": "Фиксация на постоянный цемент несъемных ортопедических конструкций (1 ед.)", "price": 1000 },
  { "id": "orthopedic-fix-permanent-cement-implant", "name": "Фиксация на постоянный цемент несъемных ортопедических конструкций с опорой на имплантаты (1 ед.)", "price": 2000 },
  { "id": "orthopedic-fix-temporary-cement", "name": "Фиксация на временный цемент несъемных ортопедических конструкций (1 ед.)", "price": 1000 },
  { "id": "orthopedic-remove-fixed-permanent", "name": "Снятие несъемной ортопедической конструкции постоянной (1 ед.)", "price": 1500 },
  { "id": "orthopedic-remove-fixed-temporary", "name": "Снятие несъемной ортопедической конструкции временной (1 ед.)", "price": 500 },
  //Имплантация (хирургическая часть)
  { "id": "implant-surgery-astra-straumann", "name": "Внутрикостная дентальная имплантация системы Astra Tech (Швеция), Straumann (Швейцария) для дальнейшего зубопротезирования", "price": 42000 },
  { "id": "implant-surgery-inno", "name": "Внутрикостная дентальная имплантация системы ИННО Имплант (Cowellmedi) для дальнейшего зубопротезирования", "price": 35000 },
  { "id": "implant-surgery-superline", "name": "Внутрикостная дентальная имплантация системы SuperLine (Ю. Корея) для дальнейшего зубопротезирования", "price": 25000 },
  { "id": "implant-surgery-osstem-healing-abutment", "name": "Внутрикостная дентальная имплантация: установка формирователя десны Osstem (Ю. Корея)", "price": 5000 },
  { "id": "implant-surgery-astra-straumann-healing-abutment", "name": "Внутрикостная дентальная имплантация: установка формирователя десны Astra Tech (Швеция), Straumann (Швейцария)", "price": 8000 },
  { "id": "implant-surgery-temporary-mini", "name": "Внутрикостная дентальная имплантация временного имплантата или мини-имплантата", "price": 12000 },
  { "id": "implant-surgery-orthodontic", "name": "Внутрикостная дентальная имплантация ортодонтического имплантата", "price": 15000 },
  { "id": "implant-surgery-reimplantation", "name": "Реимплантация", "price": 5000 },
  { "id": "implant-surgery-removal", "name": "Удаление имплантата", "price": 8000 },
  //отбеливание зубов
  { "id": "whitening-home-2jaws", "name": "Профессиональное отбеливание зубов каповое домашнее - 2 челюсти (включает стоимость изготовления кап и стандартный набор отбеливающего геля)", "price": 25000 },
  { "id": "whitening-home-1jaw", "name": "Профессиональное отбеливание зубов каповое домашнее - 1 челюсть (включает стоимость изготовления капы и стандартный набор отбеливающего геля)", "price": 12000 },
  { "id": "whitening-home-gel-large", "name": "Профессиональное отбеливание зубов каповое домашнее (дополнительный набор отбеливающего геля большой)", "price": 9000 },
  { "id": "whitening-home-gel-small", "name": "Профессиональное отбеливание зубов каповое домашнее (дополнительный набор отбеливающего геля малый)", "price": 7000 },
  { "id": "whitening-intracoronal", "name": "Профессиональное отбеливание зубов внутрикоронковое для невитальных измененных в цвете зубов (1 зуб)", "price": 8000 },
  { "id": "whitening-clinical-amazing-2jaws", "name": "Профессиональное отбеливание зубов клиническое за один визит (2 челюсти в линии улыбки) аппаратом Amazing", "price": 40000 },
  { "id": "whitening-clinical-targeted-1tooth", "name": "Профессиональное отбеливание зубов направленное клиническое (1 зуб)", "price": 3000 },
  { "id": "whitening-clinical-opalescence-2jaws", "name": "Профессиональное отбеливание зубов клиническое препаратом Опалесценс (2 челюсти в линии улыбки)", "price": 30000 },
  { "id": "whitening-clinical-opalescence-1jaw", "name": "Профессиональное отбеливание зубов клиническое препаратом Опалесценс (1 челюсть в линии улыбки)", "price": 15000 },
  //Ортопедические услуги. Оттиски
  { "id": "orthopedic-impression-alginate", "name": "Снятие оттиска с одной челюсти альгинатной массой", "price": 1000 },
  { "id": "orthopedic-impression-c-silicone", "name": "Снятие оттиска с одной челюсти массой из С-силикона", "price": 1500 },
  { "id": "orthopedic-impression-a-silicone", "name": "Снятие оттиска с одной челюсти массой из А-силикона", "price": 2000 },
  { "id": "orthopedic-impression-pvs", "name": "Снятие оттиска с одной челюсти массой из поливинилсилоксана", "price": 3000 },
  { "id": "orthopedic-impression-custom-tray", "name": "Снятие оттиска с одной челюсти с использованием индивидуальной ложки", "price": 2500 },
  { "id": "orthopedic-impression-silicone-key", "name": "Снятие оттиска с одной челюсти для изготовления силиконового ключа", "price": 1000 },
  { "id": "orthopedic-diagnostic-model-waxup", "name": "Исследование на диагностических моделях челюстей с восковой моделировкой (Wax-Up) будущей ортопедической конструкции с целью планирования препарирования, эстетики и функции (1 единица)", "price": 1500 },
  { "id": "orthopedic-bite-mockup", "name": "Определение прикуса при помощи примерки в полости рта результата воскового моделирования (Moke-Up) из временного композитного материала, планирования эстетики и функции (1 единица)", "price": 1500 },
  //Рентгенология
  { "id": "xray-intraoral", "name": "Прицельная внутриротовая контактная рентгенография", "price": 350 },
  { "id": "xray-orthopantomogram", "name": "Ортопантомография", "price": 1300 },
  { "id": "xray-orthopantomogram-repeat", "name": "Ортопантомография повторная", "price": 900 },
  { "id": "xray-teleradiography-jaw", "name": "Телерентгенография челюстей", "price": 1300 },
  { "id": "xray-ct-2jaws", "name": "Компьютерная томография челюстно-лицевой области 2-х челюстей", "price": 4000 },
  { "id": "xray-ct-repeat", "name": "Компьютерная томография челюстно-лицевой области повторная (после лечебных манипуляций)", "price": 2000 },
  { "id": "xray-ct-regular", "name": "Компьютерная томография челюстно-лицевой области для постоянных пациентов", "price": 2000 },
  { "id": "xray-teleradiography-lateral", "name": "Телерентгенография черепа в боковой проекции", "price": 1300 },
  //Консультации
  { "id": "consult-orthodontist-repeat", "name": "Прием врача-ортодонта повторный (комплексное обследование: анализ и расчет ОПТГ, ТРГ, КДМ, цифровые фото, планирование лечения)", "price": 4000 },
      { "id": "consult-orthodontist-primary", "name": "Прием врача-ортодонта первичный (осмотр, консультация)", "price": 500 },
      { "id": "consult-dentist-child", "name": "Прием врача-стоматолога первичный (детский) (осмотр)", "price": 500 },
      { "id": "consult-dentist-certificate", "name": "Прием врача-стоматолога с выдачей справки (осмотр, консультация)", "price": 1000 },
      { "id": "consult-dentist-plan", "name": "Прием врача-стоматолога с составлением комплексного плана лечения (осмотр)", "price": 1500 },
      { "id": "consult-orthopedic-dentist-repeat", "name": "Прием врача-стоматолога-ортопеда повторный (осмотр, консультация)", "price": 500 },
      { "id": "consult-surgeon-dentist-repeat", "name": "Прием врача-стоматолога-хирурга повторный (осмотр, консультация)", "price": 500 },
  //Съемное протезирование с опорой на имплантаты
  { "id": "prosthesis-removable-implant-locator", "name": "Протезирование зубов полными съемными пластиночными протезами (1 челюсть) с опорой на имплантаты: фиксатор системы локатор", "price": 35000 },
      { "id": "prosthesis-removable-implant-ball", "name": "Протезирование зубов полными съемными пластиночными протезами (1 челюсть) с опорой на имплантаты: шаровидный абатмент", "price": 40000 },
      { "id": "prosthesis-removable-implant-milled-beam", "name": "Протезирование зубов полными съемными пластиночными протезами (1 челюсть) с опорой на имплантаты на фрезерованной балке", "price": 100000 },
      { "id": "prosthesis-fixed-cons-implant-acrylic", "name": "Восстановление целостности зубного ряда несъемным консольным протезом из акрила с винтовой фиксацией (1 ед.)", "price": 10000 },
      { "id": "prosthesis-fixed-cons-implant-zirconia", "name": "Восстановление целостности зубного ряда несъемным консольным протезом из диоксида циркония с винтовой фиксацией (1 ед.)", "price": 25000 },

      //Анестезия
      { "id": "anesthesia-conduction", "name": "Проводниковая анестезия", "price": 800 },
      { "id": "anesthesia-application", "name": "Аппликационная анестезия", "price": 200 },
      { "id": "anesthesia-infiltration", "name": "Инфильтрационная анестезия", "price": 800 },
      { "id": "anesthesia-medication", "name": "Назначение лекарственных препаратов при заболеваниях полости рта и зубов", "price": 800 },
      //Пародонтология терапевтическая
      { "id": "periodontics-medication-1-2-teeth", "name": "Введение лекарственных препаратов в пародонтальный карман (в области 1-2 зубов)", "price": 800 },
      { "id": "periodontics-medication-6-teeth", "name": "Введение лекарственных препаратов в пародонтальный карман (в области 6 зубов)", "price": 3000 },
      { "id": "periodontics-scaling-hand", "name": "Удаление наддесневых и поддесневых зубных отложений в области зуба ручным методом (КЮРЕТАЖ)", "price": 2500 },
      { "id": "periodontics-therapeutic-dressing", "name": "Наложение лечебной повязки при заболеваниях слизистой оболочки полости рта и пародонта в области одной челюсти", "price": 2000 },

      //Шинирование зубов
      { "id": "splinting-temporary", "name": "Временное шинирование при заболеваниях пародонта (1 единица)", "price": 2000 }
    


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
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false) // добавить
  
  const handleLogoutClick = () => {
    setShowLogoutConfirm(true)
  }
  
  const handleLogoutConfirm = () => {
    signOut()
    setShowLogoutConfirm(false)
    setOpen(false) // закрыть меню
  }

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
            <button type="button" className="contact-pill" onClick={handleLogoutClick}>Выйти</button>
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
              <button type="button" className="btn-link" onClick={handleLogoutClick}>Выйти</button>
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
      {showLogoutConfirm && (
        <div className="modal-backdrop" onClick={() => setShowLogoutConfirm(false)}>
          <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title" style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 12 }}>Вы уверены, что хотите выйти?</h3>
            <div className="modal-action" style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 12 }}>
              <button type="button" className="btn-link" onClick={handleLogoutConfirm}>Да</button>
              <button type="button" className="btn-link" onClick={() => setShowLogoutConfirm(false)}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

function Hero({ onOpenBooking }) {
  const { user } = useAuth()
  const [coupon, setCoupon] = useState(null)
  
  useEffect(() => {
    if (!user) return
    
    // загрузите купон из Supabase
    const fetchCoupon = async () => {
      const { data, error } = await supabase
        .from('cupons')
        .select('cupon_name, discount_percent')
        .maybeSingle()
      
      if (!error && data) setCoupon(data)
    }
    fetchCoupon()
  }, [user])

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
        {user && coupon && (
          <div className="hero-coupon">
            <span className="coupon-text">Промокод: {coupon.cupon_name}</span>
            <span className="coupon-discount">-{coupon.discount_percent}%</span>
          </div>
        )}
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

function ServicesModal({ open, onClose, title, imageSrc, items, onServiceSelect }) 
{
  const [searchQuery, setSearchQuery] = useState("")
  
  const filteredItems = items.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  if (!open) return null
  return (
    <div className="modal-backdrop svc-backdrop-top" onClick={onClose}>
      <div className="modal svc-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <button className="svc-close" aria-label="Закрыть" onClick={onClose}>×</button>
        <div className="svc-hero">
          <img className="svc-hero-img" src={imageSrc} alt={title} />
          <div className="svc-hero-gradient" />
          <h3 className="svc-hero-title">{title}</h3>
        </div>
        <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--border)' }}>
          <input
            type="text"
            placeholder="Поиск услуги..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>
        <div className="svc-list" role="list">
          {filteredItems.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--muted)' }}>
              Услуги не найдены
            </div>
          ) : (
            filteredItems.map((s) => (
              <div key={s.id} className="svc-row" role="listitem">
                <div className="svc-row-name">{s.name}</div>
                <div className="svc-row-right">
                  <span 
                    className="svc-price clickable" 
                    onClick={() => {
                      if (onServiceSelect) {
                        onServiceSelect(s)
                        onClose()
                      }
                    }}
                  >
                    {s.price.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function Collections() {
  return (
    <section id="materials" className="section">
      <div className="kicker">Наши услуги</div>
      <h2>Выберите идеальное решение</h2>
      <div className="grid gallery">
        <div className="card clickable" onClick={() => window.dispatchEvent(new CustomEvent('open-services-modal'))} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') window.dispatchEvent(new CustomEvent('open-services-modal')) }}>
          <div className="cover">
            <img src="/995acf1daaea98992a3227f803d62754.jpg" alt="Керамогранит — образец интерьера" />
          </div>
          <h3>Лабораторные конструкции</h3>
          <p className="text">Незаметные и высокоэстетичные пломбы
Современная анестезия
Рентген-контроль процедуры.</p>
        </div>
        <div className="card clickable" onClick={() => window.dispatchEvent(new CustomEvent('open-services-modal'))} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') window.dispatchEvent(new CustomEvent('open-services-modal')) }}>
          <div className="cover">
            <img src="/zzz.png" alt="HPL‑панели — пример интерьера" />
          </div>
          <h3>Ортодонтия</h3>
          <p className="text">Безболезненные и атравматичные методы удаления
Удаление ретинированных и дистопированных зубов.</p>
        </div>
        <div className="card clickable" onClick={() => window.dispatchEvent(new CustomEvent('open-services-modal'))} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') window.dispatchEvent(new CustomEvent('open-services-modal')) }}>
          <div className="cover">
            <img src="/ааа.jpg" alt="Клинкер — фасад" />
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

function DoctorModal({ open, onClose, doctor }) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  
  useEffect(() => {
    if (!open || !doctor || !doctor.photos) return
    const interval = setInterval(() => {
      setCurrentPhotoIndex(i => (i + 1) % doctor.photos.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [open, doctor?.photos?.length])
  
  if (!open || !doctor || !doctor.photos) return null
  
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal doctor-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" aria-label="Закрыть" onClick={onClose}>×</button>
        <div className="doctor-modal-content">
          <div className="doctor-modal-photos">
            <div className="doctor-photo-carousel">
              {doctor.photos.map((photo, index) => (
                <img
                  key={index}
                  className={`doctor-carousel-img ${index === currentPhotoIndex ? 'active' : ''}`}
                  src={photo}
                  alt={`${doctor.name} ${index + 1}`}
                />
              ))}
            </div>
            <div className="doctor-photo-indicators">
              {doctor.photos.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`photo-indicator ${index === currentPhotoIndex ? 'active' : ''}`}
                  onClick={() => setCurrentPhotoIndex(index)}
                  aria-label={`Фото ${index + 1}`}
                />
              ))}
            </div>
          </div>
          <div className="doctor-modal-info">
            <h3 className="doctor-modal-name">{doctor.name}</h3>
            <p className="doctor-modal-specialty">{doctor.specialty}</p>
            <div className="doctor-modal-description">
              <h4>Образование и квалификация:</h4>
              <div className="doctor-education-text">
                {doctor.education.join('\n\n')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function WhyUs({ onDoctorClick }) {
  return (
    <section id="services" className="section">
      <div className="kicker">Наши врачи</div>
      <h2>Выберите лучшего специалиста</h2>
      <div className="grid doctors">
        <div className="doctor-card clickable" onClick={() => onDoctorClick && onDoctorClick('umarbek')}>
          <img
            className="doctor-photo"
            src="/VRACHI/umarbek.jpg"
            alt="Умарбеков Канатбек Умарбекович"
          />
          <div className="doctor-info">
            <strong className="doctor-name">Умарбеков Канатбек Умарбекович
            </strong>
            <p className="text"></p>
            <p className="text">Хирург-ортопед-стоматолог</p>
          </div>
        </div>
        <div className="doctor-card clickable" onClick={() => onDoctorClick && onDoctorClick('kanikey')}>
          <img
            className="doctor-photo"
            src="/VRACHI/kanikey.jpg"
            alt="Туратбекова Каныкей Туратбековна"
          />
          <div className="doctor-info">
            <strong className="doctor-name">Туратбекова Каныкей Туратбековна
            </strong>
            <p className="text"></p>
            <p className="text">Стоматолог - ортодонт</p>
          </div>
        </div>
        <div className="doctor-card clickable" onClick={() => onDoctorClick && onDoctorClick('mikhailina')}>
          <img
            className="doctor-photo"
            src="/VRACHI/mikhailina.jpg"
            alt="Михалина Альфия Галимьяновна"
          />
          <div className="doctor-info">
            <strong className="doctor-name">Михалина Альфия Галимьяновна</strong>
            <p className="text"></p>
            <p className="text">Стоматолог-ортодонт</p>
          </div>
        </div>
        <div className="doctor-card clickable" onClick={() => onDoctorClick && onDoctorClick('erk')}>
          <img
            className="doctor-photo"
            src="/VRACHI/erk/doctor.png"
            alt="Эрк Улу Нияз"
          />
          <div className="doctor-info">
            <strong className="doctor-name">Эрк Улу Нияз</strong>
            <p className="text"></p>
            <p className="text">Врач стоматолог общей практики</p>
          </div>
        </div>
        <div className="doctor-card clickable" onClick={() => onDoctorClick && onDoctorClick('aziza')}>
          <img
            className="doctor-photo"
            src="/VRACHI/aziza.jpg"
            alt="Сагындыкова Азиза Рысбековна"
          />
          <div className="doctor-info">
            <strong className="doctor-name">Сагындыкова Азиза Рысбековна</strong>
            <p className="text"></p>
            <p className="text">Врач стоматолог общей практики, терапевт</p>
          </div>
        </div>
        <div className="doctor-card">
          <img
            className="doctor-photo"
            src="/VRACHI/azat.png"
            alt="Азат Акылбеков"
          />
          <div className="doctor-info">
            <strong className="doctor-name">Азат Акылбеков</strong>
            <p className="text"></p>
            <p className="text">Врач общей практики, Терапевт-ортопед</p>
          </div>
        </div>
        <div className="doctor-card clickable" onClick={() => onDoctorClick && onDoctorClick('dania')}>
          <img
            className="doctor-photo"
            src="/VRACHI/lebedev.jpg"
            alt="Лебедев Данила Сергеевич"
          />
          <div className="doctor-info">
            <strong className="doctor-name">Лебедев Данила Сергеевич</strong>
            <p className="text"></p>
            <p className="text">Стоматолог-хирург имплантолог</p>
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
            <a className="icon-btn" href="https://t.me/alif_dent_bot" target="_blank" rel="noreferrer" aria-label="Telegram">
              <img src="/icons8-telegram-app.svg" alt="Telegram" />
            </a>
            <a className="icon-btn" href="https://www.instagram.com/alif_dent_moscow/" target="_blank" rel="noreferrer" aria-label="Instagram">
              <img src="/inst.png" alt="Instagram" />
            </a>
            <a className="icon-btn" href="https://wa.me/74957900699" target="_blank" rel="noreferrer" aria-label="WhatsApp">
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
function BookingModal({ open, onClose, selectedService }) {
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
  const [useCoupon, setUseCoupon] = useState(false)
  const [promoCode, setPromoCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [promoError, setPromoError] = useState("")
  const [couponAvailable, setCouponAvailable] = useState(null)
 

  useEffect(() => {
    if (selectedService && open) {
      setSelectedServiceIds([selectedService.id])
    }
  }, [selectedService, open])

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

  // Проверка статуса купона
  useEffect(() => {
    if (!open || !user) return
    
    const checkCouponStatus = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('cupon_status')
        .eq('id', user.id)
        .maybeSingle()
      
      setCouponAvailable(data?.cupon_status !== 'used')
      
      if (data?.cupon_status === 'used') {
        setAppliedCoupon(null)
        setPromoCode('')
        setUseCoupon(false)  // Добавьте эту строку
      }
    }
    checkCouponStatus()
  }, [open, user])
  
  const handleApplyPromo = async () => {
    if (!promoCode.trim()) { setPromoError('Введите промокод'); return }
    setPromoError('')
    
    const { data, error } = await supabase
      .from('cupons')
      .select('cupon_name, discount_percent')
      .eq('cupon_name', promoCode.trim().toUpperCase())
      .maybeSingle()
    
    if (error || !data) {
      setPromoError('Неверный промокод')
      return
    }
    
    setAppliedCoupon(data)
    setPromoCode('')
  }

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
        <p className="modal-note">Перезвоним в течение 15 минут (работаем каждый день с 9 до 21)</p>
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
            if (useCoupon && !appliedCoupon) {
              setSubmitError('Введите и примените промокод, или снимите галочку "Использовать промокод"')
              return
            }
            const selectedServices = SERVICES.filter(s => selectedServiceIds.includes(s.id))
            const finalTotal = appliedCoupon 
              ? Math.floor(selectedServices.reduce((sum, s) => sum + (s.price || 0), 0) * (1 - appliedCoupon.discount_percent / 100))
              : selectedServices.reduce((sum, s) => sum + (s.price || 0), 0)
            
            const payload = {
              name: name.trim(),
              phone: phone.trim(),
              date: formatDateKey(selectedDate),
              time: selectedTime,
              services: selectedServices.map(s => ({ id: s.id, name: s.name, price: s.price })),
              total: finalTotal,
              status: 'new',
              cabinet_id: user?.id || null,
              cupon_name: useCoupon && appliedCoupon ? appliedCoupon.cupon_name : null,
              discount_percent: useCoupon && appliedCoupon ? appliedCoupon.discount_percent : null,
            }

            try {
              setSubmitting(true)
              const { data, error } = await supabase.from('bookings').insert(payload)
  
              if (error) {
                setSubmitError(error.message || 'Не удалось отправить заявку')
                setSubmitting(false)
                return
  }
  console.log(data)
  console.log('=== DEBUG: Проверка статуса купона ===')
console.log('useCoupon:', useCoupon)
console.log('appliedCoupon:', appliedCoupon)
console.log('user?.id:', user?.id)
console.log('Все условия выполнены:', useCoupon && appliedCoupon && user?.id)

if (useCoupon && appliedCoupon && user?.id) {
  console.log('Начинаем обновление статуса купона...')
  try {
    const { data: updateData, error: updateError } = await supabase
      .from('users')
      .update({ cupon_status: 'used' })
      .eq('id', user.id)
      .select()  // ← ДОБАВЬТЕ ЭТО!
    
    console.log('=== РЕЗУЛЬТАТ ОБНОВЛЕНИЯ ===')
    console.log('updateData:', updateData)
    console.log('updateError:', updateError)
    
    if (updateError) {
      console.error('❌ Ошибка обновления статуса купона:', updateError)
      setSubmitError('Не удалось обновить статус купона')
    } else if (!updateData || updateData.length === 0) {
      console.error('⚠️ Обновлено 0 строк - это означает, что RLS заблокировал обновление!')
      console.error('⚠️ ИЛИ user.id не найден в базе данных')
      setSubmitError('Не удалось обновить статус купона (проблема с правами доступа)')
    } else {
      console.log('✅ Статус купона успешно обновлён на "used". Обновлено строк:', updateData.length)
      
    }
  } catch (updateErr) {
    console.error('❌ Ошибка при обновлении статуса купона:', updateErr)
  }
} else {
  console.log('❌ Условие не выполнено, статус купона НЕ обновляется')
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

          {user && couponAvailable && (
            <label className="check">
              <input 
                type="checkbox" 
                checked={useCoupon}
                onChange={(e) => {
                  setUseCoupon(e.target.checked)
                  if (!e.target.checked) {
                    setAppliedCoupon(null)
                    setPromoCode('')
                  }
                }}
              />
              <span>Использовать промокод</span>
            </label>
          )}
          {user && !couponAvailable && (
  <div style={{}}>
    <p style={{ margin: 0, color: '#c33', fontWeight: '50' }}>
    Промокод уже был использован
    </p>
  </div>
)}
          {user && useCoupon && couponAvailable && (
  <div className="field">
    <span className="field-label">Промокод</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  className="input"
                  type="text"
                  placeholder="Введите промокод"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={appliedCoupon !== null}
                />
                {!appliedCoupon && (
                  <button
                    type="button"
                    className="btn-link primary"
                    onClick={handleApplyPromo}
                  >
                    Применить
                  </button>
                )}
              </div>
              {promoError && <div className="text" style={{ color: 'var(--brand)' }}>{promoError}</div>}
              {appliedCoupon && (
                <div className="applied-coupon">
                  Применен: {appliedCoupon.cupon_name} (-{appliedCoupon.discount_percent}%)
                </div>
              )}
            </div>
          )}

          <label className="check">
            <input type="checkbox" required />
            <span>Я даю своё согласие на обработку компанией ООО "ALIF DENT" моих персональных данных в соответствии с требованиями ФЗ от 27.07.2006г. № 152-ФЗ «О персональных данных» и Политикой обработки и защиты персональных данных. *</span>
          </label>
          {submitError && <div className="text" style={{ color: 'var(--brand)' }}>{submitError}</div>}
          <div className="modal-actions">
            <button type="submit" className="btn primary" disabled={submitting}>{submitting ? 'Отправка…' : 'Отправить'}</button>
            <div className="modal-alt">
              <span>Другие способы связи:</span>
              <a className="icon-btn" href="https://t.me/alif_dent_bot" target="_blank" rel="noreferrer" aria-label="Telegram">
                <img src="/icons8-telegram-app.svg" alt="Telegram" />
              </a>
              <a className="icon-btn" href="https://wa.me/74957900699" target="_blank" rel="noreferrer" aria-label="WhatsApp">
                <img src="/icons8-whatsapp.svg" alt="WhatsApp" />
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

const DOCTORS = {
  umarbek: {
    name: 'Умарбеков Канатбек Умарбекович',
    specialty: 'Хирург-ортопед-стоматолог',
    photos: [
      '/VRACHI/umarbek/umarbek.jpeg',
      '/VRACHI/umarbek/umarbek2.jpeg',
      '/VRACHI/umarbek/umarbek10.png',
      '/VRACHI/umarbek/umarbek20.png'
    ],
    
    education: [
      '2009-2014 г. - окончил Кыргызско-Российский Славянский Университет, медицинский факультет, специальность - «Стоматология»',
      '2014-2015г. - Интернатура по специальности «Стоматолог общего профиля», Российский Университет Дружбы Народов (РУДН)',
      '2016 г. - Первичная специализация «Ортопедическая стоматология»',
      '2017 г. - Первичная специализация «Хирургическая стоматология»',
      '2019 г - повышение квалификации по «Хирургической стоматологии», «Ортопедической стоматологии»'
    ]
  },
  kanikey: {
    name: 'Туратбекова Каныкей Туратбековна',
    specialty: 'Врач стоматолог-ортодонт',
    photos: [
      '/VRACHI/kanikey/tura.jpeg',
      '/VRACHI/kanikey/tura 1.jpeg',
      '/VRACHI/kanikey/tura3.jpeg'
    ],
    education: [
      '2009-2014 г. - с Отличием окончила Кыргызско-Российский Славянский Университет, медицинский факультет, специальность - "Стоматология"',
      '2014-2016 г. - Ординатура по специальности "Ортодонтия", Российский Университет Дружбы Народов (РУДН)',
      '2019 г - повышение квалификации по специальности «Ортодонтия», Москва',
      '2022 г. "Биомеханика в ортодонтическом лечении", Giorgio Fiorelli',
      '2022 г. «Ортодонтическое лечение при смешанном прикусе», Marco Rosa',
      '2022г. "TADs и элайнеры", "Цифровая ортодонтия и элайнер-терапия», Chris Chang',
      '2020-2021 гг. «Orthodontic Treatment using Directional Force Technology» on Typodonts с Class I, Class II Malocclusion. Korean Orthodontic Research Institute, Russian Branch',
      '2020 г. «Orthodontic Diagnosis. Cephalometric Theory and Practice», Korean Orthodontic Research Institute, Russian Branch',
      '2020 г. «Конгресс Ортодонтии» Won Moon, Seong-hun Kim, Marco Rosa',
      '2019 г. «Orthodontic Congress», Monica Casadei, Armanda Dias Da Silva, Hyo-Sang Park',
      '2019 г. «ВНЧС в практике ортодонта», Яна Дьячкова',
      '2017 г. «Возможности ортодонтического лечения при использовании нового поколения брекет-систем пассивного самолигирования - системы Н4», Алексей Ермаков',
      '2017г. Сертификация «Star smile»',
      '2016г. «Многофункциональный ортодонтический аппарат Twicare. Применение эластопозиционеров в ортодонтической практике», Гизоева А.Е.',
      '2016г. «Эффективная система скелетной опоры. Мини-импланты в ортодонтии», Гизоева А.Е.',
      '2016г. «Систематизированный подход к ортодонтическому лечению», Проценко Д.В.',
      '2016г. «Компромиссное ортодонтическое лечение на системе Damon», С.А.Блум',
      '2016г. «Эстетическая ортодонтия», Лисовская В.Т.',
      '2015г. «Этапы лечения системой Damon: от первой дуги до завершения», Тихонов С.В.',
      '2015г. Школа Ортодонтии ORMCO',
      '2015г. «Грамотное применение системы Damon в ортодонтической практике: от понимания принципов работы до завершающих этапов лечения», Тихонов С.В.',
      '2015г. «Уверенность с первых шагов. Современная несъёмная ортодонтическая техника - понимание принципов работы. От первой консультации до снятия - клинические аспекты по работе с системой Damon», Тихонов С.В.',
      '2015г. «Bridge for educational in dental science: orthodontics», Касале Микеле',
      '2014г. «Лечение прозрачными каппами OrthoSnap»',
      '2014г. «Применение капп 3D Smile в клинической практике ортодонта», Домрачёва М.Е.',
      '2014г. «Практические аспекты миофункциональной ортодонтии», проф. Герман Рамирез, д-р Рохан Виджей'
    ]
  },
  mikhailina: {
    name: 'Михалина Альфия Галимьяновна',
    specialty: 'Стоматолог-ортодонт',
    photos: [
      '/VRACHI/mikhalina/miha.png',
      '/VRACHI/mikhalina/miha2.png',
      '/VRACHI/mikhalina/miha 3.png',
      '/VRACHI/mikhalina/miha4.png'
    ],
    education: [
      '2008 - окончила Ижевскую Государственную Медицинскую Академию',
      '2008-2009 - интернатура по специальности «Стоматолог общей практики», Ижевская Государственная Медицинская Академия',
      '2009- первичная специализация по терапевтической стоматологии, ИГМА',
      '2009-2016 работала стоматологом-терапевтом (Ижевск, Нефтекамск, Москва)',
      '2016 - окончила ординатуру по специальности «Ортодонтия», медицинский факультет РУДН, Москва',
      '2019 - профессиональная переподготовка по специальности «Стоматология хирургическая», Москва',
      '2020 - профессиональная переподготовка по специальности «Ортодонтия», БГМУ',
      '2020- профессиональная переподготовка по специальности «Стоматология терапевтическая»',
      '2025- профессиональная переподготовка по специальности «Ортодонтия», Москва'
    ]
  },
  erk: {
    name: 'Эрк Улу Нияз',
    specialty: 'Врач стоматолог общей практики (смешанный приём)',
    photos: [
      '/VRACHI/erk/doctor.png',
    
    ],
    education: [
      'Кырыгызско-Российский Славянский Университет имени Ельцина (2012-2017) г.Бишкек',
      'Ординатура 2х годичная ординатура при Кырыгызско-Российском Славянском Университете имени Ельцина (2017-2019) г.Бишкек',
      'Специальность (диплом): Врач стоматолог общей практики',
      '2019 - курс реставрация жевательных зубов 72 часа',
      '2020 - эстетика мягких тканей планирование и реализация 24 часа',
      '2022 - ошибки и осложнения в имплантации 12 часов',
      'Стаж практической работы: Более 5 лет',
      'Врачебная категория: Врач стоматолог высшей категории',
      'Ведение терапевтического, ортопедического, хирургического и детского приема в полном объеме',
      'Эндодонтическое лечение на высоком уровне, использование современных технологий и материалов',
      'Художественные реставрации, работа в четыре руки, чтение рентгеновских снимков ЗЧС',
      'Профессиональная гигиена полости рта, отбеливание',
      'Подготовка полости рта к протезированию, съемное и несъемное протезирование',
      'Изготовление вкладок несъемных коронок всех видов',
      'Удаление зубов любой сложности взрослых и детей',
      'Опыт работы: Работаю с студенческих времён, с 3 курса. Опыт работы по всем направлениям, терапия, ортопедия, хирургия и детский приём'
    ]
  },
  aziza: {
    name: 'Сагындыкова Азиза Рысбековна',
    specialty: 'Врач стоматолог общей практики, терапевт',
    photos: [
      '/VRACHI/aziza/IMG_1919.JPG',
      '/VRACHI/aziza/IMG_1923.JPG'
    ],
    education: [
      '2016-2021 Кыргызская Государственная Медицинская Академия им И.К. Ахунбаева, Факультет стоматологии',
      '2021-2023 Ординатура «Стоматолог общей практики»',
      '23.04.2023 «Прохождение ступени в технике Bypass», лектор: Игорь Ли',
      '23.03.2024 «Эндодонтия в сложных клинических ситуациях», лектор: Кипарисова Д.',
      '24.03.2025 «Практическое применение микроскопа», Кипарисова Д.',
      '19.10.2024 Практический курс «Нехирургическое перелечиваниe корневых каналов», авторский курс Yoshi Terauchi',
      '20.10.2024 Практический курс «Методы перелечивания и способы извлечения инструментов под микроскопом», Yoshi Terauchi',
      '31.08.2024 «Базовый курс эндодонтии», Ахмедов Р.',
      '2024 «Заболевание слизистой оболочки полости рта»'
    ]
  },
  dania: {
    name: 'Лебедев Данила Сергеевич',
    specialty: 'Стоматолог-хирург имплантолог',
    photos: [
      '/VRACHI/dania/dania.jpeg',
      '/VRACHI/dania/dania2.jpeg'
    ],
    education: [
      'Классическая и одномоментная имплантация',
      'Открытый и закрытый синуслифтинг',
      'Установка ортодонтических минивинтов/минипластин',
      'Удаление зубов различной степени сложности',
      'Удаление доброкачественных новообразований (эпулис, кисты)',
      'Вскрытие поднадкостничных, пародонтальных абсцессов, установка дренажа',
      'Удаление экзостозов челюстей, коррекция альвеолярной части и альвеолярного отростка',
      'Направленная костная регенерация: IDR, B2S, ламинатная техника, с использованием армированных мембран',
      'Пластики мягких тканей: закрытие рецессий, ороантральных сообщений, вестибулопластика',
      'Шинирование',
      'Зубосохраняющие операции: аутотрансплантация, реимплантация, резекция верхушки корня (апексэктомия)',
      'Все работы проводятся под увеличением и полным фотопротокол'
    ]
  }
}

export default function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [openServices, setOpenServices] = useState(false)
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState(null)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [doctorModalOpen, setDoctorModalOpen] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  
  useEffect(() => {
    const onOpen = () => setOpenServices(true)
    window.addEventListener('open-services-modal', onOpen)
    return () => window.removeEventListener('open-services-modal', onOpen)
  }, [])
  
  const handleDoctorClick = (doctorId) => {
    setSelectedDoctor(DOCTORS[doctorId])
    setDoctorModalOpen(true)
  }
  
  return (
    <div className="site">
      <Header onOpenLogin={() => setIsLoginOpen(true)} />
      <ScrollManager />
      <main>
  <Outlet context={{ setIsBookingOpen, onDoctorClick: handleDoctorClick }} />
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
      <DoctorModal
        open={doctorModalOpen}
        onClose={() => setDoctorModalOpen(false)}
        doctor={selectedDoctor}
      />
      <ServicesModal
        open={openServices}
        onClose={() => setOpenServices(false)}
        title="Услуги "
        imageSrc="/logo(1).png"
        items={SERVICES}
        onServiceSelect={(service) => {
          setSelectedServiceForBooking(service)  // ИСПРАВИТЬ
          setOpenServices(false)
          setIsBookingOpen(true)
        }}
      />
      <BookingModal
  open={isBookingOpen}
  onClose={() => setIsBookingOpen(false)}
  selectedService={selectedServiceForBooking}  // ИСПРАВИТЬ СТРОКУ 1242
/>
    </div>
  )
}

// Pages
export function HomePage() {
  const { setIsBookingOpen, onDoctorClick } = useOutletContext()
  return (
    <>
      <Hero onOpenBooking={() => setIsBookingOpen(true)} />
      <Collections />
      <WhyUs onDoctorClick={onDoctorClick} />
      <Projects />
      
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
