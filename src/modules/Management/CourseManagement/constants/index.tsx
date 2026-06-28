import CButton from "@/components/UI/Button";
import { CourseStatus } from "@/constants/enums";
import type { ICategory, ICourse } from "@/type";
import CTag, { TypeTagEnum } from "@/components/UI/Tag";
import { formatDate, formatFullName, formatDateTime } from "@/utils/format";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Avatar, Badge, Rate, Space, Tag, Tooltip, Typography } from "antd";
import CPopconfirm from "@/components/UI/Popconfirm";
import {
  Archive,
  BookOpen,
  CheckCircle,
  Clock,
  Edit2,
  Eye,
  History,
  RotateCcw,
  Send,
  ShieldCheck,
  Users,
  XCircle
} from "lucide-react";
import CategoryIcon from "../components/CategoryIcon";
import CourseStatusTag from "../components/CourseStatusTag";

const { Text, Paragraph } = Typography;

export const formatPrice = (value: number | undefined): string => {
  if (value === undefined || value === null || value === 0) return "Miễn phí";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

// 1. Columns for Category Management
export const getColumnsTableCategory = (
  onEdit: (record: ICategory) => void,
  onDelete: (id: string) => void,
  deleting: boolean
) => [
  {
    title: "Icon",
    key: "icon",
    width: 64,
    align: "center" as const,
    render: (_: any, record: ICategory) => (
      <CategoryIcon src={record.icon || record.cateImage} alt={record.name} size={40} />
    ),
  },
  {
    title: "Tên danh mục",
    key: "name",
    render: (_: any, record: ICategory) => (
      <div>
        <Text strong className="text-sm">{record.name}</Text>
        <br />
        <Text type="secondary" className="text-xs">{record.cateSlug}</Text>
      </div>
    ),
  },
  {
    title: "Mô tả",
    dataIndex: "description",
    key: "description",
    ellipsis: true,
    width: 320,
    responsive: ["md"] as any,
    render: (desc: string) => (
      <Paragraph
        ellipsis={{ rows: 2, tooltip: true }}
        className="mb-0 text-xs text-gray-500"
        style={{ maxWidth: 300 }}
      >
        {desc || "—"}
      </Paragraph>
    ),
  },
  {
    title: "Số khóa học",
    key: "courses",
    width: 120,
    align: "center" as const,
    render: (_: any, record: ICategory) => (
      <Badge
        count={record.courses ?? 0}
        showZero
        overflowCount={999}
        style={{
          backgroundColor: (record.courses ?? 0) > 0 ? "#2563eb" : "#d9d9d9",
          borderRadius: 6,
          padding: "0 8px",
          fontSize: 12,
          fontWeight: 600,
        }}
      />
    ),
  },
  {
    title: "Ngày tạo",
    key: "createdAt",
    width: 130,
    responsive: ["sm"] as any,
    render: (_: any, record: any) =>
      record.createdAt ? (
        <Text className="text-xs text-gray-500">
          {formatDate(record.createdAt)}
        </Text>
      ) : (
        <Text className="text-xs text-gray-300">—</Text>
      ),
  },
  {
    title: "Thao tác",
    key: "actions",
    width: 120,
    align: "center" as const,
    render: (_: any, record: ICategory) => (
      <Space size="small">
        <Tooltip title="Chỉnh sửa">
          <CButton
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            className="hover:text-blue-500"
          />
        </Tooltip>
        <CPopconfirm
          title="Xóa danh mục?"
          description={`Bạn có chắc muốn xóa "${record.name}"? Hành động này không thể hoàn tác.`}
          onConfirm={() => onDelete(record.id)}
          okButtonProps={{ danger: true, loading: deleting }}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Tooltip title="Xóa">
            <CButton
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              danger
            />
          </Tooltip>
        </CPopconfirm>
      </Space>
    ),
  },
];



// 2. Columns for Admin Course List
export const getColumnsTableCoursesAdmin = ({
  onViewCurriculum,
  onShowHistory,
  onApprove,
  onReject,
  onUnpublish,
  onForcePublish,
}: {
  onViewCurriculum: (course: ICourse) => void;
  onShowHistory: (course: ICourse) => void;
  onApprove: (course: ICourse) => void;
  onReject: (course: ICourse) => void;
  onUnpublish: (course: ICourse) => void;
  onForcePublish: (course: ICourse) => void;
}) => [
  {
    title: "Khóa học",
    key: "courseInfo",
    width: 320,
    render: (_: any, record: ICourse) => (
      <div className="flex gap-3">
        <img
          alt={record.name}
          src={record.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&auto=format&fit=crop&q=80"}
          className="w-16 h-10 object-cover rounded shadow-sm shrink-0 border border-gray-100"
        />
        <div className="min-w-0 flex flex-col justify-center">
          <Text strong className="text-sm text-gray-800 line-clamp-1 cursor-pointer hover:text-blue-600" onClick={() => onViewCurriculum(record)}>
            {record.name}
          </Text>
          <span className="text-[11px] text-gray-400 font-medium">
            {record.category?.name || "Danh mục khác"}
          </span>
        </div>
      </div>
    ),
  },
  {
    title: "Giảng viên",
    key: "instructor",
    width: 180,
    render: (_: any, record: ICourse) => {
      const instName = record.instructor
        && formatFullName(record.instructor)

      return (
        <div>
          <Text className="text-xs text-gray-700 font-medium">{instName}</Text>
          <br />
          <Text type="secondary" className="text-[10px] text-gray-400">{record.instructorId || "—"}</Text>
        </div>
      );
    },
  },
  {
    title: "Giá",
    key: "priceInfo",
    width: 160,
    render: (_: any, record: ICourse) => {
      const hasDiscount = record.price && record.finalPrice && record.finalPrice < record.price;
      return (
        <div className="flex flex-col">
          {hasDiscount ? (
            <>
              <span className="text-sm font-bold text-blue-600">{formatPrice(record.finalPrice)}</span>
              <span className="text-[10px] text-gray-400 line-through">{formatPrice(record.price)}</span>
            </>
          ) : (
            <span className="text-sm font-bold text-gray-700">{formatPrice(record.finalPrice ?? record.price)}</span>
          )}
        </div>
      );
    },
  },
  {
    title: "Đánh giá & Thống kê",
    key: "stats",
    width: 180,
    responsive: ["md"] as any,
    render: (_: any, record: ICourse) => (
      <div className="space-y-1">
        <div className="flex items-center gap-1">
          <Rate disabled allowHalf defaultValue={record.avgRatingStars || 0} style={{ fontSize: 10, color: "#fadb14" }} />
          <span className="text-[10px] text-gray-400">({record.numOfReviews || 0})</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-gray-400 font-medium">
          <span className="flex items-center gap-1"><Users className="w-3 h-3 text-gray-400" /> {record.studentCount || 0}</span>
          <span className="flex items-center gap-1"><Eye className="w-3 h-3 text-gray-400" /> {record.views || 0}</span>
        </div>
      </div>
    ),
  },
  {
    title: "Cấp độ",
    key: "level",
    width: 140,
    responsive: ["sm"] as any,
    render: (_: any, record: ICourse) => (
      <Tag color="purple" className="m-0 text-[10px] font-bold py-0.5 border-0 uppercase">{record.level}</Tag>
    ),
  },
  {
    title: "Trạng thái",
    key: "status",
    dataIndex: "status",
    width: 120,
    render: (status: any) => <CourseStatusTag status={status} className="rounded-full px-2.5 py-0.5 text-[10px] uppercase font-semibold" />,
  },
  {
    title: "Hành động",
    key: "actions",
    width: 160,
    align: "center" as const,
    render: (_: any, record: ICourse) => {
      const isPending = record.status === CourseStatus.PENDING;
      const isPublished = record.status === CourseStatus.PUBLISHED;

      return (
        <Space size="middle" className="text-gray-500">
          <Tooltip title="Xem giáo trình">
            <CButton
              type="text"
              size="small"
              icon={<BookOpen className="w-4 h-4 text-blue-500" />}
              onClick={() => onViewCurriculum(record)}
            />
          </Tooltip>

          {isPending && (
            <>
              <Tooltip title="Phê duyệt">
                <CPopconfirm
                  title="Duyệt khóa học?"
                  description="Khóa học sẽ được xuất bản công khai."
                  onConfirm={() => onApprove(record)}
                  okText="Duyệt"
                  cancelText="Hủy"
                >
                  <CButton
                    type="text"
                    size="small"
                    icon={<CheckCircle className="w-4 h-4 text-green-500" />}
                  />
                </CPopconfirm>
              </Tooltip>
              <Tooltip title="Từ chối">
                <CPopconfirm
                  title="Từ chối khóa học?"
                  description="Trả về cho giảng viên chỉnh sửa."
                  onConfirm={() => onReject(record)}
                  okText="Từ chối"
                  cancelText="Hủy"
                  okButtonProps={{ danger: true }}
                >
                  <CButton
                    type="text"
                    size="small"
                    icon={<XCircle className="w-4 h-4 text-red-500" />}
                  />
                </CPopconfirm>
              </Tooltip>
            </>
          )}

          {!isPending && isPublished && (
            <Tooltip title="Gỡ bỏ">
              <CPopconfirm
                title="Gỡ khóa học?"
                description="Khóa học sẽ bị ẩn khỏi hệ thống."
                onConfirm={() => onUnpublish(record)}
                okText="Gỡ bỏ"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
              >
                <CButton
                  type="text"
                  size="small"
                  icon={<XCircle className="w-4 h-4 text-orange-500" />}
                />
              </CPopconfirm>
            </Tooltip>
          )}

          {!isPending && !isPublished && (
            <Tooltip title="Xuất bản trực tiếp">
              <CPopconfirm
                title="Xuất bản trực tiếp?"
                description="Khóa học sẽ xuất bản ngay lập tức."
                onConfirm={() => onForcePublish(record)}
                okText="Xuất bản"
                cancelText="Hủy"
              >
                <CButton
                  type="text"
                  size="small"
                  icon={<ShieldCheck className="w-4 h-4 text-emerald-500" />}
                />
              </CPopconfirm>
            </Tooltip>
          )}

          <Tooltip title="Lịch sử thay đổi">
            <CButton
              type="text"
              size="small"
              icon={<History className="w-4 h-4 text-violet-500" />}
              onClick={() => onShowHistory(record)}
            />
          </Tooltip>
        </Space>
      );
    },
  },
];

// 3. Columns for Instructor Course List
export const getColumnsTableCoursesInstructor = ({
  onViewCurriculum,
  onEditInfo,
  onSubmitForReview,
  onArchive,
  onRestore,
}: {
  onViewCurriculum: (course: ICourse) => void;
  onEditInfo: (course: ICourse) => void;
  onSubmitForReview: (course: ICourse) => void;
  onArchive: (course: ICourse) => void;
  onRestore: (course: ICourse) => void;
}) => [
  {
    title: "Khóa học",
    key: "courseInfo",
    width: 320,
    render: (_: any, record: ICourse) => (
      <div className="flex gap-3">
        <img
          alt={record.name}
          src={record.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&auto=format&fit=crop&q=80"}
          className="w-16 h-10 object-cover rounded shadow-sm shrink-0 border border-gray-100"
        />
        <div className="min-w-0 flex flex-col justify-center">
          <Text strong className="text-sm text-gray-800 line-clamp-1 cursor-pointer hover:text-blue-600" onClick={() => onViewCurriculum(record)}>
            {record.name}
          </Text>
          <span className="text-[11px] text-gray-400 font-medium">
            {record.category?.name || "Danh mục khác"}
          </span>
        </div>
      </div>
    ),
  },
  {
    title: "Giá",
    key: "priceInfo",
    width: 160,
    render: (_: any, record: ICourse) => {
      const hasDiscount = record.price && record.finalPrice && record.finalPrice < record.price;
      return (
        <div className="flex flex-col">
          {hasDiscount ? (
            <>
              <span className="text-sm font-bold text-blue-600">{formatPrice(record.finalPrice)}</span>
              <span className="text-[10px] text-gray-400 line-through">{formatPrice(record.price)}</span>
            </>
          ) : (
            <span className="text-sm font-bold text-gray-700">{formatPrice(record.finalPrice ?? record.price)}</span>
          )}
        </div>
      );
    },
  },
  {
    title: "Thống kê",
    key: "stats",
    width: 180,
    responsive: ["md"] as any,
    render: (_: any, record: ICourse) => (
      <div className="space-y-1">
        <div className="flex items-center gap-1">
          <Rate disabled allowHalf defaultValue={record.avgRatingStars || 0} style={{ fontSize: 10, color: "#fadb14" }} />
          <span className="text-[10px] text-gray-400">({record.numOfReviews || 0})</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-gray-400 font-medium">
          <span className="flex items-center gap-1"><Users className="w-3 h-3 text-gray-400" /> {record.studentCount || 0} học viên</span>
          <span className="flex items-center gap-1"><Eye className="w-3 h-3 text-gray-400" /> {record.views || 0} xem</span>
        </div>
      </div>
    ),
  },
  {
    title: "Cấp độ",
    key: "level",
    width: 140,
    responsive: ["sm"] as any,
    render: (_: any, record: ICourse) => (
      <Tag color="purple" className="m-0 text-[10px] font-bold py-0.5 border-0 uppercase">{record.level}</Tag>
    ),
  },
  {
    title: "Trạng thái",
    key: "status",
    dataIndex: "status",
    width: 120,
    render: (status: any) => <CourseStatusTag status={status} className="rounded-full px-2.5 py-0.5 text-[10px] uppercase font-semibold" />,
  },
  {
    title: "Hành động",
    key: "actions",
    width: 160,
    align: "center" as const,
    render: (_: any, record: ICourse) => {
      const isDraft = record.status === CourseStatus.DRAFT || record.status === CourseStatus.REJECTED;
      const isPending = record.status === CourseStatus.PENDING;
      const isPublished = record.status === CourseStatus.PUBLISHED;
      const isArchived = record.status === CourseStatus.ARCHIVED;

      return (
        <Space size="middle" className="text-gray-500">
          <Tooltip title="Chỉnh sửa giáo trình">
            <CButton
              type="text"
              size="small"
              icon={<BookOpen className="w-4 h-4 text-blue-500" />}
              onClick={() => onViewCurriculum(record)}
            />
          </Tooltip>

          <Tooltip title="Sửa thông tin cơ bản">
            <CButton
              type="text"
              size="small"
              icon={<Edit2 className="w-4 h-4 text-amber-500" />}
              onClick={() => onEditInfo(record)}
            />
          </Tooltip>

          {isDraft && (
            <Tooltip title="Gửi duyệt">
              <CPopconfirm
                title="Gửi duyệt khóa học?"
                description="Gửi yêu cầu kiểm duyệt nội dung cho Admin."
                onConfirm={() => onSubmitForReview(record)}
                okText="Xác nhận"
                cancelText="Hủy"
              >
                <CButton
                  type="text"
                  size="small"
                  icon={<Send className="w-4 h-4 text-green-500" />}
                />
              </CPopconfirm>
            </Tooltip>
          )}

          {isPending && (
            <Tooltip title="Đang chờ duyệt">
              <CButton
                type="text"
                size="small"
                disabled
                icon={<Clock className="w-4 h-4 text-gray-400" />}
              />
            </Tooltip>
          )}

          {isPublished && (
            <Tooltip title="Lưu trữ">
              <CPopconfirm
                title="Lưu trữ khóa học?"
                description="Khóa học sẽ bị ẩn khỏi học viên."
                onConfirm={() => onArchive(record)}
                okText="Lưu trữ"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
              >
                <CButton
                  type="text"
                  size="small"
                  icon={<Archive className="w-4 h-4 text-red-500" />}
                />
              </CPopconfirm>
            </Tooltip>
          )}

          {isArchived && (
            <Tooltip title="Khôi phục thành nháp">
              <CPopconfirm
                title="Khôi phục khóa học?"
                description="Chuyển về trạng thái Bản nháp để chỉnh sửa."
                onConfirm={() => onRestore(record)}
                okText="Xác nhận"
                cancelText="Hủy"
              >
                <CButton
                  type="text"
                  size="small"
                  icon={<RotateCcw className="w-4 h-4 text-indigo-500" />}
                />
              </CPopconfirm>
            </Tooltip>
          )}
        </Space>
      );
    },
  },
];

// 4. Interface & Columns for Course History Log
export interface ICourseHistoryLog {
  id: string;
  type: string;
  createdAt: string;
  description: string;
  userId?: string;
  createdByName?: string;
  instructor?: {
    firstName: string;
    lastName: string;
    avatar?: string;
    role?: string;
  };
}

export const getHistoryColumns = () => [
  {
    title: "Thời gian",
    dataIndex: "createdAt",
    key: "createdAt",
    width: 145,
    render: (date: string) => <span className="text-gray-500 text-xs">{formatDateTime(date)}</span>,
  },
  {
    title: "Hành động",
    dataIndex: "type",
    key: "type",
    width: 110,
    render: (type: string) => {
      let tagType: TypeTagEnum = TypeTagEnum.WAITING;
      if (type === "CREATE") tagType = TypeTagEnum.SUCCESS;
      if (type === "DELETE") tagType = TypeTagEnum.ERROR;
      if (type === "UPDATE") tagType = TypeTagEnum.PROCESSING;
      return <CTag type={tagType} className="m-0 text-[10px] uppercase font-bold">{type}</CTag>;
    },
  },
  {
    title: "Mô tả",
    dataIndex: "description",
    key: "description",
    render: (text: string) => <span className="text-sm text-gray-700 font-medium">{text}</span>,
  },
  {
    title: "Tác nhân",
    key: "actor",
    width: 220,
    render: (_: any, log: ICourseHistoryLog) => {
      const name = log.instructor ? formatFullName(log.instructor) : (log.createdByName || log.userId || "Hệ thống");
      const role = log.instructor?.role || (log.userId === "SYSTEM" ? "SYSTEM" : "USER");
      const avatarUrl = log.instructor?.avatar;

      return (
        <div className="flex items-center gap-2">
          <Avatar src={avatarUrl} size="small" className="bg-violet-100 text-violet-600 font-semibold">
            {name ? name.charAt(0).toUpperCase() : "H"}
          </Avatar>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-600">{name}</span>
            <span className="text-[10px] text-gray-400 capitalize">{role.toLowerCase()}</span>
          </div>
        </div>
      );
    },
  },
];
