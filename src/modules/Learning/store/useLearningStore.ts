import type { AnyElement, ICourse, ILesson } from "@/type";
import { create } from "zustand";

interface LearningState {
  course: ICourse | null;
  lessons: ILesson[];
  lessonsDoneIds: string[];
  currentLesson: ILesson | null;
  currentLessonIndex: number;

  // Hành động khởi tạo
  setCourse: (course: ICourse) => void;
  setLessons: (lessons: ILesson[]) => void;
  setLessonsDoneIds: (ids: string[]) => void;
  setCurrentLesson: (lesson: ILesson) => void;

  // Hành động điều hướng
  nextLesson: () => void;
  prevLesson: () => void;

  // Hành động dọn dẹp
  reset: () => void;

  // Điều khiển Video Player (Tính năng Notes)
  playerRef: AnyElement;
  setPlayerRef: (ref: AnyElement) => void;
  seekTo: (seconds: number) => void;
}

const initialState = {
  course: null,
  lessons: [],
  lessonsDoneIds: [],
  currentLesson: null,
  currentLessonIndex: 0,
  playerRef: null,
};

export const useLearningStore = create<LearningState>((set, get) => ({
  ...initialState,

  setCourse: (course) => set({ course }),

  setLessons: (lessons) => set({ lessons }),

  setLessonsDoneIds: (lessonsDoneIds) => set({ lessonsDoneIds }),

  setCurrentLesson: (lesson) => {
    const { lessons } = get();
    const index = lessons.findIndex((l) => l.id === lesson.id);
    set({
      currentLesson: lesson,
      currentLessonIndex: index !== -1 ? index : 0,
    });
  },

  nextLesson: () => {
    const { lessons, currentLessonIndex } = get();
    if (currentLessonIndex < lessons.length - 1) {
      const nextIndex = currentLessonIndex + 1;
      set({
        currentLesson: lessons[nextIndex],
        currentLessonIndex: nextIndex,
      });
    }
  },

  prevLesson: () => {
    const { lessons, currentLessonIndex } = get();
    if (currentLessonIndex > 0) {
      const prevIndex = currentLessonIndex - 1;
      set({
        currentLesson: lessons[prevIndex],
        currentLessonIndex: prevIndex,
      });
    }
  },

  reset: () => set({ ...initialState }),

  setPlayerRef: (ref) => {
    if (get().playerRef === ref) return; // 🛑 FIREWALL: Prevents redundant store updates
    set({ playerRef: ref });
  },

  seekTo: (seconds) => {
    const player = get().playerRef;
    if (player) {
      player.seekTo(seconds, "seconds");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  },
}));
