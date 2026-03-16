import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LuX } from "react-icons/lu";
import { toast } from "sonner";

import { AppButton } from "../../../widgets/button/ui/AppButton";
import { getOutboundOrderDetail } from "../api/getOutboundOrderDetail";
import { packOrder, pickOrder, shipOrder } from "../api/handleOrder";

type OrderDetailModalProps = {
  orderSn: string;
  onClose: () => void;
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const getActionLabelByWmsStatus = (status: string) => {
  const normalizedStatus = status.replace(/\s+/g, "_").toUpperCase();

  if (normalizedStatus === "READY_TO_PICK" || normalizedStatus === "READY_TO_PICKUP") {
    return "Pickup";
  }

  if (normalizedStatus === "PICKING") {
    return "Pack";
  }

  if (normalizedStatus === "PACKED") {
    return "Ship";
  }

  return "Detail";
};

export const OrderDetailModal = ({ orderSn, onClose }: OrderDetailModalProps) => {
  const queryClient = useQueryClient();

  const detailQuery = useQuery({
    queryKey: ["outbound-order-detail", orderSn],
    queryFn: () => getOutboundOrderDetail(orderSn),
  });

  const processOrderMutation = useMutation({
    mutationFn: async () => {
      const detail = detailQuery.data;

      if (!detail) {
        throw new Error("Detail order belum tersedia");
      }

      const normalizedStatus = detail.wmsStatus.replace(/\s+/g, "_").toUpperCase();

      if (normalizedStatus === "READY_TO_PICK" || normalizedStatus === "READY_TO_PICKUP") {
        return pickOrder(detail.orderId);
      }

      if (normalizedStatus === "PICKING") {
        return packOrder(detail.orderId);
      }

      if (normalizedStatus === "PACKED") {
        return shipOrder(detail.orderId, "JNE");
      }

      throw new Error("Action tidak tersedia untuk status ini");
    },
    onSuccess: async (response) => {
      toast.success(response.message || "Proses order berhasil");
      await queryClient.invalidateQueries({ queryKey: ["outbound-order-detail", orderSn] });
      await queryClient.invalidateQueries({ queryKey: ["outbound-orders"] });
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error("Proses order gagal", { description: error.message });
        return;
      }

      toast.error("Proses order gagal");
    },
  });

  const handleProcessOrder = async () => {
    if (!detailQuery.data || processOrderMutation.isPending) {
      return;
    }

    await processOrderMutation.mutateAsync();
  };

  const detail = detailQuery.data;
  const actionLabel = detail ? getActionLabelByWmsStatus(detail.wmsStatus) : "Detail";
  const canProcessAction = actionLabel !== "Detail";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white p-4 shadow-xl" onClick={(event) => event.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-lg font-semibold text-slate-800">Detail</p>
          <button type="button" className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700" onClick={onClose} aria-label="Close detail modal">
            <LuX className="h-5 w-5" />
          </button>
        </div>

        {detailQuery.isLoading ? <p className="text-sm text-slate-500">Loading order detail...</p> : null}
        {!detailQuery.isLoading && detailQuery.error instanceof Error ? <p className="text-sm text-rose-600">{detailQuery.error.message}</p> : null}

        {!detailQuery.isLoading && !detailQuery.error && detail ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 text-sm text-slate-700 md:grid-cols-2">
              <div>
                <p className="text-xs text-slate-500">Order SN</p>
                <p className="font-semibold">{detail.orderId}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Shipping Status</p>
                <p className="font-semibold">{detail.shippingStatus}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Marketplace Status</p>
                <p className="font-semibold">{detail.marketplaceStatus}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Tracking Number</p>
                <p className="font-semibold">{detail.trackingNumber}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">WMS Status</p>
                <p className="font-semibold">{detail.wmsStatus}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Created At</p>
                <p className="font-semibold">{detail.createdAt}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Total Amount</p>
                <p className="font-semibold">{formatCurrency(detail.totalAmount)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Updated At</p>
                <p className="font-semibold">{detail.updatedAt}</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="min-w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-3 py-2 font-medium">SKU</th>
                    <th className="px-3 py-2 font-medium">QTY</th>
                    <th className="px-3 py-2 text-right font-medium">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.items.map((item) => (
                    <tr key={`${item.sku}-${item.qty}-${item.price}`} className="border-t border-slate-100">
                      <td className="px-3 py-2">{item.sku}</td>
                      <td className="px-3 py-2">{item.qty}</td>
                      <td className="px-3 py-2 text-right">{formatCurrency(item.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <AppButton
              type="button"
              variant="primary"
              className="w-full rounded-md px-3! py-2! text-xs shadow-none hover:enabled:translate-y-0 hover:enabled:shadow-none"
              onClick={() => {
                void handleProcessOrder();
              }}
              disabled={!canProcessAction || detailQuery.isLoading || processOrderMutation.isPending}
            >
              {processOrderMutation.isPending ? "Processing..." : actionLabel}
            </AppButton>
          </div>
        ) : null}
      </div>
    </div>
  );
};
