import CButton from "@/components/UI/Button";
import { For, Show } from "@/components/UI/Template";
import CTextArea from "@/components/UI/TextArea";
import { useAuthStore } from "@/store/useAuthStore";
import { formatDate, formatFullName } from "@/utils/format";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CommentOutlined,
  DeleteOutlined,
  MessageOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Avatar, Empty, message, Pagination, Spin, Typography } from "antd";
import CPopconfirm from "@/components/UI/Popconfirm";
import React, { useState } from "react";
import {
  useCommentsList,
  useCreateCommentMutation,
  useDeleteCommentMutation,
} from "../hooks/useBlogQueries";
import type { IBlogComment } from "../types";

const { Paragraph } = Typography;

interface BlogCommentSectionProps {
  postId: string;
}

export const BlogCommentSection: React.FC<BlogCommentSectionProps> = ({ postId }) => {
  const { isAuth, user } = useAuthStore();
  const [commentText, setCommentText] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Query top-level comments
  const { data: commentsData, isLoading } = useCommentsList(postId, {
    page: page - 1,
    size: pageSize,
  });

  const comments = commentsData?.content || [];
  const totalComments = commentsData?.totalElements || 0;

  // Mutations
  const createCommentMutation = useCreateCommentMutation();
  const deleteCommentMutation = useDeleteCommentMutation();

  const handlePostComment = async () => {
    if (!commentText.trim()) return;

    try {
      await createCommentMutation.mutateAsync({
        postId,
        data: { content: commentText },
      });
      setCommentText("");
      message.success("Đã gửi bình luận thành công!");
    } catch {
      message.error("Gửi bình luận thất bại. Vui lòng thử lại!");
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded p-6 shadow-none mt-8 font-sans">
      {/* Title */}
      <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
        <MessageOutlined className="text-slate-700 text-base" />
        <span className="font-bold text-slate-800 text-sm md:text-base uppercase tracking-wider">
          Bình luận ({totalComments})
        </span>
      </div>

      {/* Main comment input box */}
      <Show>
        <Show.When isTrue={isAuth && !!user}>
          <div className="flex gap-3 mt-6">
            <Avatar
              src={user?.avatar}
              size={36}
              className="border border-gray-200 bg-gray-50 shrink-0"
            >
              {user?.firstName?.charAt(0) || "U"}
            </Avatar>
            <div className="flex-1 space-y-2">
              <CTextArea
                placeholder="Viết bình luận của bạn..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                autoSize={{ minRows: 3, maxRows: 6 }}
                className="rounded border-gray-300 text-slate-700 text-sm"
              />
              <div className="flex justify-end">
                <CButton
                  typeCustom="primary"
                  onClick={handlePostComment}
                  disabled={!commentText.trim() || createCommentMutation.isPending}
                  className="rounded flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 h-9"
                >
                  <SendOutlined /> Gửi bình luận
                </CButton>
              </div>
            </div>
          </div>
        </Show.When>
        <Show.Else>
          <div className="bg-gray-50 border border-gray-200 rounded p-6 text-center space-y-3 mt-6">
            <CommentOutlined className="text-gray-400 text-2xl" />
            <p className="text-slate-500 text-xs font-medium">
              Bạn cần đăng nhập để tham gia thảo luận và gửi bình luận.
            </p>
            <CButton
              typeCustom="primary"
              onClick={() => (window.location.href = "/login")}
              className="rounded font-semibold text-xs px-5 py-2 h-9"
            >
              Đăng nhập ngay
            </CButton>
          </div>
        </Show.Else>
      </Show>

      {/* Comments List */}
      <div className="space-y-4 mt-6">
        <Show>
          <Show.When isTrue={isLoading}>
            <div className="flex justify-center py-6">
              <Spin size="default" tip="Đang tải bình luận..." />
            </div>
          </Show.When>

          <Show.When isTrue={comments.length === 0}>
            <Empty
              description="Chưa có bình luận nào. Hãy gửi bình luận đầu tiên!"
              className="py-6 text-slate-400 text-xs"
            />
          </Show.When>

          <Show.Else>
            <div className="space-y-4 divide-y divide-gray-100">
              <For
                array={comments}
                render={(comment: IBlogComment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    postId={postId}
                    currentUser={user}
                    onDelete={async (id) => {
                      try {
                        await deleteCommentMutation.mutateAsync({ commentId: id, postId });
                        message.success("Đã xóa bình luận!");
                      } catch {
                        message.error("Không thể xóa bình luận!");
                      }
                    }}
                  />
                )}
              />
            </div>

            {totalComments > pageSize && (
              <div className="flex justify-center pt-4 border-t border-gray-100 mt-4">
                <Pagination
                  current={page}
                  pageSize={pageSize}
                  total={totalComments}
                  onChange={(p) => setPage(p)}
                  showSizeChanger={false}
                />
              </div>
            )}
          </Show.Else>
        </Show>
      </div>
    </div>
  );
};

/* Individual comment item with replies support */
const CommentItem: React.FC<{
  comment: IBlogComment;
  postId: string;
  currentUser: any;
  onDelete: (id: string) => Promise<void>;
}> = ({ comment, postId, currentUser, onDelete }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState("");
  const createCommentMutation = useCreateCommentMutation();

  const handlePostReply = async () => {
    if (!replyText.trim()) return;

    try {
      await createCommentMutation.mutateAsync({
        postId,
        data: {
          content: replyText,
          parentId: comment.id,
        },
      });
      setReplyText("");
      setShowReplyForm(false);
      setShowReplies(true);
      message.success("Đã gửi câu trả lời!");
    } catch {
      message.error("Gửi phản hồi thất bại!");
    }
  };

  const getRoleLabel = (role?: string) => {
    if (!role) return "";
    switch (role.toUpperCase()) {
      case "ADMIN":
        return "Admin";
      case "INSTRUCTOR":
      case "TEACHER":
        return "Giảng viên";
      default:
        return "";
    }
  };

  const roleLabel = getRoleLabel(comment.user?.role);

  return (
    <div className="pt-4 first:pt-0">
      <div className="flex gap-3">
        {/* Author Avatar */}
        <Avatar
          src={comment.user?.avatar}
          size={32}
          className="border border-gray-200 bg-gray-50 shrink-0"
        >
          {comment.user?.firstName?.charAt(0) || "U"}
        </Avatar>

        {/* Comment Content Area */}
        <div className="flex-1 space-y-1.5">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-slate-800 text-xs font-serif">
                {comment.user && formatFullName(comment.user)}
              </span>
              {roleLabel && (
                <span className="text-[9px] font-bold px-1.5 py-0.2 bg-gray-100 text-slate-600 border border-gray-300 rounded uppercase tracking-wider">
                  {roleLabel}
                </span>
              )}
              <span className="text-[10px] text-slate-400">
                {formatDate(comment.createdAt)}
              </span>
            </div>

            {/* Actions: Delete for owner */}
            {currentUser?.id === comment.userId && (
              <CPopconfirm
                title="Xóa bình luận"
                description="Bạn chắc chắn muốn xóa chứ?"
                onConfirm={() => onDelete(comment.id)}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
              >
                <button className="text-slate-400 hover:text-red-500 transition-colors text-xs flex items-center cursor-pointer">
                  <DeleteOutlined className="text-[10px]" />
                </button>
              </CPopconfirm>
            )}
          </div>

          {/* Comment content */}
          <Paragraph className="text-slate-700 text-xs leading-relaxed mb-1 font-sans">
            {comment.content}
          </Paragraph>

          {/* Reply Toggle and Action buttons */}
          <div className="flex items-center gap-3 text-[10px] font-sans">
            {currentUser && (
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className={`font-semibold transition-colors cursor-pointer ${
                  showReplyForm ? "text-slate-800 underline" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Trả lời
              </button>
            )}

            {/* Toggle replies if any */}
            {comment.repliesCount > 0 && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="text-slate-600 font-semibold hover:text-slate-800 transition-colors flex items-center gap-0.5 cursor-pointer"
              >
                {showReplies ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                {showReplies ? "Ẩn phản hồi" : `Xem ${comment.repliesCount} phản hồi`}
              </button>
            )}
          </div>

          {/* Inline Reply Input Form */}
          <Show>
            <Show.When isTrue={showReplyForm}>
              <div className="flex gap-2.5 mt-3 bg-gray-50 p-3 rounded border border-gray-200">
                <Avatar
                  src={currentUser?.avatar}
                  size={28}
                  className="border border-gray-200 bg-gray-50 shrink-0"
                >
                  {currentUser?.firstName?.charAt(0) || "U"}
                </Avatar>
                <div className="flex-1 space-y-2">
                  <CTextArea
                    placeholder={`Trả lời...`}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    autoSize={{ minRows: 2, maxRows: 4 }}
                    className="rounded border-gray-300 text-slate-700 text-xs bg-white"
                  />
                  <div className="flex justify-end gap-2">
                    <CButton
                      typeCustom="outline"
                      onClick={() => {
                        setShowReplyForm(false);
                        setReplyText("");
                      }}
                      className="rounded text-[10px] font-semibold px-3 py-1 h-7"
                    >
                      Hủy
                    </CButton>
                    <CButton
                      typeCustom="primary"
                      onClick={handlePostReply}
                      disabled={!replyText.trim() || createCommentMutation.isPending}
                      className="rounded text-[10px] font-semibold px-3 py-1 h-7 flex items-center gap-1"
                    >
                      <SendOutlined /> Trả lời
                    </CButton>
                  </div>
                </div>
              </div>
            </Show.When>
          </Show>

          {/* Nested Replies List Container */}
          <Show>
            <Show.When isTrue={showReplies}>
              <div className="mt-3 border-l-2 border-gray-200 pl-3 space-y-3">
                <RepliesList
                  postId={postId}
                  parentId={comment.id}
                  currentUser={currentUser}
                  getRoleLabel={getRoleLabel}
                />
              </div>
            </Show.When>
          </Show>
        </div>
      </div>
    </div>
  );
};

/* Child replies fetched dynamically */
const RepliesList: React.FC<{
  postId: string;
  parentId: string;
  currentUser: any;
  getRoleLabel: (role?: string) => string;
}> = ({ postId, parentId, currentUser, getRoleLabel }) => {
  const { data: repliesData, isLoading } = useCommentsList(postId, {
    parentId,
    size: 50,
  });

  const replies = repliesData?.content || [];
  const deleteCommentMutation = useDeleteCommentMutation();

  const handleDeleteReply = async (replyId: string) => {
    try {
      await deleteCommentMutation.mutateAsync({ commentId: replyId, postId });
      message.success("Đã xóa phản hồi!");
    } catch {
      message.error("Không thể xóa phản hồi!");
    }
  };

  return (
    <div className="space-y-3">
      <Show>
        <Show.When isTrue={isLoading}>
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] py-1.5">
            <Spin size="small" />
            <span>Đang tải...</span>
          </div>
        </Show.When>
        <Show.Else>
          <For
            array={replies}
            render={(reply: IBlogComment) => {
              const replyRoleLabel = getRoleLabel(reply.user?.role);
              return (
                <div key={reply.id} className="flex gap-2.5">
                  <Avatar
                    src={reply.user?.avatar}
                    size={26}
                    className="border border-gray-200 bg-gray-50 shrink-0"
                  >
                    {reply.user?.firstName?.charAt(0) || "U"}
                  </Avatar>
                  <div className="flex-1 space-y-1 bg-gray-50/50 p-2.5 rounded border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-slate-800 text-[11px] font-serif">
                          {reply.user && formatFullName(reply.user)}
                        </span>
                        {replyRoleLabel && (
                          <span className="text-[8px] font-bold px-1 bg-gray-100 text-slate-500 border border-gray-300 rounded uppercase tracking-wider">
                            {replyRoleLabel}
                          </span>
                        )}
                        <span className="text-[9px] text-slate-400">
                          {formatDate(reply.createdAt)}
                        </span>
                      </div>

                      {currentUser?.id === reply.userId && (
                        <CPopconfirm
                          title="Xóa phản hồi"
                          description="Xóa chứ?"
                          onConfirm={() => handleDeleteReply(reply.id)}
                          okText="Xóa"
                          cancelText="Hủy"
                          okButtonProps={{ danger: true }}
                        >
                          <button className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer">
                            <DeleteOutlined className="text-[9px]" />
                          </button>
                        </CPopconfirm>
                      )}
                    </div>
                    <Paragraph className="text-slate-700 text-xs leading-relaxed mb-0 font-sans">
                      {reply.content}
                    </Paragraph>
                  </div>
                </div>
              );
            }}
          />
        </Show.Else>
      </Show>
    </div>
  );
};
