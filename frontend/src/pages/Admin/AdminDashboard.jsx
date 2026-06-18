import {
  BarChartOutlined,
  UserOutlined,
  EnvironmentOutlined,
  ArrowUpOutlined,
  CalendarOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import "./AdminDashboard.css";

function AdminDashboard() {
  const stats = [
    {
      title: "Tổng sân",
      value: "24",
      icon: EnvironmentOutlined,
      color: "#3b82f6",
      bgColor: "#eff6ff",
    },
    {
      title: "Người dùng",
      value: "156",
      icon: UserOutlined,
      color: "#10b981",
      bgColor: "#ecfdf5",
    },
    {
      title: "Đặt hôm nay",
      value: "12",
      icon: CalendarOutlined,
      color: "#f59e0b",
      bgColor: "#fffbeb",
    },
    {
      title: "Doanh thu tháng",
      value: "15.5M",
      icon: DollarOutlined,
      color: "#8b5cf6",
      bgColor: "#faf5ff",
    },
  ];

  const recentBookings = [
    {
      id: 1,
      user: "Nguyễn Văn A",
      field: "Sân 1 - Khu A",
      date: "17/06/2024",
      time: "14:00 - 16:00",
      status: "Đã xác nhận",
    },
    {
      id: 2,
      user: "Trần Thị B",
      field: "Sân 3 - Khu B",
      date: "17/06/2024",
      time: "16:00 - 18:00",
      status: "Chờ xác nhận",
    },
    {
      id: 3,
      user: "Lê Văn C",
      field: "Sân 2 - Khu A",
      date: "18/06/2024",
      time: "10:00 - 12:00",
      status: "Đã xác nhận",
    },
    {
      id: 4,
      user: "Phạm Thị D",
      field: "Sân 4 - Khu C",
      date: "18/06/2024",
      time: "18:00 - 20:00",
      status: "Đã hủy",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Đã xác nhận":
        return "#10b981";
      case "Chờ xác nhận":
        return "#f59e0b";
      case "Đã hủy":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Chào mừng bạn trở lại! Đây là tổng quan của hệ thống.</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.title} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: stat.bgColor }}>
              <stat.icon style={{ color: stat.color, fontSize: "24px" }} />
            </div>
            <div className="stat-info">
              <p className="stat-label">{stat.title}</p>
              <h3 className="stat-value">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="recent-bookings">
        <div className="section-header">
          <h2>Đặt lịch gần đây</h2>
          <a href="/admin/bookings" className="view-all">
            Xem tất cả →
          </a>
        </div>

        <div className="bookings-table">
          <div className="table-header">
            <div className="col-user">Người dùng</div>
            <div className="col-field">Sân</div>
            <div className="col-date">Ngày</div>
            <div className="col-time">Thời gian</div>
            <div className="col-status">Trạng thái</div>
          </div>

          {recentBookings.map((booking) => (
            <div key={booking.id} className="table-row">
              <div className="col-user">
                <div className="user-avatar">{booking.user[0]}</div>
                <span>{booking.user}</span>
              </div>
              <div className="col-field">{booking.field}</div>
              <div className="col-date">{booking.date}</div>
              <div className="col-time">{booking.time}</div>
              <div className="col-status">
                <span
                  className="status-badge"
                  style={{
                    borderColor: getStatusColor(booking.status),
                    color: getStatusColor(booking.status)
                  }}
                >
                  {booking.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <div className="section-header">
          <h2>Hành động nhanh</h2>
        </div>
        <div className="actions-grid">
          <button className="action-btn primary">
            <EnvironmentOutlined />
            Thêm sân mới
          </button>
          <button className="action-btn secondary">
            <UserOutlined />
            Quản lý người dùng
          </button>
          <button className="action-btn secondary">
            <BarChartOutlined />
            Xem báo cáo
          </button>
          <button className="action-btn secondary">
            <ArrowUpOutlined />
            Phân tích thống kê
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
