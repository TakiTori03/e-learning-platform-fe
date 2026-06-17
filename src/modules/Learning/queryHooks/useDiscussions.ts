import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { learningApi } from "../services";
import type { IDiscussion, IListResponse } from "@/type";

/**
 * Hook to manage Q&A comments/discussions.
 */
export const useDiscussions = (lessonId: string, courseId: string) => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);

  const { data, isLoading } = useQuery<IListResponse<IDiscussion>>({
    queryKey: ["discussions", lessonId, page],
    queryFn: () => learningApi.getDiscussions(lessonId),
    enabled: !!lessonId,
  });

  const createMutation = useMutation<
    IDiscussion,
    Error,
    { content: string; parentId?: string; sectionId?: string }
  >({
    mutationFn: (variables) =>
      learningApi.createDiscussion({
        ...variables,
        lessonId,
        courseId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discussions", lessonId] });
    },
  });

  return {
    discussions: data?.content || [],
    totalElements: data?.totalElements || 0,
    isLoading,
    createDiscussion: createMutation.mutate,
    isCreating: createMutation.isPending,
    page,
    setPage,
  };
};

export default useDiscussions;
