import { z } from 'zod';

import { permissionNameSchema } from './permission.schema';
import { LITERALS } from '../constants/literals';

const adminRoleName = process.env.ADMIN_ROLE_NAME || 'admin';

/**
 * Schema for validating a role's name.
 * Ensures the name is a string and does not exceed 30 characters.
 * @property {string} name - The role's name.
 */
const roleNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Name too short. Min 3 characters long')
    .max(30, 'Name too long. Max 15 characters long')
    .refine((val) => val !== adminRoleName, {
      message: LITERALS.NAME_FORBIDDEN,
    }),
});

/**
 * Schema for validating a role's description.
 * Ensures the description is a string. The maximum length allowed is 100 characters.
 * @property {string} description - The role's description.
 */
const roleDescriptionSchema = z.object({
  description: z
    .string()
    .trim()
    .min(5, 'Description too short. Min 3 characters long')
    .max(100, 'Description too long. Max 100 characters long')
    .optional(),
});

/**
 * Schema for validating a role's permissions.
 * Ensures the role include at least one permission.
 * @property {Array<string>} permissions - The role's permissions.
 */
const permissionsSchema = z.object({
  permissions: z.array(permissionNameSchema).min(1, 'Role must have at least 1 permission'),
});

/**
 * Schema for validating complete role data.
 * Combines `roleNameSchema` and `roleDescriptionSchema` to validate an role's name and description.
 * @property {string} name - The role's name.
 * @property {string} description - The role's description.
 * @property {Array<string>} permissions - The role's permissions.
 */
export const roleSchema = roleNameSchema
  .extend(roleDescriptionSchema.shape)
  .extend(permissionsSchema.shape);
export type TRoleInput = z.infer<typeof roleSchema>;
