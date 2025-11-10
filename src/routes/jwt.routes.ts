import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fs from 'fs';
import path from 'path';

import { ROUTES, HTTP } from '../constants';

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: HTTP.METHODS.GET,
    url: ROUTES.JWTS_JSON,
    handler: async (_: FastifyRequest, res: FastifyReply) => {
      const jwksPath = path.join(__dirname, '../../keys/jwks.json');
      const data = JSON.parse(fs.readFileSync(jwksPath, 'utf-8'));
      return res.send(data);
    },
  });
}
