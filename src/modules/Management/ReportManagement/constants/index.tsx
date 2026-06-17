import { formatFullName } from "@/utils/format";
import React from "react";
import { Space, Typography, Badge, Avatar } from "antd";
import { StarOutlined, BookOutlined } from "@ant-design/icons";
import BaseTag from "@/components/UI/Tag/BaseTag";
import { CourseStatus, CourseStatusLabels, UserRole, UserRoleLabels, OrderStatus, OrderStatusLabels } from "@/constants/enums";
import { formatDate, formatDateTime } from "@/utils/format";
import type { ColumnsType } from "antd/es/table";

const { Text } = Typography;

export const getColumnsTableUsers = (): ColumnsType<any> => [
  {
    title: "Học viên",
    key: "user",
    render: (_: any, record: any) => (
      <Space>
        <Avatar src={record.avatar || undefined}>{record.lastName?.charAt(0)}</Avatar>
        <div>
          <Text strong>{formatFullName(record)}</Text>
          <br />
          <Text type="secondary" className="text-xs">{record.email}</Text>
        </div>
      </Space>
    ),
  },
  {
    title: "Vai trò",
    dataIndex: "role",
    key: "role",
    render: (role: string) => {
      if (!role) return <span className="text-gray-400">-</span>;
      const colorMap: Record<UserRole, string> = {
        [UserRole.ADMIN]: "purple",
        [UserRole.INSTRUCTOR]: "cyan",
        [UserRole.STUDENT]: "blue",
      };

      const tagColor = colorMap[role as UserRole] || "blue";
      const label = UserRoleLabels[role as UserRole] || role;
      return (
        <BaseTag color={tagColor} className="font-semibold m-0 uppercase text-[10px]">
          {label}
        </BaseTag>
      );
    },
  },
  {
    title: "Ngày tham gia",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (date: string) => formatDate(date),
  },
];

export const getColumnsTableProgress = (): ColumnsType<any> => [
  {
    title: "Mã khóa học",
    dataIndex: "courseCode",
    key: "courseCode",
    width: 140,
    render: (code: string, record: any) => (
      <div className="flex flex-col">
        <Text strong className="text-xs">{code || record.courseId?.substring(0, 8)}</Text>
        <Text type="secondary" copyable className="text-[10px] select-all">{record.courseId}</Text>
      </div>
    )
  },
  {
    title: "Tên khóa học",
    dataIndex: "courseName",
    key: "courseName",
    width: 250,
    render: (name: string) => <Text strong className="text-xs text-gray-700">{name || "—"}</Text>
  },
  {
    title: "Tổng lượt đăng ký",
    dataIndex: "totalEnrollments",
    key: "totalEnrollments",
    sorter: (a: any, b: any) => a.totalEnrollments - b.totalEnrollments,
    render: (val: number) => <Text>{val.toLocaleString("vi-VN")}</Text>
  },
  {
    title: "Số lượt hoàn thành",
    dataIndex: "completedEnrollments",
    key: "completedEnrollments",
    sorter: (a: any, b: any) => a.completedEnrollments - b.completedEnrollments,
    render: (val: number) => <Badge count={val} showZero color="#10b981" />
  },
  {
    title: "Tiến độ học trung bình",
    dataIndex: "averageProgress",
    key: "averageProgress",
    sorter: (a: any, b: any) => a.averageProgress - b.averageProgress,
    render: (val: number) => (
      <Space direction="vertical" className="w-full">
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-primary">{val}%</span>
        </div>
        <div className="w-32 bg-gray-100 rounded-full h-1.5 overflow-hidden">
          <div className="bg-primary h-1.5 rounded-full" style={{ width: `${val}%` }}></div>
        </div>
      </Space>
    )
  }
];

export const getColumnsTableSales = (): ColumnsType<any> => [
  {
    title: "Tên khóa học",
    dataIndex: "courseName",
    key: "courseName",
    render: (text: string) => <Text strong>{text}</Text>
  },
  {
    title: "Lượt bán ra",
    dataIndex: "totalSales",
    key: "totalSales",
    sorter: (a: any, b: any) => a.totalSales - b.totalSales,
    render: (val: number) => <Text>{val.toLocaleString("vi-VN")} lượt</Text>
  },
  {
    title: "Doanh thu tích lũy",
    dataIndex: "totalRevenue",
    key: "totalRevenue",
    sorter: (a: any, b: any) => a.totalRevenue - b.totalRevenue,
    render: (val: number) => <Text className="font-bold text-green-600">{val.toLocaleString("vi-VN")}đ</Text>
  }
];

export const getColumnsTableOrders = (): ColumnsType<any> => [
  {
    title: "Mã giao dịch",
    dataIndex: "id",
    key: "id",
    render: (id: string) => <Text copyable type="secondary">{id.substring(0, 8)}...</Text>
  },
  {
    title: "Tổng thanh toán",
    dataIndex: "totalPrice",
    key: "totalPrice",
    render: (price: number) => <Text strong>{price.toLocaleString("vi-VN")}đ</Text>
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    render: (status: string) => {
      const colorMap: Record<OrderStatus, "default" | "success" | "processing" | "error" | "warning"> = {
        [OrderStatus.COMPLETED]: "success",
        [OrderStatus.PAYMENT_SUCCESS]: "success",
        [OrderStatus.CANCELLED]: "error",
        [OrderStatus.FAILED]: "error",
        [OrderStatus.PENDING]: "warning",
        [OrderStatus.REFUNDED]: "default",
      };

      const color = colorMap[status as OrderStatus] || "default";
      const text = OrderStatusLabels[status as OrderStatus] || status;
      return <Badge status={color} text={text} />;
    }
  },
  {
    title: "Ngày thanh toán",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (date: string) => formatDateTime(date)
  }
];

export const getColumnsTablePerformance = (): ColumnsType<any> => [
  {
    title: "Khóa học",
    key: "course",
    render: (_: any, record: any) => (
      <Space size="middle">
        <Avatar 
          shape="square" 
          size={44} 
          src={record.thumbnail}
          icon={<BookOutlined />}
          className="rounded-lg bg-gray-100"
        />
        <div>
          <Text strong className="block max-w-xs truncate">{record.name}</Text>
          <Text type="secondary" className="text-xs">{record.category?.name || "Khác"}</Text>
        </div>
      </Space>
    )
  },
  {
    title: "Học viên",
    dataIndex: "studentCount",
    key: "studentCount",
    sorter: (a: any, b: any) => (a.studentCount || 0) - (b.studentCount || 0),
    render: (val: number) => <Text strong>{(val || 0).toLocaleString("vi-VN")}</Text>
  },
  {
    title: "Lượt xem",
    dataIndex: "views",
    key: "views",
    sorter: (a: any, b: any) => (a.views || 0) - (b.views || 0),
    render: (val: number) => <Text type="secondary">{(val || 0).toLocaleString("vi-VN")}</Text>
  },
  {
    title: "Đánh giá",
    dataIndex: "avgRatingStars",
    key: "avgRatingStars",
    sorter: (a: any, b: any) => {
      const valA = typeof a.avgRatingStars === "object" ? (a.avgRatingStars?.parsedValue ?? 0) : (a.avgRatingStars || 0);
      const valB = typeof b.avgRatingStars === "object" ? (b.avgRatingStars?.parsedValue ?? 0) : (b.avgRatingStars || 0);
      return valA - valB;
    },
    render: (val: any) => {
      const rating = typeof val === "object" ? (val?.parsedValue ?? 0) : (val || 0);
      return (
        <Space size={4}>
          <StarOutlined className="text-yellow-500" />
          <Text strong>{rating ? rating.toFixed(1) : "0.0"}</Text>
        </Space>
      );
    }
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    render: (status: string) => {
      const colorMap: Record<CourseStatus, "success" | "warning" | "default" | "error" | "processing"> = {
        [CourseStatus.PUBLISHED]: "success",
        [CourseStatus.PENDING]: "warning",
        [CourseStatus.REJECTED]: "error",
        [CourseStatus.DRAFT]: "default",
        [CourseStatus.ARCHIVED]: "default",
      };
      
      const color = colorMap[status as CourseStatus] || "default";
      const text = CourseStatusLabels[status as CourseStatus] || status;
      return <Badge status={color} text={text} />;
    }
  }
];
