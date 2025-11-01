import { z } from 'zod';
import { sprintf } from 'sprintf-js';

import { isValidEmail, isValidPassword, PASSWORD_RULES } from '../utils';
import { LITERALS } from '../constants/literals';

/**
 * Schema for validating a user's name.
 * Ensures the name is a string and does not exceed 50 characters.
 * @property {string} name - The user's name.
 */
export const userNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Name too short. Min 3 characters long')
    .max(50, 'Name too long. Max 50 characters long'),
});
export type TNameInput = z.infer<typeof userNameSchema>;

/**
 * Schema for validating a user's email.
 * Ensures the email is a string, at least 5 characters long, and in a valid email format. The maximum length allowed is 200 characters.
 * @property {string} email - The user's email address.
 */
export const emailSchema = z.object({
  email: z
    .string()
    .trim()
    .min(5, 'Email too short. Min 5 characters long')
    .max(200, 'Email too long. Max 200 characters long')
    .refine((value: string) => isValidEmail(value), {
      message: LITERALS.INVALID_EMAIL_FORMAT,
    }),
});
export type TEmailInput = z.infer<typeof emailSchema>;

/**
 * Schema for validating a user's password.
 * Ensures the password is a string and conforms to custom password rules defined by the `isValidPassword` function. The maximum length allowed is 200 characters.
 * @property {string} password - The user's password.
 */
export const passwordSchema = z.object({
  password: z
    .string()
    .trim()
    .max(200, 'Password too long. Max 200 characters long')
    .refine((value: string) => isValidPassword(value), {
      message: sprintf(LITERALS.INVALID_PASSWORD_FORMAT, `${PASSWORD_RULES}`),
    }),
});
export type TPasswordInput = z.infer<typeof passwordSchema>;

/**
 * Schema for validating user login data.
 * Combines the `emailSchema` and `passwordSchema` to validate login credentials.
 * @property {string} email - The user's email address.
 * @property {string} password - The user's password.
 */
export const loginSchema = emailSchema.extend(passwordSchema.shape);
export type TLoginInput = z.infer<typeof loginSchema>;

/**
 * Schema for validating a user's roles.
 * Ensures the roles include at least one role.
 * @property {Array<string>} roles - The user's roles.
 */
const rolesSchema = z.object({
  roles: z
    .array(z.string())
    .min(1, 'Roles must have at least 1 role')
    .optional(),
});

/**
 * Schema for validating complete user data.
 * Combines `loginSchema` and `nameSchema` to validate a user's name, email, password and optional roles.
 * @property {string} name - The user's name.
 * @property {string} email - The user's email address.
 * @property {string} password - The user's password.
 * @property {Array<string>} roles - The user's roles.
 */
export const userSchema = loginSchema
  .extend(userNameSchema.shape)
  .extend(rolesSchema.shape);
export type TUserInput = z.infer<typeof userSchema>;
