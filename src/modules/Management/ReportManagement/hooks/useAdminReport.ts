import { useQuery } from "@tanstack/react-query";
import { adminReportApi } from "../api/adminReportApi";

// Cache times configurations
const STALE_TIME = 5 * 60 * 1000; // 5 minutes

export const useSummaryReport = () => {
  return useQuery({
    queryKey: ["admin", "reports", "summary"],
    queryFn: () => adminReportApi.getSummary(),
    staleTime: STALE_TIME,
  });
};

export const useNewSignupsReport = (params: { startDate?: string; endDate?: string; groupBy?: "day" | "month" | "year" }) => {
  return useQuery({
    queryKey: ["admin", "reports", "new-signups", params.groupBy, params.startDate, params.endDate],
    queryFn: () => adminReportApi.getNewSignups(params),
    staleTime: STALE_TIME,
  });
};

export const useRevenuesReport = (params: { startDate?: string; endDate?: string; groupBy?: "day" | "month" | "year" }) => {
  return useQuery({
    queryKey: ["admin", "reports", "revenues", params.groupBy, params.startDate, params.endDate],
    queryFn: () => adminReportApi.getRevenues(params),
    staleTime: STALE_TIME,
  });
};

export const useCourseSalesReport = () => {
  return useQuery({
    queryKey: ["admin", "reports", "course-sales"],
    queryFn: () => adminReportApi.getCourseSales(),
    staleTime: STALE_TIME,
  });
};

export const useTopUsersReport = (limit: number = 5) => {
  return useQuery({
    queryKey: ["admin", "reports", "top-users", limit],
    queryFn: () => adminReportApi.getTopUsers({ limit }),
    staleTime: STALE_TIME,
  });
};

export const useTopOrdersReport = (limit: number = 5) => {
  return useQuery({
    queryKey: ["admin", "reports", "top-orders", limit],
    queryFn: () => adminReportApi.getTopOrders({ limit }),
    staleTime: STALE_TIME,
  });
};

export const useAdminCourses = (page: number = 0, size: number = 10, q?: string) => {
  return useQuery({
    queryKey: ["admin", "courses-list", page, size, q],
    queryFn: () => adminReportApi.getAllCourses({ page, size, q }),
    staleTime: STALE_TIME,
  });
};

export const useAuthorReport = (authorId?: string) => {
  return useQuery({
    queryKey: ["admin", "reports", "author-report", authorId],
    queryFn: () => adminReportApi.getCoursesReportByAuthor(authorId),
    staleTime: STALE_TIME,
  });
};

export const useUsersProgressReport = () => {
  return useQuery({
    queryKey: ["admin", "reports", "users-progress"],
    queryFn: () => adminReportApi.getUsersProgress(),
    staleTime: STALE_TIME,
  });
};
