import React from "react";
import { Form, Row, Col, InputNumber, Space } from "antd";
import type { ICategory } from "@/type";
import {
  CourseLevel,
  CourseLevelLabels,
} from "@/constants/enums";
import CModal from "@/components/UI/Modal";
import CInput from "@/components/UI/Input";
import CSelect from "@/components/UI/Select";
import CTextArea from "@/components/UI/TextArea";
import CButton from "@/components/UI/Button";

interface CourseFormModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  isSubmitting: boolean;
  editingCourse: any | null;
  categories: ICategory[];
  form: ReturnType<typeof Form.useForm>[0];
}

const CourseFormModal: React.FC<CourseFormModalProps> = ({
  open,
  onCancel,
  onSubmit,
  isSubmitting,
  editingCourse,
  categories,
  form,
}) => {
  return (
    <CModal
      title={editingCourse ? "Chỉnh sửa thông tin khóa học" : "Tạo khóa học mới"}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={800}
      forceRender
      style={{ top: 30 }}
      className="rounded-2xl overflow-hidden pb-2"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        initialValues={{
          level: "ALL",
          price: 0,
          finalPrice: 0,
        }}
        className="pt-2"
      >
        <div className="max-h-[65vh] overflow-y-auto pr-2" style={{ scrollbarWidth: "thin", scrollbarColor: "#cbd5e1 transparent" }}>
          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item
                name="name"
                label={<span className="font-semibold text-gray-700">Tên khóa học</span>}
                rules={[{ required: true, message: "Vui lòng nhập tên khóa học" }]}
              >
                <CInput id="name" placeholder="Ví dụ: Lập trình ReactJS Pro..." className="rounded-lg h-10" />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                name="subTitle"
                label={<span className="font-semibold text-gray-700">Mô tả ngắn (Subtitle)</span>}
                rules={[{ required: true, message: "Vui lòng nhập mô tả ngắn" }]}
              >
                <CInput id="subTitle" placeholder="Mô tả tóm tắt nội dung hấp dẫn người học..." className="rounded-lg h-10" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="categoryId"
                label={<span className="font-semibold text-gray-700">Danh mục chính</span>}
                rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
              >
                <CSelect
                  id="categoryId"
                  placeholder="Chọn danh mục..."
                  className="h-10 custom-select"
                  options={categories.map((cat) => ({
                    value: cat.id,
                    label: cat.name,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="level"
                label={<span className="font-semibold text-gray-700">Cấp độ khóa học</span>}
                rules={[{ required: true, message: "Vui lòng chọn cấp độ" }]}
              >
                <CSelect
                  id="level"
                  className="h-10 custom-select"
                  options={Object.values(CourseLevel).map((level) => ({
                    value: level,
                    label: CourseLevelLabels[level],
                  }))}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="price"
                label={<span className="font-semibold text-gray-700">Giá gốc (VND)</span>}
                rules={[{ required: true, message: "Vui lòng nhập giá gốc" }]}
              >
                <InputNumber<number>
                  min={0}
                  className="w-full rounded-lg h-10 flex items-center"
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, "") as any}
                  addonAfter="VND"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="finalPrice"
                label={<span className="font-semibold text-gray-700">Giá bán thực tế (VND)</span>}
                rules={[{ required: true, message: "Vui lòng nhập giá bán thực tế" }]}
              >
                <InputNumber<number>
                  min={0}
                  className="w-full rounded-lg h-10 flex items-center"
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, "") as any}
                  addonAfter="VND"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="thumbnail"
                label={<span className="font-semibold text-gray-700">Đường dẫn ảnh thu nhỏ (Thumbnail URL)</span>}
              >
                <CInput id="thumbnail" placeholder="https://unsplash.com/photo-..." className="rounded-lg h-10" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="coursePreview"
                label={<span className="font-semibold text-gray-700">Video giới thiệu (Youtube URL)</span>}
              >
                <CInput id="coursePreview" placeholder="https://youtube.com/watch?v=..." className="rounded-lg h-10" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                name="description"
                label={<span className="font-semibold text-gray-700">Mô tả chi tiết khóa học</span>}
                rules={[{ required: true, message: "Vui lòng nhập mô tả chi tiết" }]}
              >
                <CTextArea
                  id="description"
                  rows={4}
                  placeholder="Nội dung chính, mục tiêu và cách thức học tập..."
                  className="rounded-lg"
                />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                name="requirements"
                label={<span className="font-semibold text-gray-700">Yêu cầu khóa học (Nhấn Enter để thêm)</span>}
              >
                <CSelect id="requirements" mode="tags" placeholder="Thêm yêu cầu..." className="rounded-lg" />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                name="willLearns"
                label={<span className="font-semibold text-gray-700">Học viên sẽ học được gì (Nhấn Enter để thêm)</span>}
              >
                <CSelect id="willLearns" mode="tags" placeholder="Thêm lợi ích..." className="rounded-lg" />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                name="tags"
                label={<span className="font-semibold text-gray-700">Tags (Nhấn Enter để thêm)</span>}
              >
                <CSelect id="tags" mode="tags" placeholder="Thêm tag..." className="rounded-lg" />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <div className="pt-4 mt-2 border-t border-gray-100 flex justify-end">
          <Space>
            <CButton onClick={onCancel} className="rounded-lg h-10 px-4 font-medium hover:bg-gray-100 transition-colors">
              Hủy bỏ
            </CButton>
            <CButton
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
              style={{
                height: "40px",
                borderRadius: "8px",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                border: "none",
                fontWeight: 600,
                padding: "0 24px",
              }}
            >
              Lưu thông tin
            </CButton>
          </Space>
        </div>
      </Form>
    </CModal>
  );
};

export default CourseFormModal;
