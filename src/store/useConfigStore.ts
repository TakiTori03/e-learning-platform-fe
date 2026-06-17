import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface IConfigStore {
  // UI State
  collapsedMenu: boolean;
  openKeys: string[];

  // Actions
  toggleCollapsedMenu: () => void;
  setCollapsedMenu: (collapsed: boolean) => void;
  setOpenKeys: (keys: string[] | ((prev: string[]) => string[])) => void;
}

export const useConfigStore = create<IConfigStore>()(
  persist(
    (set) => ({
      // 1. Initial State
      collapsedMenu: false,
      openKeys: [],

      // 2. Actions
      toggleCollapsedMenu: () =>
        set((state) => ({ collapsedMenu: !state.collapsedMenu })),

      setCollapsedMenu: (collapsed) => set({ collapsedMenu: collapsed }),

      setOpenKeys: (keys) =>
        set((state) => ({
          openKeys: typeof keys === "function" ? keys(state.openKeys) : keys,
        })),
    }),
    {
      name: "elearning-config", // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist collapsedMenu state, keep openKeys in-memory per session
      partialize: (state) => ({
        collapsedMenu: state.collapsedMenu,
      }),
    }
  )
);

export default useConfigStore;
