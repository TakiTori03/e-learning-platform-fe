import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminOrderApi } from "../services";
import { App } from "antd";
import type { IOrder, IPayment, IListResponse } from "@/type";

// ======================== HOOKS ========================
export const useAdminOrders = (page = 1, size = 10, search?: string) => {
  return useQuery<IListResponse<IOrder>>({
    queryKey: ["admin", "orders-list", page, size, search],
    queryFn: async () => {
      return await adminOrderApi.getAllOrders({ page, size, q: search });
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useAdminOrderDetail = (orderId?: string) => {
  return useQuery<IOrder>({
    queryKey: ["admin", "order-detail", orderId],
    queryFn: async () => {
      if (!orderId) throw new Error("Order ID is required");
      return await adminOrderApi.getOrderById(orderId);
    },
    enabled: !!orderId,
  });
};

export const useUpdateOrderStatusMutation = () => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  return useMutation<IOrder, unknown, { id: string; status: string }>({
    mutationFn: ({ id, status }) =>
      adminOrderApi.updateOrderStatus(id, status),
    onSuccess: (updated) => {
      notification.success({
        message: "Cập nhật thành công",
        description: `Đơn hàng "${updated.id}" đã được cập nhật thành "${updated.status}".`,
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "orders-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "order-detail"] });
    },
    onError: (error: unknown) => {
      const err = error as { message?: string; response?: { data?: { message?: string } } };
      notification.error({
        message: "Cập nhật trạng thái đơn hàng thất bại",
        description: err?.response?.data?.message || err?.message || "Đã xảy ra lỗi khi cập nhật đơn hàng.",
      });
    },
  });
};

export const useAdminTransactions = (page = 1, size = 10, search?: string) => {
  return useQuery<IListResponse<IPayment>>({
    queryKey: ["admin", "transactions-list", page, size, search],
    queryFn: async () => {
      return await adminOrderApi.getAllTransactions({ page, size, q: search });
    },
    staleTime: 2 * 60 * 1000,
  });
};
