import React, { useState, useRef, useEffect, useMemo } from "react";
import { Empty, Spin, Divider, Input } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useDiscussions } from "../../queryHooks";
import { useDiscussionSocket } from "../../hooks/useDiscussionSocket";
import DiscussionItem from "./DiscussionItem";
import type { AnyElement } from "@/type";
import { For, Show } from "@/components/UI/Template";

interface DiscussionListProps {
  lessonId: string;
  courseId: string;
}

const DiscussionList: React.FC<DiscussionListProps> = ({
  lessonId,
  courseId,
}) => {
  const {
    discussions,
    isLoading,
    createDiscussion,
    isCreating,
    totalElements,
    page,
  } = useDiscussions(lessonId, courseId);

  // Lắng nghe WebSocket thời gian thực đồng bộ dữ liệu Q&A
  useDiscussionSocket({ lessonId, page });

  const [newComment, setNewComment] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevMessagesCountRef = useRef(0);

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    createDiscussion({ content: newComment });
    setNewComment("");
  };

  const handleReply = (content: string, parentId: string) => {
    createDiscussion({ content, parentId });
  };

  // Sắp xếp thảo luận theo thời gian từ cũ nhất -> mới nhất
  const sortedDiscussions = useMemo(() => {
    return [...discussions].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateA - dateB;
    });
  }, [discussions]);

  // Chỉ quan tâm đến tin nhắn/thảo luận gốc (top-level discussions)
  const totalMessagesCount = sortedDiscussions.length;

  const scrollToBottom = (behavior: ScrollBehavior = "auto") => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior,
      });
    }
  };

  const [hasScrolledInitial, setHasScrolledInitial] = useState(false);

  // Reset trạng thái cuộn ban đầu khi bài học thay đổi
  useEffect(() => {
    setHasScrolledInitial(false);
  }, [lessonId]);

  useEffect(() => {
    // 1. Cuộn xuống dưới cùng lần đầu khi dữ liệu được tải xong
    if (totalMessagesCount > 0 && !hasScrolledInitial) {
      const timer = setTimeout(() => {
        scrollToBottom("auto");
        setHasScrolledInitial(true);
      }, 100);
      prevMessagesCountRef.current = totalMessagesCount;
      return () => clearTimeout(timer);
    }

    // 2. Chỉ cuộn mượt xuống dưới cùng khi tổng số lượng tin nhắn tăng lên (có tin nhắn hoặc phản hồi mới)
    if (hasScrolledInitial && totalMessagesCount > prevMessagesCountRef.current) {
      const timer = setTimeout(() => {
        scrollToBottom("smooth");
      }, 100);
      prevMessagesCountRef.current = totalMessagesCount;
      return () => clearTimeout(timer);
    }

    // Cập nhật lại số lượng tin nhắn trước đó khi có sự thay đổi khác (ví dụ: like/dislike, xóa tin nhắn) để tránh lệch số liệu
    prevMessagesCountRef.current = totalMessagesCount;
  }, [totalMessagesCount, hasScrolledInitial]);

  if (isLoading && discussions.length === 0) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
        <Spin size="large" />
        <span className="text-slate-500 font-medium">Đang tải thảo luận...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] lg:h-full overflow-hidden w-full max-w-4xl mx-auto bg-transparent">
      {/* Khung chat cuộn */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto custom-scrollbar px-5 py-4 space-y-4"
      >
        <Show>
          <Show.When isTrue={sortedDiscussions.length === 0}>
            <div className="h-full flex flex-col items-center justify-center py-20">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Chưa có thảo luận nào cho bài học này. Hãy là người đầu tiên đặt câu hỏi!"
              />
            </div>
          </Show.When>
          <Show.Else>
            <div>
              <Divider orientation={"left" as AnyElement} plain className="!my-0 !mb-6 text-slate-400">
                {totalElements} thảo luận
              </Divider>
              <div className="discussion-items space-y-4">
                <For
                  array={sortedDiscussions}
                  render={(item) => (
                    <DiscussionItem
                      key={item.id}
                      discussion={item}
                      onReply={handleReply}
                      isCreating={isCreating}
                    />
                  )}
                />
              </div>
            </div>
          </Show.Else>
        </Show>
      </div>

      {/* Thanh nhắn tin cố định phía dưới */}
      <div className="p-4 bg-white border-t border-slate-100/80 flex-shrink-0">
        <div className="flex items-end gap-2 rounded-2xl py-2 px-3 border border-slate-200 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 shadow-sm bg-white">
          <Input.TextArea
            placeholder="Hỏi đáp hoặc thảo luận... (Enter để gửi, Shift+Enter để xuống dòng)"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            autoSize={{ minRows: 1, maxRows: 5 }}
            disabled={isCreating}
            className="flex-1 border-0 focus:shadow-none resize-none !bg-transparent !p-0 text-sm leading-6 align-bottom"
            style={{ border: "none", outline: "none", boxShadow: "none" }}
          />
          <div className="flex items-center justify-center pb-1 flex-shrink-0">
            {isCreating ? (
              <Spin size="small" />
            ) : (
              <SendOutlined
                onClick={handleSubmit}
                className={`cursor-pointer transition-colors ${
                  newComment.trim() ? "text-primary hover:text-primary/80" : "text-slate-300"
                }`}
                style={{ fontSize: 16 }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussionList;
