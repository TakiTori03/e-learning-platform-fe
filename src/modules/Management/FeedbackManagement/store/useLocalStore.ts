import { create } from "zustand";
import { ActionsType } from "@/constants/enums";
import type { IFeedback } from "@/type";

interface ILocalStore {
  actionMode: ActionsType | "";
  selectedFeedback: IFeedback | null;
  replyFeedbackId: string | null;

  setActionMode: (mode: ActionsType | "") => void;
  setSelectedFeedback: (feedback: IFeedback | null) => void;
  setReplyFeedbackId: (id: string | null) => void;

  resetStore: () => void;
}

export const useLocalStore = create<ILocalStore>((set) => ({
  actionMode: "",
  selectedFeedback: null,
  replyFeedbackId: null,

  setActionMode: (actionMode) => set({ actionMode }),
  setSelectedFeedback: (selectedFeedback) => set({ selectedFeedback }),
  setReplyFeedbackId: (replyFeedbackId) => set({ replyFeedbackId }),

  resetStore: () =>
    set({
      actionMode: "",
      selectedFeedback: null,
      replyFeedbackId: null,
    }),
}));

export default useLocalStore;
