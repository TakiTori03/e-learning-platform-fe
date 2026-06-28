import CPopconfirm from "@/components/UI/Popconfirm";
import { CourseStatus } from "@/constants/enums";
import type { ICourse, IUserInfo } from "@/type";
import { formatFullName } from "@/utils/format";
import { Empty, Pagination, Spin, Table, Tooltip, Typography } from "antd";
import {
  BookOpen,
  CheckCircle,
  History,
  XCircle
} from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// UI Wrappers & Template Components
import CModal from "@/components/UI/Modal";
import PageHeader from "@/components/UI/PageHeader";
import CSelect from "@/components/UI/Select";
import { Show } from "@/components/UI/Template";
import CourseFilterBar from "../components/CourseFilterBar";
import CourseGrid from "../components/CourseGrid";
import { getHistoryColumns } from "../constants";

// React Query hooks
import {
  useAdminApproveCourse,
  useAdminCourses,
  useCategoriesSelect,
  useCourseHistory,
  useInstructorsSelect,
} from "../queryHooks";

const { Text } = Typography;

export const AdminCourseList: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  const [authorFilter, setAuthorFilter] = useState<string | undefined>(undefined);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [selectedCourseForHistory, setSelectedCourseForHistory] = useState<ICourse | null>(null);
  const [historyPage, setHistoryPage] = useState(1);


  const handleSearchChange = useCallback((value: string) => {
    setSearchText(value);
    setPage(1);
  }, []);

  const handleStatusFilterChange = useCallback((value: string | undefined) => {
    setStatusFilter(value);
    setPage(1);
  }, []);

  const handleCategoryFilterChange = useCallback((value: string | undefined) => {
    setCategoryFilter(value);
    setPage(1);
  }, []);

  const handleAuthorFilterChange = useCallback((value: string | undefined) => {
    setAuthorFilter(value);
    setPage(1);
  }, []);

  // Queries & Mutations
  const { data: coursesData, isLoading } = useAdminCourses(
    page,
    pageSize,
    searchText || undefined,
    authorFilter,
    statusFilter
  );
  const { data: categories = [] } = useCategoriesSelect();
  const { data: instructors = [] } = useInstructorsSelect();
  const approveMutation = useAdminApproveCourse();

  const { data: historyData, isLoading: loadingHistory } = useCourseHistory(
    selectedCourseForHistory?.id || "",
    historyPage,
    10
  );

  // Mutation handlers
  const handleApprove = useCallback((course: ICourse) => {
    approveMutation.mutate({ id: course.id, status: CourseStatus.PUBLISHED });
  }, [approveMutation]);

  const handleReject = useCallback((course: ICourse) => {
    approveMutation.mutate({ id: course.id, status: CourseStatus.REJECTED });
  }, [approveMutation]);

  const handleUnpublish = useCallback((course: ICourse) => {
    approveMutation.mutate({ id: course.id, status: CourseStatus.REJECTED });
  }, [approveMutation]);

  const handleForcePublish = useCallback((course: ICourse) => {
    approveMutation.mutate({ id: course.id, status: CourseStatus.PUBLISHED });
  }, [approveMutation]);

  // Client-side category filtering fallback
  const filteredCourses = useMemo(() => {
    if (!coursesData?.content) return [];
    if (!categoryFilter) return coursesData.content;
    return coursesData.content.filter(
      (c) => (c.category?.id || c.category) === categoryFilter
    );
  }, [coursesData, categoryFilter]);

  // Admin Card Actions Builder
  const renderActions = useCallback((course: ICourse) => {
    const viewCurriculum = (
      <Tooltip title="Xem giáo trình (Read-only)" key="view-curriculum">
        <div
          onClick={() => navigate(`/admin/courses/${course.id}`)}
          className="flex justify-center items-center py-2 text-gray-500 hover:text-primary transition-colors cursor-pointer w-full"
        >
          <BookOpen className="w-4 h-4 mr-1.5 text-blue-500" />
          <span className="text-xs font-semibold">Xem</span>
        </div>
      </Tooltip>
    );

    const historyAction = (
      <Tooltip title="Lịch sử thay đổi" key="history">
        <div
          onClick={() => {
            setSelectedCourseForHistory(course);
            setHistoryPage(1);
            setHistoryModalVisible(true);
          }}
          className="flex justify-center items-center py-2 text-gray-500 hover:text-violet-600 transition-colors cursor-pointer w-full"
        >
          <History className="w-4 h-4 mr-1.5 text-violet-500" />
          <span className="text-xs font-semibold">Lịch sử</span>
        </div>
      </Tooltip>
    );

    if (course.status === CourseStatus.PENDING) {
      const approveAction = (
        <Tooltip title="Phê duyệt khóa học" key="approve">
          <CPopconfirm
            title="Phê duyệt khóa học này?"
            description="Khóa học sẽ được xuất bản công khai trên hệ thống."
            onConfirm={() => handleApprove(course)}
            okText="Duyệt"
            cancelText="Hủy"
          >
            <div className="flex justify-center items-center py-2 text-green-600 hover:text-green-700 cursor-pointer font-semibold text-xs w-full">
              <CheckCircle className="w-4 h-4 mr-1.5 text-green-500" />
              <span>Duyệt</span>
            </div>
          </CPopconfirm>
        </Tooltip>
      );

      const rejectAction = (
        <Tooltip title="Từ chối phê duyệt" key="reject">
          <CPopconfirm
            title="Từ chối khóa học này?"
            description="Khóa học sẽ bị từ chối và trả lại cho giảng viên chỉnh sửa."
            onConfirm={() => handleReject(course)}
            okText="Từ chối"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <div className="flex justify-center items-center py-2 text-red-600 hover:text-red-700 cursor-pointer font-semibold text-xs w-full">
              <XCircle className="w-4 h-4 mr-1.5 text-red-500" />
              <span>Từ chối</span>
            </div>
          </CPopconfirm>
        </Tooltip>
      );

      return [viewCurriculum, approveAction, rejectAction, historyAction];
    }

    if (course.status === CourseStatus.PUBLISHED) {
      const statusAction = (
        <Tooltip title="Gỡ khóa học khỏi hệ thống" key="unpublish">
          <CPopconfirm
            title="Gỡ khóa học này?"
            description="Khóa học sẽ chuyển sang trạng thái bị từ chối và không hiển thị nữa."
            onConfirm={() => handleUnpublish(course)}
            okText="Gỡ bỏ"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <div className="flex justify-center items-center py-2 text-gray-500 hover:text-red-600 transition-colors cursor-pointer w-full">
              <XCircle className="w-4 h-4 mr-1.5 text-red-500" />
              <span className="text-xs font-semibold">Gỡ bỏ</span>
            </div>
          </CPopconfirm>
        </Tooltip>
      );
      return [viewCurriculum, statusAction, historyAction];
    }

    return [viewCurriculum, historyAction];
  }, [navigate, handleApprove, handleReject, handleUnpublish]);

  const handlePageChange = useCallback((p: number, ps?: number) => {
    setPage(p);
    if (ps) setPageSize(ps);
  }, []);

  const handleHistoryModalClose = useCallback(() => {
    setHistoryModalVisible(false);
    setSelectedCourseForHistory(null);
  }, []);

  const handleHistoryPageChange = useCallback((page: number) => {
    setHistoryPage(page);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý khóa học hệ thống"
        subtitle="Phê duyệt, kiểm duyệt nội dung và quản trị tất cả khóa học trên nền tảng"
        showCreateButton={false}
      />

      <CourseFilterBar
        searchText={searchText}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={handleCategoryFilterChange}
        categories={categories}
        extraFilters={
          <CSelect
            showSearch
            allowClear
            placeholder="Lọc theo giảng viên"
            value={authorFilter}
            onChange={handleAuthorFilterChange}
            className="w-full h-11 custom-select"
            style={{ height: "44px" }}
            options={instructors.map((inst: IUserInfo) => ({
              value: inst.id,
              label: formatFullName(inst),
            }))}
          />
        }
      />

      {/* Grid Course View */}
      <CourseGrid
        courses={filteredCourses}
        isLoading={isLoading}
        renderActions={renderActions}
      />

      {/* Pagination */}
      {coursesData && coursesData.totalElements > 0 && (
        <div className="flex justify-end mt-8">
          <Pagination
            current={page}
            pageSize={pageSize}
            total={coursesData.totalElements}
            onChange={handlePageChange}
            showTotal={(total) => `Tổng số ${total} khóa học`}
            showSizeChanger={true}
            pageSizeOptions={["8", "12", "24", "48"]}
          />
        </div>
      )}

      {/* History Log Modal */}
      <CModal
        title={
          <div>
            <Text strong className="text-base text-white">Lịch sử thay đổi</Text>
            <br />
            <Text type="secondary" className="text-xs text-white/80">{selectedCourseForHistory?.name}</Text>
          </div>
        }
        open={historyModalVisible}
        onCancel={handleHistoryModalClose}
        footer={null}
        width={850}
        destroyOnClose
      >
        <div className="py-2">
          <Show>
            <Show.When isTrue={loadingHistory}>
              <div className="flex items-center justify-center h-48">
                <Spin size="large" />
              </div>
            </Show.When>
            <Show.When isTrue={!!(historyData?.content && historyData.content.length > 0)}>
              <Table
                columns={getHistoryColumns()}
                dataSource={historyData?.content}
                rowKey="id"
                pagination={false}
                size="small"
                className="border border-gray-100 rounded-lg overflow-hidden"
              />
              <div className="flex justify-center mt-6 pt-4 border-t border-gray-100">
                <Pagination
                  current={historyPage}
                  pageSize={10}
                  total={historyData?.totalElements || 0}
                  onChange={handleHistoryPageChange}
                  showSizeChanger={false}
                  size="small"
                />
              </div>
            </Show.When>
            <Show.Else>
              <Empty description="Chưa có lịch sử thay đổi cho khóa học này." className="py-8" />
            </Show.Else>
          </Show>
        </div>
      </CModal>
    </div>
  );
};

export default AdminCourseList;
