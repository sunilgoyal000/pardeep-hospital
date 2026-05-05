import { z } from "zod";

export const NotificationTypeSchema = z.enum([
  "APPOINTMENT",
  "PATIENT",
  "DOCTOR",
  "PHARMACY",
  "LAB",
  "SYSTEM",
]);
export type NotificationType = z.infer<typeof NotificationTypeSchema>;

export const ListNotificationsQuerySchema = z.object({
  unreadOnly: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => v === "true"),
  type: NotificationTypeSchema.optional(),
  limit: z.coerce.number().int().min(1).max(200).default(100),
});
export type ListNotificationsQuery = z.infer<typeof ListNotificationsQuerySchema>;

export interface NotificationView {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string; // ISO
}
