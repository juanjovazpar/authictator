import { z } from 'zod';

/**
 * Schema for validating a permission's name.
 * Ensures the name is a string and does not exceed 15 characters.
 * @property {string} name - The permission's name.
 */
const nameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Name too short. Min 3 characters long')
    .max(15, 'Name too long. Max 15 characters long'),
});

/**
 * Schema for validating a permission's description.
 * Ensures the description is a string. The maximum length allowed is 30 characters.
 * @property {string} description - The permission's description.
 */
const descriptionSchema = z.object({
  description: z
    .string()
    .min(5, 'Description too short. Min 3 characters long')
    .max(30, 'Description too long. Max 30 characters long')
    .optional(),
});

/**
 * Schema for validating complete permission data.
 * Combines `nameSchema` and `descriptionSchema` to validate a permission's name and description.
 * @property {string} name - The permission's name.
 * @property {string} description - The permission's description.
 */
export const permissionSchema = nameSchema.extend(descriptionSchema.shape);
export type TPermissionInput = z.infer<typeof permissionSchema>;
