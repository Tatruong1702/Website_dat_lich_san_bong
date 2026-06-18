import { useState, useEffect } from "react";
import { PlusOutlined, EditOutlined, DeleteOutlined, LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import "./AdminCategories.css";

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
    image_url: "",
    status: "active",
    display_order: 0,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/api/categories/all");
      setCategories(response.data);
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Lỗi tải danh mục");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingId(category.id);
      setFormData(category);
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        description: "",
        icon: "",
        image_url: "",
        status: "active",
        display_order: 0,
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

    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên danh mục");
      return;
    }

    try {
      if (editingId) {
        await axios.put(`http://localhost:3000/api/categories/${editingId}`, formData);
        alert("Cập nhật danh mục thành công");
      } else {
        await axios.post("http://localhost:3000/api/categories", formData);
        alert("Tạo danh mục thành công");
      }
      handleCloseModal();
      fetchCategories();
    } catch (error) {
      console.error("Lỗi:", error);
      alert(error.response?.data?.error || "Lỗi lưu danh mục");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa danh mục này?")) {
      try {
        await axios.delete(`http://localhost:3000/api/categories/${id}`);
        alert("Xóa danh mục thành công");
        fetchCategories();
      } catch (error) {
        console.error("Lỗi:", error);
        alert(error.response?.data?.error || "Lỗi xóa danh mục");
      }
    }
  };

  return (
    <div className="admin-categories">
      <div className="categories-header">
        <h1>Quản lý Danh mục</h1>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <PlusOutlined /> Thêm danh mục
        </button>
      </div>

      {loading ? (
        <div className="loading">
          <LoadingOutlined /> Đang tải...
        </div>
      ) : (
        <div className="categories-grid">
          {categories.map((category) => (
            <div key={category.id} className="category-card">
              <div className="category-icon">{category.icon}</div>
              <div className="category-info">
                <h3>{category.name}</h3>
                <p className="category-desc">{category.description}</p>
                <div className="category-meta">
                  <span className="field-count">{category.field_count} sân</span>
                  <span className={`status ${category.status}`}>{category.status}</span>
                </div>
              </div>
              <div className="category-actions">
                <button className="btn-edit" onClick={() => handleOpenModal(category)}>
                  <EditOutlined />
                </button>
                <button className="btn-delete" onClick={() => handleDelete(category.id)}>
                  <DeleteOutlined />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingId ? "Cập nhật danh mục" : "Thêm danh mục mới"}</h2>
              <button className="modal-close" onClick={handleCloseModal}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-group">
                <label>Tên danh mục *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nhập tên danh mục"
                />
              </div>

              <div className="form-group">
                <label>Mô tả</label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Nhập mô tả"
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Icon (Emoji)</label>
                  <input
                    type="text"
                    maxLength={2}
                    value={formData.icon || ""}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="⚽"
                  />
                </div>

                <div className="form-group">
                  <label>Thứ tự hiển thị</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>URL hình ảnh</label>
                <input
                  type="url"
                  value={formData.image_url || ""}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="form-group">
                <label>Trạng thái</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="active">Kích hoạt</option>
                  <option value="inactive">Vô hiệu hóa</option>
                </select>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
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

export default AdminCategories;
