import { ZodTupleDef, ZodTypeDef } from 'zod';
import { JsonSchema7Type, parseDef } from '../parseDef';

export type JsonSchema7TupleType = {
  type: 'array';
  minItems: number;
  maxItems: number;
  items: JsonSchema7Type[];
};

export function parseTupleDef(
  def: ZodTupleDef,
  path: string[],
  visited: { def: ZodTypeDef; path: string[] }[],
  useRefs: boolean
): JsonSchema7TupleType {
  return {
    type: 'array',
    minItems: def.items.length,
    maxItems: def.items.length,
    items: def.items
      .map((x, i) =>
        parseDef(x, [...path, 'items', i.toString()], visited, useRefs)
      )
      .reduce(
        (acc: JsonSchema7Type[], x) => (x === undefined ? acc : [...acc, x]),
        []
      ),
  };
}
