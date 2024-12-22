export type PartialPropertyRecord<From, To> = Partial<Record<keyof From, keyof To>>;
