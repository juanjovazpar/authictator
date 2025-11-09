import Redis from 'ioredis';
import { IUser } from '../interfaces';

export const cache = (() => {
    const MFA_CACHE_KEY = 'mfa';
    const LOCKED_LOGINS_CACHE_KEY = 'locked_logins';
    const SESSIONS_CACHE_KEY = 'sessions';

    const client = new Redis({
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        username: process.env.REDIS_WRITER_USERNAME,
        password: process.env.REDIS_WRITER_PASSWORD,
    });

    return {
        setMFA: (id: string, secret: string): Promise<'OK'> =>
            client.set(`${MFA_CACHE_KEY}:${id}`, secret, 'EX', 300),

        getMFA: (id: string): Promise<string | null> =>
            client.get(`${MFA_CACHE_KEY}:${id}`),

        delMFA: (id: string): Promise<number> =>
            client.del(`${MFA_CACHE_KEY}:${id}`),

        setLockedLogin: (id: string, userId: string): Promise<'OK'> =>
            client.set(`${LOCKED_LOGINS_CACHE_KEY}:${id}`, userId, 'EX', 120),

        getLockedLogin: (id: string): Promise<string | null> =>
            client.get(`${LOCKED_LOGINS_CACHE_KEY}:${id}`),

        delLockedLogin: (id: string): Promise<number> =>
            client.del(`${LOCKED_LOGINS_CACHE_KEY}:${id}`),

        setSession: async (id: string, user: IUser): Promise<void> => {
            const key = `${SESSIONS_CACHE_KEY}:${user._id}:${id}`;
            await client.hset(key, {
                sub: user._id,
                name: user.name,
                email: user.email,
                roles: JSON.stringify(user.roles),
            });
            await client.expire(key, 10000);
        },

        delSession: (id: string, userId: string): Promise<number> =>
            client.del(`${SESSIONS_CACHE_KEY}:${userId}:${id}`),

        delSessions: async (id: string): Promise<number> => {
            const keys: string[] = await client.keys(`${SESSIONS_CACHE_KEY}:${id}:*`);
            return keys.length ? client.del(...keys) : 0;
        },
    };
})();
