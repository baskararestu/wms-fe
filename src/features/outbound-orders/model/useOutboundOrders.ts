import { useEffect, useMemo, useState } from "react";

import { getOutboundOrders } from "../api/getOutboundOrders";
import type { OutboundOrder } from "./types";

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export const useOutboundOrders = () => {
  const [orders, setOrders] = useState<OutboundOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_SIZE);
  const [totalEntries, setTotalEntries] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
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
          search: searchTerm,
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
  }, [currentPage, rowsPerPage, searchTerm]);

  const filteredOrders = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    if (!normalizedSearchTerm) {
      return orders;
    }

    return orders.filter((order) => {
      return [order.orderId, order.marketplaceStatus, order.shippingStatus, order.wmsStatus, order.trackingNumber].join(" ").toLowerCase().includes(normalizedSearchTerm);
    });
  }, [orders, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [rowsPerPage]);

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
  const visibleEnd = Math.min((currentPage - 1) * rowsPerPage + filteredOrders.length, totalEntries);

  return {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
    isLoading,
    errorMessage,
    orders: filteredOrders,
    totalPages,
    pageNumbers,
    visibleStart,
    visibleEnd,
    filteredTotal: filteredOrders.length,
    totalEntries,
  };
};
