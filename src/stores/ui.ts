import { create } from 'zustand';

export interface UIStore {
  isDefaultSidebarOpen: boolean;
  setIsDefaultSidebarOpen: (isDefaultSidebarOpen: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isDefaultSidebarOpen: false,
  setIsDefaultSidebarOpen: (isDefaultSidebarOpen: boolean) =>
    set(() => ({ isDefaultSidebarOpen })),
}));
