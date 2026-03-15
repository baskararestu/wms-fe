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

export const startMarketplaceConnect = async (shopId: string) => {
  const response = await httpClient.post<ApiEnvelope<StartConnectData>>(
    "/api/integrations/marketplace/shops/connect/start",
    {
      shop_id: shopId,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

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
