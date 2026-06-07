import { create } from 'zustand';

import type { PageId } from '../types';

interface NavigationState {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  currentPage: 'home',
  setCurrentPage: (page) => set({ currentPage: page }),
}));
