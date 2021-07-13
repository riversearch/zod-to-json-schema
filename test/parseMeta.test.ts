import { annotate } from '../src/lib/schema-utils';
import { z } from 'zod';
import { zodToJsonSchema } from '../src/zodToJsonSchema';

describe('With meta properties', () => {
  it('adds the meta properties to the json schema', () => {
    const schema = annotate(
      { description: 'Hi' },
      z.object({
        foo: annotate({ description: 'foo' }, z.string()),
      })
    );

    expect(zodToJsonSchema(schema)).toEqual({
      $schema: 'http://json-schema.org/draft-07/schema#',
      additionalProperties: false,
      description: 'Hi',
      properties: {
        foo: {
          description: 'foo',
          type: 'string',
        },
      },
      required: ['foo'],
      type: 'object',
    });
  });

  it('can specify a custom format', () => {
    const schema = annotate(
      { format: 'custom-date-time', type: 'object' },
      z.date()
    );

    expect(zodToJsonSchema(schema)).toMatchObject({
      format: 'custom-date-time',
      type: 'object',
    });
  });
});
