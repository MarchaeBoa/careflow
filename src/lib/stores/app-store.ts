import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Locale, Theme } from "@/lib/constants";
import { DEFAULT_LOCALE, THEMES } from "@/lib/constants";

// ─── Notification Type ───────────────────────────────────────────────────────

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  read: boolean;
  link: string | null;
  created_at: string;
}

// ─── Store State ─────────────────────────────────────────────────────────────

interface AppState {
  // Sidebar
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;

  // Organization
  currentOrganizationId: string | null;

  // Locale & Theme
  locale: Locale;
  theme: Theme;

  // Notifications
  notifications: AppNotification[];
  unreadCount: number;

  // Actions — Sidebar
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapsed: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Actions — Organization
  setCurrentOrganizationId: (id: string | null) => void;

  // Actions — Locale & Theme
  setLocale: (locale: Locale) => void;
  setTheme: (theme: Theme) => void;

  // Actions — Notifications
  addNotification: (
    notification: Omit<AppNotification, "id" | "read" | "created_at">
  ) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

// ─── Store ───────────────────────────────────────────────────────────────────

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      sidebarOpen: true,
      sidebarCollapsed: false,
      currentOrganizationId: null,
      locale: DEFAULT_LOCALE,
      theme: THEMES.SYSTEM,
      notifications: [],
      unreadCount: 0,

      // Sidebar actions
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      toggleSidebarCollapsed: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setSidebarCollapsed: (collapsed) =>
        set({ sidebarCollapsed: collapsed }),

      // Organization actions
      setCurrentOrganizationId: (id) =>
        set({ currentOrganizationId: id }),

      // Locale & Theme actions
      setLocale: (locale) => set({ locale }),

      setTheme: (theme) => set({ theme }),

      // Notification actions
      addNotification: (notification) => {
        const newNotification: AppNotification = {
          ...notification,
          id: crypto.randomUUID(),
          read: false,
          created_at: new Date().toISOString(),
        };
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }));
      },

      markNotificationRead: (id) =>
        set((state) => {
          const notifications = state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          );
          const unreadCount = notifications.filter((n) => !n.read).length;
          return { notifications, unreadCount };
        }),

      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({
            ...n,
            read: true,
          })),
          unreadCount: 0,
        })),

      removeNotification: (id) =>
        set((state) => {
          const notifications = state.notifications.filter(
            (n) => n.id !== id
          );
          const unreadCount = notifications.filter((n) => !n.read).length;
          return { notifications, unreadCount };
        }),

      clearNotifications: () =>
        set({ notifications: [], unreadCount: 0 }),
    }),
    {
      name: "careflow-app-store",
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            }
      ),
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        currentOrganizationId: state.currentOrganizationId,
        locale: state.locale,
        theme: state.theme,
      }),
    }
  )
);
