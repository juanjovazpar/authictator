import { FastifyRequest, FastifyReply } from 'fastify';
import { MongoServerError } from 'mongodb';
import mongoose from 'mongoose';
import { ZodError } from 'zod';

import { HTTP, LITERALS } from '../constants';

type WithStatusCode = {
    statusCode: number;
    message: string;
};

export const errorHandler = async (
    _: FastifyRequest,
    res: FastifyReply,
    error: unknown,
) => {
    const err = error instanceof Error ? error : new Error('Unknown error');

    if (err instanceof ZodError) {
        res.status(HTTP.CODES.BadRequest).send({
            message: LITERALS.VALIDATION_FAILED,
            error: err.issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message,
            })),
        });
    } else if (
        err instanceof mongoose.Error.ValidationError ||
        (err as MongoServerError).code === 11000
    ) {
        res.status(HTTP.CODES.BadRequest).send({ error: err.message });
    } else if ('statusCode' in err) {
        const e = err as WithStatusCode;
        if (e.statusCode === HTTP.CODES.Unauthorized) {
            res.status(HTTP.CODES.Unauthorized).send({ error: e.message });
        } else {
            res.status(e.statusCode).send({ error: e.message });
        }
    } else {
        res.status(HTTP.CODES.InternalServerError).send({
            error: 'Internal Server Error',
        });
    }

    res.log.error(err);
};
