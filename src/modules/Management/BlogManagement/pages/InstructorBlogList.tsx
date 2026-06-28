import React, { useState, useCallback } from "react";
import { Form, App, Tooltip, Pagination } from "antd";
import CPopconfirm from "@/components/UI/Popconfirm";
import {
  Edit2,
  Trash2,
  Send,
  Eye,
} from "lucide-react";

// Shared UI
import PageHeader from "@/components/UI/PageHeader";
import CInput from "@/components/UI/Input";
import CSelect from "@/components/UI/Select";

// Blog-specific
import BlogFormModal, { type BlogFormValues } from "../components/BlogFormModal";
import BlogGrid from "../components/BlogGrid";
import BlogPreviewModal from "../components/BlogPreviewModal";

// Hooks & API
import {
  useBlogList,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  usePublishBlogMutation,
  useDeleteBlogMutation,
} from "@/modules/Blog/hooks/useBlogQueries";
import { blogApi } from "@/modules/Blog/services/blogApi";
import type { IBlogPost } from "@/modules/Blog/types";
import { useAuthStore } from "@/store/useAuthStore";

// Icons
import { SearchOutlined } from "@ant-design/icons";



export const InstructorBlogList: React.FC = () => {
  const { message } = App.useApp();
  const { user } = useAuthStore();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<IBlogPost | null>(null);
  const [form] = Form.useForm();

  // Preview modal state
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewBlogId, setPreviewBlogId] = useState<string | null>(null);

  // Queries — filter by current instructor's authorId
  const { data: blogsData, isLoading } = useBlogList({
    page: page - 1,
    size: pageSize,
    q: searchText || undefined,
    authorId: user?.id,
    status: statusFilter || undefined,
    sort: "newest",
  });

  const blogs = blogsData?.content || [];
  const totalElements = blogsData?.totalElements || 0;

  // Mutations
  const createMutation = useCreateBlogMutation();
  const updateMutation = useUpdateBlogMutation();
  const publishMutation = usePublishBlogMutation();
  const deleteMutation = useDeleteBlogMutation();

  // --- Handlers ---
  const handleOpenPreviewModal = useCallback((id: string) => {
    setPreviewBlogId(id);
    setIsPreviewOpen(true);
  }, []);

  const handleClosePreviewModal = useCallback(() => {
    setPreviewBlogId(null);
    setIsPreviewOpen(false);
  }, []);

  const handleOpenCreateModal = useCallback(() => {
    setEditingBlog(null);
    form.resetFields();
    setIsModalOpen(true);
  }, [form]);

  const handleOpenEditModal = useCallback(
    async (blog: IBlogPost) => {
      let hideLoader = () => {};
      try {
        hideLoader = message.open({
          type: "loading",
          content: "Đang tải dữ liệu bài viết...",
          duration: 0,
        });
        const fullBlog = await blogApi.getBlogDetail(blog.id);
        hideLoader();

        setEditingBlog(fullBlog);
        form.setFieldsValue({
          title: fullBlog.title,
          summary: fullBlog.summary,
          content: fullBlog.content,
          thumbnailUrl: fullBlog.thumbnailUrl,
          tags: fullBlog.tags,
        });
        setIsModalOpen(true);
      } catch {
        if (hideLoader) hideLoader();
        message.error("Lỗi khi tải chi tiết bài viết!");
      }
    },
    [message, form]
  );

  const handleFormSubmit = useCallback(
    (values: BlogFormValues) => {
      if (editingBlog) {
        updateMutation.mutate(
          { id: editingBlog.id, data: values },
          {
            onSuccess: () => {
              message.success("Cập nhật bài viết thành công!");
              setIsModalOpen(false);
            },
            onError: () => message.error("Lỗi khi cập nhật bài viết!"),
          }
        );
      } else {
        createMutation.mutate(values, {
          onSuccess: () => {
            message.success("Tạo bài viết thành công!");
            setIsModalOpen(false);
          },
          onError: () => message.error("Lỗi khi tạo bài viết!"),
        });
      }
    },
    [editingBlog, updateMutation, createMutation, message]
  );

  const handlePublish = useCallback(
    (id: string) => {
      publishMutation.mutate(id, {
        onSuccess: () => message.success("Xuất bản bài viết thành công!"),
        onError: () => message.error("Lỗi khi xuất bản bài viết!"),
      });
    },
    [publishMutation, message]
  );

  const handleDelete = useCallback(
    (id: string) => {
      deleteMutation.mutate(id, {
        onSuccess: () => message.success("Xóa bài viết thành công!"),
        onError: () => message.error("Lỗi khi xóa bài viết!"),
      });
    },
    [deleteMutation, message]
  );

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // --- Grid action renderer ---
  const renderActions = useCallback(
    (blog: IBlogPost) => {
      const actions: React.ReactNode[] = [];

      // Preview Action (always available)
      actions.push(
        <Tooltip title="Xem chi tiết & bình luận" key="preview">
          <div
            onClick={() => handleOpenPreviewModal(blog.id)}
            className="flex justify-center items-center py-2 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer w-full"
          >
            <Eye className="w-4 h-4 mr-1.5 text-blue-500" />
            <span className="text-xs font-semibold">Xem chi tiết</span>
          </div>
        </Tooltip>
      );

      // Edit Action (always available)
      actions.push(
        <Tooltip title="Chỉnh sửa bài viết" key="edit">
          <div
            onClick={() => handleOpenEditModal(blog)}
            className="flex justify-center items-center py-2 text-gray-500 hover:text-amber-600 transition-colors cursor-pointer w-full"
          >
            <Edit2 className="w-4 h-4 mr-1.5 text-amber-500" />
            <span className="text-xs font-semibold">Chỉnh sửa</span>
          </div>
        </Tooltip>
      );

      // Publish Action (only for DRAFT)
      if (blog.status === "DRAFT") {
        actions.push(
          <Tooltip title="Xuất bản bài viết công khai" key="publish">
            <CPopconfirm
              title="Xuất bản bài viết này?"
              description="Bài viết sẽ được hiển thị công khai."
              onConfirm={() => handlePublish(blog.id)}
              okText="Xuất bản"
              cancelText="Hủy"
            >
              <div className="flex justify-center items-center py-2 text-gray-500 hover:text-green-600 transition-colors cursor-pointer w-full">
                <Send className="w-4 h-4 mr-1.5 text-green-500" />
                <span className="text-xs font-semibold">Xuất bản</span>
              </div>
            </CPopconfirm>
          </Tooltip>
        );
      }

      // Delete Action
      actions.push(
        <Tooltip title="Xóa bài viết" key="delete">
          <CPopconfirm
            title="Xóa bài viết này?"
            description="Hành động này không thể hoàn tác. Toàn bộ bình luận cũng sẽ bị xóa."
            onConfirm={() => handleDelete(blog.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <div className="flex justify-center items-center py-2 text-gray-500 hover:text-red-600 transition-colors cursor-pointer w-full">
              <Trash2 className="w-4 h-4 mr-1.5 text-red-500" />
              <span className="text-xs font-semibold">Xóa</span>
            </div>
          </CPopconfirm>
        </Tooltip>
      );

      return actions;
    },
    [handleOpenPreviewModal, handleOpenEditModal, handlePublish, handleDelete]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý Bài viết Blog"
        subtitle="Tạo mới, chỉnh sửa và xuất bản các bài viết chia sẻ kiến thức của bạn"
        showCreateButton
        createButtonText="Viết bài mới"
        onCreateClick={handleOpenCreateModal}
      />

      {/* Filter Bar */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <CInput
              placeholder="Tìm kiếm theo tiêu đề bài viết..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setPage(1);
              }}
              className="rounded-xl h-11 border-gray-200"
              allowClear
            />
          </div>
          <div className="w-full sm:w-[200px]">
            <CSelect
              placeholder="Lọc theo trạng thái"
              value={statusFilter}
              onChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
              className="w-full h-11"
              allowClear
              options={[
                { label: "Bản nháp", value: "DRAFT" },
                { label: "Đã xuất bản", value: "PUBLISHED" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Blog Grid View */}
      <BlogGrid
        blogs={blogs}
        isLoading={isLoading}
        renderActions={renderActions}
        onCreateNewClick={handleOpenCreateModal}
      />

      {/* Pagination */}
      {blogsData && totalElements > 0 && (
        <div className="flex justify-end mt-8">
          <Pagination
            current={page}
            pageSize={pageSize}
            total={totalElements}
            onChange={(p, s) => {
              setPage(p);
              setPageSize(s);
            }}
            showTotal={(total) => `Tổng số ${total} bài viết`}
            showSizeChanger={true}
            pageSizeOptions={["8", "12", "24", "48"]}
          />
        </div>
      )}

      {/* Blog Form Modal */}
      <BlogFormModal
        open={isModalOpen}
        onCancel={handleModalClose}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        editingBlog={editingBlog}
        form={form}
      />

      {/* Blog Preview Modal */}
      <BlogPreviewModal
        open={isPreviewOpen}
        onCancel={handleClosePreviewModal}
        blogId={previewBlogId}
      />
    </div>
  );
};

export default InstructorBlogList;

