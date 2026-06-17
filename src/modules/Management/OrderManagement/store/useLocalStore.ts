import { create } from "zustand";
import { ActionsType } from "@/constants/enums";
import type { IOrder, IPayment } from "@/type";

interface ILocalStore {
  actionMode: ActionsType | "";
  idDetail: string | null;
  isValuesChanged: boolean;
  selectedOrder: IOrder | null;
  selectedTx: IPayment | null;

  setActionMode: (mode: ActionsType | "") => void;
  setIdDetail: (id: string | null) => void;
  setValuesChanged: (changed: boolean) => void;
  setSelectedOrder: (order: IOrder | null) => void;
  setSelectedTx: (tx: IPayment | null) => void;

  resetStore: () => void;
}

export const useLocalStore = create<ILocalStore>((set) => ({
  actionMode: "",
  idDetail: null,
  isValuesChanged: false,
  selectedOrder: null,
  selectedTx: null,

  setActionMode: (actionMode) => set({ actionMode }),
  setIdDetail: (idDetail) => set({ idDetail }),
  setValuesChanged: (isValuesChanged) => set({ isValuesChanged }),
  setSelectedOrder: (selectedOrder) => set({ selectedOrder }),
  setSelectedTx: (selectedTx) => set({ selectedTx }),

  resetStore: () =>
    set({
      actionMode: "",
      idDetail: null,
      isValuesChanged: false,
      selectedOrder: null,
      selectedTx: null,
    }),
}));

export default useLocalStore;
