export type OrderApiItem = {
  id: string;
  order_sn: string;
  marketplace_status: string;
  shipping_status: string;
  wms_status: string;
  tracking_number: string;
  updated_at: string;
  created_at: string;
};

export type OrderDetailApiItem = {
  id: string;
  order_sn: string;
  marketplace_status: string;
  shipping_status: string;
  wms_status: string;
  tracking_number: string;
  updated_at: string;
  created_at: string;
  total_amount: number;
  items: Array<{
    sku: string;
    qty: number;
    price: number;
  }>;
};

export type OrdersApiResponse = {
  code: number;
  message: string;
  data: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
    orders: OrderApiItem[];
    summary_stats?: {
      total_orders_count: number;
      cancelled_orders_count: number;
    };
  };
};

export type OrderDetailApiResponse = {
  code: number;
  message: string;
  data: OrderDetailApiItem;
};

export type OutboundOrder = {
  id: string;
  orderId: string;
  marketplaceStatus: string;
  shippingStatus: string;
  wmsStatus: string;
  trackingNumber: string;
  updatedAt: string;
};

export type OutboundOrderDetailItem = {
  sku: string;
  qty: number;
  price: number;
};

export type OutboundOrderDetail = {
  id: string;
  orderId: string;
  marketplaceStatus: string;
  shippingStatus: string;
  wmsStatus: string;
  trackingNumber: string;
  updatedAt: string;
  createdAt: string;
  totalAmount: number;
  items: OutboundOrderDetailItem[];
};

export type GetOutboundOrdersParams = {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  wmsStatus?: string;
  marketplaceStatus?: string;
  shippingStatus?: string;
  shopId?: string;
};

export type GetOutboundOrdersResult = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  orders: OutboundOrder[];
};

export type OutboundOrdersFilters = {
  search: string;
  sortBy: string;
  sortDir: "asc" | "desc";
  wmsStatus: string;
  marketplaceStatus: string;
  shippingStatus: string;
  shopId: string;
};
