import { API_PREFIX } from "@/constants/api";
import { axiosClient } from "@/core/http";
import type { IListResponse } from "@/type";
import type { IBlogComment, IBlogPost } from "../types";

// Mutation endpoints (POST, PUT, DELETE) call interaction-service directly
const INTERACTION_BLOG_PREFIX = `${API_PREFIX.INTERACTION}/blogs`;

export const blogApi = {
  // GET requests (Aggregator Service)
  getBlogs: (params: { page?: number; size?: number; q?: string; authorId?: string; status?: string; sort?: string }): Promise<IListResponse<IBlogPost>> =>
    axiosClient.get<IListResponse<IBlogPost>>(INTERACTION_BLOG_PREFIX, params),

  getBlogDetail: (id: string): Promise<IBlogPost> =>
    axiosClient.get<IBlogPost>(`${INTERACTION_BLOG_PREFIX}/${id}`),

  getComments: (postId: string, params?: { page?: number; size?: number; parentId?: string }): Promise<IListResponse<IBlogComment>> =>
    axiosClient.get<IListResponse<IBlogComment>>(`${INTERACTION_BLOG_PREFIX}/${postId}/comments`, params),

  // POST / PUT / DELETE requests (Interaction Service directly)
  createBlogPost: (data: { title: string; summary: string; content: string; thumbnailUrl?: string; tags?: string[] }): Promise<IBlogPost> =>
    axiosClient.post<IBlogPost>(INTERACTION_BLOG_PREFIX, data),

  updateBlogPost: (id: string, data: { title: string; summary: string; content: string; thumbnailUrl?: string; tags?: string[] }): Promise<IBlogPost> =>
    axiosClient.put<IBlogPost>(`${INTERACTION_BLOG_PREFIX}/${id}`, data),

  publishBlogPost: (id: string): Promise<IBlogPost> =>
    axiosClient.post<IBlogPost>(`${INTERACTION_BLOG_PREFIX}/${id}/publish`),

  deleteBlogPost: (id: string): Promise<void> =>
    axiosClient.delete<void>(`${INTERACTION_BLOG_PREFIX}/${id}`),

  toggleLikeBlogPost: (id: string): Promise<void> =>
    axiosClient.post<void>(`${INTERACTION_BLOG_PREFIX}/${id}/like`),

  createComment: (postId: string, data: { content: string; parentId?: string }): Promise<IBlogComment> =>
    axiosClient.post<IBlogComment>(`${INTERACTION_BLOG_PREFIX}/${postId}/comments`, data),

  deleteComment: (commentId: string): Promise<void> =>
    axiosClient.delete<void>(`${INTERACTION_BLOG_PREFIX}/comments/${commentId}`),

  reportBlogPost: (id: string): Promise<void> =>
    axiosClient.post<void>(`${INTERACTION_BLOG_PREFIX}/${id}/report`),

  togglePinBlogPost: (id: string): Promise<IBlogPost> =>
    axiosClient.put<IBlogPost>(`${INTERACTION_BLOG_PREFIX}/${id}/pin`),

  updateBlogStatusAdmin: (id: string, status: string): Promise<IBlogPost> =>
    axiosClient.put<IBlogPost>(`${INTERACTION_BLOG_PREFIX}/${id}/status`, {}, { params: { status } }),
};

export default blogApi;
