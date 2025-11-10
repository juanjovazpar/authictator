import * as crypto from 'crypto';
import { IUserAccessToken, IUserRefreshToken } from '../interfaces';

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

export const getUuid = (): string => crypto.randomUUID();

export const getAccessToken = (
    sub: string,
    roles: string[],
): IUserAccessToken => ({
    jwti: getUuid(),
    sub,
    roles,
});

export const getRefreshToken = (sub: string): IUserRefreshToken => ({
    jwti: getUuid(),
    sub,
});
