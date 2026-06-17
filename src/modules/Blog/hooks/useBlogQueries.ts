import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { blogApi } from "../services/blogApi";
import { courseApi } from "@/modules/Courses/services";

const STALE_TIME = 5 * 60 * 1000; // 5 minutes

export const useBlogList = (params: { page?: number; size?: number; q?: string; authorId?: string; status?: string; sort?: string }) => {
  return useQuery({
    queryKey: ["blogs", "list", params],
    queryFn: () => blogApi.getBlogs(params),
    staleTime: STALE_TIME,
  });
};

export const useBlogDetail = (id: string, options?: { staleTime?: number }) => {
  return useQuery({
    queryKey: ["blogs", "detail", id],
    queryFn: () => blogApi.getBlogDetail(id),
    staleTime: options?.staleTime !== undefined ? options.staleTime : STALE_TIME,
    enabled: !!id,
  });
};

export const useLikeBlogMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => blogApi.toggleLikeBlogPost(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["blogs", "detail", id] });
      queryClient.invalidateQueries({ queryKey: ["blogs", "list"] });
    },
  });
};

export const useCommentsList = (postId: string, params?: { page?: number; size?: number; parentId?: string }) => {
  return useQuery({
    queryKey: ["blogs", "comments", postId, params],
    queryFn: () => blogApi.getComments(postId, params),
    staleTime: 30 * 1000, // 30 seconds
    enabled: !!postId,
  });
};

export const useCreateCommentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, data }: { postId: string; data: { content: string; parentId?: string } }) =>
      blogApi.createComment(postId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["blogs", "comments", variables.postId] });
    },
  });
};

export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId }: { commentId: string; postId: string }) =>
      blogApi.deleteComment(commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["blogs", "comments", variables.postId] });
    },
  });
};

export const useCreateBlogMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { title: string; summary: string; content: string; thumbnailUrl?: string; tags?: string[] }) =>
      blogApi.createBlogPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs", "list"] });
    },
  });
};

export const useUpdateBlogMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { title: string; summary: string; content: string; thumbnailUrl?: string; tags?: string[] } }) =>
      blogApi.updateBlogPost(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["blogs", "detail", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["blogs", "list"] });
    },
  });
};

export const usePublishBlogMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => blogApi.publishBlogPost(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["blogs", "detail", id] });
      queryClient.invalidateQueries({ queryKey: ["blogs", "list"] });
    },
  });
};

export const useDeleteBlogMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => blogApi.deleteBlogPost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs", "list"] });
    },
  });
};

export const useReportBlogMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => blogApi.reportBlogPost(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["blogs", "detail", id] });
      queryClient.invalidateQueries({ queryKey: ["blogs", "list"] });
    },
  });
};

export const usePinBlogMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => blogApi.togglePinBlogPost(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["blogs", "detail", id] });
      queryClient.invalidateQueries({ queryKey: ["blogs", "list"] });
    },
  });
};

export const useUpdateBlogStatusAdminMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      blogApi.updateBlogStatusAdmin(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["blogs", "detail", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["blogs", "list"] });
    },
  });
};

export const useBlogRelatedCourses = (postId: string) => {
  return useQuery({
    queryKey: ["blogs", "detail", postId, "courses"],
    queryFn: () => courseApi.getCourses({ page: 0, size: 3 }).then((res) => res?.content || []),
    staleTime: 5 * 60 * 1000,
  });
};
