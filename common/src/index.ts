import z, { string } from "zod";

export const signupInput = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string(),
});

export const signinInput = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const updateUser = z.object({
  email: z.string().email().optional(),
  username: z.string().optional(),
  password: z.string().min(6).optional(),
  profilePicture: z.string().optional(),
});

export const createBlogInput = z.object({
  title: z.string(),
  content: z.string(),
  category: z.string(),
  image: z.string(),
});

export const updateBlogInput = z.object({
  title: z.string(),
  content: z.string(),
  id: z.string(),
  category: z.string(),
  image: z.string(),
});

export type SignupInput = z.infer<typeof signupInput>;
export type SigninInput = z.infer<typeof signinInput>;
export type CreateBlogInput = z.infer<typeof createBlogInput>;
export type UpdateBlogInput = z.infer<typeof updateBlogInput>;
export type UpdateUser = z.infer<typeof updateUser>;
