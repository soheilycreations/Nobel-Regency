import { z } from "zod";

export const guestDetailsSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(7, "Enter a valid phone number"),
  specialRequests: z.string().optional(),
});

export type GuestDetailsForm = z.infer<typeof guestDetailsSchema>;
