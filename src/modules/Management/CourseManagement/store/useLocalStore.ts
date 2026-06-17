import { create } from "zustand";
import type { ICategory } from "@/type";
import type { ActionsType } from "@/constants/enums";

interface CourseManagementLocalState {
  // Category management UI states
  actionMode: "" | ActionsType;
  idDetail: string | null;
  selectedCategory: ICategory | null;
  selectedIcon: string;
  isValuesChanged: boolean;

  setActionMode: (mode: "" | ActionsType) => void;
  setIdDetail: (id: string | null) => void;
  setSelectedCategory: (category: ICategory | null) => void;
  setSelectedIcon: (icon: string) => void;
  setIsValuesChanged: (changed: boolean) => void;
  resetStore: () => void;
}

const initialState = {
  actionMode: "" as "" | ActionsType,
  idDetail: null,
  selectedCategory: null,
  selectedIcon: "",
  isValuesChanged: false,
};

export const useLocalStore = create<CourseManagementLocalState>((set) => ({
  ...initialState,
  setActionMode: (actionMode) => set({ actionMode }),
  setIdDetail: (idDetail) => set({ idDetail }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setSelectedIcon: (selectedIcon) => set({ selectedIcon }),
  setIsValuesChanged: (isValuesChanged) => set({ isValuesChanged }),
  resetStore: () => set(initialState),
}));

export default useLocalStore;
