import React from "react";
import { Modal, Form, Input, type FormInstance } from "antd";
import CSelect from "@/components/UI/Select";
import CButton from "@/components/UI/Button";
import type { IBlogPost } from "@/modules/Blog/types";

const { TextArea } = Input;

interface BlogFormModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: BlogFormValues) => void;
  isSubmitting: boolean;
  editingBlog: IBlogPost | null;
  form: FormInstance;
}

export interface BlogFormValues {
  title: string;
  summary: string;
  content: string;
  thumbnailUrl?: string;
  tags?: string[];
}

const BlogFormModal: React.FC<BlogFormModalProps> = ({
  open,
  onCancel,
  onSubmit,
  isSubmitting,
  editingBlog,
  form,
}) => {
  const handleFinish = (values: BlogFormValues) => {
    onSubmit(values);
  };

  return (
    <Modal
      title={editingBlog ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
      open={open}
      onCancel={onCancel}
      width={800}
      centered
      destroyOnClose
      footer={[
        <CButton key="cancel" onClick={onCancel} className="rounded-lg h-10 px-5">
          Hủy
        </CButton>,
        <CButton
          key="submit"
          type="primary"
          loading={isSubmitting}
          onClick={() => form.submit()}
          className="rounded-lg h-10 px-5 font-semibold"
          style={{ backgroundColor: "#2563eb", border: "none" }}
        >
          {editingBlog ? "Cập nhật" : "Tạo bài viết"}
        </CButton>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="mt-4"
        requiredMark="optional"
      >
        <Form.Item
          name="title"
          label="Tiêu đề bài viết"
          rules={[
            { required: true, message: "Vui lòng nhập tiêu đề!" },
            { max: 200, message: "Tiêu đề tối đa 200 ký tự!" },
          ]}
        >
          <Input
            placeholder="Nhập tiêu đề bài viết..."
            className="rounded-lg h-11"
            maxLength={200}
            showCount
          />
        </Form.Item>

        <Form.Item
          name="summary"
          label="Tóm tắt"
          rules={[
            { required: true, message: "Vui lòng nhập tóm tắt!" },
            { max: 500, message: "Tóm tắt tối đa 500 ký tự!" },
          ]}
        >
          <TextArea
            placeholder="Mô tả ngắn gọn nội dung bài viết..."
            rows={3}
            className="rounded-lg"
            maxLength={500}
            showCount
          />
        </Form.Item>

        <Form.Item
          name="content"
          label="Nội dung bài viết (Markdown)"
          rules={[
            { required: true, message: "Vui lòng nhập nội dung bài viết!" },
          ]}
        >
          <TextArea
            placeholder="Viết nội dung bài viết bằng Markdown..."
            rows={12}
            className="rounded-lg font-mono text-sm"
          />
        </Form.Item>

        <Form.Item
          name="thumbnailUrl"
          label="Ảnh bìa (URL)"
          rules={[
            { type: "url", message: "Vui lòng nhập đường link hợp lệ!" },
          ]}
        >
          <Input
            placeholder="https://example.com/image.jpg"
            className="rounded-lg h-11"
          />
        </Form.Item>

        <Form.Item
          name="tags"
          label="Thẻ tags"
        >
          <CSelect
            mode="tags"
            placeholder="Nhập tags và nhấn Enter..."
            className="w-full rounded-lg"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BlogFormModal;
