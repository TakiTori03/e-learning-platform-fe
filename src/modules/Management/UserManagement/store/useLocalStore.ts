import { create } from "zustand";
import type { IUserInfo } from "@/type";
import type { ActionsType } from "@/constants/enums";

interface UserManagementLocalState {
  actionMode: "" | ActionsType;
  idDetail: string | null;
  selectedUser: IUserInfo | null;
  isValuesChanged: boolean;

  setActionMode: (mode: "" | ActionsType) => void;
  setIdDetail: (id: string | null) => void;
  setSelectedUser: (user: IUserInfo | null) => void;
  setIsValuesChanged: (changed: boolean) => void;
  resetStore: () => void;
}

const initialState = {
  actionMode: "" as "" | ActionsType,
  idDetail: null,
  selectedUser: null,
  isValuesChanged: false,
};

export const useLocalStore = create<UserManagementLocalState>((set) => ({
  ...initialState,
  setActionMode: (actionMode) => set({ actionMode }),
  setIdDetail: (idDetail) => set({ idDetail }),
  setSelectedUser: (selectedUser) => set({ selectedUser }),
  setIsValuesChanged: (isValuesChanged) => set({ isValuesChanged }),
  resetStore: () => set(initialState),
}));

export default useLocalStore;
