import React, { useEffect, useMemo } from "react";
import { Layout, Menu, Tooltip } from "antd";
import type { MenuProps } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { sidebarItems, getSelectedKey, getParentKey } from "./menuConfig";
import type { SidebarItem } from "./menuConfig";
import { useConfigStore } from "@/store/useConfigStore";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

const { Sider } = Layout;

// ── Premium Dark Sidebar Theme ──────────────────────────────────────────
const StyledSider = styled(Sider)`
  background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%) !important;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  position: relative;
  overflow: hidden;

  /* Ambient glow effect */
  &::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      ellipse at 20% 50%,
      rgba(34, 114, 235, 0.06) 0%,
      transparent 60%
    );
    pointer-events: none;
    z-index: 0;
  }

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  /* ── Ant Menu Reset for Dark Theme ── */
  .ant-menu {
    background: transparent !important;
    border-inline-end: none !important;
    padding: 8px 12px;
  }

  /* Menu item base */
  .ant-menu-item,
  .ant-menu-submenu-title {
    color: rgba(255, 255, 255, 0.55) !important;
    border-radius: 10px !important;
    margin: 2px 0 !important;
    height: 42px !important;
    line-height: 42px !important;
    font-size: 13.5px;
    font-weight: 500;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }

  .ant-menu-item .anticon,
  .ant-menu-submenu-title .anticon {
    font-size: 16px !important;
    color: rgba(255, 255, 255, 0.4) !important;
    transition: color 0.2s ease !important;
  }

  /* Hover */
  .ant-menu-item:hover,
  .ant-menu-submenu-title:hover {
    color: rgba(255, 255, 255, 0.95) !important;
    background: rgba(255, 255, 255, 0.06) !important;
  }

  .ant-menu-item:hover .anticon,
  .ant-menu-submenu-title:hover .anticon {
    color: rgba(255, 255, 255, 0.85) !important;
  }

  /* Active / Selected */
  .ant-menu-item-selected {
    background: linear-gradient(
      135deg,
      rgba(34, 114, 235, 0.2) 0%,
      rgba(59, 130, 246, 0.12) 100%
    ) !important;
    color: #60a5fa !important;
    font-weight: 600;
    box-shadow: inset 0 0 0 1px rgba(96, 165, 250, 0.15);
  }

  .ant-menu-item-selected .anticon {
    color: #60a5fa !important;
  }

  /* Submenu selected title */
  .ant-menu-submenu-selected > .ant-menu-submenu-title {
    color: rgba(255, 255, 255, 0.85) !important;
  }

  .ant-menu-submenu-selected > .ant-menu-submenu-title .anticon {
    color: rgba(255, 255, 255, 0.7) !important;
  }

  /* Submenu expand arrow */
  .ant-menu-submenu-arrow {
    color: rgba(255, 255, 255, 0.3) !important;
  }

  .ant-menu-submenu-title:hover .ant-menu-submenu-arrow,
  .ant-menu-submenu-open > .ant-menu-submenu-title .ant-menu-submenu-arrow {
    color: rgba(255, 255, 255, 0.6) !important;
  }

  /* Sub-menu children */
  .ant-menu-sub.ant-menu-inline {
    background: transparent !important;
  }

  .ant-menu-sub .ant-menu-item {
    padding-left: 48px !important;
    font-size: 13px;
    height: 38px !important;
    line-height: 38px !important;
  }

  /* Inline collapsed tooltip */
  .ant-menu-inline-collapsed .ant-menu-item,
  .ant-menu-inline-collapsed .ant-menu-submenu-title {
    padding-inline: 0 !important;
    text-align: center;
  }

  .ant-menu-inline-collapsed .ant-menu-item .anticon,
  .ant-menu-inline-collapsed .ant-menu-submenu-title .anticon {
    font-size: 18px !important;
  }
`;

// ── Logo Component ──────────────────────────────────────────────────────
const LogoWrapper = styled.div<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64px;
  padding: ${({ $collapsed }) => ($collapsed ? "0 8px" : "0 20px")};
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  position: relative;
  z-index: 1;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }
`;

const LogoIcon = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 14px;
  color: white;
  letter-spacing: -0.5px;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.35);
`;

const LogoText = styled.span`
  margin-left: 12px;
  font-size: 17px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.92);
  letter-spacing: 0.5px;
  white-space: nowrap;
  overflow: hidden;
`;

// ── Role Badge ──────────────────────────────────────────────────────────
const RoleBadge = styled.div<{ $collapsed: boolean }>`
  margin: 12px ${({ $collapsed }) => ($collapsed ? "8px" : "16px")} 4px;
  padding: 8px ${({ $collapsed }) => ($collapsed ? "0" : "12px")};
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  text-align: center;
  position: relative;
  z-index: 1;
`;

const RoleLabel = styled.span<{ $isAdmin: boolean }>`
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: ${({ $isAdmin }) => ($isAdmin ? "#f59e0b" : "#34d399")};
`;

// ── Collapse Toggle Button ─────────────────────────────────────────────
const CollapseToggleWrapper = styled.div`
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(15, 23, 42, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
`;

const CollapseToggleButton = styled.button`
  width: 100%;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #ffffff;
    border-color: rgba(255, 255, 255, 0.15);
  }

  .anticon {
    font-size: 16px;
  }
`;

// ── Component ───────────────────────────────────────────────────────────
interface AdminSiderProps {
  userRole?: string;
}

interface SimpleMenuItem {
  key: string;
  icon?: React.ReactNode;
  label: React.ReactNode;
  children?: SimpleMenuItem[];
  onClick?: () => void;
}

const AdminSider: React.FC<AdminSiderProps> = ({ userRole = "GUEST" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const collapsedMenu = useConfigStore((state) => state.collapsedMenu);
  const openKeys = useConfigStore((state) => state.openKeys);
  const setOpenKeys = useConfigStore((state) => state.setOpenKeys);
  const toggleCollapsedMenu = useConfigStore((state) => state.toggleCollapsedMenu);

  const isAdmin = userRole === "ADMIN";

  useEffect(() => {
    const key = getSelectedKey(location.pathname);
    const parentKey = getParentKey(key);
    if (parentKey && !collapsedMenu) {
      setOpenKeys((prev) => (prev.includes(parentKey) ? prev : [...prev, parentKey]));
    }
  }, [location.pathname, collapsedMenu, setOpenKeys]);

  const menuItems = useMemo<MenuProps['items']>(() => {
    const filterAndMap = (items: SidebarItem[]): SimpleMenuItem[] => {
      return items
        .filter((item) => {
          const safeRole = userRole || "GUEST";
          return !item.roles || item.roles.includes(safeRole);
        })
        .map((item): SimpleMenuItem => {
          const label = collapsedMenu ? (
            <Tooltip title={item.label} placement="right">
              {item.label}
            </Tooltip>
          ) : (
            item.label
          );

          const mappedItem: SimpleMenuItem = {
            key: item.key,
            icon: item.icon,
            label,
          };

          if (item.children) {
            mappedItem.children = filterAndMap(item.children);
          } else if (item.path) {
            mappedItem.onClick = () => navigate(item.path?.(userRole || "GUEST") || "/");
          }

          return mappedItem;
        });
    };

    return filterAndMap(sidebarItems) as unknown as MenuProps['items'];
  }, [userRole, collapsedMenu, navigate]);

  return (
    <StyledSider
      trigger={null}
      collapsible
      collapsed={collapsedMenu}
      theme="dark"
      style={{ height: "100vh" }}
      width={260}
      collapsedWidth={72}
    >
      <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
        {/* Scrollable menu section */}
        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }} className="custom-scrollbar">
          {/* Logo */}
          <LogoWrapper $collapsed={collapsedMenu}>
            <LogoIcon>EL</LogoIcon>
            {!collapsedMenu && <LogoText>E-Learning</LogoText>}
          </LogoWrapper>

          {/* Role indicator */}
          <RoleBadge $collapsed={collapsedMenu}>
            <RoleLabel $isAdmin={isAdmin}>
              {collapsedMenu
                ? isAdmin
                  ? "AD"
                  : "GV"
                : isAdmin
                  ? "Quản trị viên"
                  : "Giảng viên"}
            </RoleLabel>
          </RoleBadge>

          {/* Navigation */}
          <Menu
            mode="inline"
            selectedKeys={[getSelectedKey(location.pathname)]}
            openKeys={collapsedMenu ? [] : openKeys}
            onOpenChange={(keys) => setOpenKeys(keys)}
            items={menuItems}
          />
        </div>

        {/* Fixed collapse toggle button at the bottom */}
        <CollapseToggleWrapper>
          <Tooltip title={collapsedMenu ? "Mở rộng menu" : "Thu gọn menu"} placement="right">
            <CollapseToggleButton
              id="btn-sidebar-collapse-toggle"
              onClick={toggleCollapsedMenu}
            >
              {collapsedMenu ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </CollapseToggleButton>
          </Tooltip>
        </CollapseToggleWrapper>
      </div>
    </StyledSider>
  );
};

export default React.memo(AdminSider);
