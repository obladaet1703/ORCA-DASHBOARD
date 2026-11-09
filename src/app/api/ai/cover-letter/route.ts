import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { vacancyTitle, company, description, profileType, keyRequirements } = await request.json();

    // Качественный генератор сопроводительных с высокой конверсией
    // Структура:
    // 1. Четкий хук и интерес к стеку/задаче компании
    // 2. Релевантный опыт именно под их боли (Next.js, real-time, перформанс, e2e)
    // 3. Лаконичный call to action без лишней воды

    let letter = '';

    if (profileType === 'fullstack') {
      letter = `Здравствуйте${company ? `, команда ${company}` : ''}!

Меня заинтересовала вакансия ${vacancyTitle || 'Fullstack-разработчика'}. 

У меня более 3.5 лет опыта коммерческой разработки на TypeScript, React/Next.js и Node.js. Закрываю задачи под ключ — от архитектуры API и клиентского стейта до деплоя и оптимизации:
• На бэкенде: проектирование REST/WebSocket сервисов (Node.js, Socket.IO), работа с потоковой передачей данных, chunked upload с exponential backoff и фоновой обработкой.
• На фронтенде: Next.js (App Router, SSR, Server Actions), сложная клиентская логика, оптимизация кэширования через TanStack Query (сокращал лишние запросы на 35%), Zustand.
• Качество и CI/CD: покрываю критичные сценарии E2E- и unit-тестами (Vitest, Playwright), настраиваю pre-push хуки и пайплайны.

Буду рад пообщаться на коротком скрининге и подробнее обсудить ваши текущие задачи!

Портфолио и резюме: прикреплены
Telegram: @gans1704 / @gTakeshi1703`;
    } else {
      // Frontend Engineer
      letter = `Здравствуйте${company ? `, команда ${company}` : ''}!

Откликаюсь на позицию ${vacancyTitle || 'Frontend-разработчика'}. 

Мой ключевой стек — React, TypeScript, Next.js. Более 3.5 лет специализируюсь на создании сложных клиентских интерфейсов, где за чистым UI стоит серьезная инженерная логика:
• Оптимизация и стейт: устраняю избыточные ререндеры, разделяю server/client state (TanStack Query, Zustand), реализовывал сложные модули управления расписанием с коллизиями и отменой неактуальных асинхронных запросов (AbortController).
• Real-time и стриминг: опыт работы с WebSockets/Socket.IO (чаты, waveform-визуализация аудио), интеграция AI-интерфейсов и потоковых ответов.
• Инфраструктура: пишу E2E- и screenshot-тесты на Playwright, создаю поддерживаемые UI-киты в Storybook, оптимизирую CI/CD проверки.

Задачи в вашей вакансии отлично ложатся в мой практический опыт. Буду рад созвониться на 15-20 минут для знакомства!

Telegram: @gans1704 / @gTakeshi1703`;
    }

    return NextResponse.json({
      success: true,
      letter,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate cover letter' },
      { status: 500 }
    );
  }
}
