/* eslint-disable no-unused-vars */
const enum ENDPOINTS {
    SIGNIN = '/signin',
    SIGNIN_MFA = '/signinmfa',
    SIGNUP = '/signup',
    FORGOT = '/forgot',
    VERIFY_USER = '/verify',
    PERMISSIONS = '/permissions',
    ROLES = '/roles',
    WHOAMI = '/whoami',
    LOGOUT = '/logout',
    HEALTHZ = '/healthz',
    MFA = '/mfa',
    JWTS_JSON = '/.well-known/jwks.json',
}

export enum PARAMS {
    USER_ID = 'user_id',
    ROLE_ID = 'role_id',
    PERMISSION_ID = 'permission_id',
    FORGOT_PASSWORD_TOKEN = 'resetPasswordToken',
    VERIFY_USER_TOKEN = 'verificationToken',
}

export const ROUTES = {
    SIGNUP: ENDPOINTS.SIGNUP,
    SIGNIN: ENDPOINTS.SIGNIN,
    SIGNIN_MFA: ENDPOINTS.SIGNIN_MFA,
    VERIFY_USER: `${ENDPOINTS.VERIFY_USER}/:${PARAMS.VERIFY_USER_TOKEN}`,
    REQUEST_FORGOT_PASSWORD: ENDPOINTS.FORGOT,
    SET_PASSWORD: `${ENDPOINTS.FORGOT}/:${PARAMS.FORGOT_PASSWORD_TOKEN}`,
    PERMISSIONS: ENDPOINTS.PERMISSIONS,
    PERMISSION: `${ENDPOINTS.PERMISSIONS}/:${PARAMS.PERMISSION_ID}`,
    ROLES: ENDPOINTS.ROLES,
    ROLE: `${ENDPOINTS.ROLES}/:${PARAMS.ROLE_ID}`,
    WHOAMI: ENDPOINTS.WHOAMI,
    LOGOUT: ENDPOINTS.LOGOUT,
    HEALTHZ: ENDPOINTS.HEALTHZ,
    MFA: ENDPOINTS.MFA,
    JWTS_JSON: ENDPOINTS.JWTS_JSON,
};
