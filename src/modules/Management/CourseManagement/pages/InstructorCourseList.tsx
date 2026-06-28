import React, { useState, useMemo, useCallback } from "react";
import { Form, App, Tooltip, Pagination } from "antd";
import CPopconfirm from "@/components/UI/Popconfirm";
import { useNavigate } from "react-router-dom";
import { BookOpen, Edit2, Send, Archive, RotateCcw, Clock } from "lucide-react";
import type { ICourse } from "@/type";
import { CourseStatus } from "@/constants/enums";

// UI Wrappers & Template Components
import PageHeader from "@/components/UI/PageHeader";
import CourseFilterBar from "../components/CourseFilterBar";
import CourseFormModal from "../components/CourseFormModal";
import CourseGrid from "../components/CourseGrid";

// React Query hooks
import {
  useInstructorCourses,
  useCategoriesSelect,
  useCreateCourse,
  useUpdateCourse,
  useToggleCourseActiveStatus,
} from "../queryHooks";
import { courseApi } from "../services/courseApi";
import type { ICourseRequest } from "../services/courseApi";

export const InstructorCourseList: React.FC = () => {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);

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

  // Modal form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<ICourse | null>(null);
  const [form] = Form.useForm();

  // Queries & Mutations
  const { data: coursesData, isLoading } = useInstructorCourses(
    page,
    pageSize,
    searchText || undefined,
    statusFilter
  );
  const { data: categories = [] } = useCategoriesSelect();
  
  const createCourseMutation = useCreateCourse();
  const updateCourseMutation = useUpdateCourse(editingCourse?.id || "");
  const toggleActiveMutation = useToggleCourseActiveStatus();

  // Open Create Modal
  const handleOpenCreateModal = useCallback(() => {
    setEditingCourse(null);
    form.resetFields();
    setIsModalOpen(true);
  }, [form]);

  // Open Edit Modal
  const handleOpenEditModal = useCallback(async (course: ICourse) => {
    let hideLoader = () => {};
    try {
      hideLoader = message.open({
        type: "loading",
        content: "Đang tải dữ liệu khóa học...",
        duration: 0,
      });
      const fullCourse = await courseApi.getCourseDetail(course.id);
      hideLoader();
      
      setEditingCourse(fullCourse);
      form.setFieldsValue({
        name: fullCourse.name,
        subTitle: fullCourse.subTitle,
        description: fullCourse.description,
        categoryId: fullCourse.category?.id || fullCourse.category,
        level: fullCourse.level,
        price: fullCourse.price,
        finalPrice: fullCourse.finalPrice,
        thumbnail: fullCourse.thumbnail,
        coursePreview: fullCourse.coursePreview,
        requirements: fullCourse.requirements,
        willLearns: fullCourse.willLearns,
        tags: fullCourse.tags,
      });
      setIsModalOpen(true);
    } catch (error) {
      if (hideLoader) hideLoader();
      console.error(error);
      message.error("Lỗi khi tải chi tiết khóa học!");
    }
  }, [message, form]);

  // Form Submit
  const handleFormSubmit = useCallback(async (values: ICourseRequest) => {
    if (editingCourse) {
      updateCourseMutation.mutate(values, {
        onSuccess: () => setIsModalOpen(false),
      });
    } else {
      createCourseMutation.mutate(values, {
        onSuccess: () => setIsModalOpen(false),
      });
    }
  }, [editingCourse, updateCourseMutation, createCourseMutation]);

  // Instructor Card Actions Builder
  const renderActions = useCallback((course: ICourse) => {
    const actions = [
      <Tooltip title="Chi tiết giáo trình" key="curriculum">
        <div
          onClick={() => navigate(`/author/courses/${course.id}`)}
          className="flex justify-center items-center py-2 text-gray-500 hover:text-primary transition-colors cursor-pointer w-full"
        >
          <BookOpen className="w-4 h-4 mr-1.5 text-blue-500" />
          <span className="text-xs font-semibold">Giáo trình</span>
        </div>
      </Tooltip>,
      <Tooltip title="Chỉnh sửa thông tin" key="edit">
        <div
          onClick={() => handleOpenEditModal(course)}
          className="flex justify-center items-center py-2 text-gray-500 hover:text-amber-600 transition-colors cursor-pointer w-full"
        >
          <Edit2 className="w-4 h-4 mr-1.5 text-amber-500" />
          <span className="text-xs font-semibold">Sửa</span>
        </div>
      </Tooltip>,
    ];

    if (course.status === CourseStatus.DRAFT || course.status === CourseStatus.REJECTED) {
      actions.push(
        <Tooltip title="Gửi yêu cầu phê duyệt cho Admin" key="submit-review">
          <CPopconfirm
            title="Gửi duyệt khóa học?"
            description="Sau khi gửi duyệt, bạn sẽ không thể thay đổi thông tin cho đến khi Admin phản hồi."
            onConfirm={() => toggleActiveMutation.mutate({ id: course.id, status: CourseStatus.PENDING })}
            okText="Xác nhận"
            cancelText="Hủy"
          >
            <div className="flex justify-center items-center py-2 text-gray-500 hover:text-green-600 transition-colors cursor-pointer w-full">
              <Send className="w-4 h-4 mr-1.5 text-green-500" />
              <span className="text-xs font-semibold">Gửi duyệt</span>
            </div>
          </CPopconfirm>
        </Tooltip>
      );
    } else if (course.status === CourseStatus.PENDING) {
      actions.push(
        <Tooltip title="Đang chờ Admin phê duyệt" key="pending-review">
          <div className="flex justify-center items-center py-2 text-gray-400 cursor-not-allowed w-full">
            <Clock className="w-4 h-4 mr-1.5 text-amber-500" />
            <span className="text-xs font-semibold">Đang duyệt</span>
          </div>
        </Tooltip>
      );
    } else if (course.status === CourseStatus.PUBLISHED) {
      actions.push(
        <Tooltip title="Ẩn/Lưu trữ khóa học này" key="archive">
          <CPopconfirm
            title="Lưu trữ khóa học này?"
            description="Khóa học sẽ bị ẩn khỏi học viên and chuyển vào kho lưu trữ."
            onConfirm={() => toggleActiveMutation.mutate({ id: course.id, status: CourseStatus.ARCHIVED })}
            okText="Xác nhận"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <div className="flex justify-center items-center py-2 text-gray-500 hover:text-red-600 transition-colors cursor-pointer w-full">
              <Archive className="w-4 h-4 mr-1.5 text-red-500" />
              <span className="text-xs font-semibold">Lưu trữ</span>
            </div>
          </CPopconfirm>
        </Tooltip>
      );
    } else if (course.status === CourseStatus.ARCHIVED) {
      actions.push(
        <Tooltip title="Khôi phục khóa học về trạng thái bản nháp" key="restore">
          <CPopconfirm
            title="Khôi phục khóa học này?"
            description="Khóa học sẽ trở về trạng thái Bản nháp để bạn chỉnh sửa."
            onConfirm={() => toggleActiveMutation.mutate({ id: course.id, status: CourseStatus.DRAFT })}
            okText="Xác nhận"
            cancelText="Hủy"
          >
            <div className="flex justify-center items-center py-2 text-gray-500 hover:text-indigo-600 transition-colors cursor-pointer w-full">
              <RotateCcw className="w-4 h-4 mr-1.5 text-indigo-500" />
              <span className="text-xs font-semibold">Khôi phục</span>
            </div>
          </CPopconfirm>
        </Tooltip>
      );
    }

    return actions;
  }, [navigate, handleOpenEditModal, toggleActiveMutation]);

  // Client-side category filtering fallback
  const filteredDataSource = useMemo(() => {
    if (!coursesData?.content) return [];
    if (!categoryFilter) return coursesData.content;
    return coursesData.content.filter(
      (c) => (c.category?.id || c.category) === categoryFilter
    );
  }, [coursesData, categoryFilter]);

  const handlePageChange = useCallback((p: number, ps?: number) => {
    setPage(p);
    if (ps) setPageSize(ps);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý khóa học của bạn"
        subtitle="Tạo mới, chỉnh sửa nội dung và theo dõi các khóa học bạn đang giảng dạy"
        showCreateButton
        createButtonText="Tạo khóa học mới"
        onCreateClick={handleOpenCreateModal}
      />

      <CourseFilterBar
        searchText={searchText}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={handleCategoryFilterChange}
        categories={categories}
      />

      {/* Grid Course View */}
      <CourseGrid
        courses={filteredDataSource}
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

      <CourseFormModal
        open={isModalOpen}
        onCancel={handleModalClose}
        onSubmit={handleFormSubmit}
        isSubmitting={createCourseMutation.isPending || updateCourseMutation.isPending}
        editingCourse={editingCourse}
        categories={categories}
        form={form}
      />
    </div>
  );
};

export default InstructorCourseList;
