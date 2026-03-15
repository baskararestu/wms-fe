import { useEffect, useMemo, useState } from "react";

import { getOutboundOrders } from "../api/getOutboundOrders";
import type { OutboundOrder } from "./types";

const PAGE_SIZE = 10;

export const useOutboundOrders = () => {
  const [orders, setOrders] = useState<OutboundOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const response = await getOutboundOrders();
        setOrders(response.orders);
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
  }, []);

  const filteredOrders = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    if (!normalizedSearchTerm) {
      return orders;
    }

    return orders.filter((order) => {
      return [order.orderId, order.marketplaceStatus, order.shippingStatus, order.wmsStatus, order.trackingNumber]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearchTerm);
    });
  }, [orders, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredOrders.slice(startIndex, startIndex + PAGE_SIZE);
  }, [currentPage, filteredOrders]);

  const pageNumbers = useMemo(() => {
    const visibleWindow = 5;
    const halfWindow = Math.floor(visibleWindow / 2);
    const startPage = Math.max(1, Math.min(currentPage - halfWindow, totalPages - visibleWindow + 1));
    const endPage = Math.min(totalPages, startPage + visibleWindow - 1);

    return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
  }, [currentPage, totalPages]);

  const visibleStart = filteredOrders.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const visibleEnd = Math.min(currentPage * PAGE_SIZE, filteredOrders.length);

  return {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    isLoading,
    errorMessage,
    orders: paginatedOrders,
    totalPages,
    pageNumbers,
    visibleStart,
    visibleEnd,
    filteredTotal: filteredOrders.length,
  };
};
