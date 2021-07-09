import { ZodStringDef } from 'zod';

export enum JsonSchemaStringFormatType {
  DATE = 'date',
  DATE_TIME = 'date-time',
  EMAIL = 'email',
  IPV4 = 'ipv4',
  IPV6 = 'ipv6',
  REGEX = 'regex',
  TIME = 'time',
  URI = 'uri',
}

export type JsonSchema7StringType = {
  format?: string;
  type: 'string';
  minLength?: number;
  maxLength?: number;
  pattern?: string;
};

export function parseStringDef(def: ZodStringDef): JsonSchema7StringType {
  const res: JsonSchema7StringType = {
    type: 'string',
  };

  if (def.checks) {
    for (const check of def.checks) {
      switch (check.kind) {
        case 'email':
          res.format = JsonSchemaStringFormatType.EMAIL;
          break;
        case 'regex':
          res.format = JsonSchemaStringFormatType.REGEX;
          res.pattern = check.regex.source;
          // These are all regexp based (except URL which is "new Uri()" based) and zod does not seem to expose the source regexp right now.
          break;
        case 'min':
          res.minLength = check.value;
          break;
        case 'max':
          res.maxLength = check.value;
          break;
        case 'url':
          res.format = JsonSchemaStringFormatType.URI;
          break;
      }
    }
  }

  return res;
}
