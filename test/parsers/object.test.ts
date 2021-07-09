import { JSONSchema7Type } from 'json-schema';
import { z } from 'zod';
import { parseObjectDef } from '../../src/parsers/object';

describe('object parser', () => {
  it('allows a catchall modifier', () => {
    const parsedSchema = parseObjectDef(
      z.object({ foo: z.string() }).catchall(z.unknown())._def,
      [],
      [],
      false
    );

    expect(parsedSchema).toMatchObject({ additionalProperties: true });
  });

  test('without catchall sets additionalProperties to false', () => {
    const parsedSchema = parseObjectDef(
      z.object({ foo: z.string() })._def,
      [],
      [],
      false
    );

    expect(parsedSchema).toMatchObject({ additionalProperties: false });
  });
});
