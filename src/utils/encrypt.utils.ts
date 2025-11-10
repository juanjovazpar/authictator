import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const SECRET_KEY = process.env.ENCRYPTION_KEY || 'secret';
const IV_LENGTH = 16;

export function encrypt(secret: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(
        ALGORITHM,
        Buffer.from(SECRET_KEY, 'hex'),
        iv,
    );

    const encrypted = Buffer.concat([
        cipher.update(secret, 'utf8'),
        cipher.final(),
    ]);
    const tag = cipher.getAuthTag();

    return Buffer.concat([iv, tag, encrypted]).toString('base64');
}

export function decrypt(encrypted: string): string {
    const data = Buffer.from(encrypted, 'base64');
    const iv = data.slice(0, IV_LENGTH);
    const tag = data.slice(IV_LENGTH, IV_LENGTH + 16);
    const text = data.slice(IV_LENGTH + 16);

    const decipher = crypto.createDecipheriv(
        ALGORITHM,
        Buffer.from(SECRET_KEY, 'hex'),
        iv,
    );
    decipher.setAuthTag(tag);

    return decipher.update(text) + decipher.final('utf8');
}
