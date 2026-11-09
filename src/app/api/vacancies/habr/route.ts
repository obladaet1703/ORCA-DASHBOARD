import { NextResponse } from 'next/server';
import { Vacancy } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || 'frontend';

  try {
    const rssUrl = `https://career.habr.com/vacancies/rss?q=${encodeURIComponent(query)}&type=all`;
    const res = await fetch(rssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      throw new Error(`Habr RSS returned ${res.status}`);
    }

    const xml = await res.text();
    const vacancies: Vacancy[] = [];

    // Извлекаем <item>...</item>
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    let idx = 0;

    while ((match = itemRegex.exec(xml)) !== null && idx < 15) {
      const itemContent = match[1];

      const titleMatch = itemContent.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || itemContent.match(/<title>(.*?)<\/title>/);
      const linkMatch = itemContent.match(/<link>(.*?)<\/link>/);
      const descMatch = itemContent.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) || itemContent.match(/<description>([\s\S]*?)<\/description>/);
      const pubDateMatch = itemContent.match(/<pubDate>(.*?)<\/pubDate>/);

      const title = titleMatch ? titleMatch[1].trim() : 'Frontend Developer';
      const link = linkMatch ? linkMatch[1].trim() : 'https://career.habr.com';
      const desc = descMatch ? descMatch[1].replace(/<[^>]+>/g, '').trim() : '';
      const pubDate = pubDateMatch ? new Date(pubDateMatch[1]).toISOString() : new Date().toISOString();

      const tags: string[] = ['Хабр Карьера'];
      if (/react/i.test(desc + title)) tags.push('React');
      if (/typescript|ts/i.test(desc + title)) tags.push('TypeScript');
      if (/node/i.test(desc + title)) tags.push('Node.js');
      if (/next/i.test(desc + title)) tags.push('Next.js');

      vacancies.push({
        id: `habr-${idx}-${Date.now()}`,
        source: 'habr',
        externalId: link,
        title,
        company: 'Хабр Карьера',
        location: /удален|remote/i.test(desc) ? 'Удаленно' : 'РФ',
        url: link,
        descriptionSnippet: desc.length > 250 ? desc.slice(0, 250) + '...' : desc,
        tags,
        publishedAt: pubDate,
        status: 'saved',
      });

      idx++;
    }

    return NextResponse.json({
      success: true,
      source: 'habr',
      vacancies,
    });
  } catch (error: any) {
    console.warn('Habr fetch error, returning fallback:', error.message);
    return NextResponse.json({
      success: true,
      source: 'habr',
      isFallback: true,
      vacancies: [
        {
          id: 'habr-demo-1',
          source: 'habr',
          externalId: 'https://career.habr.com/vacancies/10001',
          title: 'Middle+ Frontend Developer (React/TypeScript)',
          company: 'VK Tech',
          salary: { from: 240000, to: 320000, currency: 'RUR' },
          location: 'Удаленно / Москва / Санкт-Петербург',
          url: 'https://career.habr.com/vacancies',
          descriptionSnippet: 'Проектирование высоконагруженных интерфейсов облачной платформы. Микрофронтенды, TypeScript, оптимизация Web Vitals, Storybook.',
          tags: ['React', 'TypeScript', 'Storybook', 'Хабр Карьера'],
          publishedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
          status: 'saved',
        },
      ],
    });
  }
}
