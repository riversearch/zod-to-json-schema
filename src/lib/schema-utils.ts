import { z } from 'zod';

type ZodMeta = {
  description?: string;
  format?: string;
  name?: string;
  type?: string | string[];
};

type AnyObject = z.ZodTypeAny;
export type AnnotatedSchema<T extends z.ZodTypeAny = z.ZodTypeAny> = T &
  ZodMeta;

export function annotate<T extends AnyObject>(
  metadata: ZodMeta,
  schema: T
): AnnotatedSchema<T> {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  (schema as any).meta = metadata;
  return schema as any;
  /* eslint-enable @typescript-eslint/no-explicit-any */
}
