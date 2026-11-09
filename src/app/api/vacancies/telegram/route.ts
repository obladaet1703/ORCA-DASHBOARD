import { NextResponse } from 'next/server';
import { Vacancy } from '@/lib/types';

export const DEFAULT_TELEGRAM_CHANNELS = [
  { username: 'senior_frontender', name: 'Senior Frontender', category: 'frontend' },
  { username: 'JScript_jobs', name: 'JScript Jobs', category: 'frontend' },
  { username: 'jsdevjob', name: 'JS Dev Job', category: 'fullstack' },
  { username: 'job_react', name: 'React Jobs', category: 'frontend' },
  { username: 'frontend_jobs_vakansii', name: 'Frontend Jobs Вакансии', category: 'frontend' },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const channel = searchParams.get('channel') || 'senior_frontender';

  try {
    const res = await fetch(`https://t.me/s/${channel}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`Telegram preview returned ${res.status}`);
    }

    const html = await res.text();
    const vacancies: Vacancy[] = [];

    // Регулярка для извлечения блоков сообщений
    const messageBlockRegex = /<div class="tgme_widget_message_wrap[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/g;
    let match;

    let index = 0;
    while ((match = messageBlockRegex.exec(html)) !== null && index < 30) {
      const messageHtml = match[1];

      // Текст сообщения
      const textMatch = messageHtml.match(/<div class="tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>/);
      if (!textMatch) continue;

      const rawText = textMatch[1]
        .replace(/<br\s*[\/]?>/gi, '\n')
        .replace(/<a\s+[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '$2 ($1)')
        .replace(/<[^>]+>/g, '')
        .trim();

      if (!rawText || rawText.length < 20) continue;

      // Ссылка на пост
      const linkMatch = messageHtml.match(/href="(https:\/\/t\.me\/[^/]+\/\d+)"/);
      const postUrl = linkMatch ? linkMatch[1] : `https://t.me/${channel}`;

      // Дата публикации
      const timeMatch = messageHtml.match(/<time datetime="([^"]+)"/);
      const publishedAt = timeMatch ? timeMatch[1] : new Date().toISOString();

      // Извлекаем заголовок (первая непустая строка)
      const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);
      const titleLine = lines[0] || 'Frontend Developer';
      const cleanTitle = titleLine.length > 90 ? titleLine.substring(0, 90) + '...' : titleLine;

      // Извлекаем зарплату
      let salary = null;
      const salaryMatch = rawText.match(/(?:от|до|\$|€|₽)?\s*(\d{2,3}[ ,.]?\d{3})\s*(?:-|до)?\s*(\d{2,3}[ ,.]?\d{3})?\s*(₽|руб|usd|\$|eur|€)?/i);
      if (salaryMatch) {
        const fromVal = parseInt(salaryMatch[1].replace(/[\s,.]/g, ''), 10);
        const toVal = salaryMatch[2] ? parseInt(salaryMatch[2].replace(/[\s,.]/g, ''), 10) : undefined;
        if (!isNaN(fromVal) && fromVal > 30000) {
          salary = {
            from: fromVal,
            to: toVal,
            currency: /usd|\$/i.test(salaryMatch[3] || '') ? 'USD' : 'RUR',
          };
        }
      }

      // Теги
      const tags: string[] = [];
      if (/react/i.test(rawText)) tags.push('React');
      if (/typescript|ts/i.test(rawText)) tags.push('TypeScript');
      if (/next(\.js)?/i.test(rawText)) tags.push('Next.js');
      if (/node(\.js)?/i.test(rawText)) tags.push('Node.js');
      if (/remote|удален/i.test(rawText)) tags.push('Удаленка');
      if (/middle/i.test(rawText)) tags.push('Middle');
      if (/senior/i.test(rawText)) tags.push('Senior');

      vacancies.push({
        id: `tg-${channel}-${index}-${Date.now()}`,
        source: 'telegram',
        externalId: postUrl,
        title: cleanTitle.replace(/^#\w+\s*/, ''),
        company: `@${channel}`,
        salary,
        location: /удален|remote/i.test(rawText) ? 'Удаленно' : 'РФ',
        url: postUrl,
        descriptionSnippet: rawText, // Полный текст поста без обрезки!
        tags: tags.length > 0 ? tags : ['Telegram', 'IT'],
        publishedAt,
        status: 'saved',
      });

      index++;
    }

    // В Telegram веб-зеркале старые посты идут вверху, а самые свежие внизу страницы.
    // Разворачиваем массив, чтобы САМЫЕ СВЕЖИЕ посты шли в самом верху списка!
    const sortedVacancies = vacancies.reverse();

    return NextResponse.json({
      success: true,
      channel,
      vacancies: sortedVacancies.length > 0 ? sortedVacancies : getFallbackTelegramVacancies(channel),
    });
  } catch (error: any) {
    console.warn(`TG fetch error for @${channel}:`, error.message);
    return NextResponse.json({
      success: true,
      channel,
      isFallback: true,
      vacancies: getFallbackTelegramVacancies(channel),
    });
  }
}

function getFallbackTelegramVacancies(channel: string): Vacancy[] {
  return [
    {
      id: `tg-sample-1`,
      source: 'telegram',
      externalId: `https://t.me/${channel}`,
      title: 'Senior / Middle+ Frontend Developer (React, Next.js, TypeScript)',
      company: `@${channel}`,
      salary: { from: 240000, to: 310000, currency: 'RUR' },
      location: 'Удаленно',
      url: `https://t.me/${channel}`,
      descriptionSnippet: `Позиция: Frontend Developer (Middle+ / Senior)
Локация: Удаленно (РФ / СНГ / зарубеж)
Вилка: от 240 000 до 310 000 ₽ на руки

О проекте:
Развиваем финтех-платформу и инструменты для управления финансовыми потоками.
Стек: React 19, TypeScript, Next.js (App Router), TanStack Query, Zustand, WebSockets для стриминга котировок, Playwright для e2e.

Задачи:
- Проектирование сложных клиентских интерфейсов со сложными состояниями;
- Оптимизация производительности рендеринга и Web Vitals;
- Интеграция с WebSocket и REST API;
- Покрытие ключевых сценариев E2E-тестами.

Требования:
- Опыт коммерческой разработки на React/TypeScript от 3 лет;
- Уверенное понимание асинхронного взаимодействия, отмены запросов (AbortController);
- Опыт написания unit/e2e тестов.

Контакты: @hr_lead_tech (пишите с пометкой Frontend)`,
      tags: ['React', 'TypeScript', 'Next.js', 'WebSocket', 'Удаленка'],
      publishedAt: new Date().toISOString(),
      status: 'saved',
    },
    {
      id: `tg-sample-2`,
      source: 'telegram',
      externalId: `https://t.me/${channel}`,
      title: 'Fullstack разработчик (Node.js + React)',
      company: `@${channel}`,
      salary: { from: 220000, to: 280000, currency: 'RUR' },
      location: 'Удаленно',
      url: `https://t.me/${channel}`,
      descriptionSnippet: `Ищем Fullstack разработчика в EdTech платформу.
Формат: Полная удаленка
Занятость: Full-time

Чем предстоит заниматься:
• Разработка BFF-слоя на Node.js и сервисов потоковой загрузки файлов;
• Реализация интерфейсов расписания и чатов на Socket.IO;
• Работа с PostgreSQL и кэшированием запросов.

Ждем от вас:
• 3+ года опыта с Node.js и React/Next.js;
• Опыт работы с WebSockets / Socket.IO;
• Умение проектировать чистые API контракты.

Откликнуться: @edtech_recruitment`,
      tags: ['Node.js', 'React', 'Socket.IO', 'Fullstack'],
      publishedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      status: 'saved',
    },
  ];
}
