import { useMutation, useQuery } from "@tanstack/react-query";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";
import { orderApi } from "../api/orderApi";
import type { IOrderResponse } from "../api/orderApi";
import { useCartStore } from "@/modules/Cart/store/useCartStore";

export const useOrder = () => {
  const navigate = useNavigate();
  const { clearCart } = useCartStore();

  const createOrderMutation = useMutation<IOrderResponse, Error, string[]>({
    mutationFn: (courseIds: string[]) =>
      orderApi.createOrder({
        courseIds,
        note: "Thanh toán khóa học E-Learning",
      }),
    onSuccess: async (res) => {
      const orderData = res;

      // 1. Trường hợp khóa học miễn phí (Tổng = 0)
      if (orderData.totalPrice === 0) {
        notification.success({ message: "Đăng ký khóa học thành công!" });
        clearCart();
        if (orderData.items && orderData.items.length > 0) {
          navigate(`/learning/${orderData.items[0].courseId}`);
        } else {
          navigate("/");
        }
        return;
      }

      // 2. Trường hợp có phí, lấy URL VNPAY
      try {
        const vnpayUrl = await orderApi.getVNPAYUrl(orderData.id);
        if (vnpayUrl) {
          clearCart(); // Xóa giỏ hàng trước khi rời sang trang thanh toán
          window.location.href = vnpayUrl as unknown as string;
        } else {
          throw new Error("Không lấy được URL thanh toán");
        }
      } catch (error: unknown) {
        const err = error as { message?: string };
        notification.error({
          message: err?.message || "Lỗi kết nối cổng thanh toán VNPAY",
        });
      }
    },
    onError: (error) => {
      notification.error({
        message: error?.message || "Tạo đơn hàng thất bại. Vui lòng thử lại!",
      });
    },
  });

  return {
    createOrder: createOrderMutation.mutate,
    isCreatingOrder: createOrderMutation.isPending,
  };
};

export const useMyOrders = (page: number, size = 10) => {
  return useQuery({
    queryKey: ["myOrders", page, size],
    queryFn: () => orderApi.getMyOrders({ page, size }),
    placeholderData: (previousData) => previousData,
  });
};

export const useOrderDetail = (orderId: string, enabled = true) => {
  return useQuery({
    queryKey: ["orderDetail", orderId],
    queryFn: () => orderApi.getOrderDetail(orderId),
    enabled: !!orderId && enabled,
  });
};
