const statusToneClassMap: Record<string, "emerald" | "rose" | "amber" | "violet" | "blue" | "cyan" | "orange" | "slate"> = {
  Delivered: "emerald",
  Cancelled: "rose",
  Canceled: "rose",
  Shipping: "amber",
  Processing: "violet",
  Paid: "blue",
  Shipped: "blue",
  "Label Created": "cyan",
  "Ready To Pick": "orange",
  "Ready to Pickup": "orange",
  "Awaiting Pickup": "slate",
};

export const getStatusTone = (value: string) => statusToneClassMap[value] ?? "slate";
