import { create } from "zustand"

interface SidebarState {
  sidebarOpen: boolean
  adminExpanded: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  toggleAdmin: () => void
  setAdminExpanded: (expanded: boolean) => void
}

export const useSidebarStore = create<SidebarState>((set) => ({
  sidebarOpen: true,
  adminExpanded: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleAdmin: () => set((state) => ({ adminExpanded: !state.adminExpanded })),
  setAdminExpanded: (expanded) => set({ adminExpanded: expanded }),
}))
