import { httpClient } from "../../../shared/api/httpClient";
import type { OrdersApiResponse, OutboundOrder } from "../model/types";

const formatStatusLabel = (value: string) =>
  value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const formatDateTime = (value: string) => {
  const date = new Date(value);

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(date)
    .replace(",", "");
};

const mapOrder = (order: OrdersApiResponse["data"]["orders"][number]): OutboundOrder => ({
  id: order.id,
  orderId: order.order_sn,
  marketplaceStatus: formatStatusLabel(order.marketplace_status),
  shippingStatus: formatStatusLabel(order.shipping_status),
  wmsStatus: formatStatusLabel(order.wms_status),
  trackingNumber: order.tracking_number || "-",
  updatedAt: formatDateTime(order.updated_at),
});

export const getOutboundOrders = async () => {
  const response = await httpClient.get<OrdersApiResponse>("/api/orders?page=1&limit=1000", {
    headers: {
      Accept: "application/json",
    },
  });

  if (response.data.code !== 200) {
    throw new Error(response.data.message || "Gagal mengambil data order");
  }

  return {
    total: response.data.data.total,
    orders: response.data.data.orders.map(mapOrder),
  };
};
