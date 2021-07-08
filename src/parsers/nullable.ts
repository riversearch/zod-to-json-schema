import { ZodOptionalDef } from 'zod';
import { parseDef } from '../parseDef';

export function parseNullable(def: ZodOptionalDef): { type: string[] } {
  const { type, ...rest } = parseDef(def.innerType, [], []) as any;

  return {
    type: [type, 'null'],
    ...rest,
  };
}
