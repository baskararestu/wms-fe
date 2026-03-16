import { useQuery } from "@tanstack/react-query";

import { getOutboundOrders } from "../api/getOutboundOrders";
import { useOrderSyncStore } from "./orderSyncStore";

export const useOutboundOrderSummary = () => {
  const refreshVersion = useOrderSyncStore((state) => state.refreshVersion);

  const summaryQuery = useQuery({
    queryKey: ["outbound-orders-summary", refreshVersion],
    queryFn: () =>
      getOutboundOrders({
        page: 1,
        limit: 10,
        sortBy: "updated_at",
        sortDir: "desc",
      }),
    select: (result) => result.summaryStats,
  });

  return {
    totalOrdersCount: summaryQuery.data?.totalOrdersCount ?? 0,
    cancelledOrdersCount: summaryQuery.data?.cancelledOrdersCount ?? 0,
    isLoading: summaryQuery.isLoading || summaryQuery.isFetching,
  };
};
