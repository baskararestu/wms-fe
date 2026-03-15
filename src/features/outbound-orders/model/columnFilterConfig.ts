export type FilterableColumn = "marketplaceStatus" | "shippingStatus" | "wmsStatus" | "updatedAt";
export type PopupTab = "sort" | "filter";

type ColumnConfig = {
  label: string;
  sortBy: string;
  filterKey?: "marketplaceStatus" | "shippingStatus" | "wmsStatus";
  filterOptions?: Array<{ label: string; value: string }>;
};

const marketplaceStatusOptions = [
  { label: "All", value: "" },
  { label: "Delivered", value: "delivered" },
  { label: "Shipping", value: "shipping" },
  { label: "Processing", value: "processing" },
  { label: "Paid", value: "paid" },
  { label: "Cancelled", value: "cancelled" },
];

const shippingStatusOptions = [
  { label: "All", value: "" },
  { label: "Delivered", value: "delivered" },
  { label: "Shipped", value: "shipped" },
  { label: "Label Created", value: "label_created" },
  { label: "Awaiting Pickup", value: "awaiting_pickup" },
  { label: "Cancelled", value: "cancelled" },
];

const wmsStatusOptions = [
  { label: "All", value: "" },
  { label: "Ready to Pick", value: "READY_TO_PICK" },
  { label: "Picking", value: "PICKING" },
  { label: "Packed", value: "PACKED" },
  { label: "Shipped", value: "SHIPPED" },
];

export const columnConfig: Record<FilterableColumn, ColumnConfig> = {
  marketplaceStatus: {
    label: "Marketplace Status",
    sortBy: "marketplace_status",
    filterKey: "marketplaceStatus",
    filterOptions: marketplaceStatusOptions,
  },
  shippingStatus: {
    label: "Shipping Status",
    sortBy: "shipping_status",
    filterKey: "shippingStatus",
    filterOptions: shippingStatusOptions,
  },
  wmsStatus: {
    label: "WMS Status",
    sortBy: "wms_status",
    filterKey: "wmsStatus",
    filterOptions: wmsStatusOptions,
  },
  updatedAt: {
    label: "Update At",
    sortBy: "updated_at",
  },
};
