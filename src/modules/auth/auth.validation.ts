import { z } from "zod";

export const registerUserSchema = z.object({
  body: z.object({
    username: z.string().min(3).trim(),
    email: z.string().email().trim(),
    fullName: z.string().min(1).trim(),
    password: z.string().min(6),
  }),
});

export const loginUserSchema = z.object({
  body: z.object({
    // Allow either username or email, but at least one must be present
    username: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().min(1),
  }).refine((data) => data.username || data.email, {
    message: "Username or email is required",
    path: ["username"], // Attach error to username to avoid top-level error
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(1),
    newPassword: z.string().min(6),
  }),
});

export const refreshAccessTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().optional(),
  }),
});
