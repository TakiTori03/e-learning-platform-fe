import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { learningApi } from "../services";
import { notification } from "antd";
import type { INoteItem } from "../components/note/NoteItem";

export const useNotes = (courseId: string) => {
  const queryClient = useQueryClient();

  // Fetch notes
  const notesQuery = useQuery<INoteItem[]>({
    queryKey: ["learning-notes", courseId],
    queryFn: () => learningApi.getNotes(courseId) as Promise<INoteItem[]>,
    enabled: !!courseId,
  });

  // Create note
  const createNoteMutation = useMutation<
    unknown,
    Error,
    { courseId: string; lessonId: string; content: string; videoTime: number }
  >({
    mutationFn: learningApi.createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["learning-notes", courseId] });
      notification.success({ message: "Đã lưu ghi chú" });
    },
  });

  // Delete note
  const deleteNoteMutation = useMutation<unknown, Error, string>({
    mutationFn: learningApi.deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["learning-notes", courseId] });
      notification.success({ message: "Đã xóa ghi chú" });
    },
  });

  return {
    notes: notesQuery.data || [],
    isLoading: notesQuery.isLoading,
    isCreating: createNoteMutation.isPending,
    isDeleting: deleteNoteMutation.isPending,
    createNote: createNoteMutation.mutate,
    deleteNote: deleteNoteMutation.mutate,
  };
};
