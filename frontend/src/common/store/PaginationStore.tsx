import { create } from "zustand";

interface PaginationState {
  page: number;
  pageSize: number;
  totalItems: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setTotalItems: (count: number) => void;
  reset: () => void;
}

export const usePaginationStore = create<PaginationState>((set) => ({
  page: 1,
  pageSize: 10,
  totalItems: 0,

  setPage: (page) => set(() => ({ page })),
  setPageSize: (pageSize) => set(() => ({ pageSize, page: 1 })), // reset page on size change
  setTotalItems: (totalItems) => set(() => ({ totalItems })),
  reset: () => set(() => ({ page: 1, pageSize: 10, totalItems: 0 })),
}));