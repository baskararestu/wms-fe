import { create } from "zustand";

type MarketplaceState = {
  connectedShopId: string | null;
  setConnectedShopId: (shopId: string | null) => void;
};

export const useMarketplaceStore = create<MarketplaceState>((set) => ({
  connectedShopId: null,
  setConnectedShopId: (shopId) => {
    set({ connectedShopId: shopId });
  },
}));
