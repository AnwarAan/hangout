import * as z from "zod";

const MAX_FILE_SIZE = 3000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/heic", "file/pdf"];

export const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Event name must be at least 2 character(s)",
    })
    .max(50),
  location: z.object({
    isOnline: z.string(),
    province: z.string().optional(),
    regency: z.string().optional(),
    district: z.string().optional(),
    address: z.string().optional(),
  }),
  date: z.date(),
  time: z.object({
    hours: z.string(),
    minutes: z.string(),
    type: z.string(),
  }),
  description: z.string().min(2),
  type: z.string(),
  price: z.string().optional(),
  category: z.string(),
  tags: z.string().array(),
  file: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 3MB.`)
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.type), "Only .jpg, .jpeg, .png and .pdf"),
});

export const eventRegisterSchema = z.object({
  referral: z.string().optional(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
});

export const eventPromos = z.object({
  name: z.string(),
  percentage: z.string(),
  limit: z.string(),
});

export const eventComment = z.object({
  review: z.string().min(2, {
    message: "Please write something ...",
  }),
});

export const loginSchema = z.object({
  email: z.string().email("This is not a valid email.").min(2, {
    message: "Minimun 2 character",
  }),
  password: z.string().min(6, {
    message: "Minimun 6 character",
  }),
});

export const registerSchema = z.object({
  firstName: z.string().min(2, {
    message: "Minimun 2 character",
  }),
  lastName: z.string().min(2, {
    message: "Minimun 2 character",
  }),
  email: z.string().email("This is not a valid email.").min(2, {
    message: "Minimun 2 character",
  }),
  password: z.string().min(6, {
    message: "Minimun 6 character",
  }),
});

export const sendEmailSchema = z.object({
  email: z.string().email("This is not a valid email.").min(2, {
    message: "Minimun 2 character",
  }),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, {
    message: "Minimun 6 character",
  }),
  confirmPassword: z.string().min(6, {
    message: "Minimun 6 character",
  }),
});
