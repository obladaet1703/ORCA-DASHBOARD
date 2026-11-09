export type PlatformSource = 'hh' | 'telegram' | 'habr' | 'getmatch';

export type ApplicationStatus = 
  | 'saved'       // Сохранено в вишлист
  | 'applied'     // Отправлен отклик
  | 'viewed'      // Просмотрено работодателем
  | 'screening'   // Скрининг с HR
  | 'tech_interview' // Техническое собеседование
  | 'offer'       // Оффер
  | 'rejected';   // Отказ

export interface Vacancy {
  id: string;
  source: PlatformSource;
  externalId: string;
  title: string;
  company: string;
  salary?: {
    from?: number | null;
    to?: number | null;
    currency: string;
    gross?: boolean;
  } | null;
  experience?: string;
  employment?: string;
  location?: string;
  url: string;
  descriptionSnippet: string;
  tags: string[];
  publishedAt: string;
  status: ApplicationStatus;
  appliedWithResumeId?: string;
  appliedDate?: string;
  notes?: string;
  accountUsed?: string; // e.g. "Аккаунт 1 (Фронт)"
}

export interface ResumeProfile {
  id: string;
  title: string;
  category: 'frontend' | 'fullstack' | 'backend';
  experienceYears: string;
  targetSalary: number;
  currency: string;
  summary: string;
  skills: string[];
  bulletPoints: {
    company: string;
    period: string;
    role: string;
    highlights: string[];
  }[];
  active: boolean;
}

export interface HHAccount {
  id: string;
  name: string;
  accountEmail: string;
  status: 'connected' | 'needs_auth' | 'error';
  authMethod: 'cookie' | 'oauth_token';
  credentialsMasked: string;
  resumes: {
    id: string;
    title: string;
    lastBumpedAt?: string;
    nextBumpAvailableAt?: string;
    status: 'published' | 'hidden';
    viewsCount?: number;
    impressionsCount?: number;
  }[];
  autoBumpEnabled: boolean;
  lastCheckedAt?: string;
}

export interface TelegramChannelConfig {
  id: string;
  name: string;
  username: string; // e.g. "forwebdev"
  description: string;
  enabled: boolean;
  category: 'frontend' | 'fullstack' | 'all';
}
