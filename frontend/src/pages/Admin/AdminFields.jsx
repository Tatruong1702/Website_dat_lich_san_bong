import { useState, useEffect } from "react";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LoadingOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import axios from "axios";
import "./AdminFields.css";

function AdminFields() {
  const [fields, setFields] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    category_id: "",
    name: "",
    description: "",
    location: "",
    image_url: "",
    price_per_hour: "",
    capacity: 10,
    length: "",
    width: "",
    surface_type: "grass",
    amenities: "",
    phone_number: "",
    operating_hours_start: "06:00",
    operating_hours_end: "22:00",
    status: "active",
  });

  useEffect(() => {
    fetchFields();
    fetchCategories();
  }, []);

  const fetchFields = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/api/fields");
      setFields(response.data);
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Lỗi tải danh sách sân");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/categories/all",
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  const handleOpenModal = (field = null) => {
    if (field) {
      setEditingId(field.id);
      setFormData({
        category_id: field.category_id,
        name: field.name,
        description: field.description || "",
        location: field.location,
        image_url: field.image_url || "",
        price_per_hour: field.price_per_hour,
        capacity: field.capacity,
        length: field.length || "",
        width: field.width || "",
        surface_type: field.surface_type || "grass",
        amenities: Array.isArray(field.amenities)
          ? field.amenities.join(", ")
          : typeof field.amenities === "string"
            ? field.amenities
            : "",
        phone_number: field.phone_number || "",
        operating_hours_start:
          field.operating_hours_start?.slice(0, 5) || "06:00",
        operating_hours_end: field.operating_hours_end?.slice(0, 5) || "22:00",
        status: field.status,
      });
    } else {
      setEditingId(null);
      setFormData({
        category_id: "",
        name: "",
        description: "",
        location: "",
        image_url: "",
        price_per_hour: "",
        capacity: 10,
        length: "",
        width: "",
        surface_type: "grass",
        amenities: "",
        phone_number: "",
        operating_hours_start: "06:00",
        operating_hours_end: "22:00",
        status: "active",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.category_id ||
      !formData.name.trim() ||
      !formData.location.trim() ||
      !formData.price_per_hour
    ) {
      alert("Vui lòng nhập đầy đủ thông tin bắt buộc");
      return;
    }

    try {
      const amenitiesArray = formData.amenities
        ? formData.amenities
            .split(",")
            .map((a) => a.trim())
            .filter(Boolean)
        : [];

      const submitData = {
        ...formData,
        price_per_hour: parseFloat(formData.price_per_hour),
        capacity: parseInt(formData.capacity),
        length: formData.length ? parseFloat(formData.length) : null,
        width: formData.width ? parseFloat(formData.width) : null,
        amenities: amenitiesArray,
        operating_hours_start: formData.operating_hours_start + ":00",
        operating_hours_end: formData.operating_hours_end + ":00",
      };

      if (editingId) {
        await axios.put(
          `http://localhost:3000/api/fields/${editingId}`,
          submitData,
        );
        alert("Cập nhật sân thành công");
      } else {
        await axios.post("http://localhost:3000/api/fields", submitData);
        alert("Tạo sân thành công");
      }

      handleCloseModal();
      fetchFields();
    } catch (error) {
      console.error("Lỗi:", error);
      alert(error.response?.data?.error || "Lỗi lưu sân");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa sân này?")) {
      try {
        await axios.delete(`http://localhost:3000/api/fields/${id}`);
        alert("Xóa sân thành công");
        fetchFields();
      } catch (error) {
        console.error("Lỗi:", error);
        alert(error.response?.data?.error || "Lỗi xóa sân");
      }
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : "N/A";
  };

  return (
    <div className="admin-fields">
      <div className="fields-header">
        <h1>Quản lý Sân Bóng</h1>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <PlusOutlined /> Thêm sân
        </button>
      </div>

      {loading ? (
        <div className="loading">
          <LoadingOutlined /> Đang tải...
        </div>
      ) : (
        <div className="fields-table">
          <div className="table-header">
            <div className="col-name">Tên sân</div>
            <div className="col-category">Danh mục</div>
            <div className="col-location">Địa điểm</div>
            <div className="col-price">Giá/Giờ</div>
            <div className="col-status">Trạng thái</div>
            <div className="col-views">Lượt xem</div>
            <div className="col-actions">Hành động</div>
          </div>

          {fields.map((field) => (
            <div key={field.id} className="table-row">
              <div className="col-name">
                {field.image_url && (
                  <img
                    src={field.image_url}
                    alt={field.name}
                    className="field-thumb"
                  />
                )}
                <div>
                  <p className="field-name">{field.name}</p>
                </div>
              </div>
              <div className="col-category">
                {getCategoryName(field.category_id)}
              </div>
              <div className="col-location">{field.location}</div>
              <div className="col-price">
                {field.price_per_hour?.toLocaleString() || 0}đ
              </div>
              <div className="col-status">
                <span className={`status-badge ${field.status}`}>
                  {field.status}
                </span>
              </div>
              <div className="col-views">
                <EyeOutlined /> {field.view_count}
              </div>
              <div className="col-actions">
                <button
                  className="btn-icon edit"
                  onClick={() => handleOpenModal(field)}
                >
                  <EditOutlined />
                </button>
                <button
                  className="btn-icon delete"
                  onClick={() => handleDelete(field.id)}
                >
                  <DeleteOutlined />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal modal-lg">
            <div className="modal-header">
              <h2>{editingId ? "Cập nhật sân" : "Thêm sân mới"}</h2>
              <button className="modal-close" onClick={handleCloseModal}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body">
              {/* Form fields */}
              <div className="form-row">
                <div className="form-group">
                  <label>Danh mục *</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category_id: parseInt(e.target.value),
                      })
                    }
                    required
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Tên sân *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Nhập tên sân"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Nhập mô tả sân"
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Địa điểm *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="VD: Khu A"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Giá/Giờ (đ) *</label>
                  <input
                    type="number"
                    value={formData.price_per_hour}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price_per_hour: e.target.value,
                      })
                    }
                    placeholder="150000"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Chiều dài (m)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.length}
                    onChange={(e) =>
                      setFormData({ ...formData, length: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Chiều rộng (m)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.width}
                    onChange={(e) =>
                      setFormData({ ...formData, width: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Mở cửa</label>
                  <input
                    type="time"
                    value={formData.operating_hours_start}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        operating_hours_start: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Đóng cửa</label>
                  <input
                    type="time"
                    value={formData.operating_hours_end}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        operating_hours_end: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Tiện ích (cách nhau bằng dấu phẩy)</label>
                <textarea
                  value={formData.amenities}
                  onChange={(e) =>
                    setFormData({ ...formData, amenities: e.target.value })
                  }
                  placeholder="VD: Bãi đỗ xe, Phòng thay đồ, Nhà vệ sinh"
                  rows={2}
                />
              </div>

              <div className="form-group">
                <label>URL hình ảnh</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) =>
                    setFormData({ ...formData, image_url: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>

              <div className="form-group">
                <label>Trạng thái</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="active">Kích hoạt</option>
                  <option value="inactive">Vô hiệu hóa</option>
                  <option value="maintenance">Bảo trì</option>
                </select>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingId ? "Cập nhật" : "Tạo mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminFields;
