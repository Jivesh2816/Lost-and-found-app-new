import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const signupSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Enter a valid email address')
    .refine((v) => v.toLowerCase().endsWith('@uwaterloo.ca'), {
      message: 'Must be a @uwaterloo.ca email address',
    }),
  password: z.string().min(8, 'Must be at least 8 characters'),
});

export const createPostSchema = z
  .object({
    status: z.enum(['lost', 'found']),
    title: z.string().trim().min(1, 'Title is required'),
    description: z.string().trim().optional(),
    category: z.string().min(1, 'Pick a category'),
    building: z.string().min(1, 'Pick a building'),
    otherLocation: z.string().trim().optional(),
  })
  .refine((data) => data.building !== 'Somewhere else' || data.otherLocation?.trim(), {
    message: 'Tell us where',
    path: ['otherLocation'],
  });

export const editPostSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().trim().optional(),
  category: z.string().min(1, 'Pick a category'),
  location: z.string().trim().min(1, 'Location is required'),
  status: z.enum(['lost', 'found', 'returned']),
});

export const contactSchema = z.object({
  name: z.string().trim().min(1, 'Your name is required'),
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
  message: z.string().trim().min(1, 'Say a bit about it'),
});
