import { z } from "zod";

export const updateAccountDetailsSchema = z.object({
  body: z.object({
    fullName: z.string().min(1).trim(),
    email: z.string().email().trim(),
  }),
});

export const updateAvatarSchema = z.object({
    // Validation for file presence is often handled by middleware checking req.file
    // But we can validate body if strict, or just rely on controller check for req.file
});

export const updateCoverImageSchema = z.object({});

export const changePasswordSchema = z.object({
    body: z.object({
        oldPassword: z.string().min(1),
        newPassword: z.string().min(6)
    })
})
