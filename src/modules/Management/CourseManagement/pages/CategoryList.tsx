import React, { useState, useCallback, useMemo } from "react";
import { Card, Form, Row, Col, App, Pagination } from "antd";
import { SearchOutlined, UploadOutlined } from "@ant-design/icons";
import type { ICategory } from "@/type";

// UI Wrappers & Template Components
import CInput from "@/components/UI/Input";
import CTextArea from "@/components/UI/TextArea";
import CButton from "@/components/UI/Button";
import CTable from "@/components/UI/Table";
import CModal from "@/components/UI/Modal";
import CUpload from "@/components/Upload";
import PageHeader from "@/components/UI/PageHeader";
import { TotalTableMessage } from "@/components/UI/Template";
import CategoryIcon from "../components/CategoryIcon";

// Core upload API
import { mediaApi } from "@/core/http/mediaApi";

// Hooks, Constants & Store
import { useCategoriesSearch, useCreateCategory, useUpdateCategory, useDeleteCategory } from "../queryHooks";
import { getColumnsTableCategory } from "../constants";
import { useLocalStore } from "../store/useLocalStore";
import { ActionsType } from "@/constants/enums";



export const CategoryList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState("");
  const [form] = Form.useForm();
  const { message } = App.useApp();

  // Zustand Store
  const {
    actionMode,
    idDetail,
    selectedIcon,
    setActionMode,
    setIdDetail,
    setSelectedCategory,
    setSelectedIcon,
    resetStore,
  } = useLocalStore();

  // React Query API calls
  const { data: categoriesData, isLoading } = useCategoriesSearch(page, size, search || undefined);
  const { mutate: createCategory, isPending: creating } = useCreateCategory();
  const { mutate: updateCategory, isPending: updating } = useUpdateCategory();
  const { mutate: deleteCategory, isPending: deleting } = useDeleteCategory();

  // Dialog Handlers
  const handleOpenCreate = useCallback(() => {
    resetStore();
    form.resetFields();
    setActionMode(ActionsType.CREATE);
  }, [form, resetStore, setActionMode]);

  const handleOpenEdit = useCallback(
    (record: ICategory) => {
      resetStore();
      setIdDetail(record.id);
      setSelectedCategory(record);
      setSelectedIcon(record.icon || record.cateImage || "");
      form.setFieldsValue({
        name: record.name,
        description: record.description,
      });
      setActionMode(ActionsType.UPDATE);
    },
    [form, resetStore, setActionMode, setIdDetail, setSelectedCategory, setSelectedIcon]
  );

  const handleModalClose = useCallback(() => {
    resetStore();
    form.resetFields();
  }, [form, resetStore]);

  const handleSubmit = useCallback(
    (values: { name: string; description: string }) => {
      const body = {
        name: values.name,
        description: values.description,
        icon: selectedIcon,
      };

      if (actionMode === ActionsType.UPDATE && idDetail) {
        updateCategory(
          { id: idDetail, body },
          { onSuccess: () => handleModalClose() }
        );
      } else {
        createCategory(body, { onSuccess: () => handleModalClose() });
      }
    },
    [actionMode, idDetail, selectedIcon, updateCategory, createCategory, handleModalClose]
  );

  // Decoupled Table Columns (Rule 5)
  const columns = useMemo(
    () => getColumnsTableCategory(handleOpenEdit, deleteCategory, deleting),
    [handleOpenEdit, deleteCategory, deleting]
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Quản lý Danh mục Khóa học"
        subtitle="Tạo và quản lý danh mục để giảng viên phân loại khóa học khi đăng mới"
        showCreateButton={true}
        createButtonText="Tạo danh mục mới"
        onCreateClick={handleOpenCreate}
      />

      {/* Search / Filter Bar */}
      <Card className="border border-gray-100 rounded-xl shadow-sm" styles={{ body: { padding: "16px" } }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12} lg={8}>
            <CInput
              placeholder="Tìm kiếm theo tên danh mục..."
              prefix={<SearchOutlined className="text-gray-400" />}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              style={{
                height: "38px",
                borderRadius: "8px",
              }}
              allowClear
            />
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Card className="border border-gray-100 rounded-xl shadow-sm" styles={{ body: { padding: 0 } }}>
        <CTable
          dataSource={categoriesData?.content || []}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={false}
          className="custom-table"
          scroll={{ x: "max-content" }}
        />
      </Card>

      {/* Pagination */}
      {categoriesData && categoriesData.totalElements > 0 && (
        <div className="flex justify-end mt-6">
          <Pagination
            current={page}
            pageSize={size}
            total={categoriesData.totalElements}
            onChange={(p, s) => {
              setPage(p);
              setSize(s);
            }}
            showTotal={(total) => `Tổng số ${total} danh mục`}
            showSizeChanger={true}
            pageSizeOptions={["10", "20", "50", "100"]}
          />
        </div>
      )}

      {/* Create / Edit Modal (CModal chuẩn) */}
      <CModal
        open={actionMode !== ""}
        title={actionMode === ActionsType.UPDATE ? "Chỉnh sửa danh mục" : "Tạo danh mục mới"}
        onCancel={handleModalClose}
        footer={null}
        forceRender
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          {/* Category Image Upload */}
          <Form.Item
            label={<span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Ảnh đại diện danh mục (PNG/SVG)</span>}
            required
          >
            <div className="flex items-center gap-4">
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 16,
                  border: "1px dashed #cbd5e1",
                  background: "#f8fafc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <CategoryIcon src={selectedIcon} alt="Category Icon" size={80} />
              </div>

              <div className="flex flex-col gap-2">
                <CUpload
                  uploadType="image"
                  showUploadList={false}
                  beforeUpload={async (file) => {
                    try {
                      const res = await mediaApi.uploadImage(file);
                      setSelectedIcon(res.url);
                      message.success("Tải lên ảnh thành công!");
                    } catch {
                      message.error("Tải lên ảnh thất bại!");
                    }
                    return false;
                  }}
                >
                  <CButton icon={<UploadOutlined />} style={{ height: "36px", borderRadius: "8px" }}>
                    Tải ảnh lên
                  </CButton>
                </CUpload>

                {selectedIcon && (
                  <CButton
                    type="text"
                    danger
                    size="small"
                    className="p-0 text-left h-auto text-xs"
                    onClick={() => setSelectedIcon("")}
                  >
                    Xóa ảnh
                  </CButton>
                )}
              </div>
            </div>
          </Form.Item>

          {/* Name */}
          <Form.Item
            name="name"
            label={<span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tên danh mục</span>}
            rules={[
              { required: true, message: "Vui lòng nhập tên danh mục!" },
              { min: 2, message: "Tên danh mục phải có ít nhất 2 ký tự" },
              { max: 100, message: "Tên danh mục tối đa 100 ký tự" },
            ]}
          >
            <CInput
              placeholder="VD: Lập trình Web, Data Science..."
              style={{ height: "44px", borderRadius: "10px" }}
              maxLength={100}
            />
          </Form.Item>

          {/* Description */}
          <Form.Item
            name="description"
            label={<span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Mô tả</span>}
            rules={[
              { required: true, message: "Vui lòng nhập mô tả cho danh mục!" },
              { min: 10, message: "Mô tả phải có nhất 10 ký tự" },
            ]}
          >
            <CTextArea
              placeholder="Mô tả ngắn gọn về danh mục này giúp giảng viên chọn đúng phân loại..."
              rows={4}
              maxLength={500}
              style={{ borderRadius: "10px" }}
            />
          </Form.Item>

          {/* Dialog Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <CButton onClick={handleModalClose} style={{ height: "40px", borderRadius: "10px" }}>
              Hủy
            </CButton>
            <CButton
              type="primary"
              htmlType="submit"
              loading={creating || updating}
              style={{
                height: "40px",
                borderRadius: "10px",
                fontWeight: 600,
              }}
            >
              {actionMode === ActionsType.UPDATE ? "Lưu thay đổi" : "Tạo danh mục"}
            </CButton>
          </div>
        </Form>
      </CModal>
    </div>
  );
};

export default CategoryList;
