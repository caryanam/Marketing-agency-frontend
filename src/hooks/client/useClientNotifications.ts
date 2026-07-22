import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clientApiFetch } from "@/lib/api";
import toast from "react-hot-toast";

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export function useClientNotifications(unreadOnly = false) {
  return useQuery<NotificationItem[]>({
    queryKey: ["clientNotifications", unreadOnly],
    queryFn: async () => {
      const response = await clientApiFetch<NotificationItem[]>(
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

export function useClientUnreadCount() {
  return useQuery<number>({
    queryKey: ["clientNotificationsUnreadCount"],
    queryFn: async () => {
      const response = await clientApiFetch<number>("/api/notifications/unread-count");
      if (response.status === "SUCCESS") {
        return response.data ?? 0;
      }
      throw new Error(response.message || "Failed to fetch unread count");
    },
    refetchInterval: 10000, // Background poll every 10 seconds
  });
}

export function useClientMarkRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (notificationIds: number[]) => {
      const response = await clientApiFetch("/api/notifications/mark-read", {
        method: "PUT",
        body: { notificationIds },
      });
      if (response.status !== "SUCCESS") {
        throw new Error(response.message || "Failed to mark notifications as read");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientNotifications"] });
      queryClient.invalidateQueries({ queryKey: ["clientNotificationsUnreadCount"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Error updating notifications");
    },
  });
}

export function useClientMarkAllRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await clientApiFetch("/api/notifications/mark-all-read", {
        method: "PUT",
      });
      if (response.status !== "SUCCESS") {
        throw new Error(response.message || "Failed to mark all as read");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientNotifications"] });
      queryClient.invalidateQueries({ queryKey: ["clientNotificationsUnreadCount"] });
      toast.success("All notifications marked as read");
    },
    onError: (err: any) => {
      toast.error(err.message || "Error updating notifications");
    },
  });
}
