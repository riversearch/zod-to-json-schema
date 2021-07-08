import { ZodOptionalDef } from 'zod';
import { parseDef } from '../parseDef';

export function parseNullable(
  def: ZodOptionalDef,
  useRefs: boolean
): { type: string[] } {
  const { type, ...rest } = parseDef(def.innerType, [], [], useRefs) as any;

  return {
    type: [type, 'null'],
    ...rest,
  };
}
