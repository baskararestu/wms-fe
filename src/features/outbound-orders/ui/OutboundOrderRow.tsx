import { AppButton } from "../../../widgets/button/ui/AppButton";
import { Badge } from "../../../shared/ui/badge/Badge";
import { getStatusTone } from "../model/statusTone";
import type { OutboundOrder } from "../model/types";

type OutboundOrderRowProps = {
  order: OutboundOrder;
  onOpenDetail: (orderSn: string) => void;
};

export const OutboundOrderRow = ({ order, onOpenDetail }: OutboundOrderRowProps) => {
  return (
    <tr className="border-t border-slate-100 text-slate-700">
      <td className="px-3 py-2">{order.orderId}</td>
      <td className="px-3 py-2">
        <Badge tone={getStatusTone(order.marketplaceStatus)}>{order.marketplaceStatus}</Badge>
      </td>
      <td className="px-3 py-2">
        <Badge tone={getStatusTone(order.shippingStatus)}>{order.shippingStatus}</Badge>
      </td>
      <td className="px-3 py-2">
        <Badge tone={getStatusTone(order.wmsStatus)}>{order.wmsStatus}</Badge>
      </td>
      <td className="px-3 py-2">{order.trackingNumber}</td>
      <td className="px-3 py-2">{order.updatedAt}</td>
      <td className="px-3 py-2 text-right">
        <AppButton type="button" variant="primary" className="min-h-8! rounded-md px-3! py-1! text-[10px] shadow-none hover:enabled:translate-y-0 hover:enabled:shadow-none" onClick={() => onOpenDetail(order.orderId)}>
          Detail
        </AppButton>
      </td>
    </tr>
  );
};
