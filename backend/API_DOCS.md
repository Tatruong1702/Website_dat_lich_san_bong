# API Endpoints - Quản lý Danh mục & Sân Bóng Rổ

## DANH MỤC (Categories) - Bóng Rổ

**Danh mục có sẵn:**
- Sân 3x3 - Sân bóng rổ nửa sân 🏀
- Sân 5x5 - Sân bóng rổ tiêu chuẩn 🏀
- Sân trong nhà - Có mái che, điều hòa 🏢
- Sân ngoài trời - Sân mở ngoài trời ☀️
- Sân thi đấu - Đạt tiêu chuẩn tổ chức giải 🏆
- Sân tập luyện - Dành cho tập cá nhân, đội nhóm 💪

### GET /api/categories
Lấy tất cả danh mục (chỉ active)
```bash
curl http://localhost:3000/api/categories
```

### GET /api/categories/all
Lấy tất cả danh mục bao gồm inactive (cho admin)
```bash
curl http://localhost:3000/api/categories/all
```

### GET /api/categories/:id
Lấy chi tiết một danh mục
```bash
curl http://localhost:3000/api/categories/1
```

### POST /api/categories
Tạo danh mục mới
```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sân bóng đá",
    "description": "Các sân chơi bóng đá",
    "icon": "⚽",
    "image_url": "https://...",
    "status": "active",
    "display_order": 1
  }'
```

### PUT /api/categories/:id
Cập nhật danh mục
```bash
curl -X PUT http://localhost:3000/api/categories/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sân bóng đá mới",
    "status": "active"
  }'
```

### DELETE /api/categories/:id
Xóa danh mục
```bash
curl -X DELETE http://localhost:3000/api/categories/1
```

---

## SÂN BÓNG (Fields)

### GET /api/fields
Lấy tất cả sân (có lọc và sort)
```bash
# Cơ bản
curl http://localhost:3000/api/fields

# Lọc theo danh mục
curl http://localhost:3000/api/fields?category_id=1

# Lọc theo status
curl http://localhost:3000/api/fields?status=active

# Sort theo popular (lượt xem)
curl http://localhost:3000/api/fields?sort=popular

# Sort theo highest_rated
curl http://localhost:3000/api/fields?sort=highest_rated

# Sort theo price_low (giá thấp đến cao)
curl http://localhost:3000/api/fields?sort=price_low

# Sort theo price_high (giá cao đến thấp)
curl http://localhost:3000/api/fields?sort=price_high

# Kết hợp
curl http://localhost:3000/api/fields?category_id=1&sort=price_low
```

### GET /api/fields/:id
Lấy chi tiết một sân (tự động tăng view_count)
```bash
curl http://localhost:3000/api/fields/1
```

### GET /api/fields/category/:category_id
Lấy tất cả sân của một danh mục
```bash
curl http://localhost:3000/api/fields/category/1
```

### GET /api/fields/search
Tìm kiếm sân
```bash
# Tìm theo keyword
curl "http://localhost:3000/api/fields/search?keyword=sân%20bóng"

# Lọc theo category
curl "http://localhost:3000/api/fields/search?keyword=sân&category_id=1"

# Lọc theo giá
curl "http://localhost:3000/api/fields/search?min_price=100000&max_price=200000"

# Kết hợp
curl "http://localhost:3000/api/fields/search?keyword=sân&category_id=1&min_price=100000&max_price=200000"
```

### POST /api/fields
Tạo sân mới
```bash
curl -X POST http://localhost:3000/api/fields \
  -H "Content-Type: application/json" \
  -d '{
    "category_id": 1,
    "name": "Sân bóng đá 3",
    "description": "Sân bóng đá chất lượng cao",
    "location": "Khu D",
    "address": "123 Đường ABC",
    "image_url": "https://...",
    "price_per_hour": 150000,
    "capacity": 20,
    "length": 105,
    "width": 68,
    "surface_type": "synthetic",
    "amenities": ["Bãi đỗ xe", "Phòng thay đồ", "Nhà vệ sinh"],
    "phone_number": "0901234567",
    "operating_hours_start": "06:00:00",
    "operating_hours_end": "22:00:00",
    "status": "active"
  }'
```

### PUT /api/fields/:id
Cập nhật sân
```bash
curl -X PUT http://localhost:3000/api/fields/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sân bóng đá 1 - Cập nhật",
    "price_per_hour": 160000,
    "status": "maintenance"
  }'
```

### DELETE /api/fields/:id
Xóa sân
```bash
curl -X DELETE http://localhost:3000/api/fields/1
```

---

## Cấu trúc dữ liệu

### Category
```json
{
  "id": 1,
  "name": "Sân bóng đá",
  "description": "Các sân chơi bóng đá",
  "image_url": "https://...",
  "icon": "⚽",
  "status": "active",
  "display_order": 1,
  "field_count": 5,
  "created_at": "2024-06-17T10:30:00Z",
  "updated_at": "2024-06-17T10:30:00Z"
}
```

### Field
```json
{
  "id": 1,
  "category_id": 1,
  "category_name": "Sân bóng đá",
  "name": "Sân bóng đá 1",
  "description": "Sân bóng đá chất lượng cao",
  "location": "Khu A",
  "address": "123 Đường Lê Lợi",
  "image_url": "https://...",
  "price_per_hour": 150000,
  "capacity": 20,
  "length": 105,
  "width": 68,
  "surface_type": "synthetic",
  "amenities": ["Bãi đỗ xe", "Phòng thay đồ"],
  "phone_number": "0901234567",
  "operating_hours_start": "06:00:00",
  "operating_hours_end": "22:00:00",
  "is_available": true,
  "rating": 4.5,
  "total_reviews": 12,
  "view_count": 156,
  "status": "active",
  "created_at": "2024-06-17T10:30:00Z",
  "updated_at": "2024-06-17T10:30:00Z"
}
```

---

## Cách setup database

1. Mở MySQL/MariaDB client
2. Chạy file schema.sql:
```sql
source backend/schema.sql
```

Hoặc copy toàn bộ SQL từ `backend/schema.sql` và chạy trong MySQL workbench
