import { create } from 'zustand';

interface CMSState {
  activeTab: string;
  formData: Record<string, unknown>;
  dirty: boolean;
  setActiveTab: (tab: string) => void;
  setFormData: (key: string, data: unknown) => void;
  setDirty: (dirty: boolean) => void;
  resetForm: (key: string) => void;
}

export const useCMSStore = create<CMSState>((set) => ({
  activeTab: 'dashboard',
  formData: {},
  dirty: false,

  setActiveTab: (tab) => set({ activeTab: tab, dirty: false }),

  setFormData: (key, data) =>
    set((state) => ({
      formData: { ...state.formData, [key]: data },
      dirty: true,
    })),

  setDirty: (dirty) => set({ dirty }),

  resetForm: (key) =>
    set((state) => {
      const newFormData = { ...state.formData };
      delete newFormData[key];
      return { formData: newFormData, dirty: false };
    }),
}));
