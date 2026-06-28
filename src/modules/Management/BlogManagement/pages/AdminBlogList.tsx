import { formatFullName } from "@/utils/format";
import { App, Avatar, Badge, Pagination, Switch, Table, Tag, Tooltip } from "antd";
import CPopconfirm from "@/components/UI/Popconfirm";
import {
  Eye,
  Pin,
  Search,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";

// Shared UI
import CInput from "@/components/UI/Input";
import PageHeader from "@/components/UI/PageHeader";
import CSelect from "@/components/UI/Select";

// Blog-specific
import BlogPreviewModal from "../components/BlogPreviewModal";
import BlogStatusTag from "../components/BlogStatusTag";

// Hooks & API
import {
  useBlogList,
  usePinBlogMutation,
  useUpdateBlogStatusAdminMutation,
} from "@/modules/Blog/hooks/useBlogQueries";
import type { IBlogPost } from "@/modules/Blog/types";
import { useAdminUsers } from "@/modules/Management/UserManagement/queryHooks";
import { formatDateTime } from "@/utils/format";



export const AdminBlogList: React.FC = () => {
  const { message } = App.useApp();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [authorFilter, setAuthorFilter] = useState<string | undefined>(undefined);
  const [onlyReported, setOnlyReported] = useState<boolean>(false);

  // Preview modal state
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewBlogId, setPreviewBlogId] = useState<string | null>(null);

  // Fetch instructors for the author filter dropdown
  const { data: instructorsData, isLoading: isLoadingInstructors } = useAdminUsers(
    1,
    100, // Fetch up to 100 instructors
    undefined,
    "INSTRUCTOR"
  );

  const instructorsOptions = useMemo(() => {
    if (!instructorsData?.content) return [];
    return instructorsData.content.map((u) => {
      const name = formatFullName(u);
      return {
        label: name,
        value: u.id,
      };
    });
  }, [instructorsData]);

  // Queries
  const { data: blogsData, isLoading } = useBlogList({
    page: page - 1,
    size: pageSize,
    q: searchText || undefined,
    status: statusFilter || undefined,
    authorId: authorFilter || undefined,
    sort: "newest",
  });

  const blogs = blogsData?.content || [];
  const totalElements = blogsData?.totalElements || 0;

  // Mutations
  const pinMutation = usePinBlogMutation();
  const updateStatusMutation = useUpdateBlogStatusAdminMutation();

  // --- Handlers ---
  const handleOpenPreviewModal = useCallback((id: string) => {
    setPreviewBlogId(id);
    setIsPreviewOpen(true);
  }, []);

  const handleClosePreviewModal = useCallback(() => {
    setPreviewBlogId(null);
    setIsPreviewOpen(false);
  }, []);

  const handleTogglePin = useCallback(
    (blog: IBlogPost) => {
      if (blog.status !== "PUBLISHED") {
        message.warning("Chỉ có thể ghim bài viết đã được xuất bản!");
        return;
      }
      pinMutation.mutate(blog.id, {
        onSuccess: () => {
          message.success(blog.isPinned ? "Đã bỏ ghim bài viết!" : "Đã ghim bài viết lên nổi bật!");
        },
        onError: () => message.error("Lỗi khi thay đổi trạng thái ghim!"),
      });
    },
    [pinMutation, message]
  );

  const handleBlockBlog = useCallback(
    (id: string) => {
      updateStatusMutation.mutate(
        { id, status: "BLOCKED" },
        {
          onSuccess: () => message.success("Đã khóa bài viết thành công!"),
          onError: () => message.error("Lỗi khi khóa bài viết!"),
        }
      );
    },
    [updateStatusMutation, message]
  );

  const handleUnblockBlog = useCallback(
    (id: string) => {
      updateStatusMutation.mutate(
        { id, status: "PUBLISHED" },
        {
          onSuccess: () => message.success("Đã mở khóa bài viết công khai!"),
          onError: () => message.error("Lỗi khi mở khóa bài viết!"),
        }
      );
    },
    [updateStatusMutation, message]
  );

  // Filter reported items on the current page for display
  const filteredBlogs = useMemo(() => {
    if (!onlyReported) return blogs;
    return blogs.filter((b) => b.reportedUserIds && b.reportedUserIds.length > 0);
  }, [blogs, onlyReported]);

  // --- Table columns ---
  const columns = [
    {
      title: "Bài viết",
      dataIndex: "title",
      key: "title",
      width: "30%",
      render: (_: string, record: IBlogPost) => (
        <div className="flex items-center gap-3">
          {record.thumbnailUrl ? (
            <img
              src={record.thumbnailUrl}
              alt={record.title}
              className="w-14 h-10 rounded-lg object-cover shrink-0 border border-gray-100"
            />
          ) : (
            <div className="w-14 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center shrink-0 border border-gray-100">
              <span className="text-blue-400 text-[10px] font-bold">BLOG</span>
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate m-0 leading-tight">
              {record.title}
            </p>
            <p className="text-xs text-gray-400 truncate m-0 mt-0.5 max-w-[240px]">
              {record.summary}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Tác giả",
      key: "author",
      width: "18%",
      render: (_: unknown, record: IBlogPost) => {
        const authorName = record.author && formatFullName(record.author);
        return (
          <div className="flex items-center gap-2">
            <Avatar
              src={record.author?.avatar}
              size="small"
              className="bg-blue-100 text-blue-600 font-medium text-xs"
            >
              {record.author?.firstName?.charAt(0) || "U"}
            </Avatar>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-700 truncate m-0">{authorName}</p>
              <p className="text-[10px] text-gray-400 m-0 uppercase tracking-wider">{record.author?.role || "INSTRUCTOR"}</p>
            </div>
          </div>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "12%",
      render: (status: string) => <BlogStatusTag status={status} />,
    },
    {
      title: "Ghim nổi bật",
      key: "isPinned",
      width: "12%",
      align: "center" as const,
      render: (_: unknown, record: IBlogPost) => (
        <Tooltip title={record.status === "PUBLISHED" ? "Ghim bài viết này lên đầu trang chủ" : "Chỉ có thể ghim bài viết đã xuất bản"}>
          <Switch
            checked={record.isPinned}
            onChange={() => handleTogglePin(record)}
            disabled={record.status !== "PUBLISHED" || pinMutation.isPending}
            checkedChildren={<Pin className="w-3.5 h-3.5 mt-1" />}
            unCheckedChildren={<Pin className="w-3.5 h-3.5 mt-1 opacity-50" />}
          />
        </Tooltip>
      ),
    },
    {
      title: "Báo cáo vi phạm",
      key: "reports",
      width: "12%",
      align: "center" as const,
      render: (_: unknown, record: IBlogPost) => {
        const count = record.reportedUserIds?.length || 0;
        return count > 0 ? (
          <Tooltip title={`Báo cáo bởi ${count} tài khoản học viên`}>
            <Badge count={count}>
              <Tag color="red" className="rounded-full px-2 py-0.5 m-0 font-bold flex items-center gap-1 text-[11px]">
                <ShieldAlert className="w-3.5 h-3.5 text-red-500" /> {count} Báo cáo
              </Tag>
            </Badge>
          </Tooltip>
        ) : (
          <span className="text-xs text-gray-400">-</span>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "10%",
      render: (date: string) => (
        <span className="text-xs text-gray-500">{formatDateTime(date)}</span>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: "10%",
      align: "center" as const,
      render: (_: unknown, record: IBlogPost) => (
        <div className="flex items-center justify-center gap-1.5">
          {/* View/Preview Article */}
          <Tooltip title="Xem chi tiết & bình luận">
            <button
              onClick={() => handleOpenPreviewModal(record.id)}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>
          </Tooltip>

          {/* Block / Unblock */}
          {record.status === "BLOCKED" ? (
            <Tooltip title="Mở khóa bài viết">
              <CPopconfirm
                title="Mở khóa bài viết này?"
                description="Bài viết sẽ được hiển thị công khai trở lại."
                onConfirm={() => handleUnblockBlog(record.id)}
                okText="Mở khóa"
                cancelText="Hủy"
              >
                <button className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-green-500 hover:bg-green-50 transition-colors">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                </button>
              </CPopconfirm>
            </Tooltip>
          ) : (
            record.status !== "DRAFT" && (
              <Tooltip title="Khóa bài viết (Vi phạm chính sách)">
                <CPopconfirm
                  title="Khóa bài viết này?"
                  description="Bài viết này sẽ bị ẩn ngay lập tức khỏi học viên."
                  onConfirm={() => handleBlockBlog(record.id)}
                  okText="Khóa bài"
                  cancelText="Hủy"
                  okButtonProps={{ danger: true }}
                >
                  <button className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <ShieldAlert className="w-4 h-4 text-red-500" />
                  </button>
                </CPopconfirm>
              </Tooltip>
            )
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý Bài viết Hệ thống"
        subtitle="Quản trị, kiểm duyệt, ghim nổi bật hoặc khóa các bài viết chia sẻ kiến thức trên toàn nền tảng"
      />

      {/* Filter Bar */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto flex-1">
            <div className="flex-1 max-w-md">
              <CInput
                placeholder="Tìm kiếm theo tiêu đề bài viết..."
                prefix={<Search className="w-4 h-4 text-gray-400" />}
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  setPage(1);
                }}
                className="rounded-xl h-11 border-gray-200"
                allowClear
              />
            </div>
            <div className="w-full sm:w-[180px]">
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
                  { label: "Đã khóa", value: "BLOCKED" },
                ]}
              />
            </div>
            <div className="w-full sm:w-[220px]">
              <CSelect
                placeholder="Lọc theo tác giả"
                value={authorFilter}
                onChange={(value) => {
                  setAuthorFilter(value);
                  setPage(1);
                }}
                className="w-full h-11"
                allowClear
                showSearch
                optionFilterProp="label"
                loading={isLoadingInstructors}
                options={instructorsOptions}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-sm font-semibold text-gray-600">Báo cáo vi phạm:</span>
            <Switch
              checked={onlyReported}
              onChange={(checked) => {
                setOnlyReported(checked);
                setPage(1);
              }}
              checkedChildren="Chỉ bài bị báo cáo"
              unCheckedChildren="Tất cả bài viết"
              className={onlyReported ? "bg-red-500" : ""}
            />
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <Table
          dataSource={filteredBlogs}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={false}
          className="[&_.ant-table-thead_th]:bg-gray-50/80 [&_.ant-table-thead_th]:text-xs [&_.ant-table-thead_th]:font-semibold [&_.ant-table-thead_th]:text-gray-500 [&_.ant-table-thead_th]:uppercase [&_.ant-table-thead_th]:tracking-wide [&_.ant-table-thead_th]:border-gray-100"
        />

        {/* Custom Pagination */}
        {blogsData && totalElements > 0 && (
          <div className="flex justify-end p-4 border-t border-gray-50">
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
              pageSizeOptions={["10", "20", "50", "100"]}
            />
          </div>
        )}
      </div>

      {/* Blog Preview Modal */}
      <BlogPreviewModal
        open={isPreviewOpen}
        onCancel={handleClosePreviewModal}
        blogId={previewBlogId}
      />
    </div>
  );
};

export default AdminBlogList;
