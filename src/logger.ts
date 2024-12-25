import { ExplicitAny } from '@evs-core';

export function logToConsole(...msg: ExplicitAny[]) {
  // todo - turn off for production
  console.log('evstats.info >>', ...msg);
}
