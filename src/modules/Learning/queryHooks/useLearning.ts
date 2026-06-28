import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useEffect, useCallback, useMemo } from "react";
import { learningApi } from "../services";
import { courseApi } from "@/modules/Courses/services";
import { useLearningStore } from "../store/useLearningStore";
import type { AnyElement, ICourse, ILesson } from "@/type";

/**
 * Main hook coordinating current course, lessons, and routing/completed-status tracking.
 */
export const useLearning = (courseId: string, urlLessonId?: string) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const course = useLearningStore((state) => state.course);
  const currentLesson = useLearningStore((state) => state.currentLesson);
  const setCurrentLesson = useLearningStore((state) => state.setCurrentLesson);
  const setCourse = useLearningStore((state) => state.setCourse);
  const setLessons = useLearningStore((state) => state.setLessons);
  const setLessonsDoneIds = useLearningStore((state) => state.setLessonsDoneIds);
  const lessonsDoneIds = useLearningStore((state) => state.lessonsDoneIds);
  const lessons = useLearningStore((state) => state.lessons);
  const currentLessonIndex = useLearningStore((state) => state.currentLessonIndex);
  const reset = useLearningStore((state) => state.reset);

  const courseQuery = useQuery<ICourse>({
    queryKey: ["enrolled-course", courseId],
    queryFn: () => learningApi.getEnrolledCourseDetail(courseId),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
  });

  const lessonsQuery = useQuery<ILesson[]>({
    queryKey: ["lessons-all", courseId],
    queryFn: () => courseApi.getAllLessonsByCourseId(courseId),
    enabled: !!courseId,
    staleTime: 10 * 60 * 1000,
  });

  const courseDetailQuery = useQuery<ICourse>({
    queryKey: ["course-detail", courseId],
    queryFn: () => courseApi.getCourseDetail(courseId),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
  });

  const isInitializing = useMemo(() => {
    return !courseQuery.data || !lessonsQuery.data || !courseDetailQuery.data;
  }, [courseQuery.data, lessonsQuery.data, courseDetailQuery.data]);

  // Sắp xếp danh sách bài học phẳng theo đúng thứ tự phân bổ trong Sections
  const orderedLessons = useMemo(() => {
    const flatLessons = lessonsQuery.data || [];
    const detailData = courseDetailQuery.data;
    if (!detailData || !detailData.sections || detailData.sections.length === 0) {
      return flatLessons;
    }

    let list: ILesson[] = [];
    detailData.sections.forEach((sec) => {
      if (sec.lessons && sec.lessons.length > 0) {
        list.push(...sec.lessons);
      } else {
        const secLessons = flatLessons.filter((l) => l.sectionId === sec.id);
        list.push(...secLessons);
      }
    });

    if (list.length === 0) return flatLessons;

    const seen = new Set();
    return list.filter((l) => {
      if (!l || !l.id) return false;
      if (seen.has(l.id)) return false;
      seen.add(l.id);
      return true;
    });
  }, [lessonsQuery.data, courseDetailQuery.data]);

  // Sync static data with store
  useEffect(() => {
    if (courseQuery.data && courseDetailQuery.data && orderedLessons.length > 0) {
      const progressData = courseQuery.data;
      const detailData = courseDetailQuery.data;
      
      // Chỉ giữ lại những ID bài học đã hoàn thành thuộc về khóa học hiện tại và loại bỏ trùng lặp
      const finishedLessonIds = Array.from(new Set(
        (progressData.finishedLessonIds || []).filter((id) =>
          orderedLessons.some((l) => l.id === id)
        )
      ));

      const mergedCourse: ICourse = {
        ...detailData,
        progress: progressData.progress || 0,
        finishedLessonIds: finishedLessonIds,
        lastAccessedLessonId: progressData.lastAccessedLessonId,
        lessons: orderedLessons,
        sections: detailData.sections || [],
        totalVideosLengthDone: 0,
        isBought: detailData.isBought ?? true,
      };

      setCourse(mergedCourse);
      setLessons(orderedLessons);
      setLessonsDoneIds(finishedLessonIds);
    }
  }, [
    courseQuery.data,
    orderedLessons,
    courseDetailQuery.data,
    setCourse,
    setLessons,
    setLessonsDoneIds,
  ]);

  // Handle URL lesson routing
  useEffect(() => {
    if (orderedLessons.length === 0 || isInitializing) return;

    if (urlLessonId) {
      const targetLesson = orderedLessons.find((l) => l.id === urlLessonId);
      if (targetLesson) {
        setCurrentLesson(targetLesson);
      }
      return;
    }

    const progressData = courseQuery.data;
    const finishedLessonIds = (progressData?.finishedLessonIds || []).filter((id) =>
      orderedLessons.some((l) => l.id === id)
    );
    const backendLastAccessedId = progressData?.lastAccessedLessonId;

    const savedLastLessonId = localStorage.getItem(`last_lesson_${courseId}`);
    const backendSavedLesson = orderedLessons.find((l) => l.id === backendLastAccessedId);
    const savedLesson = orderedLessons.find((l) => l.id === savedLastLessonId);

    let targetId = orderedLessons[0].id;

    if (backendSavedLesson) {
      targetId = backendSavedLesson.id;
    } else if (savedLesson) {
      targetId = savedLesson.id;
    } else {
      const firstIncomplete = orderedLessons.find((l) => !finishedLessonIds.includes(l.id));
      if (firstIncomplete) {
        targetId = firstIncomplete.id;
      }
    }

    navigate(`/learning/${courseId}/${targetId}`, { replace: true });
  }, [
    urlLessonId,
    orderedLessons,
    courseQuery.data,
    isInitializing,
    courseId,
    navigate,
    setCurrentLesson,
  ]);

  const { mutate: updateProgress, isPending: isUpdatingProgress } = useMutation<AnyElement, Error, string>({
    mutationFn: (lessonId: string) =>
      learningApi.trackProgress({
        courseId,
        lessonId,
        isDone: true,
      }),
    onSuccess: (_, lessonId) => {
      queryClient.invalidateQueries({
        queryKey: ["enrolled-course", courseId],
      });
      if (!lessonsDoneIds.includes(lessonId)) {
        setLessonsDoneIds([...lessonsDoneIds, lessonId]);
      }
    },
  });

  const { mutate: trackAccess } = useMutation<AnyElement, Error, string>({
    mutationFn: (lessonId: string) => learningApi.trackAccess(courseId, lessonId),
    onSuccess: () => {
      // Làm mới cache tiến trình khóa học hiện tại
      queryClient.invalidateQueries({
        queryKey: ["enrolled-course", courseId],
      });
      // Làm mới danh sách khóa học để nút "Học tiếp" ở trang ngoài nhận bài học mới nhất tức thì
      queryClient.invalidateQueries({
        queryKey: ["enrolled-courses"],
      });
    },
  });

  const handleLessonSelect = useCallback(
    (lesson: ILesson) => {
      navigate(`/learning/${courseId}/${lesson.id}${window.location.search}`);
    },
    [navigate, courseId]
  );

  const handleLessonComplete = useCallback(
    (lessonId: string) => {
      const currentDoneIds = useLearningStore.getState().lessonsDoneIds;
      if (!currentDoneIds.includes(lessonId)) {
        updateProgress(lessonId);
      }
    },
    [updateProgress]
  );

  const goToNextLesson = useCallback(() => {
    if (currentLessonIndex < lessons.length - 1) {
      const nextLesson = lessons[currentLessonIndex + 1];
      navigate(`/learning/${courseId}/${nextLesson.id}${window.location.search}`);
    }
  }, [currentLessonIndex, lessons, courseId, navigate]);

  const goToPrevLesson = useCallback(() => {
    if (currentLessonIndex > 0) {
      const prevLesson = lessons[currentLessonIndex - 1];
      navigate(`/learning/${courseId}/${prevLesson.id}${window.location.search}`);
    }
  }, [currentLessonIndex, lessons, courseId, navigate]);

  // Auto position tracker sync
  useEffect(() => {
    if (currentLesson?.id && courseId) {
      localStorage.setItem(`last_lesson_${courseId}`, currentLesson.id);
      trackAccess(currentLesson.id);
    }
  }, [currentLesson?.id, courseId, trackAccess]);

  useEffect(() => {
    return () => reset();
  }, [reset]);

  const progressPercent = useMemo(() => {
    if (lessons.length === 0) return 0;
    return (lessonsDoneIds.length / lessons.length) * 100;
  }, [lessons.length, lessonsDoneIds.length]);

  return {
    course,
    lessons,
    currentLesson,
    currentLessonIndex,
    lessonsDoneIds,

    isLoading: courseQuery.isLoading || lessonsQuery.isLoading || isInitializing,
    isUpdatingProgress,

    handleLessonSelect,
    handleLessonComplete,
    goToNextLesson,
    goToPrevLesson,
    hasPathNext: currentLessonIndex < lessons.length - 1,
    hasPathPrev: currentLessonIndex > 0,

    progressPercent,
    doneCount: lessonsDoneIds.length,
    totalCount: lessons.length,
  };
};

export default useLearning;
