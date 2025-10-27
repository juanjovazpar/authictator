const enum ENDPOINTS {
    SIGNIN = '/signin',
    SIGNUP = '/signup',
    FORGOT = '/forgot',
    VERIFY_USER = '/verify',
    WHOAMI = '/whoami',
}

export enum PARAMS {
    USER_ID = 'user_id',
    FORGOT_PASSWORD_TOKEN = 'resetPasswordToken',
    VERIFY_USER_TOKEN = 'verificationToken',
}

export const ROUTES = {
    SIGNUP: ENDPOINTS.SIGNUP,
    SIGNIN: ENDPOINTS.SIGNIN,
    VERIFY_USER: `${ENDPOINTS.VERIFY_USER}/:${PARAMS.VERIFY_USER_TOKEN}`,
    REQUEST_FORGOT_PASSWORD: ENDPOINTS.FORGOT,
    SET_PASSWORD: `${ENDPOINTS.FORGOT}/:${PARAMS.FORGOT_PASSWORD_TOKEN}`,
    WHOAMI: ENDPOINTS.WHOAMI,
};
