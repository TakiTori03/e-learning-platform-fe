import { formatFullName } from "@/utils/format";
import React, { useEffect } from "react";
import { Form } from "antd";
import { useAuthStore } from "@/store/useAuthStore";
import { FeedbackType } from "@/constants/enums";
import { useSubmitFeedbackMutation } from "../hooks/useFeedback";
import type { IFeedbackSubmitRequest } from "../api/feedbackApi";
import CInput from "@/components/UI/Input";
import CSelect from "@/components/UI/Select";
import CTextArea from "@/components/UI/TextArea";
import CButton from "@/components/UI/Button";

export const ContactPage: React.FC = () => {
  const [form] = Form.useForm<IFeedbackSubmitRequest>();
  const { user } = useAuthStore();

  // Prefill when logged in user details are available
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: formatFullName(user),
        email: user.email || "",
      });
    }
  }, [user, form]);

  const submitMutation = useSubmitFeedbackMutation(() => {
    // Clear specific input fields while keeping name and email
    form.setFieldsValue({
      title: "",
      content: "",
      type: FeedbackType.GENERAL,
    });
  });

  const handleFormSubmit = (values: IFeedbackSubmitRequest) => {
    submitMutation.mutate(values);
  };

  const feedbackTypeOptions = [
    { value: FeedbackType.BUG, label: "Báo lỗi hệ thống (Bug)" },
    { value: FeedbackType.FEATURE, label: "Đóng góp tính năng mới (Feature)" },
    { value: FeedbackType.GENERAL, label: "Góp ý & Thắc mắc chung (General)" },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 via-[#f3f7ff] to-slate-50 py-10 px-4 md:px-8">
      <div className="max-w-[800px] w-full mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.05)] transition-all duration-300">
        
        {/* Header section */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Liên hệ & Phản hồi
          </h2>
          <p className="text-slate-400 mt-3 text-sm max-w-md mx-auto leading-relaxed">
            Gửi ý kiến đóng góp, báo lỗi hoặc thắc mắc của bạn cho ban quản trị.
          </p>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          initialValues={{ type: FeedbackType.GENERAL }}
          requiredMark="optional"
        >
          <div className="flex flex-col gap-5">
            
            {/* Hàng 1: Họ tên & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Họ tên */}
              <Form.Item
                label={<span className="font-semibold text-slate-600 text-xs tracking-wide uppercase">Họ và tên</span>}
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
                className="mb-0"
              >
                <CInput 
                  id="name" 
                  placeholder="Nhập họ và tên của bạn" 
                  size="large" 
                  className="rounded-xl h-11 border-slate-200 hover:border-primary/50 focus:border-primary transition-colors" 
                />
              </Form.Item>

              {/* Email */}
              <Form.Item
                label={<span className="font-semibold text-slate-600 text-xs tracking-wide uppercase">Địa chỉ Email</span>}
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không đúng định dạng!" },
                ]}
                className="mb-0"
              >
                <CInput 
                  id="email" 
                  placeholder="example@email.com" 
                  size="large" 
                  className="rounded-xl h-11 border-slate-200 hover:border-primary/50 focus:border-primary transition-colors" 
                />
              </Form.Item>
            </div>

            {/* Hàng 2: Tiêu đề & Loại phản hồi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tiêu đề */}
              <Form.Item
                label={<span className="font-semibold text-slate-600 text-xs tracking-wide uppercase">Tiêu đề</span>}
                name="title"
                rules={[
                  { required: true, message: "Vui lòng nhập tiêu đề phản hồi!" },
                  { min: 5, message: "Tiêu đề phải có tối thiểu 5 ký tự!" },
                ]}
                className="mb-0"
              >
                <CInput 
                  id="title" 
                  placeholder="Nhập tiêu đề ngắn gọn" 
                  size="large" 
                  className="rounded-xl h-11 border-slate-200 hover:border-primary/50 focus:border-primary transition-colors" 
                />
              </Form.Item>

              {/* Loại phản hồi */}
              <Form.Item
                label={<span className="font-semibold text-slate-600 text-xs tracking-wide uppercase">Loại ý kiến phản hồi</span>}
                name="type"
                rules={[{ required: true, message: "Vui lòng chọn loại ý kiến phản hồi!" }]}
                className="mb-0"
              >
                <CSelect 
                  id="type" 
                  size="large" 
                  className="h-11 rounded-xl border-slate-200 hover:border-primary/50 focus:border-primary transition-colors" 
                  options={feedbackTypeOptions} 
                />
              </Form.Item>
            </div>

            {/* Hàng 3: Nội dung (Full width) */}
            <Form.Item
              label={<span className="font-semibold text-slate-600 text-xs tracking-wide uppercase">Nội dung phản hồi</span>}
              name="content"
              rules={[
                { required: true, message: "Vui lòng nhập nội dung chi tiết!" },
                { min: 10, message: "Nội dung phản hồi phải có tối thiểu 10 ký tự!" },
              ]}
              className="mb-0"
            >
              <CTextArea
                id="content"
                placeholder="Mô tả chi tiết ý kiến của bạn..."
                rows={5}
                className="rounded-xl border-slate-200 hover:border-primary/50 focus:border-primary transition-colors p-3.5"
                style={{ minHeight: "135px", resize: "none" }}
              />
            </Form.Item>

          </div>

          {/* Nút gửi */}
          <Form.Item className="mb-0 mt-8">
            <CButton
              type="primary"
              htmlType="submit"
              size="large"
              loading={submitMutation.isPending}
              className="w-full font-bold h-12 rounded-xl bg-primary hover:bg-primary/95 text-white shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all border-none"
            >
              Gửi phản hồi
            </CButton>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ContactPage;
