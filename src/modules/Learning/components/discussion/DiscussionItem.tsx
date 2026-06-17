import CButton from "@/components/UI/Button";
import { For, Show } from "@/components/UI/Template";
import { useAuthStore } from "@/store/useAuthStore";
import type { IDiscussion } from "@/type";
import { formatFullName } from "@/utils/format";
import {
  CaretDownOutlined,
  CaretUpOutlined,
  MessageOutlined,
  SendOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Avatar, Input, Spin, Typography } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import React, { useState } from "react";
import { learningApi } from "../../services";

dayjs.extend(utc);
dayjs.extend(relativeTime);

const { Text, Paragraph } = Typography;

interface DiscussionItemProps {
  discussion: IDiscussion;
  onReply: (content: string, parentId: string) => void;
  isCreating?: boolean;
  depth?: number;
}

const DiscussionItem: React.FC<DiscussionItemProps> = ({
  discussion,
  onReply,
  isCreating,
  depth = 0,
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  // Kiểm tra trạng thái đã upvote/downvote
  const isUpvoted = discussion.likedUserIds?.includes(user?.id || "") || false;
  const isDownvoted = discussion.dislikedUserIds?.includes(user?.id || "") || false;
  const likeCount = discussion.likedUserIds?.length || 0;
  const dislikeCount = discussion.dislikedUserIds?.length || 0;
  const score = likeCount - dislikeCount;

  // Khởi tạo trạng thái thu gọn nếu điểm số âm (< 0)
  const [isCollapsed, setIsCollapsed] = useState(() => score < 0);

  // Mutation cho Like/Unlike
  const likeMutation = useMutation({
    mutationFn: () => learningApi.likeDiscussion(discussion.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discussions", discussion.lessonId] });
    },
  });

  // Mutation cho Dislike/Undislike
  const dislikeMutation = useMutation({
    mutationFn: () => learningApi.dislikeDiscussion(discussion.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discussions", discussion.lessonId] });
    },
  });

  const handleReplySubmit = () => {
    if (!replyContent.trim()) return;
    onReply(replyContent, discussion.id);
    setReplyContent("");
    setShowReplyForm(false);
  };

  if (isCollapsed) {
    return (
      <div className="mb-3 pl-2 py-1.5 bg-slate-50/50 hover:bg-slate-50 rounded-lg border border-slate-200/50 flex items-center gap-2 text-[11px] text-slate-400/80 shadow-sm animate-fade-in w-full">
        <button
          onClick={() => setIsCollapsed(false)}
          className="w-4 h-4 flex items-center justify-center rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-500 font-bold cursor-pointer transition-colors border-0 text-slate-500 text-[10px]"
          title="Mở rộng thảo luận"
        >
          +
        </button>
        <span>•</span>
        <span>{dayjs.utc(discussion.createdAt).local().fromNow()}</span>
        <span>•</span>
        <span className="italic font-medium text-slate-400">
          Đã thu gọn ({discussion.replyCount || (discussion.replies?.length ?? 0)} phản hồi)
        </span>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <div className="flex gap-3">
        <Avatar
          src={discussion.user?.avatar}
          icon={<UserOutlined />}
          size={depth > 0 ? "default" : "large"}
          className="flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className={`${depth > 0 ? "bg-slate-50 p-3" : "bg-white p-4"} rounded-lg border border-slate-100 shadow-sm relative group`}>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Text strong className="text-primary text-sm">
                {discussion.user
                  && formatFullName(discussion.user)}
              </Text>
              <span className="text-gray-300 text-xs">•</span>
              <Text type="secondary" className="text-xs">
                {dayjs.utc(discussion.createdAt).local().fromNow()}
              </Text>
            </div>

            <Paragraph className="mb-2 whitespace-pre-wrap text-sm text-gray-700">
              {discussion.content}
            </Paragraph>

            <div className="flex items-center gap-4">
              {/* Reddit-style vote widget */}
              <div className="flex items-center gap-0.5 bg-slate-100/60 hover:bg-slate-100 rounded-full px-1.5 py-0.5 border border-slate-200/40">
                <button
                  onClick={() => likeMutation.mutate()}
                  className={`flex items-center justify-center p-0.5 rounded-full hover:bg-slate-200/60 cursor-pointer transition-colors border-0 ${
                    isUpvoted ? "text-orange-500 font-bold" : "text-slate-400 hover:text-slate-600"
                  }`}
                  title="Thích (Upvote)"
                >
                  <CaretUpOutlined style={{ fontSize: 15 }} />
                </button>
                <span className={`text-xs font-semibold px-1 select-none min-w-[10px] text-center ${
                  isUpvoted ? "text-orange-500" : isDownvoted ? "text-blue-500" : "text-slate-600"
                }`}>
                  {score}
                </span>
                <button
                  onClick={() => dislikeMutation.mutate()}
                  className={`flex items-center justify-center p-0.5 rounded-full hover:bg-slate-200/60 cursor-pointer transition-colors border-0 ${
                    isDownvoted ? "text-blue-500 font-bold" : "text-slate-400 hover:text-slate-600"
                  }`}
                  title="Không thích (Downvote)"
                >
                  <CaretDownOutlined style={{ fontSize: 15 }} />
                </button>
              </div>

              {/* Reply Button */}
              <CButton
                type="link"
                size="small"
                icon={<MessageOutlined />}
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="p-0 text-gray-500 hover:text-primary flex items-center gap-1 shadow-none text-xs"
              >
                <span>Trả lời</span>
                <Show>
                  <Show.When isTrue={discussion.replyCount > 0}>
                    <span>({discussion.replyCount})</span>
                  </Show.When>
                </Show>
              </CButton>
            </div>
          </div>

          {/* Reply Form */}
          <Show>
            <Show.When isTrue={showReplyForm}>
              <div className="mt-3 flex items-end gap-2 rounded-xl py-1.5 px-3 border border-slate-200 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 shadow-sm bg-white">
                <Input.TextArea
                  placeholder="Viết phản hồi của bạn... (Enter để gửi, Shift+Enter để xuống dòng)"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleReplySubmit();
                    }
                  }}
                  autoSize={{ minRows: 1, maxRows: 3 }}
                  className="flex-1 border-0 focus:shadow-none resize-none !bg-transparent !p-0 text-sm leading-6 align-bottom"
                  style={{ border: "none", outline: "none", boxShadow: "none" }}
                />
                <div className="flex items-center justify-center pb-1 flex-shrink-0">
                  {isCreating ? (
                    <Spin size="small" />
                  ) : (
                    <SendOutlined
                      onClick={handleReplySubmit}
                      className={`cursor-pointer transition-colors ${
                        replyContent.trim() ? "text-primary hover:text-primary/80" : "text-slate-300"
                      }`}
                      style={{ fontSize: 15 }}
                    />
                  )}
                </div>
              </div>
            </Show.When>
          </Show>

          {/* Nested Replies with Reddit threadline */}
          <Show>
            <Show.When isTrue={!!discussion.replies && (discussion.replies?.length ?? 0) > 0}>
              <div className="mt-3 flex gap-2 relative">
                {/* Threadline Connector */}
                <div
                  onClick={() => setIsCollapsed(true)}
                  className="w-4 group cursor-pointer flex flex-col items-center select-none"
                  title="Click để thu gọn chuỗi thảo luận"
                >
                  <div className="w-4 h-4 flex items-center justify-center text-[10px] text-slate-400 border border-slate-200/80 rounded bg-white group-hover:bg-blue-50 group-hover:text-blue-500 group-hover:border-blue-500 transition-colors shadow-sm">
                    -
                  </div>
                  <div className="w-[2px] flex-1 bg-slate-100 group-hover:bg-blue-500/80 rounded transition-colors duration-150 mt-1.5" />
                </div>

                {/* Replies container */}
                <div className="flex-1 min-w-0">
                  <For
                    array={[...(discussion.replies || [])].sort((a, b) => {
                      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                      return dateA - dateB;
                    })}
                    render={(reply) => (
                      <DiscussionItem
                        key={reply.id}
                        discussion={reply}
                        onReply={onReply}
                        isCreating={isCreating}
                        depth={depth + 1}
                      />
                    )}
                  />
                </div>
              </div>
            </Show.When>
          </Show>
        </div>
      </div>
    </div>
  );
};

export default DiscussionItem;
