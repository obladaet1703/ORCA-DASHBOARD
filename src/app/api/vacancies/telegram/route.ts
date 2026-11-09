import { NextResponse } from 'next/server';
import { Vacancy } from '@/lib/types';

// Список топовых публичных каналов по фронтенду и фуллстеку
export const DEFAULT_TELEGRAM_CHANNELS = [
  { username: 'forwebdev', name: 'Web Dev Jobs', category: 'frontend' },
  { username: 'javascript_jobs', name: 'JS & React Вакансии', category: 'frontend' },
  { username: 'front_end_jobs', name: 'Frontend Jobs', category: 'frontend' },
  { username: 'nodejs_jobs', name: 'Node.js & Backend Jobs', category: 'fullstack' },
  { username: 'it_vacancies_remote', name: 'IT Remote Вакансии', category: 'all' },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const channel = searchParams.get('channel') || 'forwebdev';

  try {
    const res = await fetch(`https://t.me/s/${channel}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
      },
      next: { revalidate: 300 }, // 5 минут кэш
    });

    if (!res.ok) {
      throw new Error(`Telegram preview returned ${res.status}`);
    }

    const html = await res.text();
    const vacancies: Vacancy[] = [];

    // Регулярки для парсинга превью Telegram каналов
    const messageBlockRegex = /<div class="tgme_widget_message_wrap[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/g;
    let match;

    let index = 0;
    while ((match = messageBlockRegex.exec(html)) !== null && index < 15) {
      const messageHtml = match[1];

      // Текст сообщения
      const textMatch = messageHtml.match(/<div class="tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>/);
      if (!textMatch) continue;

      const rawText = textMatch[1]
        .replace(/<br\s*[\/]?>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .trim();

      // Проверяем, похоже ли на вакансию
      if (
        !/(вакансия|developer|разработчик|frontend|react|node|vue|engineer|middle|senior|fullstack|ищем)/i.test(
          rawText
        )
      ) {
        continue;
      }

      // Ссылка на пост
      const linkMatch = messageHtml.match(/href="(https:\/\/t\.me\/[^/]+\/\d+)"/);
      const postUrl = linkMatch ? linkMatch[1] : `https://t.me/${channel}`;

      // Дата публикации
      const timeMatch = messageHtml.match(/<time datetime="([^"]+)"/);
      const publishedAt = timeMatch ? timeMatch[1] : new Date().toISOString();

      // Извлекаем заголовок (первая непустая строчка)
      const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);
      const titleLine = lines[0] || 'Frontend Developer';
      const cleanTitle = titleLine.length > 80 ? titleLine.substring(0, 80) + '...' : titleLine;

      // Пытаемся извлечь зарплату
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
        descriptionSnippet: rawText.length > 280 ? rawText.slice(0, 280) + '...' : rawText,
        tags: tags.length > 0 ? tags : ['Telegram', 'Frontend'],
        publishedAt,
        status: 'saved',
      });

      index++;
    }

    return NextResponse.json({
      success: true,
      channel,
      vacancies: vacancies.length > 0 ? vacancies : getFallbackTelegramVacancies(channel),
    });
  } catch (error: any) {
    console.warn(`TG fetch error for @${channel}, using fallback data:`, error.message);
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
      externalId: `https://t.me/${channel}/1`,
      title: 'Senior / Middle+ Frontend Developer (React, TypeScript, Next.js)',
      company: 'FinTech Startup via @' + channel,
      salary: { from: 220000, to: 300000, currency: 'RUR' },
      location: 'Удаленно',
      url: `https://t.me/${channel}`,
      descriptionSnippet: 'Ищем опытного фронтендера в финтех-продукт. Стек: React 18/19, TypeScript, Next.js, Zustand, WebSocket для котировок, Playwright для e2e тестов.',
      tags: ['React', 'TypeScript', 'Next.js', 'WebSocket', 'Удаленка'],
      publishedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      status: 'saved',
    },
    {
      id: `tg-sample-2`,
      source: 'telegram',
      externalId: `https://t.me/${channel}/2`,
      title: 'Fullstack разработчик (Node.js + React)',
      company: 'EdTech Platform via @' + channel,
      salary: { from: 200000, to: 280000, currency: 'RUR' },
      location: 'Удаленно / Москва',
      url: `https://t.me/${channel}`,
      descriptionSnippet: 'Развитие интерактивной LMS системы для онлайн-школ. Разработка клиентских модулей расписания, файловой подсистемы, чатов на Socket.io.',
      tags: ['Node.js', 'React', 'Socket.IO', 'PostgreSQL'],
      publishedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      status: 'saved',
    },
  ];
}
