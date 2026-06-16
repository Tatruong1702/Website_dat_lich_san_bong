export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.bottom}>
        <div style={styles.bottomContent}>
          <p>
            © 2026 <strong>Passion Team</strong> - Nền tảng đặt sân bóng rổ trực
            tuyến. All Rights Reserved.
          </p>

          <div style={styles.legalLinks}>
            <a href="/privacy" style={styles.legalLink}>
              Chính sách bảo mật
            </a>
            <span style={styles.separator}>•</span>

            <a href="/terms" style={styles.legalLink}>
              Điều khoản dịch vụ
            </a>
            <span style={styles.separator}>•</span>

            <a href="/refund" style={styles.legalLink}>
              Chính sách hoàn tiền
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: "#f8fafc",
    color: "#1e2937",
    marginTop: "60px",
    paddingTop: "50px",
  },

  bottom: {
    borderTop: "1px solid #e2e8f0",
    background: "#f1f5f9",
    padding: "22px 20px",
  },

  bottomContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    fontSize: "13.5px",
    color: "#64748b",
    textAlign: "center",
  },

  legalLinks: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  legalLink: {
    color: "#64748b",
    textDecoration: "none",
  },

  separator: {
    color: "#cbd5e1",
    margin: "0 6px",
  },
};