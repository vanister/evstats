import { ExplicitAny } from '@evs-core';

export type Changes = {
  changes?: number;
  lastId?: number;
};

export type StatementSet = {
  statement: string;
  values?: ExplicitAny[];
};

export type DboKeys<T> = keyof T;
