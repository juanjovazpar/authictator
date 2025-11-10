/* eslint-disable no-unused-vars */
import { IUser } from './user.interface';

export interface IRedisCache {
    setMFA(id: string, secret: string): Promise<'OK'>;
    getMFA(id: string): Promise<string | null>;
    delMFA(id: string): Promise<number>;

    setLockedLogin(id: string, userId: string): Promise<'OK'>;
    getLockedLogin(id: string): Promise<string | null>;
    delLockedLogin(id: string): Promise<number>;

    setSession(id: string, user: IUser): Promise<void>;
    delSession(id: string, userId: string): Promise<number>;
    delSessions(userId: string): Promise<number>;
    isSessionActive(id: string, userId: string): Promise<number>;
}
