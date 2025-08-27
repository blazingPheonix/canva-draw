import * as z from 'zod';

export const userSchema = z.object({
    username: z.string().min(3).max(14),
    email: z.string().min(3).max(54),
    password: z.string().min(6).max(16)
})

export const roomSchma = z.object({
    name: z.string()
})

