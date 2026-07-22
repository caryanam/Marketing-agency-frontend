import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApiFetch } from "@/lib/api";
import toast from "react-hot-toast";

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export function useAdminNotifications(unreadOnly = false) {
  return useQuery<NotificationItem[]>({
    queryKey: ["adminNotifications", unreadOnly],
    queryFn: async () => {
      const response = await adminApiFetch<NotificationItem[]>(
        `/api/notifications?unreadOnly=${unreadOnly}`
      );
      if (response.status === "SUCCESS") {
        return response.data || [];
      }
      throw new Error(response.message || "Failed to fetch notifications");
    },
    refetchInterval: 10000, // Background poll every 10 seconds
  });
}

export function useAdminUnreadCount() {
  return useQuery<number>({
    queryKey: ["adminNotificationsUnreadCount"],
    queryFn: async () => {
      const response = await adminApiFetch<number>("/api/notifications/unread-count");
      if (response.status === "SUCCESS") {
        return response.data ?? 0;
      }
      throw new Error(response.message || "Failed to fetch unread count");
    },
    refetchInterval: 10000, // Background poll every 10 seconds
  });
}

export function useAdminMarkRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (notificationIds: number[]) => {
      const response = await adminApiFetch("/api/notifications/mark-read", {
        method: "PUT",
        body: { notificationIds },
      });
      if (response.status !== "SUCCESS") {
        throw new Error(response.message || "Failed to mark notifications as read");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminNotifications"] });
      queryClient.invalidateQueries({ queryKey: ["adminNotificationsUnreadCount"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Error updating notifications");
    },
  });
}

export function useAdminMarkAllRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await adminApiFetch("/api/notifications/mark-all-read", {
        method: "PUT",
      });
      if (response.status !== "SUCCESS") {
        throw new Error(response.message || "Failed to mark all as read");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminNotifications"] });
      queryClient.invalidateQueries({ queryKey: ["adminNotificationsUnreadCount"] });
      toast.success("All notifications marked as read");
    },
    onError: (err: any) => {
      toast.error(err.message || "Error updating notifications");
    },
  });
}
