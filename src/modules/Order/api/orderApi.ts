import { axiosClient } from "@/core/http";
import { API_PREFIX } from "@/constants/api";
import type { IListResponse } from "@/type";
import type { OrderStatus } from "@/constants/enums";

export interface IOrderRequest {
  courseIds: string[];
  note?: string;
}

export interface IOrderItem {
  courseId: string;
  name: string;
  finalPrice: number;
  thumbnail: string;
}

export interface IOrderResponse {
  id: string;
  userId: string;
  totalPrice: number;
  vatFee: number;
  note: string;
  status: OrderStatus;
  items: IOrderItem[];
  createdAt: string;
  updatedAt: string;
}

export const orderApi = {
  createOrder: (data: IOrderRequest) => {
    return axiosClient.post<IOrderResponse>(`${API_PREFIX.ORDER}/orders`, data);
  },

  getVNPAYUrl: (orderId: string) => {
    return axiosClient.get<string>(
      `${API_PREFIX.ORDER}/payments/vnpay/create/${orderId}`
    );
  },

  verifyVNPayReturn: (queryString: string) => {
    return axiosClient.get<string>(
      `${API_PREFIX.ORDER}/payments/vnpay/vnpay_return${queryString}`
    );
  },

  getOrderDetail: (orderId: string) => {
    return axiosClient.get<IOrderResponse>(
      `${API_PREFIX.ORDER}/orders/${orderId}`
    );
  },

  getMyOrders: (params: {
    page: number;
    size: number;
  }): Promise<IListResponse<IOrderResponse>> => {
    return axiosClient.get<IListResponse<IOrderResponse>>(
      `${API_PREFIX.ORDER}/orders/mine`,
      {
        params: {
          page: params.page > 0 ? params.page - 1 : 0,
          size: params.size,
        },
      }
    );
  },
};
