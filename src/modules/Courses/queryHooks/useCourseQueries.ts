import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { courseApi } from "../services";
import { useAuthStore } from "@/store/useAuthStore";
import type { AnyElement, ICourse, IParamsRequest, IListResponse } from "@/type";

export const useCourses = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract params from URL
  const page = Number(searchParams.get("page")) || 1;
  const q = searchParams.get("q") || "";
  const topics = searchParams.getAll("topics");
  const levels = searchParams.getAll("levels");
  const authors = searchParams.getAll("authors");
  const prices = searchParams.getAll("prices");
  const rating = searchParams.get("rating") || "";
  const sort = searchParams.get("sort") || "newest";

  const queryParams: IParamsRequest = {
    page: page,
    size: 12,
    q: q,
    topics: topics,
    levels: levels,
    authors: authors,
    prices: prices,
    rating: rating,
    sort: sort,
  };

  const { data, isLoading, isPlaceholderData } = useQuery<IListResponse<ICourse>>({
    queryKey: ["courses", queryParams],
    queryFn: () => courseApi.getCourses(queryParams),
    placeholderData: (previousData) => previousData,
  });

  const courses = data?.content || [];
  const totalElements = data?.totalElements || 0;

  const handleFilterChange = (newFilters: Record<string, AnyElement>) => {
    const updatedParams = new URLSearchParams(searchParams);

    Object.entries(newFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        updatedParams.delete(key);
        value.forEach((v) => {
          if (v) updatedParams.append(key, v.toString());
        });
      } else if (value !== undefined && value !== null && value !== "") {
        updatedParams.set(key, value.toString());
      } else {
        updatedParams.delete(key);
      }
    });

    // Reset to page 1 on filter change
    updatedParams.set("page", "1");
    setSearchParams(updatedParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const handlePageChange = (newPage: number) => {
    const updatedParams = new URLSearchParams(searchParams);
    updatedParams.set("page", newPage.toString());
    setSearchParams(updatedParams);
  };

  return {
    courses,
    pagination: {
      totalRows: totalElements,
      limit: 12,
      page,
    },
    isLoading,
    isPlaceholderData,
    filters: { q, topics, levels, authors, prices, rating, sort, page },
    handleFilterChange,
    handlePageChange,
    clearFilters,
    meta: data?.meta,
  };
};

export const useCourseDetail = (courseId: string) => {
  const { user } = useAuthStore();

  const detailQuery = useQuery<ICourse>({
    queryKey: ["course-detail", courseId, user?.id],
    queryFn: () => courseApi.getCourseDetail(courseId),
    enabled: !!courseId,
  });

  return {
    course: detailQuery.data,
    sections: detailQuery.data?.sections || [],
    isLoading: detailQuery.isLoading,
    isError: detailQuery.isError,
  };
};

export const useRelatedCourses = (courseId: string, limit = 4) => {
  return useQuery<ICourse[]>({
    queryKey: ["related-courses", courseId, limit],
    queryFn: () => courseApi.getRelatedCourses(courseId, limit),
    enabled: !!courseId,
  });
};

export const useAllCategories = () => {
  return useQuery({
    queryKey: ["all-categories"],
    queryFn: () => courseApi.getAllCategories(),
  });
};

export const useAllInstructors = () => {
  return useQuery({
    queryKey: ["all-instructors"],
    queryFn: () => courseApi.getInstructorsSelect(),
  });
};

export const useLessons = (sectionId: string) => {
  return useQuery({
    queryKey: ["lessons", sectionId],
    queryFn: () => courseApi.getLessonsBySectionId(sectionId),
    enabled: !!sectionId,
  });
};
