import { CourseStatus, FeedbackStatus, LessonType, OrderStatus, PaymentStatus } from "@/constants/enums";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyElement = any;

export interface IBase {
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
}

export interface IListResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  stats?: {
    totalCount: number;
    avgRating: number;
  };
  meta?: Record<string, any>;
}

export interface IParamsRequest {
  page: number;
  size: number;
  q?: string;
  [key: string]: AnyElement;
}

export const ModelStatus = {
  ACTIVE: 1,
  INACTIVE: 0,
} as const;

export interface IOption {
  label: string;
  value: string;
}

export interface IUserInfo extends IBase {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  address?: string;
  headline?: string;
  biography?: string;
  language?: string;
  socials?: Record<string, string>;
  role?: string;
  status?: string;
  showProfile?: boolean;
  showCourses?: boolean;
  lastLogin?: string;
}

export interface ISection extends IBase {
  id: string;
  name: string;
  courseId: string;
  description: string;
  numOfLessons?: number;
  totalVideosLength?: number;
  lessons?: ILesson[];
}

export interface ILesson extends IBase {
  id: string;
  name: string;
  sectionId: string;
  type: LessonType;
  content: string;
  description: string;
  videoLength: number;
  transcriptUrl?: string;
  urlTranscript?: string;
  position?: number;
  isDone?: boolean;
  courseId: string;
}

export interface IDiscussion extends IBase {
  id: string;
  content: string;
  userId: string;
  user?: {
    firstName: string;
    lastName: string;
    avatar?: string;
    role?: string;
  };
  courseId: string;
  sectionId?: string;
  lessonId: string;
  parentId?: string;
  rootId?: string;
  replies?: IDiscussion[];
  replyCount: number;
  likedUserIds?: string[];
  dislikedUserIds?: string[];
}


export interface IWishlist extends IBase {
  id: string;
  userId: string;
  courseId: string;
  courseName: string;
  courseThumbnail: string;
  coursePrice: number;
}

export const CourseLevel = {
  ALL: "ALL",
  BEGINNER: "BEGINNER",
  INTERMEDIATE: "INTERMEDIATE",
  ADVANCED: "ADVANCED",
  EXPERT: "EXPERT",
} as const;

export type CourseLevelType = (typeof CourseLevel)[keyof typeof CourseLevel];

export interface ICourse extends IBase {
  id: string;
  name: string;
  subTitle: string;
  views?: number;
  description: string;
  price?: number;
  finalPrice?: number;
  level: CourseLevelType;
  thumbnail: string;
  coursePreview?: string;
  courseSlug: string;

  avgRatingStars?: number;
  studentCount?: number;
  numOfReviews?: number;
  lessonCount?: number;
  sectionCount?: number;
  totalVideosLength?: number;

  category: {
    id: string;
    name: string;
  };
  instructorId: string;
  instructor?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string;
    biography: string;
    headline?: string;
  };

  status?: CourseStatus;
  sections?: ISection[];
  lessons?: ILesson[];
  finishedLessonIds?: string[];
  totalVideosLengthDone?: number;
  willLearns?: string[];
  requirements?: string[];
  tags?: string[];
  isBought?: boolean;
  isFavorite?: boolean;
  progress?: number;
  isCompleted?: boolean;
  completedAt?: string | null;
  lastAccessedLessonId?: string;
}

export interface ICategory extends IBase {
  id: string;
  name: string;
  description: string;
  cateImage: string;
  icon?: string;
  cateSlug: string;
  parentId?: string;
  courses?: number;
}

export interface IOrderItem {
  courseId: string;
  courseName: string;
  thumbnail?: string;
  price: number;
}

export interface IOrder extends IBase {
  id: string;
  userId: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
  totalPrice: number;
  vatFee: number;
  note?: string;
  status: OrderStatus;
  items: IOrderItem[];
}

export interface IPayment extends IBase {
  id: string;
  orderId: string;
  transactionId: string;
  method: string;
  amount: number;
  bankCode: string;
  bankTranNo: string;
  cardType: string;
  orderInfo: string;
  vnpTxnRef: string;
  status: PaymentStatus;
  payDate: string;
}

export interface IFeedbackReply extends IBase {
  id: string;
  feedbackId: string;
  content: string;
}

export interface IFeedback extends IBase {
  id: string;
  name?: string;
  email?: string;
  type: string;
  title: string;
  content: string;
  status: FeedbackStatus;
  replies?: IFeedbackReply[];
}

export interface IReviewReply extends IBase {
  id: string;
  reviewId: string;
  userId: string;
  user?: {
    firstName: string;
    lastName: string;
    avatar?: string;
    role?: string;
  };
  content: string;
  code: string;
}

export interface IReview extends IBase {
  id: string;
  code: string;
  courseId: string;
  course?: {
    name: string;
    thumbnail?: string;
  };
  userId: string;
  user?: {
    firstName: string;
    lastName: string;
    avatar?: string;
    role?: string;
  };
  title?: string;
  content: string;
  ratingStar: number;
  replies?: IReviewReply[];
}
