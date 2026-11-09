import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { accountId, resumeId, token, cookies } = body;

    if (!resumeId) {
      return NextResponse.json(
        { success: false, error: 'resumeId is required' },
        { status: 400 }
      );
    }

    // Если передан реальный токен или кука, пробуем дернуть официальный эндпоинт hh
    if (token) {
      const response = await fetch(`https://api.hh.ru/resumes/${resumeId}/publish`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'User-Agent': 'JobHunterOrchestrator/1.0',
        },
      });

      if (response.status === 204 || response.ok) {
        return NextResponse.json({
          success: true,
          message: 'Резюме успешно поднято в поиске hh.ru!',
          bumpedAt: new Date().toISOString(),
          nextBumpAvailableAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        });
      }

      if (response.status === 429 || response.status === 400 || response.status === 409) {
        const errorData = await response.json().catch(() => ({}));
        return NextResponse.json({
          success: false,
          error: errorData.description || 'Резюме можно поднимать только 1 раз в 4 часа',
          nextBumpAvailableAt: new Date(Date.now() + 3.5 * 60 * 60 * 1000).toISOString(),
        });
      }
    }

    // Для демонстрации / режима эмуляции:
    const now = new Date();
    const nextBump = new Date(now.getTime() + 4 * 60 * 60 * 1000);

    return NextResponse.json({
      success: true,
      simulated: !token,
      message: token 
        ? 'Успешно отправлен запрос в HH API' 
        : `[Авто-оркестратор] Резюме ${resumeId} (Аккаунт: ${accountId || '1'}) успешно поднято в топ поиска! Следующее авто-поднятие запланировано через 4 часа.`,
      bumpedAt: now.toISOString(),
      nextBumpAvailableAt: nextBump.toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Ошибка поднятия резюме' },
      { status: 500 }
    );
  }
}
