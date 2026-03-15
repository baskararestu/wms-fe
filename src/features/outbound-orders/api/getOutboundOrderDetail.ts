import { httpClient } from "../../../shared/api/httpClient";
import type { OrderDetailApiItem, OrderDetailApiResponse, OutboundOrderDetail } from "../model/types";

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

const mapOrderDetail = (order: OrderDetailApiItem): OutboundOrderDetail => ({
  id: order.id,
  orderId: order.order_sn,
  marketplaceStatus: formatStatusLabel(order.marketplace_status),
  shippingStatus: formatStatusLabel(order.shipping_status),
  wmsStatus: formatStatusLabel(order.wms_status),
  trackingNumber: order.tracking_number || "-",
  updatedAt: formatDateTime(order.updated_at),
  createdAt: formatDateTime(order.created_at),
  totalAmount: order.total_amount,
  items: order.items,
});

export const getOutboundOrderDetail = async (orderSn: string): Promise<OutboundOrderDetail> => {
  const encodedOrderSn = encodeURIComponent(orderSn);

  const response = await httpClient.get<OrderDetailApiResponse>(`/api/orders/${encodedOrderSn}`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (response.data.code !== 200 || !response.data.data) {
    throw new Error(response.data.message || "Gagal mengambil detail order");
  }

  return mapOrderDetail(response.data.data);
};
