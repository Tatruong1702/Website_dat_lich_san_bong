import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
  DashboardOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import "./AdminLayout.css";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { path: "/admin", label: "Dashboard", icon: DashboardOutlined },
    { path: "/admin/categories", label: "Danh mục", icon: EnvironmentOutlined },
    { path: "/admin/fields", label: "Quản lý sân", icon: EnvironmentOutlined },
    { path: "/admin/bookings", label: "Lịch đặt", icon: CalendarOutlined },
    { path: "/admin/users", label: "Người dùng", icon: UserOutlined },
    { path: "/admin/settings", label: "Cài đặt", icon: SettingOutlined },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h1 className="sidebar-logo">🏀 Admin</h1>
          <button
            className="sidebar-toggle-mobile"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <CloseOutlined /> : <MenuOutlined />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive(item.path) ? "active" : ""}`}
            >
              <item.icon />
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn">
            <LogoutOutlined />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        {/* Top Bar */}
        <div className="admin-topbar">
          <button
            className="menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <CloseOutlined /> : <MenuOutlined />}
          </button>
          <div className="topbar-right">
            <div className="user-profile">
              <div className="avatar">A</div>
              <span className="username">Admin</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
