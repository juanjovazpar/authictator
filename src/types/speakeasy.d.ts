declare module 'speakeasy' {
    export interface GeneratedSecret {
        ascii: string;
        hex: string;
        base32: string;
        otpauth_url: string;
    }
    export function generateSecret(options?: any): any;
    export function totpVerify(options: any): boolean;
    export const totp = { verify: (options: any): boolean => { } };
}