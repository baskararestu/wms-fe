import { httpClient } from "../../../shared/api/httpClient";

type SyncOrdersApiResponse = {
  code: number;
  message: string;
};

export const syncOrders = async (shopId: string) => {
  const response = await httpClient.post<SyncOrdersApiResponse>(
    "/api/orders/sync",
    {
      shop_id: shopId,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
  );

  if (response.data.code !== 200) {
    throw new Error(response.data.message || "Gagal sync orders");
  }

  return response.data;
};
