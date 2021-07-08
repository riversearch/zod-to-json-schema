import { annotate } from '../src/lib/schema-utils';
import { z } from 'zod';
import { zodToJsonSchema } from '../src/zodToJsonSchema';

describe('with duplicate properties', () => {
  const dateSchema = annotate({ description: 'Date' }, z.date());
  const schema = annotate(
    { description: 'Hi' },
    z.object({
      foo: dateSchema,
      bar: dateSchema,
    })
  );

  it('uses refs if useRefs is true', () => {
    expect(zodToJsonSchema(schema)).toMatchObject({
      properties: {
        foo: {
          description: 'Date',
          type: 'string',
        },
        bar: {
          $ref: expect.any(String),
          description: 'Date',
        },
      },
    });
  });

  it('does not use refs if useRefs is false', () => {
    expect(zodToJsonSchema(schema, { useRefs: false })).toMatchObject({
      properties: {
        foo: {
          description: 'Date',
          type: 'string',
        },
        bar: {
          description: 'Date',
          type: 'string',
        },
      },
    });
  });
});
