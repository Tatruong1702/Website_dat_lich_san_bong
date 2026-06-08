import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET tất cả sản phẩm
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi lấy sản phẩm' });  
  }
});


export default router;