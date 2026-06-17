import { axiosClient } from "@/core/http";
import { API_PREFIX } from "@/constants/api";
import type { IUserInfo, IListResponse } from "@/type";

const BFF_PREFIX = `${API_PREFIX.AGGREGATOR}/reports`;
const COURSE_PREFIX = API_PREFIX.COURSE;

export interface ISignupDataPoint {
  period: string;
  count: number;
}

export interface ISignupReportResponse {
  totalSignups: number;
  dataPoints: ISignupDataPoint[];
}

export interface IRevenueDataPoint {
  period: string;
  revenue: number;
}

export interface IRevenueReportResponse {
  totalRevenue: number;
  currency: string;
  dataPoints: IRevenueDataPoint[];
}

export interface ICourseInsightData {
  learners?: number;
  views?: number;
  totalVideosLength?: number;
  lessons?: number;
  numberOfWishlist?: number;
  numberOfRatings?: number;
  avgRatings?: number;
  totalCourses?: number;
  totalActiveCourses?: number;
  totalDraftCourses?: number;
  averageRating?: number;
  totalReviews?: number;
}

export interface ISummaryReportResponse {
  revenueData: IRevenueReportResponse | null;
  signupData: ISignupReportResponse | null;
  courseData: ICourseInsightData | null;
}

export interface ICourseSalesReport {
  courseId: string;
  courseName: string;
  totalSales: number;
  totalRevenue: number;
}

export interface ICourseProgressReportResponse {
  courseId: string;
  courseCode?: string;
  courseName?: string;
  averageProgress: number;
  totalEnrollments: number;
  completedEnrollments: number;
}

export interface IOrderResponse {
  id: string;
  userId: string;
  totalPrice: number;
  vatFee: number;
  note: string;
  status: string;
  createdAt: string;
  items: any[];
}

export const adminReportApi = {
  // Aggregator BFF Reports Endpoints
  getSummary: () =>
    axiosClient.get<ISummaryReportResponse>(`${BFF_PREFIX}/summary`),

  getNewSignups: (params: { startDate?: string; endDate?: string; groupBy?: "day" | "month" | "year" }) =>
    axiosClient.get<ISignupReportResponse>(`${BFF_PREFIX}/new-signups`, params),

  getRevenues: (params: { startDate?: string; endDate?: string; groupBy?: "day" | "month" | "year" }) =>
    axiosClient.get<IRevenueReportResponse>(`${BFF_PREFIX}/revenues`, params),

  getCourseSales: () =>
    axiosClient.get<ICourseSalesReport[]>(`${BFF_PREFIX}/course-sales`),

  getTopUsers: (params: { limit?: number } = {}) =>
    axiosClient.get<IUserInfo[]>(`${BFF_PREFIX}/get-top-users`, params),

  getTopOrders: (params: { limit?: number } = {}) =>
    axiosClient.get<IOrderResponse[]>(`${BFF_PREFIX}/get-top-orders`, params),

  getUsersProgress: () =>
    axiosClient.get<ICourseProgressReportResponse[]>(`${BFF_PREFIX}/users-progress`),

  // Course List (for course counts or admin list views)
  getAllCourses: (params: { page?: number; size?: number; q?: string } = { page: 0, size: 10 }) =>
    axiosClient.get<IListResponse<any>>(`${COURSE_PREFIX}/admin/courses`, params),

  // Instructor report
  getCoursesReportByAuthor: (authorId?: string) =>
    axiosClient.get<any>(`${BFF_PREFIX}/courses-report-by-author`, { authorId }),
};
