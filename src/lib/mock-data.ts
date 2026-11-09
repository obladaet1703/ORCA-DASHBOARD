import { ResumeProfile, HHAccount, Vacancy, TelegramChannelConfig } from './types';

export const INITIAL_RESUME_PROFILES: ResumeProfile[] = [
  {
    id: 'res-frontend',
    title: 'Frontend-разработчик (React, TypeScript, Next.js)',
    category: 'frontend',
    experienceYears: '3 года 7 месяцев',
    targetSalary: 220000,
    currency: 'RUB',
    summary: 'Инженер с глубокой экспертизой в React, Next.js и TypeScript. Специализируюсь на сложных клиентских модулях, оптимизации производительности интерфейсов, real-time взаимодействиях (WebSockets/SSE) и автоматизированном тестировании (Playwright/Vitest).',
    skills: [
      'React', 'Next.js', 'TypeScript', 'JavaScript (ES6+)', 'TanStack Query',
      'Zustand', 'Redux Toolkit', 'Socket.IO', 'Playwright', 'Vitest',
      'Storybook', 'Tailwind CSS', 'Performance Optimization', 'CI/CD (Husky/GitHub Actions)'
    ],
    bulletPoints: [
      {
        company: 'Яндекс.Лавка',
        period: 'Август 2026 — настоящее время (3 мес)',
        role: 'Frontend-разработчик (Команда AI & Search)',
        highlights: [
          'Разработка UI-компонентов и клиентской бизнес-логики интерактивного AI-ассистента на React и TypeScript.',
          'Переработал архитектуру асинхронных операций: устранил race conditions, добавил AbortController для отмены устаревших запросов и защиту от дублирующих кликов.',
          'Оптимизировал производительность: избавился от избыточных перерисовок в связанных компонентах за счёт селекторов состояния и мемоизации.',
          'Развивал E2E- и visual regression-тестирование на Playwright, повысил стабильность прогонов в CI.'
        ]
      },
      {
        company: 'Spaffy (EdTech LMS)',
        period: 'Июнь 2024 — Июль 2026 (2 года 2 мес)',
        role: 'Frontend-разработчик (Middle/Middle+)',
        highlights: [
          'Спроектировал и реализовал модуль интерактивного расписания на Next.js с обработкой коллизий, повторяющихся серий и разрешением временных пересечений.',
          'Оптимизировал работу с сервером через TanStack Query — сократил количество повторных запросов к API на 35%.',
          'Разработал отказоустойчивую подсистему чанков для загрузки файлов с возобновлением через AbortController и exponential backoff.',
          'Перевёл real-time архитектуру на Socket.IO: внедрил групповые звонки/чаты и голосовые сообщения с визуализацией waveform.',
          'Оптимизировал пайплайн CI/CD на Husky — снизил расходы CI-раннеров на 60% без потери качества кода.'
        ]
      },
      {
        company: 'AMF-marketing',
        period: 'Апрель 2023 — Май 2024 (1 год 2 мес)',
        role: 'Frontend-разработчик',
        highlights: [
          'Разработал B2B-платформу управления коммерческой недвижимостью на React/Next.js с SSR и синхронизацией фильтров в URL.',
          'Разделил server и client state между React Query и Zustand, внедрив optimistic updates (сократил дублирующие запросы в 1.5 раза).',
          'Создал UI-кит из 18 компонентов в Storybook и настроил авто-обработку картинок (Sharp, WebP) с экономией трафика на 40%.'
        ]
      }
    ],
    active: true
  },
  {
    id: 'res-fullstack',
    title: 'Fullstack Developer (Node.js / React / TypeScript)',
    category: 'fullstack',
    experienceYears: '3 года 7 месяцев',
    targetSalary: 240000,
    currency: 'RUB',
    summary: 'Продуктовый fullstack-разработчик с опытом построения масштабируемых веб-приложений. Закрываю задачи полного цикла: от проектирования REST/WebSocket API и оптимизации очередей до высокопроизводительного UI на Next.js.',
    skills: [
      'Node.js', 'TypeScript', 'React', 'Next.js (App Router)', 'PostgreSQL',
      'REST API', 'Socket.IO', 'Zustand', 'TanStack Query', 'Docker',
      'Playwright', 'Vitest', 'Express/Fastify', 'Sharp'
    ],
    bulletPoints: [
      {
        company: 'Яндекс.Лавка',
        period: 'Август 2026 — настоящее время (3 мес)',
        role: 'Fullstack-разработчик (AI & Search Services)',
        highlights: [
          'Разработка интерфейсов и интеграция клиентской логики с внутренними AI-микросервисами и LLM-пайплайнами.',
          'Оптимизация потоковых ответов (streaming response handling) и обработка асинхронных сбоев клиент-серверного взаимодействия.',
          'Инфраструктура автоматизации тестов и сбор диагностических артефактов в CI/CD.'
        ]
      },
      {
        company: 'Spaffy (EdTech LMS)',
        period: 'Июнь 2024 — Июль 2026 (2 года 2 мес)',
        role: 'Fullstack-разработчик',
        highlights: [
          'Разработал бэкенд и фронтенд сервиса загрузки медиа-файлов: chunked upload, очереди фоновой обработки, проверка контрольных сумм.',
          'Спроектировал и внедрил real-time подсистему чатов и звонков на Socket.IO с сохранением истории сообщений и обработкой разрывов соединений.',
          'Реализовал BFF-слой и API на Next.js/Node.js, настроил кэширование и уменьшил задержки ответов.'
        ]
      },
      {
        company: 'AMF-marketing',
        period: 'Апрель 2023 — Май 2024 (1 год 2 мес)',
        role: 'Fullstack Web Developer',
        highlights: [
          'Разработал B2B-платформу недвижимости: SSR-генерация, REST API интеграции, обработка и конвертация медиа через Sharp.',
          'Внедрил EventSource (SSE) для real-time уведомлений о статусе бронирования коммерческих площадей.'
        ]
      }
    ],
    active: true
  }
];

export const INITIAL_HH_ACCOUNTS: HHAccount[] = [
  {
    id: 'hh-acc-1',
    name: 'Аккаунт №1 (Основной • Frontend)',
    applicantName: 'Вадим Анохин',
    accountEmail: 'anohin.vadim.1703@yandex.com',
    phone: '+7 (929) 388-55-08',
    status: 'connected',
    authMethod: 'cookie',
    credentialsMasked: 'hhtoken=***8921a (Сессия активна)',
    resumes: [
      {
        id: 'hh-res-1',
        title: 'Frontend-разработчик (React, TypeScript, Next.js)',
        status: 'published',
        viewsCount: 38,
        impressionsCount: 480,
        invitationsCount: 4,
        lastBumpedAt: new Date(Date.now() - 1000 * 60 * 130).toISOString(),
        nextBumpAvailableAt: new Date(Date.now() + 1000 * 60 * 110).toISOString(),
        recentViews: [
          { company: 'Mindbox', time: 'Сегодня, 14:15', positionSearched: 'Frontend Engineer' },
          { company: 'Ozon FinTech', time: 'Сегодня, 11:40', positionSearched: 'React Developer' },
          { company: 'Т-Банк (Тинькофф)', time: 'Вчера, 18:20', positionSearched: 'Frontend Next.js' },
          { company: 'VK Tech', time: 'Вчера, 15:05', positionSearched: 'TypeScript Engineer' },
          { company: 'Авито', time: '07 ноября, 16:30', positionSearched: 'React Middle' },
        ],
      }
    ],
    negotiations: [
      {
        id: 'neg-1',
        vacancyTitle: 'Senior / Middle Frontend разработчик (React, Next.js)',
        vacancyUrl: 'https://hh.ru/vacancy/10842910',
        company: 'Mindbox',
        salary: '240 000 — 280 000 ₽',
        status: 'invitation',
        statusLabel: 'Приглашение',
        updatedAt: 'Сегодня, 14:30',
        hasUnreadMessages: true,
        lastMessage: 'Вадим, здравствуйте! Заинтересовал ваш опыт в Лавке и работа со стейтом. Хотим пригласить вас на 20-минутный скрининг.',
        chatUrl: 'https://hh.ru/applicant/negotiations',
      },
      {
        id: 'neg-2',
        vacancyTitle: 'React Frontend Developer',
        vacancyUrl: 'https://hh.ru/vacancy/10976541',
        company: 'Т-Банк (Тинькофф)',
        salary: 'от 240 000 ₽',
        status: 'viewed',
        statusLabel: 'Просмотрено работодателем',
        updatedAt: 'Сегодня, 11:20',
        lastMessage: 'Резюме просмотрено эйчаром команды Инвестиций.',
        chatUrl: 'https://hh.ru/applicant/negotiations',
      },
      {
        id: 'neg-3',
        vacancyTitle: 'Frontend Engineer (Next.js, Highload)',
        vacancyUrl: 'https://hh.ru/vacancy/10984920',
        company: 'Ozon FinTech',
        salary: '250 000 — 320 000 ₽',
        status: 'response',
        statusLabel: 'На рассмотрении',
        updatedAt: 'Вчера, 19:10',
        lastMessage: 'Отклик доставлен. Ожидает рассмотрения рекрутером.',
        chatUrl: 'https://hh.ru/applicant/negotiations',
      },
      {
        id: 'neg-4',
        vacancyTitle: 'Frontend разработчик (React / Redux)',
        vacancyUrl: 'https://hh.ru/vacancy/10992384',
        company: 'Лига Цифровой Экономики',
        salary: '180 000 — 220 000 ₽',
        status: 'discard',
        statusLabel: 'Отказ',
        updatedAt: '06 ноября, 12:00',
        lastMessage: 'К сожалению, в настоящее время мы не готовы предложить вам сотрудничество.',
        chatUrl: 'https://hh.ru/applicant/negotiations',
      }
    ],
    autoBumpEnabled: true,
    lastCheckedAt: new Date().toISOString(),
  },
  {
    id: 'hh-acc-2',
    name: 'Аккаунт №2 (Оркестратор • Fullstack)',
    applicantName: 'Вадим Анохин',
    accountEmail: 'vadim.fullstack.dev@yandex.ru',
    phone: '+7 (929) 388-55-08',
    status: 'connected',
    authMethod: 'cookie',
    credentialsMasked: 'hhtoken=***94fa2 (Сессия активна)',
    resumes: [
      {
        id: 'hh-res-2',
        title: 'Fullstack Developer (Node.js, React, TypeScript)',
        status: 'published',
        viewsCount: 26,
        impressionsCount: 340,
        invitationsCount: 2,
        lastBumpedAt: new Date(Date.now() - 1000 * 60 * 230).toISOString(),
        nextBumpAvailableAt: new Date(Date.now() + 1000 * 60 * 10).toISOString(),
        recentViews: [
          { company: 'Skyeng', time: 'Сегодня, 12:00', positionSearched: 'Fullstack Node.js' },
          { company: 'Selectel', time: 'Вчера, 17:15', positionSearched: 'Fullstack Engineer' },
          { company: 'Яндекс Практикум', time: '07 ноября, 14:00', positionSearched: 'React/Node Dev' },
        ],
      }
    ],
    negotiations: [
      {
        id: 'neg-201',
        vacancyTitle: 'Fullstack разработчик (Node.js + React)',
        vacancyUrl: 'https://hh.ru/vacancy/10928172',
        company: 'Skyeng',
        salary: '210 000 — 260 000 ₽',
        status: 'invitation',
        statusLabel: 'Приглашение',
        updatedAt: 'Сегодня, 12:05',
        hasUnreadMessages: true,
        lastMessage: 'Добрый день, Вадим! Понравился ваш бэкграунд в EdTech LMS платформе. Готовы предложить технический созвон на этой неделе.',
        chatUrl: 'https://hh.ru/applicant/negotiations',
      },
      {
        id: 'neg-202',
        vacancyTitle: 'Fullstack Engineer (React / Fastify)',
        vacancyUrl: 'https://hh.ru/vacancy/10965320',
        company: 'Selectel',
        salary: '220 000 — 280 000 ₽',
        status: 'viewed',
        statusLabel: 'Просмотрено работодателем',
        updatedAt: 'Вчера, 17:40',
        lastMessage: 'Резюме открыто руководителем направления разработки панели управления.',
        chatUrl: 'https://hh.ru/applicant/negotiations',
      }
    ],
    autoBumpEnabled: true,
    lastCheckedAt: new Date().toISOString(),
  }
];

export const INITIAL_TELEGRAM_CHANNELS: TelegramChannelConfig[] = [
  {
    id: 'tg-1',
    name: 'Senior Frontender',
    username: 'senior_frontender',
    description: 'Целевые вакансии для Senior и крепких Middle разработчиков',
    enabled: true,
    category: 'frontend',
  },
  {
    id: 'tg-2',
    name: 'JScript Jobs',
    username: 'JScript_jobs',
    description: 'Вакансии по JavaScript, React и вебу',
    enabled: true,
    category: 'frontend',
  },
  {
    id: 'tg-3',
    name: 'JS Dev Job',
    username: 'jsdevjob',
    description: 'Работа для frontend и fullstack инженеров',
    enabled: true,
    category: 'fullstack',
  },
  {
    id: 'tg-4',
    name: 'React Jobs',
    username: 'job_react',
    description: 'Только React, Next.js и экосистема',
    enabled: true,
    category: 'frontend',
  },
  {
    id: 'tg-5',
    name: 'Frontend Jobs Вакансии',
    username: 'frontend_jobs_vakansii',
    description: 'Свежие предложения с удаленкой',
    enabled: true,
    category: 'frontend',
  }
];

export const INITIAL_KANBAN_VACANCIES: Vacancy[] = [
  {
    id: 'crm-1',
    source: 'hh',
    externalId: '10842910',
    title: 'Senior / Middle Frontend разработчик (React, Next.js)',
    company: 'Mindbox',
    salary: { from: 240000, to: 280000, currency: 'RUR' },
    location: 'Удаленно',
    url: 'https://hh.ru/vacancy/10842910',
    descriptionSnippet: 'Развитие интерфейсов платформы автоматизации маркетинга. Микрофронтенды, TypeScript, React, сложная работа с формами и таблицами.',
    tags: ['React', 'TypeScript', 'Next.js', 'Микрофронты'],
    publishedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'tech_interview',
    appliedWithResumeId: 'res-frontend',
    appliedDate: '2026-11-04',
    accountUsed: 'Аккаунт №1 (Frontend)',
    notes: 'Прошел HR-скрининг, техсобес назначен на среду в 16:00. Повторить event loop и виртуализацию списков.',
  },
  {
    id: 'crm-2',
    source: 'hh',
    externalId: '10928172',
    title: 'Fullstack разработчик (Node.js + React)',
    company: 'Skyeng',
    salary: { from: 210000, to: 260000, currency: 'RUR' },
    location: 'Удаленно',
    url: 'https://hh.ru/vacancy/10928172',
    descriptionSnippet: 'Развитие интерактивной платформы обучения. Разработка микросервисов на Node.js, веб-сокеты, фронтенд на React.',
    tags: ['Node.js', 'React', 'Socket.IO', 'PostgreSQL'],
    publishedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    status: 'screening',
    appliedWithResumeId: 'res-fullstack',
    appliedDate: '2026-11-05',
    accountUsed: 'Аккаунт №2 (Fullstack)',
    notes: 'HR написала в Телеграм, согласовываем дату первого созвона.',
  }
];
