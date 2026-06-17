import React, { useState } from "react";
import {
  HeartOutlined,
  ShoppingCartOutlined,
  LogoutOutlined,
  SettingOutlined,
  TeamOutlined,
  BookOutlined,
  SearchOutlined,
  MenuOutlined,
  UserOutlined,
  HomeOutlined,
  AppstoreOutlined,
  ContactsOutlined,
  InfoCircleOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Dropdown,
  Space,
  Layout,
  theme,
  Drawer,
  Menu,
} from "antd";
import type { MenuProps } from "antd";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { authApi } from "@/modules/Auth/services/authApi";
import logo from "@/assets/images/e-learning-logo.svg";
import { getUserMenuItems } from "./menuconfig";
import { formatFullName } from "@/utils/format";

// UI Wrappers & Template Components
import CButton from "@/components/UI/Button";
import CInput from "@/components/UI/Input";
import { Show, For } from "@/components/UI/Template";

const { Header: AntHeader } = Layout;

const navLinks = [
  { label: "Home", to: "/", icon: <HomeOutlined /> },
  { label: "Courses", to: "/courses", icon: <AppstoreOutlined /> },
  { label: "Blog", to: "/blog", icon: <ReadOutlined /> },
  { label: "About", to: "/about-us", icon: <InfoCircleOutlined /> },
  { label: "Contact", to: "/contact", icon: <ContactsOutlined /> },
];

export const Header: React.FC = React.memo(() => {
  const isAuth = useAuthStore((state) => state.isAuth);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = React.useCallback(async () => {
    try {
      await authApi.logout();
    } catch (e) {
      console.error("Logout error:", e);
    } finally {
      logout();
      window.location.href = "/";
    }
  }, [logout]);

  const userMenuItems = React.useMemo(
    () => getUserMenuItems(user, handleLogout),
    [user, handleLogout]
  );

  return (
    <AntHeader
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        width: "100%",
        display: "flex",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        padding: "0 24px",
        height: "68px",
        boxShadow: "0 4px 20px -5px rgba(0,0,0,0.05)",
      }}
    >
      <div className="container mx-auto flex items-center justify-between w-full h-full">
        <Space size={12}>
          {/* Mobile Menu Button */}
          <CButton
            type="text"
            icon={<MenuOutlined style={{ fontSize: "20px" }} />}
            className="lg:!hidden flex items-center"
            onClick={() => setIsMobileMenuOpen(true)}
          />

          {/* LOGO */}
          <Link to="/" className="flex items-center flex-shrink-0 transition-transform hover:scale-105">
            <img src={logo} alt="Logo" className="h-9 md:h-11 w-auto" />
          </Link>
        </Space>

        {/* NAVIGATION (Desktop) */}
        <nav className="hidden lg:flex items-center gap-8 ml-10">
          <For
            array={navLinks}
            render={(item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`font-semibold text-sm transition-all hover:text-blue-600 relative py-2 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-blue-600 after:transition-all hover:after:w-full ${
                  location.pathname === item.to ? "text-blue-600 after:w-full" : "text-gray-500"
                }`}
              >
                {item.label}
              </Link>
            )}
          />
          <Show>
            <Show.When isTrue={isAuth}>
              <Link
                to="/start"
                className="font-semibold text-sm border-l pl-8 transition-colors text-gray-500 hover:text-blue-600"
                style={{ borderColor: token.colorBorder }}
              >
                My Learning
              </Link>
            </Show.When>
          </Show>
        </nav>

        {/* SEARCH & ACTIONS */}
        <div className="flex items-center gap-3 md:gap-6 ml-auto">
          {/* Search Box (Tablets & Desktop) */}
          <div className="hidden lg:block lg:w-48 xl:w-80">
            <CInput
              placeholder="Search courses..."
              prefix={
                <SearchOutlined style={{ color: token.colorTextPlaceholder }} />
              }
              style={{
                borderRadius: "24px",
                background: token.colorFillAlter,
                height: "38px",
              }}
              onPressEnter={(e) =>
                navigate(`/courses?q=${e.currentTarget.value}`)
              }
            />
          </div>

          <Space size={16} className="items-center">
            {/* Wishlist */}
            <Show>
              <Show.When isTrue={isAuth}>
                <Link to="/wishlist" className="hidden sm:flex items-center hover:scale-110 transition-transform">
                  <Badge dot offset={[-2, 2]}>
                    <HeartOutlined
                      style={{ fontSize: 20, color: token.colorTextHeading }}
                    />
                  </Badge>
                </Link>
              </Show.When>
            </Show>

            {/* Cart */}
            <Link to="/cart" className="hidden sm:flex items-center hover:scale-110 transition-transform">
              <Badge count={0} size="small" showZero={false}>
                <ShoppingCartOutlined
                  style={{ fontSize: 22, color: token.colorTextHeading }}
                />
              </Badge>
            </Link>

            {/* Auth section */}
            <Show>
              <Show.When isTrue={isAuth}>
                <Dropdown
                  menu={{ items: userMenuItems }}
                  placement="bottomRight"
                  trigger={["click"]}
                >
                  <div className="cursor-pointer hover:opacity-90 transition-opacity flex items-center pr-2">
                    <Avatar
                      src={user?.avatar}
                      icon={<UserOutlined />}
                      style={{
                        border: `2px solid ${token.colorPrimary}`,
                        width: 36,
                        height: 36,
                        boxShadow: `0 2px 10px ${token.colorPrimary.replace("1)", "0.15)")}`,
                      }}
                    />
                  </div>
                </Dropdown>
              </Show.When>
              <Show.Else>
                <div className="flex items-center gap-3">
                  <CButton
                    type="text"
                    onClick={() => navigate("/login")}
                    className="font-bold hidden sm:inline-block text-gray-600 hover:text-blue-600 h-10"
                  >
                    Login
                  </CButton>
                  <CButton
                    type="primary"
                    onClick={() => navigate("/register")}
                    style={{
                      height: "38px",
                      borderRadius: "19px",
                      fontWeight: 600,
                      backgroundColor: token.colorPrimary,
                      color: "#fff",
                      border: "none",
                    }}
                    className="px-5 transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
                  >
                    {window.innerWidth < 640 ? "Join" : "Join Free"}
                  </CButton>
                </div>
              </Show.Else>
            </Show>
          </Space>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <Drawer
        title={<img src={logo} alt="Logo" style={{ height: "36px" }} />}
        placement="left"
        onClose={() => setIsMobileMenuOpen(false)}
        open={isMobileMenuOpen}
        size={300}
        styles={{ body: { padding: 0 } }}
      >
        {/* User Info Header in Drawer */}
        <Show>
          <Show.When isTrue={isAuth}>
            <div className="p-6 bg-slate-50 border-b">
              <Space align="start" size={16}>
                <Avatar size={54} src={user?.avatar} icon={<UserOutlined />} />
                <div>
                  <div className="font-bold text-lg text-slate-800">
                    {formatFullName(user)}
                  </div>
                  <div className="text-sm text-slate-500 truncate w-40 mt-0.5">
                    {user?.email}
                  </div>
                  <Link
                    to="/profile"
                    className="text-blue-600 text-xs font-bold mt-2 inline-block hover:underline"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    View Profile
                  </Link>
                </div>
              </Space>
            </div>
          </Show.When>
          <Show.Else>
            <div className="p-6 border-b bg-blue-50/40">
              <div className="font-bold text-slate-800 mb-4">Welcome to E-Learning</div>
              <Space direction="vertical" className="w-full">
                <CButton
                  block
                  type="primary"
                  onClick={() => {
                    navigate("/register");
                    setIsMobileMenuOpen(false);
                  }}
                  className="rounded-xl h-11 font-bold"
                  style={{ backgroundColor: token.colorPrimary, color: "#fff", border: "none" }}
                >
                  Sign up for free
                </CButton>
                <CButton
                  block
                  onClick={() => {
                    navigate("/login");
                    setIsMobileMenuOpen(false);
                  }}
                  className="rounded-xl h-11 font-bold"
                >
                  Sign in
                </CButton>
              </Space>
            </div>
          </Show.Else>
        </Show>

        {/* Mobile Search */}
        <div className="p-4 bg-white border-b">
          <CInput
            placeholder="Search courses..."
            prefix={<SearchOutlined />}
            className="rounded-xl h-11"
            onPressEnter={(e) => {
              navigate(`/courses?q=${e.currentTarget.value}`);
              setIsMobileMenuOpen(false);
            }}
          />
        </div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{ borderRight: 0 }}
          onClick={() => setIsMobileMenuOpen(false)}
          items={
            [
              {
                label: "Browsing",
                type: "group",
                children: navLinks.map((link) => ({
                  key: link.to,
                  icon: link.icon,
                  label: <Link to={link.to}>{link.label}</Link>,
                })),
              },
              { type: "divider" },
              ...(isAuth
                ? [
                    {
                      label: "Account",
                      type: "group",
                      children: [
                        {
                          key: "/start",
                          label: <Link to="/start">My Learning</Link>,
                          icon: <BookOutlined />,
                        },
                        ...(user?.role === "INSTRUCTOR"
                          ? [
                              {
                                key: "/instructor/dashboard",
                                label: (
                                  <Link to="/instructor/dashboard">
                                    Instructor Dashboard
                                  </Link>
                                ),
                                icon: <TeamOutlined />,
                              },
                            ]
                          : []),
                        {
                          key: "/profile",
                          label: <Link to="/profile">Profile</Link>,
                          icon: <UserOutlined />,
                        },
                        {
                          key: "/account-settings",
                          label: (
                            <Link to="/account-settings">
                              Account settings
                            </Link>
                          ),
                          icon: <SettingOutlined />,
                        },
                        {
                          key: "logout-mobile",
                          label: "Logout",
                          icon: <LogoutOutlined />,
                          danger: true,
                          onClick: handleLogout,
                        },
                      ],
                    },
                  ]
                : []),
            ] as MenuProps["items"]
          }
        />
      </Drawer>
    </AntHeader>
  );
});

export default Header;
