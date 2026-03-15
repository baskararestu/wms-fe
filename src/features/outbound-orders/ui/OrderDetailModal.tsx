import { useEffect, useState } from "react";
import { LuX } from "react-icons/lu";

import { AppButton } from "../../../widgets/button/ui/AppButton";
import { getOutboundOrderDetail } from "../api/getOutboundOrderDetail";
import type { OutboundOrderDetail } from "../model/types";

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
  const [detail, setDetail] = useState<OutboundOrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchOrderDetail = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const response = await getOutboundOrderDetail(orderSn);

        if (!isMounted) {
          return;
        }

        setDetail(response);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Gagal mengambil detail order");
        }

        setDetail(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchOrderDetail();

    return () => {
      isMounted = false;
    };
  }, [orderSn]);

  const actionLabel = detail ? getActionLabelByWmsStatus(detail.wmsStatus) : "Detail";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white p-4 shadow-xl" onClick={(event) => event.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-lg font-semibold text-slate-800">Detail</p>
          <button type="button" className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700" onClick={onClose} aria-label="Close detail modal">
            <LuX className="h-5 w-5" />
          </button>
        </div>

        {isLoading ? <p className="text-sm text-slate-500">Loading order detail...</p> : null}
        {!isLoading && errorMessage ? <p className="text-sm text-rose-600">{errorMessage}</p> : null}

        {!isLoading && !errorMessage && detail ? (
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

            <AppButton type="button" variant="primary" className="w-full rounded-md px-3! py-2! text-xs shadow-none hover:enabled:translate-y-0 hover:enabled:shadow-none">
              {actionLabel}
            </AppButton>
          </div>
        ) : null}
      </div>
    </div>
  );
};
