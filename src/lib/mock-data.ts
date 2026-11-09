import { ResumeProfile, HHAccount, Vacancy, TelegramChannelConfig } from './types';

export const INITIAL_RESUME_PROFILES: ResumeProfile[] = [
  {
    id: 'res-frontend',
    title: 'Frontend-разработчик (React, JavaScript, TypeScript, Next.js)',
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
    credentialsMasked: 'hhtoken=***live (Сессия активна)',
    resumes: [
      {
        id: '0f2efd1dff1094692c0039ed1f7a365a487370',
        url: 'https://novosibirsk.hh.ru/applicant/resumeview/history?resumeHash=0f2efd1dff1094692c0039ed1f7a365a487370',
        title: 'Frontend-разработчик (React, JavaScript, TypeScript, Next.js)',
        status: 'published',
        viewsCount: 21,
        impressionsCount: 43,
        invitationsCount: 0,
        lastBumpedAt: new Date(Date.now() - 1000 * 60 * 130).toISOString(),
        nextBumpAvailableAt: new Date(Date.now() + 1000 * 60 * 110).toISOString(),
        recentViews: [],
      }
    ],
    negotiations: [], // Никаких левых откликов! Только реальные данные пользователя!
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
    credentialsMasked: 'hhtoken=***live (Сессия активна)',
    resumes: [
      {
        id: 'hh-res-2',
        title: 'Fullstack Developer (Node.js, React, TypeScript)',
        status: 'published',
        viewsCount: 0,
        impressionsCount: 0,
        invitationsCount: 0,
        lastBumpedAt: new Date(Date.now() - 1000 * 60 * 230).toISOString(),
        nextBumpAvailableAt: new Date(Date.now() + 1000 * 60 * 10).toISOString(),
        recentViews: [],
      }
    ],
    negotiations: [],
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

export const INITIAL_KANBAN_VACANCIES: Vacancy[] = [];
