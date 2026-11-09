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
  accountUsed?: string;
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

export interface HHNegotiation {
  id: string;
  vacancyTitle: string;
  vacancyUrl: string;
  company: string;
  salary?: string;
  status: 'invitation' | 'discard' | 'response' | 'viewed';
  statusLabel: string;
  updatedAt: string;
  hasUnreadMessages?: boolean;
  lastMessage?: string;
  chatUrl?: string;
}

export interface HHResumeView {
  company: string;
  time: string;
  positionSearched?: string;
}

export interface HHAccount {
  id: string;
  name: string;
  applicantName?: string;
  accountEmail: string;
  phone?: string;
  status: 'connected' | 'needs_auth' | 'error';
  authMethod: 'cookie' | 'oauth_token';
  credentialsMasked: string;
  cookieRaw?: string;
  resumes: {
    id: string;
    title: string;
    url?: string;
    lastBumpedAt?: string;
    nextBumpAvailableAt?: string;
    status: 'published' | 'hidden';
    appliedCount?: number;
    viewsCount?: number;
    impressionsCount?: number;
    invitationsCount?: number;
    recentViews?: HHResumeView[];
  }[];
  negotiations: HHNegotiation[]; // Отклики и переписки
  autoBumpEnabled: boolean;
  lastCheckedAt?: string;
}

export interface TelegramChannelConfig {
  id: string;
  name: string;
  username: string;
  description: string;
  enabled: boolean;
  category: 'frontend' | 'fullstack' | 'all';
}
