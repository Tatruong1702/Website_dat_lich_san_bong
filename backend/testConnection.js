import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  try {
    console.log('🔄 Đang kết nối tới database...');
    console.log('Host:', process.env.DB_HOST);
    console.log('User:', process.env.DB_USER);
    console.log('Database:', process.env.DB_NAME);

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    console.log('\n✅ Kết nối thành công!');

    // Test query
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM categories');
    console.log('📊 Số danh mục:', rows[0].count);

    const [courts] = await connection.query('SELECT COUNT(*) as count FROM courts');
    console.log('⚽ Số sân bóng:', courts[0].count);

    const [users] = await connection.query('SELECT COUNT(*) as count FROM users');
    console.log('👥 Số người dùng:', users[0].count);

    await connection.end();
    console.log('\n✅ Database đã sẵn sàng!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Lỗi kết nối:', error.message);
    console.error('\nGiải pháp:');
    console.error('1. Kiểm tra MySQL đã chạy chưa');
    console.error('2. Kiểm tra .env có thông tin đúng');
    console.error('3. Kiểm tra database "sanbong" đã tồn tại');
    console.error('4. Chạy schema.sql để tạo bảng');
    process.exit(1);
  }
};

testConnection();
