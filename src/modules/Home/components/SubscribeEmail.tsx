import React, { memo } from "react";
import { Form } from "antd";
import { Mail } from "lucide-react";
import CInput from "@/components/UI/Input";
import CButton from "@/components/UI/Button";

interface Props {
  onSubscribe: (email: string) => void;
  isLoading: boolean;
}

export const SubscribeEmail: React.FC<Props> = ({ onSubscribe, isLoading }) => {
  const [form] = Form.useForm();

  const handleFinish = (values: { email: string }) => {
    onSubscribe(values.email);
    form.resetFields();
  };

  return (
    <div className="bg-slate-50 py-16 border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Subscription Form & details */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full inline-block">
              THAM GIA CỘNG ĐỒNG
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Cập nhật thông tin mới nhất. Đăng ký bản tin của chúng tôi.
            </h2>

            <Form
              form={form}
              onFinish={handleFinish}
              layout="vertical"
              requiredMark={false}
              className="flex flex-col sm:flex-row gap-3 pt-2"
            >
              <Form.Item
                name="email"
                rules={[
                  { type: "email", message: "Email không hợp lệ!" },
                  { required: true, message: "Vui lòng nhập Email!" },
                ]}
                className="flex-1 mb-0"
              >
                <CInput
                  id="newsletter-email"
                  placeholder="Địa chỉ Email của bạn"
                  prefix={<Mail size={16} className="text-slate-400" />}
                  className="rounded-xl h-12 text-xs"
                />
              </Form.Item>
              <Form.Item className="mb-0">
                <CButton
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                  className="w-full sm:w-auto h-12 px-8 rounded-xl font-bold bg-blue-600 border-none shadow-md shadow-blue-500/10 text-xs"
                  id="btn-submit-subscribe"
                >
                  Đăng ký ngay!
                </CButton>
              </Form.Item>
            </Form>

            <div className="text-[11px] text-slate-500 leading-relaxed space-y-2 pt-2">
              <p>
                Bản tin email hàng tuần của chúng tôi cung cấp những tóm tắt không thể thiếu về xu hướng học tập, tin tức mới nhất cùng các cơ hội phát triển bản thân.
              </p>
              <p>
                Bất kỳ ai cũng có thể đăng ký nhận tin. Chỉ cần nhập địa chỉ email của bạn ở trên. Bạn có thể dễ dàng hủy đăng ký hoặc thay đổi tùy chọn bất cứ lúc nào mong muốn.
              </p>
            </div>
          </div>

          {/* Right: Graphic banner */}
          <div className="lg:col-span-5 hidden lg:flex justify-center">
            <img
              src="https://i.imgur.com/Ufc9Fxj.png"
              alt="Subscribe to our newsletter"
              className="max-h-60 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=400&q=80";
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(SubscribeEmail);
