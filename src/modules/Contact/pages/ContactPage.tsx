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
    <div className="bg-gradient-to-br from-[#f0f5ff] to-[#f8faff] py-12 px-4 md:px-8">
      <div className="max-w-[900px] mx-auto bg-white p-8 sm:p-10 rounded-2xl border border-[#e3ecf9] shadow-sm">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Liên hệ & Phản hồi
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
            {/* Cột trái */}
            <div>
              {/* Họ tên */}
              <Form.Item
                label={<span className="font-semibold text-gray-700">Họ và tên</span>}
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
                className="mb-5"
              >
                <CInput id="name" placeholder="Nhập họ và tên của bạn" size="large" className="rounded-lg h-10" />
              </Form.Item>

              {/* Email */}
              <Form.Item
                label={<span className="font-semibold text-gray-700">Địa chỉ Email</span>}
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không đúng định dạng!" },
                ]}
                className="mb-5"
              >
                <CInput id="email" placeholder="example@email.com" size="large" className="rounded-lg h-10" />
              </Form.Item>

              {/* Loại phản hồi */}
              <Form.Item
                label={<span className="font-semibold text-gray-700">Loại ý kiến phản hồi</span>}
                name="type"
                rules={[{ required: true, message: "Vui lòng chọn loại ý kiến phản hồi!" }]}
                className="mb-5"
              >
                <CSelect id="type" size="large" className="h-10" options={feedbackTypeOptions} />
              </Form.Item>
            </div>

            {/* Cột phải */}
            <div>
              {/* Tiêu đề */}
              <Form.Item
                label={<span className="font-semibold text-gray-700">Tiêu đề</span>}
                name="title"
                rules={[
                  { required: true, message: "Vui lòng nhập tiêu đề phản hồi!" },
                  { min: 5, message: "Tiêu đề phải có tối thiểu 5 ký tự!" },
                ]}
                className="mb-5"
              >
                <CInput id="title" placeholder="Nhập tiêu đề ngắn gọn" size="large" className="rounded-lg h-10" />
              </Form.Item>

              {/* Nội dung */}
              <Form.Item
                label={<span className="font-semibold text-gray-700">Nội dung phản hồi</span>}
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
                  className="rounded-lg"
                  style={{ minHeight: "135px" }}
                />
              </Form.Item>
            </div>
          </div>

          {/* Nút gửi */}
          <Form.Item className="mb-0 mt-8">
            <CButton
              type="primary"
              htmlType="submit"
              size="large"
              loading={submitMutation.isPending}
              className="w-full font-bold h-12 rounded-lg bg-primary text-white"
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
