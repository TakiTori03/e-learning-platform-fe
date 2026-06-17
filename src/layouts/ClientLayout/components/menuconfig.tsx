
import type { MenuProps } from "antd";
import { Link } from "react-router-dom";
import { Avatar } from "antd";
import {
  BellOutlined,
  HeartOutlined,
  LogoutOutlined,
  HistoryOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  KeyOutlined,
  TeamOutlined,
  BookOutlined,
  MessageOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import type { IUserInfo } from "@/type";
import { formatFullName } from "@/utils/format";

export const getUserMenuItems = (
  user: IUserInfo | null,
  handleLogout: () => void
): MenuProps["items"] => [
  {
    key: "profile-info",
    label: (
      <Link
        to="/profile"
        className="flex items-center gap-3 py-2 px-1 hover:opacity-90 transition-opacity"
      >
        <Avatar
          size={40}
          src={user?.avatar}
          className="flex-shrink-0 border border-slate-100 shadow-sm"
        />
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-[14px] text-slate-800 leading-tight truncate">
            {formatFullName(user)}
          </span>
          <span className="text-[12px] text-slate-500 truncate mt-0.5">
            {user?.email}
          </span>
        </div>
      </Link>
    ),
  },
  { type: "divider" },
  {
    key: "mylearning",
    icon: <BookOutlined />,
    label: <Link to="/start">My Learning</Link>,
  },
  {
    key: "wishlist",
    icon: <HeartOutlined />,
    label: <Link to="/wishlist">Wishlist</Link>,
  },
  {
    key: "inbox",
    icon: <MessageOutlined />,
    label: <Link to="/inbox">Inbox</Link>,
  },
  ...(user?.role === "INSTRUCTOR"
    ? [
        {
          key: "instructor-dashboard",
          icon: <TeamOutlined />,
          label: (
            <Link to="/instructor/dashboard">Instructor Dashboard</Link>
          ),
        },
      ]
    : []),
  { key: "notifications", icon: <BellOutlined />, label: "Notifications" },
  {
    key: "account-settings",
    icon: <SettingOutlined />,
    label: <Link to="/account-settings">Account settings</Link>,
  },
  {
    key: "purchase-history",
    icon: <HistoryOutlined />,
    label: <Link to="/purchase-history">Purchase history</Link>,
  },
  {
    key: "public-profile",
    icon: <TeamOutlined />,
    label: (
      <Link to={`/public-profile/${user?.id || ""}`}>Public Profile</Link>
    ),
  },
  {
    key: "change-password",
    icon: <KeyOutlined />,
    label: <Link to="/account-settings?tab=password">Change Password</Link>,
  },

  { key: "help", icon: <QuestionCircleOutlined />, label: "Help" },
  { type: "divider" },
  {
    key: "logout",
    icon: <LogoutOutlined />,
    label: "Logout",
    danger: true,
    onClick: handleLogout,
  },
];
