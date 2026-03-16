import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getOutboundOrders } from "../api/getOutboundOrders";
import { useOrderSyncStore } from "./orderSyncStore";
import type { OutboundOrdersFilters } from "./types";

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const SEARCH_DEBOUNCE_MS = 450;

const DEFAULT_FILTERS: OutboundOrdersFilters = {
  search: "",
  sortBy: "updated_at",
  sortDir: "desc",
  wmsStatus: "",
  marketplaceStatus: "",
  shippingStatus: "",
  shopId: "",
};

const resetFilterValueByKey = (key: keyof OutboundOrdersFilters): OutboundOrdersFilters[keyof OutboundOrdersFilters] => {
  return DEFAULT_FILTERS[key];
};

export const useOutboundOrders = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_SIZE);
  const [filtersDraft, setFiltersDraft] = useState<OutboundOrdersFilters>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<OutboundOrdersFilters>(DEFAULT_FILTERS);
  const refreshVersion = useOrderSyncStore((state) => state.refreshVersion);

  useEffect(() => {
    const debounce = window.setTimeout(() => {
      const nextSearch = filtersDraft.search.trim();

      setCurrentPage(1);
      setAppliedFilters((previous) => {
        if (previous.search === nextSearch) {
          return previous;
        }

        return {
          ...previous,
          search: nextSearch,
        };
      });
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(debounce);
    };
  }, [filtersDraft.search]);

  const ordersQuery = useQuery({
    queryKey: ["outbound-orders", currentPage, rowsPerPage, appliedFilters, refreshVersion],
    queryFn: () =>
      getOutboundOrders({
        page: currentPage,
        limit: rowsPerPage,
        search: appliedFilters.search,
        sortBy: appliedFilters.sortBy,
        sortDir: appliedFilters.sortDir,
        wmsStatus: appliedFilters.wmsStatus,
        marketplaceStatus: appliedFilters.marketplaceStatus,
        shippingStatus: appliedFilters.shippingStatus,
        shopId: appliedFilters.shopId,
      }),
  });

  const updateFilterDraft = <K extends keyof OutboundOrdersFilters>(key: K, value: OutboundOrdersFilters[K]) => {
    setFiltersDraft((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const applyFilters = () => {
    setCurrentPage(1);
    setAppliedFilters(filtersDraft);
  };

  const applyFilterPatch = (patch: Partial<OutboundOrdersFilters>) => {
    setCurrentPage(1);

    setFiltersDraft((previous) => ({
      ...previous,
      ...patch,
    }));

    setAppliedFilters((previous) => ({
      ...previous,
      ...patch,
    }));
  };

  const resetFilterKeys = (keys: Array<keyof OutboundOrdersFilters>) => {
    setCurrentPage(1);

    setFiltersDraft((previous) => {
      const nextDraft = { ...previous };

      keys.forEach((key) => {
        nextDraft[key] = resetFilterValueByKey(key) as never;
      });

      return nextDraft;
    });

    setAppliedFilters((previous) => {
      const nextApplied = { ...previous };

      keys.forEach((key) => {
        nextApplied[key] = resetFilterValueByKey(key) as never;
      });

      return nextApplied;
    });
  };

  const resetFilters = () => {
    setCurrentPage(1);
    setFiltersDraft(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
  };

  const handleRowsPerPageChange = (nextRowsPerPage: number) => {
    setCurrentPage(1);
    setRowsPerPage(nextRowsPerPage);
  };

  const totalEntries = ordersQuery.data?.total ?? 0;
  const totalPages = ordersQuery.data?.totalPages ?? 1;
  const orders = ordersQuery.data?.orders ?? [];
  const errorMessage = ordersQuery.error instanceof Error ? ordersQuery.error.message : ordersQuery.error ? "Gagal mengambil data order" : null;

  const pageNumbers = useMemo(() => {
    const visibleWindow = 5;
    const halfWindow = Math.floor(visibleWindow / 2);
    const startPage = Math.max(1, Math.min(currentPage - halfWindow, totalPages - visibleWindow + 1));
    const endPage = Math.min(totalPages, startPage + visibleWindow - 1);

    return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
  }, [currentPage, totalPages]);

  const visibleStart = totalEntries === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const visibleEnd = Math.min((currentPage - 1) * rowsPerPage + orders.length, totalEntries);

  return {
    appliedFilters,
    filtersDraft,
    updateFilterDraft,
    applyFilters,
    applyFilterPatch,
    resetFilters,
    resetFilterKeys,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage: handleRowsPerPageChange,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
    isLoading: ordersQuery.isLoading || ordersQuery.isFetching,
    errorMessage,
    orders,
    totalPages,
    pageNumbers,
    visibleStart,
    visibleEnd,
    totalEntries,
  };
};
