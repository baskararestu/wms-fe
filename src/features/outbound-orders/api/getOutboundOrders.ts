import { httpClient } from "../../../shared/api/httpClient";
import type { GetOutboundOrdersParams, GetOutboundOrdersResult, OrdersApiResponse, OutboundOrder } from "../model/types";

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

export const getOutboundOrders = async ({ page, limit, search, sortBy, sortDir, wmsStatus, marketplaceStatus, shippingStatus, shopId }: GetOutboundOrdersParams): Promise<GetOutboundOrdersResult> => {
  const searchParams = new URLSearchParams();

  searchParams.set("page", String(page));
  searchParams.set("limit", String(limit));

  if (search?.trim()) {
    searchParams.set("search", search.trim());
  }

  if (sortBy) {
    searchParams.set("sort_by", sortBy);
  }

  if (sortDir) {
    searchParams.set("sort_dir", sortDir);
  }

  if (wmsStatus) {
    searchParams.set("wms_status", wmsStatus);
  }

  if (marketplaceStatus) {
    searchParams.set("marketplace_status", marketplaceStatus);
  }

  if (shippingStatus) {
    searchParams.set("shipping_status", shippingStatus);
  }

  if (shopId) {
    searchParams.set("shop_id", shopId);
  }

  const response = await httpClient.get<OrdersApiResponse>(`/api/orders?${searchParams.toString()}`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (response.data.code !== 200) {
    throw new Error(response.data.message || "Gagal mengambil data order");
  }

  return {
    total: response.data.data.total,
    page: response.data.data.page,
    limit: response.data.data.limit,
    totalPages: response.data.data.total_pages,
    orders: response.data.data.orders.map(mapOrder),
    summaryStats: {
      totalOrdersCount: response.data.data.summary_stats?.total_orders_count ?? response.data.data.total,
      cancelledOrdersCount: response.data.data.summary_stats?.cancelled_orders_count ?? 0,
    },
  };
};
