import axios from "axios";

import { httpClient } from "../../../shared/api/httpClient";

type ApiEnvelope<T> = {
  code: number;
  message: string;
  data: T;
};

type StartConnectData = {
  shop_id: string;
  connected: boolean;
};

type ShopDetailData = {
  shop_id: string;
  shop_name?: string;
  marketplace?: string;
  country?: string;
  currency?: string;
  access_level?: string;
};

type ShopDetailEnvelope = {
  message?: string;
  data?: ShopDetailData;
};

export const startMarketplaceConnect = async () => {
  const response = await httpClient.get<ApiEnvelope<StartConnectData>>("/api/integrations/marketplace/shops/connect/start", {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.data.code !== 200) {
    throw new Error(response.data.message || "Gagal memulai koneksi marketplace");
  }

  return response.data.data;
};

export const checkMarketplaceConnection = async (shopId: string) => {
  try {
    const response = await httpClient.get<ApiEnvelope<unknown>>(`/api/integrations/marketplace/shops/${shopId}`);
    return response.data.code === 200;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return false;
    }

    throw error;
  }
};

export const getMarketplaceShopDetail = async (shopId: string) => {
  const response = await httpClient.get<ApiEnvelope<ShopDetailEnvelope>>(`/api/integrations/marketplace/shops/${shopId}`);

  if (response.data.code !== 200) {
    throw new Error(response.data.message || "Gagal mengambil detail shop");
  }

  const resolvedShopId = response.data.data?.data?.shop_id;

  if (!resolvedShopId) {
    throw new Error("shop_id tidak ditemukan dari response marketplace");
  }

  return {
    shopId: resolvedShopId,
    shopName: response.data.data?.data?.shop_name,
    marketplace: response.data.data?.data?.marketplace,
  };
};
