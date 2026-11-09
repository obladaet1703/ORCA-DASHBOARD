'use client';

import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, Zap } from 'lucide-react';

interface CountdownTimerProps {
  targetTime?: string;
  onReady?: () => void;
  className?: string;
}

export function CountdownTimer({ targetTime, className }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number; isReady: boolean }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isReady: true,
  });

  useEffect(() => {
    if (!targetTime) {
      setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isReady: true });
      return;
    }

    const calculate = () => {
      const now = Date.now();
      const target = new Date(targetTime).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isReady: true });
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds, isReady: false });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  if (timeLeft.isReady) {
    return (
      <span className={`inline-flex items-center gap-1.5 text-emerald-400 font-mono text-xs font-semibold ${className}`}>
        <Zap className="w-3.5 h-3.5 fill-current animate-bounce" />
        Можно поднять прямо сейчас!
      </span>
    );
  }

  const formatted = [
    timeLeft.hours > 0 ? `${timeLeft.hours}ч` : null,
    `${String(timeLeft.minutes).padStart(2, '0')}м`,
    `${String(timeLeft.seconds).padStart(2, '0')}с`,
  ].filter(Boolean).join(' ');

  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-xs ${className}`}>
      <Clock className="w-3.5 h-3.5 text-zinc-400 animate-spin-slow" />
      <span className="text-zinc-400">Авто-поднятие через:</span>
      <span className="text-emerald-400 font-bold tracking-wider">{formatted}</span>
    </span>
  );
}
