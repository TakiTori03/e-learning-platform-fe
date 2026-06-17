import type { IUserInfo } from "@/type";

export interface IBlogPostAuthor {
  firstName: string;
  lastName: string;
  avatar?: string;
  role: string;
}

export interface IBlogPost {
  id: string;
  authorId: string;
  title: string;
  summary: string;
  content: string;
  thumbnailUrl?: string;
  tags: string[];
  status: "DRAFT" | "PUBLISHED" | "BLOCKED";
  viewsCount: number;
  likedUserIds: string[];
  createdAt: string;
  updatedAt: string;
  author?: IBlogPostAuthor;
  isPinned?: boolean;
  reportedUserIds?: string[];
}

export interface IBlogComment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  parentId?: string;
  repliesCount: number;
  createdAt: string;
  updatedAt: string;
  user?: IBlogPostAuthor;
}
