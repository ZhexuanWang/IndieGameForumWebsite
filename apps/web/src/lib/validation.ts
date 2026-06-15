import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export type LoginSchema = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      'Password must include uppercase, lowercase, number and special character',
    ),
})

export type RegisterSchema = z.infer<typeof registerSchema>

export const projectTypeEnum = z.enum(['showcase', 'sale', 'custom'])
export const projectStatusEnum = z.enum(['draft', 'published', 'archived'])

export const createProjectSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be under 200 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters'),
  type: projectTypeEnum,
  categoryId: z.string().uuid().optional().or(z.literal('')),
  price: z.number().min(0).optional(),
  tagsString: z.string().optional(),
  thumbnailUrl: z.string().url().optional().or(z.literal('')),
  demoUrl: z.string().url().optional().or(z.literal('')),
})

export type CreateProjectSchema = z.infer<typeof createProjectSchema>

export const updateProjectSchema = createProjectSchema.extend({
  status: projectStatusEnum.optional(),
})

export type UpdateProjectSchema = z.infer<typeof updateProjectSchema>

export const projectFormSchema = createProjectSchema.extend({
  status: projectStatusEnum.optional(),
})

export type ProjectFormSchema = z.infer<typeof projectFormSchema>

export const createThreadSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(300, 'Title must be under 300 characters'),
  body: z
    .string()
    .min(10, 'Body must be at least 10 characters')
    .max(10000, 'Body must be under 10000 characters'),
  categoryId: z.string().uuid().optional().or(z.literal('')),
})

export type CreateThreadSchema = z.infer<typeof createThreadSchema>

export const createPostSchema = z.object({
  content: z
    .string()
    .min(2, 'Reply must be at least 2 characters')
    .max(10000, 'Reply must be under 10000 characters'),
})

export type CreatePostSchema = z.infer<typeof createPostSchema>
