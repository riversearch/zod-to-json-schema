import { AnnotatedSchema } from './lib/schema-utils';
import { JsonSchema7Type, parseDef } from './parseDef';

export type ZodToJsonSchemaOptions = { name?: string; useRefs?: boolean };

/**
 * @param schema The Zod schema to be converted
 */
function zodToJsonSchema(
  schema: AnnotatedSchema<any>,
  opts?: ZodToJsonSchemaOptions
):
  | ({
      $schema: 'http://json-schema.org/draft-07/schema#';
    } & JsonSchema7Type)
  | unknown;

/**
 * @param schema The Zod schema to be converted
 * @param name The (optional) name of the schema. If a name is passed, the schema will be put in 'definitions' and referenced from the root.
 */
function zodToJsonSchema<T extends string>(
  schema: AnnotatedSchema<any>,
  opts?: ZodToJsonSchemaOptions
): {
  $schema: 'http://json-schema.org/draft-07/schema#';
  $ref: string;
  definitions: Record<T, JsonSchema7Type>;
};
function zodToJsonSchema(
  schema: AnnotatedSchema<any>,
  opts?: ZodToJsonSchemaOptions
): JsonSchema7Type {
  const { name, useRefs = true } = opts || {};

  return name === undefined
    ? {
        $schema: 'http://json-schema.org/draft-07/schema#',
        ...parseDef(schema, [], [], useRefs),
      }
    : {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $ref: `#/definitions/${name}`,
        definitions: {
          [name]: parseDef(schema, ['definitions', name], [], useRefs) || {},
        },
      };
}

export { zodToJsonSchema };
