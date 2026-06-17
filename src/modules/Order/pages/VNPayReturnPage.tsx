import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Card, Spin, Typography } from "antd";
import { orderApi } from "../api/orderApi";
import type { IOrderResponse } from "../api/orderApi";
import {
  Play,
  Receipt,
  ShoppingCart,
  Home,
  Calendar,
  CreditCard,
  Landmark,
  Check,
  X,
  AlertTriangle,
} from "lucide-react";
import CButton from "@/components/UI/Button";
import { For, Show } from "@/components/UI/Template";

const { Title, Text } = Typography;

export const VNPayReturnPage = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState<string>(
    "Đang xử lý kết quả thanh toán..."
  );
  const [redirectUrl, setRedirectUrl] = useState<string>("/");
  const [orderDetail, setOrderDetail] = useState<IOrderResponse | null>(null);

  const amount = searchParams.get("vnp_Amount");
  const bankCode = searchParams.get("vnp_BankCode");
  const payDate = searchParams.get("vnp_PayDate");
  const transactionNo = searchParams.get("vnp_TransactionNo");
  const txnRef = searchParams.get("vnp_TxnRef");

  const formattedAmount = amount
    ? `${(Number(amount) / 100).toLocaleString()}đ`
    : "";

  const formatPayDate = (payDateStr: string | null) => {
    if (!payDateStr || payDateStr.length !== 14) return "";
    const year = payDateStr.substring(0, 4);
    const month = payDateStr.substring(4, 6);
    const day = payDateStr.substring(6, 8);
    const hour = payDateStr.substring(8, 10);
    const minute = payDateStr.substring(10, 12);
    const second = payDateStr.substring(12, 14);
    return `${hour}:${minute}:${second} - ${day}/${month}/${year}`;
  };

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const queryString = location.search; // Bắt toàn bộ query string từ URL
        if (!queryString) {
          setStatus("error");
          setMessage("Không tìm thấy thông tin thanh toán.");
          return;
        }

        const res = await orderApi.verifyVNPayReturn(queryString);

        if (res === "success") {
          setStatus("success");
          setMessage(
            "Giao dịch của bạn đã được ghi nhận thành công trên hệ thống. Hãy bắt đầu bài học của bạn ngay bây giờ!"
          );

          // Lấy ID đơn hàng từ query params để fetch chi tiết
          const orderId = searchParams.get("vnp_TxnRef");
          if (orderId) {
            try {
              const orderData: IOrderResponse =
                await orderApi.getOrderDetail(orderId);
              setOrderDetail(orderData);
              if (orderData.items && orderData.items.length > 0) {
                setRedirectUrl(`/learning/${orderData.items[0].courseId}`);
              }
            } catch (err) {
              console.error(
                "Không thể lấy chi tiết đơn hàng để redirect:",
                err
              );
            }
          }
        } else {
          setStatus("error");
          setMessage("Giao dịch thanh toán bị hủy hoặc không thành công.");
        }
      } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        setStatus("error");
        setMessage(
          err?.response?.data?.message ||
            "Đã xảy ra lỗi khi xác thực thanh toán."
        );
      }
    };

    verifyPayment();
  }, [location.search, searchParams]);

  const hasCourseItems =
    orderDetail && orderDetail.items && orderDetail.items.length > 0;

  return (
    <div className="min-h-[85vh] py-10 px-5 md:px-8 flex justify-center items-center bg-gray-50/30">
      <Card className="w-full max-w-md md:max-w-3xl shadow-xl rounded-3xl border border-gray-100/80 overflow-hidden bg-white p-6 md:p-8 transition-all duration-300">
        {/* LOADING STATE */}
        <Show>
          <Show.When isTrue={status === "loading"}>
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <Spin size="large" />
              <Title
                level={4}
                className="!m-0 !text-gray-700 font-bold animate-pulse"
              >
                Đang xác thực giao dịch
              </Title>
              <Text className="text-gray-400 text-sm text-center max-w-xs">
                {message}
              </Text>
            </div>
          </Show.When>
        </Show>

        {/* SUCCESS STATE */}
        <Show>
          <Show.When isTrue={status === "success"}>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
              {/* LEFT COLUMN: Status and Main Actions */}
              <div className="md:col-span-5 flex flex-col justify-center text-center md:text-left md:border-r md:border-gray-100 md:pr-8">
                {/* Animated Icon */}
                <div className="flex justify-center md:justify-start mb-5">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-60"></div>
                    <div className="relative bg-gradient-to-tr from-emerald-400 to-green-500 text-white p-4 rounded-full shadow-lg shadow-emerald-100">
                      <Check className="w-8 h-8 stroke-[3]" />
                    </div>
                  </div>
                </div>
  
                <Title
                  level={3}
                  className="!text-gray-800 !mb-2 font-extrabold text-2xl tracking-tight"
                >
                  Thành công!
                </Title>
  
                <Text className="text-gray-500 text-xs md:text-sm leading-relaxed mb-6 block">
                  {message}
                </Text>
  
                {/* Main Buttons */}
                <div className="flex flex-col gap-2.5">
                  <Show>
                    <Show.When isTrue={!!hasCourseItems}>
                      <CButton
                        key="learning"
                        className="w-full h-11 rounded-xl font-bold flex items-center justify-center gap-2 border-none shadow-sm transition-all duration-200 hover:-translate-y-0.5 bg-gradient-to-r from-primary to-blue text-white"
                        onClick={() => navigate(redirectUrl)}
                      >
                        <Play className="w-4 h-4 fill-current" /> Vào học ngay
                      </CButton>
                      <CButton
                        key="purchase-history"
                        className="w-full h-11 rounded-xl font-bold border border-gray-200 text-gray-700 hover:text-primary hover:border-primary flex items-center justify-center gap-2 bg-white hover:bg-gray-50 transition-all duration-200"
                        onClick={() => navigate("/purchase-history")}
                      >
                        <Receipt className="w-4 h-4" /> Lịch sử mua hàng
                      </CButton>
                    </Show.When>
                    <Show.Else>
                      <CButton
                        key="purchase-history-fallback"
                        className="w-full h-11 rounded-xl font-bold flex items-center justify-center gap-2 border-none shadow-sm transition-all duration-200 hover:-translate-y-0.5 bg-gradient-to-r from-primary to-blue text-white"
                        onClick={() => navigate("/purchase-history")}
                      >
                        <Receipt className="w-4 h-4" /> Xem lịch sử mua hàng
                      </CButton>
                    </Show.Else>
                  </Show>
  
                  <CButton
                    key="home"
                    className="w-full mt-1 font-semibold text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1.5 border-none bg-transparent shadow-none"
                    onClick={() => navigate("/")}
                  >
                    <Home className="w-4 h-4" /> Về trang chủ
                  </CButton>
                </div>
              </div>

            {/* RIGHT COLUMN: Detailed Receipt & Course List */}
            <div className="md:col-span-7 flex flex-col gap-5 justify-between">
              {/* Detailed Transaction Info */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 flex flex-col gap-3 shadow-sm">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 border-b border-gray-200 pb-2.5 mb-1">
                  <Receipt className="w-4 h-4 text-primary" /> Chi tiết hóa đơn
                </h4>

                <Show>
                  <Show.When isTrue={!!formattedAmount}>
                    <div className="flex justify-between items-center text-xs md:text-sm pb-2.5">
                      <span className="text-gray-500">Số tiền thanh toán</span>
                      <span className="font-extrabold text-primary text-sm md:text-base">
                        {formattedAmount}
                      </span>
                    </div>
                  </Show.When>
                </Show>

                <Show>
                  <Show.When isTrue={!!bankCode}>
                    <div className="flex justify-between items-center text-xs md:text-sm pb-2.5">
                      <span className="text-gray-500 flex items-center gap-1.5">
                        <Landmark className="w-4 h-4 text-gray-400" /> Ngân hàng thanh toán
                      </span>
                      <span className="font-bold text-gray-800">{bankCode}</span>
                    </div>
                  </Show.When>
                </Show>

                <Show>
                  <Show.When isTrue={!!payDate}>
                    <div className="flex justify-between items-center text-xs md:text-sm pb-2.5">
                      <span className="text-gray-500 flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-gray-400" /> Thời gian giao dịch
                      </span>
                      <span className="text-gray-700 font-semibold">
                        {formatPayDate(payDate)}
                      </span>
                    </div>
                  </Show.When>
                </Show>

                <Show>
                  <Show.When isTrue={!!transactionNo}>
                    <div className="flex justify-between items-center text-xs md:text-sm pb-2.5">
                      <span className="text-gray-500 flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-gray-400" /> Mã giao dịch VNPAY
                      </span>
                      <span className="font-mono text-[11px] bg-gray-200/80 text-gray-700 px-2 py-0.5 rounded font-semibold">
                        {transactionNo}
                      </span>
                    </div>
                  </Show.When>
                </Show>

                <Show>
                  <Show.When isTrue={!!txnRef}>
                    <div className="flex justify-between items-center text-xs md:text-sm">
                      <span className="text-gray-500 flex items-center gap-1.5">
                        <Receipt className="w-4 h-4 text-gray-400" /> Mã đơn hàng
                      </span>
                      <span className="font-mono text-[11px] bg-gray-200/80 text-gray-700 px-2 py-0.5 rounded font-semibold">
                        {txnRef}
                      </span>
                    </div>
                  </Show.When>
                </Show>
              </div>

              {/* List of Activated Courses */}
              <Show>
                <Show.When isTrue={!!hasCourseItems}>
                  <div className="flex flex-col text-left">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-500 stroke-[2.5]" /> Khóa học được kích hoạt
                    </h4>
                    <div className="flex flex-col gap-2 max-h-[140px] overflow-y-auto pr-1 custom-scrollbar">
                      <For
                        array={orderDetail?.items || []}
                        render={(item) => (
                          <div
                            key={item.courseId}
                            className="flex items-center justify-between bg-blue-50/30 hover:bg-blue-50/60 px-3.5 py-2.5 rounded-lg border border-blue-100/50 transition-all shadow-sm"
                          >
                            <span className="font-bold text-gray-800 text-xs md:text-sm line-clamp-1 flex-1 mr-4">
                              {item.name}
                            </span>
                            <span className="text-primary font-black text-xs md:text-sm shrink-0">
                              <Show>
                                <Show.When isTrue={item.finalPrice === 0}>Miễn phí</Show.When>
                                <Show.Else>{`${item.finalPrice.toLocaleString()}đ`}</Show.Else>
                              </Show>
                            </span>
                          </div>
                        )}
                      />
                    </div>
                  </div>
                </Show.When>
              </Show>
            </div>
          </div>
        </Show.When>
      </Show>

        {/* ERROR STATE */}
        <Show>
          <Show.When isTrue={status === "error"}>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
              {/* LEFT COLUMN: Status and Main Actions */}
              <div className="md:col-span-5 flex flex-col justify-center text-center md:text-left md:border-r md:border-gray-100 md:pr-8">
                {/* Animated Icon */}
                <div className="flex justify-center md:justify-start mb-5">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-red-100 animate-ping opacity-60"></div>
                    <div className="relative bg-gradient-to-tr from-red-400 to-rose-500 text-white p-4 rounded-full shadow-lg shadow-red-100">
                      <X className="w-8 h-8 stroke-[3]" />
                    </div>
                  </div>
                </div>
  
                <Title
                  level={3}
                  className="!text-gray-800 !mb-2 font-extrabold text-2xl tracking-tight"
                >
                  Thất bại
                </Title>
  
                <Text className="text-gray-500 text-xs md:text-sm leading-relaxed mb-6 block">
                  {message}
                </Text>
  
                {/* Action Buttons */}
                <div className="flex flex-col gap-2.5">
                  <CButton
                    key="cart"
                    className="w-full h-11 rounded-xl font-bold flex items-center justify-center gap-2 border-none shadow-sm transition-all duration-200 hover:-translate-y-0.5 bg-gradient-to-r from-red-500 to-rose-600 text-white"
                    onClick={() => navigate("/cart")}
                  >
                    <ShoppingCart className="w-4 h-4" /> Quay lại giỏ hàng
                  </CButton>
                  <CButton
                    key="purchase-history"
                    className="w-full h-11 rounded-xl font-bold border border-gray-200 text-gray-700 hover:text-red-500 hover:border-red-500 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 transition-all duration-200"
                    onClick={() => navigate("/purchase-history")}
                  >
                    <Receipt className="w-4 h-4" /> Lịch sử giao dịch
                  </CButton>
                  <CButton
                    key="home-err"
                    className="w-full mt-1 font-semibold text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1.5 border-none bg-transparent shadow-none"
                    onClick={() => navigate("/")}
                  >
                    <Home className="w-4 h-4" /> Về trang chủ
                  </CButton>
                </div>
              </div>
  
              {/* RIGHT COLUMN: Order Summary */}
              <div className="md:col-span-7 flex flex-col justify-center">
                <Show>
                  <Show.When isTrue={!!formattedAmount || !!txnRef}>
                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 flex flex-col gap-3 shadow-sm">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-200 pb-2.5 mb-1">
                        <AlertTriangle className="w-4 h-4 text-red-500" /> Thông tin đơn đặt hàng
                      </h4>
  
                      <Show>
                        <Show.When isTrue={!!formattedAmount}>
                          <div className="flex justify-between items-center text-xs md:text-sm pb-2.5">
                            <span className="text-gray-500">Tổng giá trị đơn hàng</span>
                            <span className="font-extrabold text-red-500 text-sm md:text-base">
                              {formattedAmount}
                            </span>
                          </div>
                        </Show.When>
                      </Show>
  
                      <Show>
                        <Show.When isTrue={!!txnRef}>
                          <div className="flex justify-between items-center text-xs md:text-sm">
                            <span className="text-gray-500 flex items-center gap-1.5">
                              <Receipt className="w-4 h-4 text-gray-400" /> Mã đơn hàng
                            </span>
                            <span className="font-mono text-[11px] bg-gray-200/80 text-gray-700 px-2 py-0.5 rounded font-semibold">
                              {txnRef}
                            </span>
                          </div>
                        </Show.When>
                      </Show>
                    </div>
                  </Show.When>
                  <Show.Else>
                    <div className="bg-gray-50/50 p-6 rounded-xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-center gap-2">
                      <AlertTriangle className="w-6 h-6 text-gray-300" />
                      <Text className="text-gray-400 text-xs">
                        Không tìm thấy thông tin chi tiết đơn hàng thô.
                      </Text>
                    </div>
                  </Show.Else>
                </Show>
              </div>
            </div>
          </Show.When>
        </Show>
      </Card>
    </div>
  );
};

export default VNPayReturnPage;
