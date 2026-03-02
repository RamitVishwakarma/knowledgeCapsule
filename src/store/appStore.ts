import { create } from "zustand";

export type ViewMode = "active" | "archived";

interface AppStore {
  selectedTopicId: string | null;
  selectedDocId: string | null;
  sidebarOpen: boolean;
  viewMode: ViewMode;
  selectTopic: (id: string | null) => void;
  selectDocument: (id: string | null) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setViewMode: (mode: ViewMode) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  selectedTopicId: null,
  selectedDocId: null,
  sidebarOpen: true,
  viewMode: "active",

  selectTopic: (id) => set({ selectedTopicId: id, selectedDocId: null }),
  selectDocument: (id) => set({ selectedDocId: id }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setViewMode: (mode) => set({ viewMode: mode }),
}));
