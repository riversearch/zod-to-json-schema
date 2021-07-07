import { z } from 'zod';

type ZodMeta = { description?: string; name?: string };
type AnyObject = z.ZodTypeAny;
type AugmentSchema<T extends z.ZodTypeAny = z.ZodTypeAny> = T & ZodMeta;

export function annotate<T extends AnyObject>(
  metadata: ZodMeta,
  schema: T
): AugmentSchema<T> {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  (schema as any).meta = metadata;
  return schema as any;
  /* eslint-enable @typescript-eslint/no-explicit-any */
}
