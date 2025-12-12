import z from 'zod';

import { fileSchema, StringToBooleanSchema } from '@/common';

/**
 * Schema for creating a new Whack-a-Mole game
 * Whack-a-Mole doesn't require items since game logic is on frontend
 */
export const CreateWhackAMoleSchema = z.object({
  name: z.string().max(128).trim(),
  description: z.string().max(256).trim().optional(),
  thumbnail_image: fileSchema({}),
  is_publish_immediately: StringToBooleanSchema.default(false),
  // Optional game settings for future expansion
  time_limit: z.number().int().positive().default(30).optional(),
  speed_increment: z.number().int().positive().default(20).optional(),
  min_speed: z.number().int().positive().default(400).optional(),
});

export type ICreateWhackAMole = z.infer<typeof CreateWhackAMoleSchema>;
