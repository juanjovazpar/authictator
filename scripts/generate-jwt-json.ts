import fs from 'fs';
import path from 'path';
import * as jose from 'jose';

async function generateJWKS() {
    const pubKeyPath = path.resolve('./keys/public.pem');
    const jwksPath = path.resolve('./keys/jwks.json');

    if (!fs.existsSync(pubKeyPath)) {
        throw new Error('❌ We couldn\'t public.pem. Generate the keys first!');
    }

    const pubPem = fs.readFileSync(pubKeyPath, 'utf8');
    const key = await jose.importSPKI(pubPem, 'RS256');
    const jwk = await jose.exportJWK(key);

    jwk.kid = 'authictator-key-1';
    jwk.alg = 'RS256';
    jwk.use = 'sig';

    const jwks = { keys: [jwk] };
    fs.writeFileSync(jwksPath, JSON.stringify(jwks, null, 2));

    console.log(`✅ jwks.json generated at ${jwksPath}`);
}

generateJWKS().catch(console.error);
