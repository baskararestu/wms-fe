import { useEffect, useMemo, useState } from "react";

import { getOutboundOrders } from "../api/getOutboundOrders";
import type { OutboundOrder, OutboundOrdersFilters } from "./types";

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

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
  const [orders, setOrders] = useState<OutboundOrder[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_SIZE);
  const [totalEntries, setTotalEntries] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [filtersDraft, setFiltersDraft] = useState<OutboundOrdersFilters>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<OutboundOrdersFilters>(DEFAULT_FILTERS);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const response = await getOutboundOrders({
          page: currentPage,
          limit: rowsPerPage,
          search: appliedFilters.search,
          sortBy: appliedFilters.sortBy,
          sortDir: appliedFilters.sortDir,
          wmsStatus: appliedFilters.wmsStatus,
          marketplaceStatus: appliedFilters.marketplaceStatus,
          shippingStatus: appliedFilters.shippingStatus,
          shopId: appliedFilters.shopId,
        });
        setOrders(response.orders);
        setTotalEntries(response.total);
        setTotalPages(response.totalPages);
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Gagal mengambil data order");
        }
      } finally {
        setIsLoading(false);
      }
    };

    void fetchOrders();
  }, [appliedFilters, currentPage, rowsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [rowsPerPage]);

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

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

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
    setRowsPerPage,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
    isLoading,
    errorMessage,
    orders,
    totalPages,
    pageNumbers,
    visibleStart,
    visibleEnd,
    totalEntries,
  };
};
