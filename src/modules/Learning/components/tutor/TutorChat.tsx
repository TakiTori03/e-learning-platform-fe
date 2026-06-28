import React, { useEffect, useRef, useCallback } from "react";
import { Input, Button, Spin, Tooltip, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import { useLearningStore } from "../../store/useLearningStore";
import CPopconfirm from "@/components/UI/Popconfirm";
import {
  SendOutlined,
  RedoOutlined,
  RobotOutlined,
  UserOutlined,
  DeleteOutlined,
  BookOutlined,
  PlayCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useTutorChatStream } from "../../hooks/useTutorChatStream";
import { ICitation } from "../../services/aiApi";

interface TutorChatProps {
  courseId: string;
}

const TutorChat: React.FC<TutorChatProps> = ({ courseId }) => {
  const navigate = useNavigate();
  const {
    sessions,
    activeSessionId,
    setActiveSessionId,
    messages,
    inputMessage,
    setInputMessage,
    isStreaming,
    streamedAnswer,
    streamedCitations,
    loadingMessages,
    handleResetChat,
    handleDeleteSession,
    handleSendMessage,
  } = useTutorChatStream(courseId);

  const lessonsList = useLearningStore((state) => state.lessons);
  const currentLesson = useLearningStore((state) => state.currentLesson);
  const setCurrentLesson = useLearningStore((state) => state.setCurrentLesson);
  const seekTo = useLearningStore((state) => state.seekTo);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Cuộn xuống cuối ô chat khi nhận tin nhắn mới hoặc đang stream
  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  }, []);

  useEffect(() => {
    scrollToBottom("smooth");
  }, [messages, streamedAnswer, scrollToBottom]);

  const parseTimestampToSeconds = (timeStr: string): number => {
    if (!timeStr) return 0;
    // Chấp nhận định dạng: "02:15" hoặc "00:02:15"
    const parts = timeStr.split(":");
    if (parts.length === 2) {
      const m = parseInt(parts[0], 10);
      const s = parseInt(parts[1], 10);
      return (isNaN(m) ? 0 : m) * 60 + (isNaN(s) ? 0 : s);
    } else if (parts.length === 3) {
      const h = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      const s = parseInt(parts[2], 10);
      return (isNaN(h) ? 0 : h) * 3600 + (isNaN(m) ? 0 : m) * 60 + (isNaN(s) ? 0 : s);
    }
    return 0;
  };

  const handleCitationClick = (cite: ICitation) => {
    let lesson = lessonsList.find((l) => String(l.id) === String(cite.lessonId));
    
    if (!lesson) {
      // Fallback: nếu bài học hiện tại đang là DOCUMENT, ta áp dụng trang cho chính bài học hiện tại
      if (currentLesson && String(currentLesson.type).toUpperCase() === "DOCUMENT") {
        lesson = currentLesson;
      }
    }

    if (!lesson) return;

    // 1. Phân tích xem có số trang hay không
    let pageNum: number | null = null;
    const isDoc = cite.contentType === "DOCUMENT" || cite.contentType === "PDF" || 
                  String(cite.contentType).toUpperCase() === "DOCUMENT" || 
                  String(cite.contentType).toUpperCase() === "PDF";
    if (isDoc && cite.sourceCitation) {
      const pageMatch = cite.sourceCitation.match(/\d+/);
      if (pageMatch) {
        const parsed = parseInt(pageMatch[0], 10);
        if (!isNaN(parsed)) pageNum = parsed;
      }
    }

    // 2. Xây dựng search parameters mới
    const searchParams = new URLSearchParams(window.location.search);
    if (pageNum !== null) {
      searchParams.set("page", pageNum.toString());
    } else {
      searchParams.delete("page"); // Xóa trang cũ nếu chuyển sang bài học khác
    }

    const targetUrl = `/learning/${courseId}/${lesson.id}?${searchParams.toString()}`;

    // 3. Điều hướng URL đến bài học mới cùng query parameter page
    navigate(targetUrl);

    // 4. Nếu là video và có timestamp, thực hiện seek
    if (cite.contentType === "VIDEO" && cite.sourceCitation) {
      const seconds = parseTimestampToSeconds(cite.sourceCitation);
      if (seconds >= 0) {
        // Đợi 800ms để video player render và load media mới
        setTimeout(() => {
          seekTo(seconds);
        }, 800);
      }
    }
  };

  // Parse Citations từ dạng JSON string
  const renderCitations = (citationsJsonString?: string) => {
    if (!citationsJsonString) return null;
    try {
      const citationsList: ICitation[] = JSON.parse(citationsJsonString);
      if (!Array.isArray(citationsList) || citationsList.length === 0) return null;

      return (
        <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap gap-1.5 items-center">
          <span className="text-[11px] text-slate-400 font-medium mr-1 flex items-center gap-0.5">
            <BookOutlined /> Trích dẫn bài học:
          </span>
          {citationsList.map((cite, index) => {
            const isVideo = cite.contentType === "VIDEO";
            return (
              <Tooltip
                key={index}
                title={isVideo ? `Xem video bài học tại mốc ${cite.sourceCitation}` : `Xem tài liệu bài học: ${cite.sourceCitation}`}
                color="#1e293b"
              >
                <span
                  onClick={() => handleCitationClick(cite)}
                  className="inline-flex items-center gap-1 text-[10px] bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-colors px-2 py-0.5 rounded-full border border-blue-100 font-medium cursor-pointer max-w-[150px] truncate"
                >
                  {isVideo ? <PlayCircleOutlined className="text-blue-500" /> : <FileTextOutlined className="text-indigo-500" />}
                  {cite.sourceCitation}
                </span>
              </Tooltip>
            );
          })}
        </div>
      );
    } catch (e) {
      return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50/50">
      {/* Top Header */}
      <div className="p-3 bg-white border-b border-slate-200/80 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white">
            <RobotOutlined className="text-lg" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-800 m-0">Trợ lý AI Học tập</h4>
            <p className="text-[11px] text-emerald-600 font-medium m-0 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Sẵn sàng hỗ trợ
            </p>
          </div>
        </div>
        <Tooltip title="Làm mới cuộc trò chuyện mới">
          <Button
            type="text"
            icon={<RedoOutlined className="text-slate-500" />}
            onClick={handleResetChat}
            className="hover:bg-slate-100"
          />
        </Tooltip>
      </div>

      {/* Main Grid Area: Sidebar Lịch sử & Khung Chat chính */}
      <div className="flex-1 flex overflow-hidden">
        {/* Lịch sử trò chuyện bên trái (Ẩn khi không có session nào) */}
        {sessions.length > 0 && (
          <div className="w-1/4 border-r border-slate-200/60 bg-white flex flex-col overflow-y-auto hidden md:flex custom-scrollbar">
            <div className="p-2 border-b border-slate-100 bg-slate-50/50">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Hội thoại cũ</span>
            </div>
            {sessions.map((s) => (
              <div
                key={s.id}
                onClick={() => setActiveSessionId(s.id)}
                className={`p-2.5 cursor-pointer border-b border-slate-50 flex items-center justify-between transition-colors ${
                  activeSessionId === s.id
                    ? "bg-blue-50/80 text-blue-600 font-medium"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <div className="text-xs truncate flex-1 pr-2 text-left">
                  {s.title || "Hội thoại mới"}
                </div>
                <CPopconfirm
                  title="Xóa hội thoại"
                  description="Bạn chắc chắn muốn xóa cuộc trò chuyện này?"
                  onConfirm={(e) => handleDeleteSession(s.id, e as any)}
                  okText="Xóa"
                  cancelText="Hủy"
                  placement="right"
                >
                  <DeleteOutlined
                    onClick={(e) => e.stopPropagation()}
                    className="text-[11px] text-slate-400 hover:text-red-500 opacity-0 hover:opacity-100 group-hover:opacity-100 md:opacity-100 transition-opacity"
                  />
                </CPopconfirm>
              </div>
            ))}
          </div>
        )}

        {/* Khung tin nhắn chính */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50">
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
          >
            {loadingMessages ? (
              <div className="h-full flex items-center justify-center">
                <Spin tip="Đang tải lịch sử trò chuyện..." size="medium" />
              </div>
            ) : messages.length === 0 && !streamedAnswer ? (
              <div className="h-full flex items-center justify-center">
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <div className="text-center max-w-xs mx-auto">
                      <p className="text-sm font-semibold text-slate-500 m-0">Hỏi tôi bất cứ điều gì!</p>
                      <p className="text-xs text-slate-400 mt-1">AI có thể trả lời kiến thức, giải thích code, bài giảng dựa trên tài liệu học tập khóa học.</p>
                    </div>
                  }
                />
              </div>
            ) : (
              <>
                {messages.map((msg) => {
                  const isUser = msg.role === "user";
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex gap-2 max-w-[85%] ${
                          isUser ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        {/* Avatar */}
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            isUser ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600 shadow-sm"
                          }`}
                        >
                          {isUser ? <UserOutlined className="text-xs" /> : <RobotOutlined className="text-xs" />}
                        </div>

                        {/* Content bubble */}
                        <div
                          className={`p-3 rounded-2xl shadow-sm ${
                            isUser
                              ? "bg-blue-600 text-white rounded-tr-none text-left"
                              : "bg-white text-slate-800 border border-slate-200/80 rounded-tl-none text-left"
                          }`}
                        >
                          <div className={`prose prose-sm max-w-none ${isUser ? "text-white" : "text-slate-800"}`}>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {msg.content}
                            </ReactMarkdown>
                          </div>

                          {/* Citations */}
                          {!isUser && renderCitations(msg.citations)}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Bong bóng hiển thị text đang STREAMING */}
                {streamedAnswer && (
                  <div className="flex justify-start">
                    <div className="flex gap-2 max-w-[85%] flex-row">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-white border border-slate-200 text-slate-600 shadow-sm shrink-0">
                        <RobotOutlined className="text-xs" />
                      </div>
                      <div className="p-3 bg-white text-slate-800 border border-slate-200/80 rounded-2xl rounded-tl-none text-left shadow-sm">
                        <div className="prose prose-sm max-w-none text-slate-800">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {streamedAnswer}
                          </ReactMarkdown>
                        </div>

                        {/* Citations stream */}
                        {streamedCitations.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap gap-1.5 items-center">
                            <span className="text-[11px] text-slate-400 font-medium mr-1 flex items-center gap-0.5">
                              <BookOutlined /> Trích dẫn bài học:
                            </span>
                            {streamedCitations.map((cite, index) => {
                              const isVideo = cite.contentType === "VIDEO";
                              return (
                                <Tooltip
                                  key={index}
                                  title={isVideo ? `Xem video bài học tại mốc ${cite.sourceCitation}` : `Xem tài liệu bài học: ${cite.sourceCitation}`}
                                  color="#1e293b"
                                >
                                  <span
                                    onClick={() => handleCitationClick(cite)}
                                    className="inline-flex items-center gap-1 text-[10px] bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-colors px-2 py-0.5 rounded-full border border-blue-100 font-medium cursor-pointer max-w-[150px] truncate"
                                  >
                                    {isVideo ? <PlayCircleOutlined className="text-blue-500" /> : <FileTextOutlined className="text-indigo-500" />}
                                    {cite.sourceCitation}
                                  </span>
                                </Tooltip>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Hoạt ảnh đang chờ phản hồi */}
                {isStreaming && !streamedAnswer && (
                  <div className="flex justify-start items-center gap-2 pl-9">
                    <Spin size="small" />
                    <span className="text-xs text-slate-400 italic">AI đang suy nghĩ...</span>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Khung nhập tin nhắn */}
          <div className="p-3 bg-white border-t border-slate-200 flex gap-2 items-center">
            <Input.TextArea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Hỏi AI Tutor về bài giảng..."
              autoSize={{ minRows: 1, maxRows: 3 }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={isStreaming}
              className="flex-1 rounded-lg border-slate-200 resize-none hover:border-blue-400 focus:border-blue-500 shadow-inner"
            />
            <Button
              type="primary"
              shape="circle"
              icon={isStreaming ? <Spin size="small" className="text-white" /> : <SendOutlined />}
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isStreaming}
              className="bg-blue-600 border-none w-9 h-9 flex items-center justify-center shadow hover:scale-105 active:scale-95 transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TutorChat);
