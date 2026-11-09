import { ResumeProfile, HHAccount, Vacancy, TelegramChannelConfig } from './types';

export const INITIAL_RESUME_PROFILES: ResumeProfile[] = [
  {
    id: 'res-frontend',
    title: 'Middle Frontend Engineer (React / Next.js / TypeScript)',
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
    accountEmail: 'anohin.vadim.1703@yandex.com',
    status: 'connected',
    authMethod: 'cookie',
    credentialsMasked: 'hhtoken=***8921a (Active Session)',
    resumes: [
      {
        id: 'hh-res-1',
        title: 'Middle Frontend Engineer (React, Next.js, TypeScript)',
        lastBumpedAt: new Date(Date.now() - 1000 * 60 * 130).toISOString(), // ~2 часа назад
        nextBumpAvailableAt: new Date(Date.now() + 1000 * 60 * 110).toISOString(), // через ~1.8 часа
        status: 'published',
        viewsCount: 42,
        impressionsCount: 512,
      }
    ],
    autoBumpEnabled: true,
    lastCheckedAt: new Date().toISOString(),
  },
  {
    id: 'hh-acc-2',
    name: 'Аккаунт №2 (Оркестратор • Fullstack)',
    accountEmail: 'vadim.fullstack.dev@yandex.ru',
    status: 'connected',
    authMethod: 'cookie',
    credentialsMasked: 'hhtoken=***94fa2 (Active Session)',
    resumes: [
      {
        id: 'hh-res-2',
        title: 'Fullstack Developer (Node.js, React, TypeScript)',
        lastBumpedAt: new Date(Date.now() - 1000 * 60 * 230).toISOString(),
        nextBumpAvailableAt: new Date(Date.now() + 1000 * 60 * 10).toISOString(), // через 10 минут
        status: 'published',
        viewsCount: 28,
        impressionsCount: 380,
      }
    ],
    autoBumpEnabled: true,
    lastCheckedAt: new Date().toISOString(),
  }
];

export const INITIAL_TELEGRAM_CHANNELS: TelegramChannelConfig[] = [
  {
    id: 'tg-1',
    name: 'Web Dev Jobs',
    username: 'forwebdev',
    description: 'Крупнейший русскоязычный канал с вакансиями по фронтенду и вебу',
    enabled: true,
    category: 'frontend',
  },
  {
    id: 'tg-2',
    name: 'JS & React Jobs',
    username: 'javascript_jobs',
    description: 'Целевые вакансии для React, Vue, TypeScript разработчиков',
    enabled: true,
    category: 'frontend',
  },
  {
    id: 'tg-3',
    name: 'Frontend Jobs / Удаленка',
    username: 'front_end_jobs',
    description: 'Удаленные вакансии для фронтендеров Middle / Senior',
    enabled: true,
    category: 'frontend',
  },
  {
    id: 'tg-4',
    name: 'Node.js & Backend Hub',
    username: 'nodejs_jobs',
    description: 'Вакансии для фуллстек и бекенд разработчиков на Node.js',
    enabled: true,
    category: 'fullstack',
  },
  {
    id: 'tg-5',
    name: 'IT Remote Вакансии',
    username: 'it_vacancies_remote',
    description: 'Удаленная работа в РФ и зарубежных продуктах',
    enabled: true,
    category: 'all',
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
    url: 'https://hh.ru',
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
    url: 'https://hh.ru',
    descriptionSnippet: 'Развитие интерактивной платформы обучения. Разработка микросервисов на Node.js, веб-сокеты, фронтенд на React.',
    tags: ['Node.js', 'React', 'Socket.IO', 'PostgreSQL'],
    publishedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    status: 'screening',
    appliedWithResumeId: 'res-fullstack',
    appliedDate: '2026-11-05',
    accountUsed: 'Аккаунт №2 (Fullstack)',
    notes: 'HR написала в Телеграм, согласовываем дату первого созвона.',
  },
  {
    id: 'crm-3',
    source: 'telegram',
    externalId: 'https://t.me/forwebdev/8492',
    title: 'Middle+ Frontend Engineer',
    company: 'Финтех Стартап (via @forwebdev)',
    salary: { from: 230000, to: 290000, currency: 'RUR' },
    location: 'Удаленно',
    url: 'https://t.me/forwebdev',
    descriptionSnippet: 'Крипто-кошелек и платежный шлюз. Стек: React, TypeScript, TanStack Query, Tailwind, E2E на Playwright.',
    tags: ['React', 'TypeScript', 'Playwright', 'Fintech'],
    publishedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    status: 'applied',
    appliedWithResumeId: 'res-frontend',
    appliedDate: '2026-11-08',
    notes: 'Отправил AI-кавер летер в личку фаундеру @alex_crypto_lead.',
  },
  {
    id: 'crm-4',
    source: 'habr',
    externalId: 'https://career.habr.com/vacancies/100084',
    title: 'Frontend Developer (Next.js, Highload)',
    company: 'СберМаркет / Купер',
    salary: { from: 220000, to: 270000, currency: 'RUR' },
    location: 'Москва / Удаленно',
    url: 'https://career.habr.com',
    descriptionSnippet: 'Оптимизация Core Web Vitals, SSR на Next.js, поддержка каталога e-grocery товаров.',
    tags: ['Next.js', 'React', 'SSR', 'Web Vitals'],
    publishedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    status: 'viewed',
    appliedWithResumeId: 'res-frontend',
    appliedDate: '2026-11-04',
    notes: 'Резюме просмотрено эйчаром 2 дня назад, жду ответ.',
  },
  {
    id: 'crm-5',
    source: 'hh',
    externalId: '10992384',
    title: 'React Frontend Developer',
    company: 'Лига Цифровой Экономики',
    salary: { from: 180000, to: 220000, currency: 'RUR' },
    location: 'Удаленно',
    url: 'https://hh.ru',
    descriptionSnippet: 'Аутсорс-проекты для банков и телекома. React, Redux Toolkit, SCSS.',
    tags: ['React', 'Redux', 'TypeScript'],
    publishedAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    status: 'rejected',
    appliedWithResumeId: 'res-frontend',
    appliedDate: '2026-11-03',
    notes: 'Стандартный автоотказ без объяснения причин.',
  }
];
