import React from "react";
import {
  RobotOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
  HistoryOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import styles from "./GlobalChatbot.module.css";

interface ChatHeaderProps {
  showHistory: boolean;
  isAuth: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onToggleHistory: () => void;
}

/**
 * Header gradient của cửa sổ chatbot.
 * Hiển thị nút tạo mới, lịch sử, đóng.
 * Khi ở chế độ lịch sử: hiện nút quay lại.
 */
const ChatHeader: React.FC<ChatHeaderProps> = ({
  showHistory,
  isAuth,
  onClose,
  onNewChat,
  onToggleHistory,
}) => {
  return (
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        {showHistory ? (
          <button
            className={styles.headerBtn}
            onClick={onToggleHistory}
            title="Quay lại"
          >
            <ArrowLeftOutlined />
          </button>
        ) : (
          <RobotOutlined className={styles.headerIcon} />
        )}
        <div>
          <h3 className={styles.headerTitle}>
            {showHistory ? "Lịch sử trò chuyện" : "HUST AI Assistant"}
          </h3>
          <p className={styles.headerSubtitle}>
            {showHistory
              ? "Chọn phiên chat cũ"
              : "Trợ lý AI đa chức năng"}
          </p>
        </div>
      </div>

      <div className={styles.headerActions}>
        {isAuth && !showHistory && (
          <>
            <button
              className={styles.headerBtn}
              onClick={onNewChat}
              title="Tạo hội thoại mới"
            >
              <PlusOutlined />
            </button>
            <button
              className={styles.headerBtn}
              onClick={onToggleHistory}
              title="Lịch sử"
            >
              <HistoryOutlined />
            </button>
          </>
        )}
        <button
          className={styles.headerBtn}
          onClick={onClose}
          title="Đóng"
        >
          <CloseOutlined />
        </button>
      </div>
    </div>
  );
};

export default React.memo(ChatHeader);
