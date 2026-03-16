import { create } from "zustand";

type OrderSyncState = {
  refreshVersion: number;
  markOrdersUpdated: () => void;
  resetRefreshVersion: () => void;
};

export const useOrderSyncStore = create<OrderSyncState>((set) => ({
  refreshVersion: 0,
  markOrdersUpdated: () => {
    set((state) => ({ refreshVersion: state.refreshVersion + 1 }));
  },
  resetRefreshVersion: () => {
    set({ refreshVersion: 0 });
  },
}));
