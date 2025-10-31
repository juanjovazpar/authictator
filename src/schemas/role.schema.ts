import { z } from 'zod';

/**
 * Schema for validating a role's name.
 * Ensures the name is a string and does not exceed 15 characters.
 * @property {string} name - The role's name.
 */
const nameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Name too short. Min 3 characters long')
    .max(15, 'Name too long. Max 15 characters long'),
});

/**
 * Schema for validating a role's description.
 * Ensures the description is a string. The maximum length allowed is 30 characters.
 * @property {string} description - The role's description.
 */
const descriptionSchema = z.object({
  description: z
    .string()
    .min(5, 'Description too short. Min 3 characters long')
    .max(30, 'Description too long. Max 30 characters long')
    .optional(),
});

/**
 * Schema for validating a role's permissions.
 * Ensures the role include at least one permission.
 * @property {Array<string>} permissions - The role's permissions.
 */
const permissionsSchema = z.object({
  permissions: z
    .array(z.string())
    .min(1, 'Role must have at least 1 permission'),
});

/**
 * Schema for validating complete role data.
 * Combines `nameSchema` and `descriptionSchema` to validate an role's name and description.
 * @property {string} name - The role's name.
 * @property {string} description - The role's description.
 * @property {Array<string>} permissions - The role's permissions.
 */
export const roleSchema = nameSchema.extend(descriptionSchema.shape).extend(permissionsSchema.shape);
export type TRoleInput = z.infer<typeof roleSchema>;
