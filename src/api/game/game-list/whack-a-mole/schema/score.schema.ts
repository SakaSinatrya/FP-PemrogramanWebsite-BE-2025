import z from 'zod';

/**
 * Schema for saving whack-a-mole score
 */
export const SaveScoreSchema = z.object({
  score: z.number().int().min(0),
  time_taken: z.number().int().min(0).optional(),
});

export type ISaveScore = z.infer<typeof SaveScoreSchema>;
