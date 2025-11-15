import { create } from "zustand";

export type DraftType = {
  storyImage: File | null;
  title: string;
  categoryId: string;
  body: string;
  shortDescription: string;
};

export const initialDraft: DraftType = {
  storyImage: null,
  title: "",
  categoryId: "",
  body: "",
  shortDescription: "",
};

type Store = {
  draft: DraftType;
  setDraft: (
    partial: Partial<DraftType> | ((prev: DraftType) => Partial<DraftType>)
  ) => void;
  clearDraft: () => void;
};

export const useStoryDraft = create<Store>((set) => ({
  draft: initialDraft,

  setDraft: (partial) =>
    set((state) => ({
      draft:
        typeof partial === "function"
          ? { ...state.draft, ...partial(state.draft) }
          : { ...state.draft, ...partial },
    })),

  clearDraft: () => set({ draft: initialDraft }),
}));