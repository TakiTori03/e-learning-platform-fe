import { useQuery, useMutation } from "@tanstack/react-query";
import { homeApi } from "../api/homeApi";
import { learningApi } from "@/modules/Learning/services";
import { useAuthStore } from "@/store/useAuthStore";
import { notification } from "antd";

export const useHome = () => {
  const isAuth = useAuthStore((state) => state.isAuth);

  const categoriesQuery = useQuery({
    queryKey: ["home", "categories"],
    queryFn: () => homeApi.getCategories(),
  });

  const popularCoursesQuery = useQuery({
    queryKey: ["home", "popular-courses"],
    queryFn: () => homeApi.getPopularCourses(),
  });

  const myCoursesQuery = useQuery({
    queryKey: ["home", "my-courses"],
    queryFn: () => learningApi.getMyEnrolledCourses(),
    enabled: isAuth,
  });

  const blogsQuery = useQuery({
    queryKey: ["home", "blogs"],
    queryFn: () => homeApi.getBlogs({ size: 8, isPinned: true, status: "PUBLISHED" }),
  });

  const subscribeMutation = useMutation({
    mutationFn: (email: string) => homeApi.createSubscription(email),
    onSuccess: () => {
      notification.success({
        message: "Đăng ký thành công",
        description: "Bạn đã đăng ký nhận bản tin thành công.",
      });
    },
    onError: (err: any) => {
      notification.error({
        message: "Đăng ký thất bại",
        description: err?.message || "Có lỗi xảy ra khi đăng ký nhận tin.",
      });
    },
  });

  return {
    categories: categoriesQuery.data?.content || [],
    popularCourses: popularCoursesQuery.data?.content || [],
    myCourses: myCoursesQuery.data || [],
    blogs: blogsQuery.data?.content || [],
    isLoading:
      categoriesQuery.isLoading ||
      popularCoursesQuery.isLoading ||
      (isAuth && myCoursesQuery.isLoading) ||
      blogsQuery.isLoading,
    isError:
      categoriesQuery.isError ||
      popularCoursesQuery.isError ||
      myCoursesQuery.isError ||
      blogsQuery.isError,
    subscribe: subscribeMutation.mutate,
    isSubscribing: subscribeMutation.isPending,
  };
};
