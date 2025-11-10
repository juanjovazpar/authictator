import { generateKeyPairSync } from 'crypto';
import fs from 'fs';
import path from 'path';

const keysDir = './keys';
const privatePath = path.join(keysDir, 'private.pem');
const publicPath = path.join(keysDir, 'public.pem');
const envPath = path.resolve('./.env');
const PRIVATE_VAR_KEY = 'JWT_PRIVATE_KEY_PATH';
const PUBLIC_VAR_KEY = 'JWT_PUBLIC_KEY_PATH';

if (!fs.existsSync(privatePath) || !fs.existsSync(publicPath)) {
    const { privateKey, publicKey } = generateKeyPairSync('rsa', {
        modulusLength: 2048,
    });

    fs.mkdirSync(keysDir, { recursive: true });
    fs.writeFileSync(privatePath, privateKey.export({ type: 'pkcs1', format: 'pem' }));
    fs.writeFileSync(publicPath, publicKey.export({ type: 'spki', format: 'pem' }));

    console.log('🔐 Security keys generated in folder /keys');
}

let env = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';

const upsertEnv = (key: string, value: string) => {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (regex.test(env)) {
        env = env.replace(regex, `${key}=${value}`);
    } else {
        env += `\n${key}=${value}`;
    }
};

upsertEnv(PRIVATE_VAR_KEY, privatePath);
upsertEnv(PUBLIC_VAR_KEY, publicPath);

fs.writeFileSync(envPath, env.trim() + '\n');

console.log('✅ Keys files added to .env');
