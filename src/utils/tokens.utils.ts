import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

export const base64UrlEncode = (input: Buffer): string => {
  return input
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

export const getHashedToken = async (
  expiration: number = 24 * 60 * 60 * 1000,
): Promise<string> => {
  const expirationTime = Date.now() + expiration;
  const randomBytes = crypto.randomBytes(32);
  const tokens = `${base64UrlEncode(randomBytes)}.${expirationTime}`;

  return tokens;
};

export const getJWToken =
  (secret: string) =>
    (payload: object): string => {
      const jwtSecret = secret || 'default-secret';
      const token: string = jwt.sign(payload, jwtSecret, {
        expiresIn: '1h',
      });

      return token;
    };
