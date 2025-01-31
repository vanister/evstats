import { ExplicitAny } from '@evs-core';

export type LogLevel = 'info' | 'warn' | 'error';

export async function logToDevServer(message: string, level: LogLevel = 'info', stack?: string) {
  if (process.env.NODE_ENV === 'production') {
    // logToConsole('production env, ignoring log to server request');
    return;
  }

  logToConsole(message);

  try {
    const entry = { message, level, stack };

    const response = await fetch('http://localhost:4000/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(entry)
    });

    if (!response.ok) {
      const { error } = await response.json();

      console.log('Log server responsed with status:', response.status, ', and message:', error);
    }
  } catch (error) {
    // console.error('Failed to send log to server.', error);
  }
}

function logToConsole(...msg: ExplicitAny[]) {
  // todo - turn off for production
  console.log('evstats.info >>', ...msg);
}
