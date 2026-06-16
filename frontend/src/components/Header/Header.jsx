export default function Header() {
  return (
    <header style={styles.header}>
      <div style={styles.headerInner}>
        <div style={styles.logo}>
          <i className="ti ti-basket"></i> Passion Team
        </div>
        <nav style={styles.navLinks}>
          <a href="#" style={styles.link}>Trang chủ</a>
          <a href="#" style={styles.link}>Sân bóng</a>
          <a href="#" style={styles.link}>Đặt lịch của tôi</a>
          <a href="#" style={styles.link}>Liên hệ</a>
        </nav>
        <button style={styles.headerCta}>Đăng nhập</button>
      </div>
    </header>
  );
}

const styles = {
  header: {
    background: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  headerInner: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '14px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#ea580c',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  navLinks: {
    display: 'flex',
    gap: '28px',
    fontSize: '15px',
    color: '#6b7280',
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
  },
  headerCta: {
    background: '#ea580c',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
};