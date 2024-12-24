import { PropsWithChildren } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExplicitAny = any;

export type PropsWithChildrenAndClass<T> = PropsWithChildren<T & { className?: string }>;
