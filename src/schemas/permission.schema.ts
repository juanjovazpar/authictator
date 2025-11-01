import { z } from 'zod';

/**
 * Schema for validating a permission's name.
 * Ensures the name is a string and does not exceed 30 characters.
 * @property {string} name - The permission's name.
 */
export const permissionNameSchema = z
  .string()
  .trim()
  .min(3, 'Name too short. Min 3 characters long')
  .max(30, 'Name too long. Max 30 characters long');

const permissionNameSchemaObj = z.object({
  name: permissionNameSchema,
});

/**
 * Schema for validating a permission's description.
 * Ensures the description is a string. The maximum length allowed is 100 characters.
 * @property {string} description - The permission's description.
 */
const permissionDescriptionSchema = z.object({
  description: z
    .string()
    .trim()
    .min(5, 'Description too short. Min 3 characters long')
    .max(100, 'Description too long. Max 100 characters long')
    .optional(),
});

/**
 * Schema for validating complete permission data.
 * Combines `permissionNameSchemaObj` and `permissionDescriptionSchema` to validate a permission's name and description.
 * @property {string} name - The permission's name.
 * @property {string} description - The permission's description.
 */
export const permissionSchema = permissionNameSchemaObj.extend(permissionDescriptionSchema.shape);
export type TPermissionInput = z.infer<typeof permissionSchema>;
