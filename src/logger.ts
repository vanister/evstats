import { ExplicitAny } from '@evs-core';

export type LogLevel = 'info' | 'warn' | 'error';

export async function logToDevServer(message: string, level: LogLevel = 'info', stack?: string) {
  if (import.meta.env.PROD || import.meta.env.MODE === 'production') {
    return;
  }

  logToConsole(message);

  if (import.meta.env.VITE_LOG_TO_CONSOLE_ONLY === 'true') {
    return;
  }

  try {
    const entry = { level, message, stack };

    const response = await fetch('http://localhost:4000/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    });

    if (!response.ok) {
      const data = await response.json();

      logToConsole('log server responsed with status:', response.status, ', and message:', data);
    }
  } catch (error) {
    // console.error('Failed to send log to server.', error);
  }
}

export function logToConsole(...msg: ExplicitAny[]) {
  if (import.meta.env.PROD || import.meta.env.MODE === 'production') {
    return;
  }

  console.debug('evstats.info >>', ...msg);
}
