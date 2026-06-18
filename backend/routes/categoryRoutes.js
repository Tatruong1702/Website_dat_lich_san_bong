import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET tất cả danh mục (chỉ active + đếm sân active)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        c.*, 
        COUNT(co.court_id) as field_count
      FROM categories c
      LEFT JOIN courts co 
        ON c.id = co.category_id 
       AND co.status = 'active'
      WHERE c.status = 'active'
      GROUP BY c.id
      ORDER BY c.display_order ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi lấy danh mục' });
  }
});

// GET tất cả danh mục (bao gồm inactive - cho admin)
router.get('/all', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        c.*, 
        COUNT(co.court_id) as field_count
      FROM categories c
      LEFT JOIN courts co ON c.id = co.category_id
      GROUP BY c.id
      ORDER BY c.display_order ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi lấy danh mục' });
  }
});

// GET một danh mục theo ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Danh mục không tồn tại' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi lấy danh mục' });
  }
});

// CREATE danh mục mới
router.post('/', async (req, res) => {
  try {
    const { name, description, image_url, icon, status, display_order } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Tên danh mục là bắt buộc' });
    }

    const [result] = await pool.query(
      'INSERT INTO categories (name, description, image_url, icon, status, display_order) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description || null, image_url || null, icon || null, status || 'active', display_order || 0]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      description,
      image_url,
      icon,
      status,
      display_order,
      message: 'Tạo danh mục thành công'
    });
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Tên danh mục đã tồn tại' });
    }
    res.status(500).json({ error: 'Lỗi tạo danh mục' });
  }
});

// UPDATE danh mục
router.put('/:id', async (req, res) => {
  try {
    const { name, description, image_url, icon, status, display_order } = req.body;

    const [check] = await pool.query('SELECT * FROM categories WHERE id = ?', [req.params.id]);
    if (check.length === 0) {
      return res.status(404).json({ error: 'Danh mục không tồn tại' });
    }

    const updateFields = [];
    const updateValues = [];

    if (name !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (image_url !== undefined) {
      updateFields.push('image_url = ?');
      updateValues.push(image_url);
    }
    if (icon !== undefined) {
      updateFields.push('icon = ?');
      updateValues.push(icon);
    }
    if (status !== undefined) {
      updateFields.push('status = ?');
      updateValues.push(status);
    }
    if (display_order !== undefined) {
      updateFields.push('display_order = ?');
      updateValues.push(display_order);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'Không có dữ liệu để cập nhật' });
    }

    updateValues.push(req.params.id);

    await pool.query(
      `UPDATE categories SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({ message: 'Cập nhật danh mục thành công' });
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Tên danh mục đã tồn tại' });
    }
    res.status(500).json({ error: 'Lỗi cập nhật danh mục' });
  }
});

// DELETE danh mục
router.delete('/:id', async (req, res) => {
  try {
    const [check] = await pool.query('SELECT * FROM categories WHERE id = ?', [req.params.id]);
    if (check.length === 0) {
      return res.status(404).json({ error: 'Danh mục không tồn tại' });
    }

    // Check nếu có sân liên kết
    const [fieldsCheck] = await pool.query('SELECT COUNT(*) as count FROM courts WHERE category_id = ?', [req.params.id]);
    if (fieldsCheck[0].count > 0) {
      return res.status(400).json({ error: 'Không thể xóa danh mục có sân liên kết' });
    }

    await pool.query('DELETE FROM categories WHERE id = ?', [req.params.id]);

    res.json({ message: 'Xóa danh mục thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi xóa danh mục' });
  }
});

export default router;