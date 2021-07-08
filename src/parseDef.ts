import { ZodTypeDef } from 'zod';
import {
  JsonSchema7ArrayType,
  parseArrayDef,
  parseNonEmptyArrayDef,
} from './parsers/array';
import { JsonSchema7BigintType, parseBigintDef } from './parsers/bigint';
import { JsonSchema7BooleanType, parseBooleanDef } from './parsers/boolean';
import { JsonSchema7DateType, parseDateDef } from './parsers/date';
import { JsonSchema7EnumType, parseEnumDef } from './parsers/enum';
import { parseIntersectionDef } from './parsers/intersection';
import { JsonSchema7LiteralType, parseLiteralDef } from './parsers/literal';
import {
  JsonSchema7NativeEnumType,
  parseNativeEnumDef,
} from './parsers/nativeEnum';
import { JsonSchema7NullType, parseNullDef } from './parsers/null';
import { parseNullable } from './parsers/nullable';
import { JsonSchema7NumberType, parseNumberDef } from './parsers/number';
import { JsonSchema7ObjectType, parseObjectDef } from './parsers/object';
import { JsonSchema7RecordType, parseRecordDef } from './parsers/record';
import { JsonSchema7StringType, parseStringDef } from './parsers/string';
import { JsonSchema7TupleType, parseTupleDef } from './parsers/tuple';
import {
  JsonSchema7UndefinedType,
  parseUndefinedDef,
} from './parsers/undefined';
import {
  JsonSchema7AnyOfType,
  JsonSchema7PrimitiveUnionType,
  parseUnionDef,
} from './parsers/union';

type JsonSchema7AnyType = {};
type JsonSchema7RefType = { $ref: string };

export type JsonSchema7Type =
  | JsonSchema7StringType
  | JsonSchema7ArrayType
  | JsonSchema7NumberType
  | JsonSchema7BigintType
  | JsonSchema7BooleanType
  | JsonSchema7DateType
  | JsonSchema7EnumType
  | JsonSchema7LiteralType
  | JsonSchema7NativeEnumType
  | JsonSchema7NullType
  | JsonSchema7NumberType
  | JsonSchema7ObjectType
  | JsonSchema7RecordType
  | JsonSchema7TupleType
  | JsonSchema7PrimitiveUnionType
  | JsonSchema7UndefinedType
  | JsonSchema7AnyOfType
  | JsonSchema7RefType
  | JsonSchema7AnyType;

function addMeta(schemaDef: any, properties: Record<string, unknown>) {
  if (schemaDef.meta && typeof schemaDef.meta === 'object') {
    return { ...properties, ...schemaDef.meta };
  }

  return properties;
}

export function parseDef<T>(
  schemaDef: any,
  path: string[],
  visited: { def: ZodTypeDef; path: string[] }[],
  useRefs = true
): JsonSchema7Type | undefined {
  if (useRefs && visited) {
    const wasVisited = visited.find((x) => Object.is(x.def, schemaDef));

    if (wasVisited) {
      return addMeta(schemaDef, { $ref: `#/${wasVisited.path.join('/')}` });
    } else {
      visited.push({ def: schemaDef, path });
    }
  }

  const ret = parseSchema(schemaDef, path, visited, useRefs);

  // optional, if meta fields are defined on the schema, it will add them to the
  // json schema
  if (schemaDef.meta && typeof schemaDef.meta === 'object') {
    return addMeta(schemaDef, ret);
  }

  return ret;
}

function parseSchema(
  schemaDef: any,
  path: string[],
  visited: { def: ZodTypeDef; path: string[] }[],
  useRefs = true
) {
  const def = schemaDef._def;

  switch (schemaDef.constructor.name) {
    case 'ZodString':
      return parseStringDef(def);
    case 'ZodNumber':
      return parseNumberDef(def);
    case 'ZodObject':
      return parseObjectDef(def, path, visited, useRefs);
    case 'ZodBigInt':
      return parseBigintDef(def);
    case 'ZodBoolean':
      return parseBooleanDef();
    case 'ZodDefault': {
      return {
        ...parseDef(def.innerType, path, visited, useRefs),
        default: def.defaultValue(),
      };
    }
    case 'ZodDate':
      return parseDateDef();
    case 'ZodUndefined':
      return parseUndefinedDef();
    case 'ZodNull':
      return parseNullDef();
    case 'ZodArray':
      return parseArrayDef(def, path, visited, useRefs);
    case 'ZodNonEmptyArray':
      return parseNonEmptyArrayDef(def, path, visited, useRefs);
    case 'ZodUnion':
      return parseUnionDef(def, path, visited, useRefs);
    case 'ZodIntersection':
      return parseIntersectionDef(def, path, visited, useRefs);
    case 'ZodTuple':
      return parseTupleDef(def, path, visited, useRefs);
    case 'ZodRecord':
      return parseRecordDef(def, path, visited, useRefs);
    case 'ZodLiteral':
      return parseLiteralDef(def);
    case 'ZodEnum':
      return parseEnumDef(def);
    case 'ZodNativeEnum':
      return parseNativeEnumDef(def);
    case 'ZodNullable':
      return parseNullable(def, useRefs);
    case 'ZodOptional':
      return parseDef(def.innerType, path, visited, useRefs);
    case 'ZodEffects':
      const _def: any = parseDef(def.schema, path, visited, useRefs);
      return {
        ..._def,
        type: (_def.type || '') + ' (refinements)',
      };
    case 'ZodAny':
    case 'ZodUnknown':
      return {};
    case 'ZodFunction':
    case 'ZodLazy':
    case 'ZodPromise':
    case 'ZodVoid':
      return undefined;
    default:
      return ((_: unknown) => undefined)(schemaDef);
  }
}
