import speakeasy, { GeneratedSecret } from 'speakeasy';

export const verifySecret = (secret: string, token: string): boolean =>
    speakeasy.totp.verify({
        encoding: 'base32',
        secret,
        token,
    });

export const getSecret = (): GeneratedSecret => speakeasy.generateSecret();
