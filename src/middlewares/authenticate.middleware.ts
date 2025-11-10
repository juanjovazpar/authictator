import { IUserToken } from "../interfaces";
import fastify, { FastifyRequest, FastifyReply } from "fastify";
import { HTTP, LITERALS } from "../constants";

export const authenticate = async function (req: FastifyRequest, res: FastifyReply) {
  try {
    const user: IUserToken = await req.jwtVerify();
    const cacheKey: string = `sessions:${user.sub}:${user.jwti}`;
    // TODO: Abstract into cache interface
    const exists: number = await req.server.cache.exists(cacheKey);

    if (!exists) {
      return res.status(HTTP.CODES.Unauthorized).send({ message: LITERALS.TOKEN_REVOKED });
    }
  } catch (err) {
    res.send(err);
  }
};
