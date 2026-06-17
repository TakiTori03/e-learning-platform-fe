import { axiosClient } from "@/core/http";
import { API_PREFIX } from "@/constants/api";
import type { IOrder, IPayment, IParamsRequest, IListResponse } from "@/type";

const ADMIN_ORDERS_PREFIX = `${API_PREFIX.ORDER}/admin/orders`;
const ADMIN_TRANSACTIONS_PREFIX = `${API_PREFIX.ORDER}/admin/transactions`;

export const adminOrderApi = {
  // --- Order Management ---
  getAllOrders: (params: IParamsRequest): Promise<IListResponse<IOrder>> => {
    return axiosClient.get<IListResponse<IOrder>>(ADMIN_ORDERS_PREFIX, {
      ...params,
      page: params.page > 0 ? params.page - 1 : 0,
    });
  },

  getOrderById: (id: string): Promise<IOrder> => {
    return axiosClient.get<IOrder>(`${ADMIN_ORDERS_PREFIX}/${id}`);
  },

  updateOrderStatus: (id: string, status: string): Promise<IOrder> => {
    return axiosClient.patch<IOrder>(`${ADMIN_ORDERS_PREFIX}/${id}/status`, {}, {
      params: { status },
    });
  },

  // --- Transaction Management ---
  getAllTransactions: (params: IParamsRequest): Promise<IListResponse<IPayment>> => {
    return axiosClient.get<IListResponse<IPayment>>(ADMIN_TRANSACTIONS_PREFIX, {
      ...params,
      page: params.page > 0 ? params.page - 1 : 0,
    });
  },

  getTransactionById: (id: string): Promise<IPayment> => {
    return axiosClient.get<IPayment>(`${ADMIN_TRANSACTIONS_PREFIX}/${id}`);
  },
};
