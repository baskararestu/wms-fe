import { httpClient } from "../../../shared/api/httpClient";
import { useOrderSyncStore } from "../model/orderSyncStore";

type ProcessOrderResponse = {
  code: number;
  message: string;
  data?: {
    order_sn: string;
    wms_status: string;
    shipping_status: string;
    tracking_number: string;
    shipping_channel: string;
  };
};

const ensureSuccess = (response: ProcessOrderResponse, fallbackMessage: string) => {
  if (response.code !== 200) {
    throw new Error(response.message || fallbackMessage);
  }

  useOrderSyncStore.getState().markOrdersUpdated();
};

export const pickOrder = async (orderSn: string) => {
  const response = await httpClient.post<ProcessOrderResponse>(`/api/orders/${encodeURIComponent(orderSn)}/pick`, null, {
    headers: {
      Accept: "application/json",
    },
  });

  ensureSuccess(response.data, "Gagal pickup order");

  return response.data;
};

export const packOrder = async (orderSn: string) => {
  const response = await httpClient.post<ProcessOrderResponse>(
    `/api/orders/${encodeURIComponent(orderSn)}/pack`,
    {
      wms_status: "PACKED",
    },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
  );

  ensureSuccess(response.data, "Gagal pack order");

  return response.data;
};

export const shipOrder = async (orderSn: string, channelId = "JNE") => {
  const response = await httpClient.post<ProcessOrderResponse>(
    `/api/orders/${encodeURIComponent(orderSn)}/ship`,
    {
      wms_status: "SHIPPED",
      channel_id: channelId,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
  );

  ensureSuccess(response.data, "Gagal ship order");

  return response.data;
};
