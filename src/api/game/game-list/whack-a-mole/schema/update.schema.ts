import z from 'zod';

import { fileSchema, StringToBooleanSchema } from '@/common';

/**
 * Schema for updating Whack-a-Mole game
 */
export const UpdateWhackAMoleSchema = z.object({
  name: z.string().max(128).trim().optional(),
  description: z.string().max(256).trim().optional(),
  thumbnail_image: fileSchema({}).optional(),
  is_published: StringToBooleanSchema.optional(),
  // Optional game settings
  time_limit: z.number().int().positive().optional(),
  speed_increment: z.number().int().positive().optional(),
  min_speed: z.number().int().positive().optional(),
});

export type IUpdateWhackAMole = z.infer<typeof UpdateWhackAMoleSchema>;
