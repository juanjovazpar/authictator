import { FastifyRequest } from 'fastify';
import { z } from 'zod';

/**
 * A middleware function generator that validates the request body against a given schema.
 *
 * This function uses Zod, a schema validation library, to ensure that the incoming request's body
 * complies with the specified schema. If the request body is invalid, Zod will automatically
 * throw a validation error.
 *
 * @param {z.ZodTypeAny} schema - A Zod schema that defines the structure and validation rules., etc.
 *
 * @returns {Function} - A Fastify pre-validation handler that checks the request body against
 * the provided schema.
 *
 * @example
 * const schema = z.object({
 *   email: z.string().email(),
 *   password: z.string().min(8)
 * });
 *
 * fastify.route({
 *   method: 'POST',
 *   url: '/login',
 *   preValidation: [getValidatorHandler(schema)],
 *   handler: loginHandler
 * });
 *
 * @throws {z.ZodError} - Throws an error if the request body does not match the schema.
 *
 * @see https://zod.dev for more information about Zod and schema validation.
 */
export const getValidatorHandler = (schema: z.ZodTypeAny) => {
  return async (req: FastifyRequest) => {
    req.body = schema.parse(req.body);
  };
};
