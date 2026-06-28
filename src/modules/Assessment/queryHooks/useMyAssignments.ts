import { useQuery } from "@tanstack/react-query";
import { learningApi } from "@/modules/Learning/services";
import type { AnyElement } from "@/type";

/**
 * Hook to fetch my assignments and statistics.
 */
export const useMyAssignments = () => {
  const { data, isLoading, error, refetch } = useQuery<AnyElement>({
    queryKey: ["my-assignments"],
    queryFn: () => learningApi.getMyAssignments(),
    staleTime: 2 * 60 * 1000, // 2 minutes stale time
  });

  const stats = data?.stats || {
    totalCount: 0,
    completedCount: 0,
    inProgressCount: 0,
    completionRate: 0,
  };
  const assignments = data?.assignments || [];
  const courses = data?.courses || [];

  return {
    stats,
    assignments,
    courses,
    isLoading,
    error,
    refetch,
  };
};

export default useMyAssignments;
