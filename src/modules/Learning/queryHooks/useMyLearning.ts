import { useQuery } from "@tanstack/react-query";
import { learningApi } from "../services";
import type { ICourse } from "@/type";

/**
 * Hook to fetch my enrolled courses.
 */
export const useMyLearning = () => {
  const { data, isLoading, error, refetch } = useQuery<ICourse[]>({
    queryKey: ["my-enrolled-courses"],
    queryFn: () => learningApi.getMyEnrolledCourses(),
    staleTime: 5 * 60 * 1000,
  });

  const enrolledCourses = data || [];

  return {
    enrolledCourses,
    isLoading,
    error,
    refetch,
  };
};

export default useMyLearning;
