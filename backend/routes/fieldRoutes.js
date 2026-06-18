import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET tất cả sân (kèm category)
router.get('/', async (req, res) => {
  try {
    const { category_id, status, sort } = req.query;
    let query = `
      SELECT c.court_id as id, c.court_name as name, c.sport_type, c.price_per_hour,
             c.image as image_url, c.status, c.category_id, c.description, c.location,
             c.capacity, c.length, c.width, c.surface_type, c.amenities,
             c.phone_number, c.operating_hours_start, c.operating_hours_end,
             c.is_available, c.rating, c.total_reviews, c.view_count,
             c.created_at, c.updated_at, cat.name as category_name
      FROM courts c
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE 1=1
    `;
    const params = [];

    if (category_id) {
      query += ' AND c.category_id = ?';
      params.push(category_id);
    }

    if (status) {
      query += ' AND c.status = ?';
      params.push(status);
    } else {
      query += ' AND c.status = "active"';
    }

    // Sort options
    if (sort === 'popular') {
      query += ' ORDER BY c.view_count DESC';
    } else if (sort === 'highest_rated') {
      query += ' ORDER BY c.rating DESC';
    } else if (sort === 'price_low') {
      query += ' ORDER BY c.price_per_hour ASC';
    } else if (sort === 'price_high') {
      query += ' ORDER BY c.price_per_hour DESC';
    } else {
      query += ' ORDER BY c.created_at DESC';
    }

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi lấy danh sách sân' });
  }
});

// GET một sân theo ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.court_id as id, c.court_name as name, c.sport_type, c.price_per_hour,
             c.image as image_url, c.status, c.category_id, c.description, c.location,
             c.capacity, c.length, c.width, c.surface_type, c.amenities,
             c.phone_number, c.operating_hours_start, c.operating_hours_end,
             c.is_available, c.rating, c.total_reviews, c.view_count,
             c.created_at, c.updated_at, cat.name as category_name
      FROM courts c
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE c.court_id = ?
    `, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Sân không tồn tại' });
    }

    // Parse JSON amenities
    if (rows[0].amenities) {
      rows[0].amenities = JSON.parse(rows[0].amenities);
    }

    // Increase view count
    await pool.query('UPDATE courts SET view_count = view_count + 1 WHERE court_id = ?', [req.params.id]);

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi lấy thông tin sân' });
  }
});

// CREATE sân mới
router.post('/', async (req, res) => {
  try {
    const {
      category_id, name, description, location, image_url,
      price_per_hour, capacity, length, width, surface_type,
      amenities, phone_number, operating_hours_start, operating_hours_end, status
    } = req.body;

    // Validation
    if (!category_id || !name || !location || !price_per_hour) {
      return res.status(400).json({ error: 'Thông tin sân không đầy đủ' });
    }

    // Check category exists
    const [categoryCheck] = await pool.query('SELECT * FROM categories WHERE id = ?', [category_id]);
    if (categoryCheck.length === 0) {
      return res.status(400).json({ error: 'Danh mục không tồn tại' });
    }

    const amenitiesJson = amenities ? JSON.stringify(amenities) : null;

    const [result] = await pool.query(
      `INSERT INTO courts (
        category_id, court_name, description, location, image,
        price_per_hour, capacity, length, width, surface_type,
        amenities, phone_number, operating_hours_start, operating_hours_end, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        category_id, name, description || null, location, image_url || null,
        price_per_hour, capacity || 10, length || null, width || null, surface_type || 'grass',
        amenitiesJson, phone_number || null, operating_hours_start || null, operating_hours_end || null,
        status || 'active'
      ]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      category_id,
      message: 'Tạo sân thành công'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi tạo sân' });
  }
});

// UPDATE sân
router.put('/:id', async (req, res) => {
  try {
    const [check] = await pool.query('SELECT * FROM courts WHERE court_id = ?', [req.params.id]);
    if (check.length === 0) {
      return res.status(404).json({ error: 'Sân không tồn tại' });
    }

    const {
      name, description, location, image_url,
      price_per_hour, capacity, length, width, surface_type,
      amenities, phone_number, operating_hours_start, operating_hours_end, status
    } = req.body;

    const updateFields = [];
    const updateValues = [];

    const fieldsMap = {
      name: 'court_name',
      description: 'description',
      location: 'location',
      image_url: 'image',
      price_per_hour: 'price_per_hour',
      capacity: 'capacity',
      length: 'length',
      width: 'width',
      surface_type: 'surface_type',
      phone_number: 'phone_number',
      operating_hours_start: 'operating_hours_start',
      operating_hours_end: 'operating_hours_end',
      status: 'status'
    };

    for (const [key, dbColumn] of Object.entries(fieldsMap)) {
      if (req.body[key] !== undefined) {
        updateFields.push(`${dbColumn} = ?`);
        updateValues.push(req.body[key]);
      }
    }

    if (amenities !== undefined) {
      updateFields.push('amenities = ?');
      updateValues.push(JSON.stringify(amenities));
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'Không có dữ liệu để cập nhật' });
    }

    updateValues.push(req.params.id);

    await pool.query(
      `UPDATE courts SET ${updateFields.join(', ')} WHERE court_id = ?`,
      updateValues
    );

    res.json({ message: 'Cập nhật sân thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi cập nhật sân' });
  }
});

// DELETE sân
router.delete('/:id', async (req, res) => {
  try {
    const [check] = await pool.query('SELECT * FROM courts WHERE court_id = ?', [req.params.id]);
    if (check.length === 0) {
      return res.status(404).json({ error: 'Sân không tồn tại' });
    }

    await pool.query('DELETE FROM courts WHERE court_id = ?', [req.params.id]);

    res.json({ message: 'Xóa sân thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi xóa sân' });
  }
});

// GET sân theo danh mục
router.get('/category/:category_id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.court_id as id, c.court_name as name, c.sport_type, c.price_per_hour,
             c.image as image_url, c.status, c.category_id, c.description, c.location,
             cat.name as category_name
      FROM courts c
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE c.category_id = ? AND c.status = 'active'
      ORDER BY c.created_at DESC
    `, [req.params.category_id]);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi lấy danh sách sân' });
  }
});

// Search sân
router.get('/search', async (req, res) => {
  try {
    const { keyword, category_id, min_price, max_price } = req.query;
    let query = `SELECT c.court_id as id, c.court_name as name, c.sport_type, c.price_per_hour,
                   c.image as image_url, c.status, c.category_id, c.description, c.location,
                   cat.name as category_name
                 FROM courts c
                 LEFT JOIN categories cat ON c.category_id = cat.id
                 WHERE c.status = 'active'`;
    const params = [];

    if (keyword) {
      query += ' AND (c.court_name LIKE ? OR c.description LIKE ? OR c.location LIKE ?)';
      const searchTerm = `%${keyword}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (category_id) {
      query += ' AND c.category_id = ?';
      params.push(category_id);
    }

    if (min_price) {
      query += ' AND c.price_per_hour >= ?';
      params.push(min_price);
    }

    if (max_price) {
      query += ' AND c.price_per_hour <= ?';
      params.push(max_price);
    }

    query += ' ORDER BY c.created_at DESC';

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi tìm kiếm sân' });
  }
});

export default router;
