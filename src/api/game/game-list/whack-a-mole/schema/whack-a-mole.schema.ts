import { z } from 'zod';

export const CreateWhackAMoleSchema = z.object({
  name: z.string().min(1, 'Game name is required'),
  description: z.string().optional(),
  thumbnail_image: z.any().optional(),
  is_publish_immediately: z
    .string()
    .transform(value => value === 'true')
    .optional(),
  time_limit: z
    .string()
    .transform(value => Number.parseInt(value))
    .pipe(z.number().min(30).max(120))
    .optional()
    .default('60'),
  difficulty_level: z
    .enum(['easy', 'medium', 'hard'])
    .optional()
    .default('medium'),
});

export type ICreateWhackAMole = z.infer<typeof CreateWhackAMoleSchema>;

export const UpdateWhackAMoleSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  thumbnail_image: z.any().optional(),
  is_publish: z
    .string()
    .transform(value => value === 'true')
    .optional(),
  time_limit: z
    .string()
    .transform(value => Number.parseInt(value))
    .pipe(z.number().min(30).max(120))
    .optional(),
  difficulty_level: z.enum(['easy', 'medium', 'hard']).optional(),
});

export type IUpdateWhackAMole = z.infer<typeof UpdateWhackAMoleSchema>;
