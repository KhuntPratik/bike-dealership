import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AOS from "aos";
import "aos/dist/aos.css";
import "../all.css";

function BrandManagement() {
  const navigate = useNavigate();
  const { getToken, isAdmin } = useContext(AuthContext);
  const token = getToken && getToken();
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [formData, setFormData] = useState({
    brandName: "",
    description: "",
    imageFile: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  // Check admin access
  useEffect(() => {
    if (!isAdmin || !isAdmin()) {
      alert("❌ Only Admins can access Brand Management");
      navigate("/admin");
    }
  }, [isAdmin, navigate]);

  // Initialize AOS
  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  // Fetch brands
  const fetchBrands = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5275/api/Brand", {
        headers: { ...authHeaders }
      });
      
      if (response.status === 401) {
        throw new Error("Unauthorized: Please login again.");
      }
      if (response.status === 403) {
        throw new Error("Forbidden: Only Admins can access brands.");
      }
      
      const data = await response.json();
      setBrands(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching brands:", error);
      alert("Error loading brands: " + error.message);
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        imageFile: file
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.brandName.trim()) {
      alert("Brand name is required!");
      return;
    }

    try {
      const url = editingBrand 
        ? `http://localhost:5275/api/Brand/${editingBrand.brandId}`
        : "http://localhost:5275/api/Brand";
      
      const method = editingBrand ? "PUT" : "POST";
      
      // Use FormData for file upload
      const submitData = new FormData();
      submitData.append("BrandName", formData.brandName);
      submitData.append("Description", formData.description || "");
      
      if (formData.imageFile) {
        submitData.append("ImageFile", formData.imageFile);
      }
      
      const response = await fetch(url, {
        method,
        headers: { ...authHeaders }, // Don't set Content-Type for FormData
        body: submitData
      });

      if (response.status === 401) {
        throw new Error("Unauthorized: Please login again.");
      }
      if (response.status === 403) {
        throw new Error("Forbidden: Only Admins can manage brands.");
      }

      if (response.ok) {
        alert(`✅ Brand ${editingBrand ? 'updated' : 'added'} successfully!`);
        setFormData({ brandName: "", description: "", imageFile: null });
        setImagePreview(null);
        setShowAddForm(false);
        setEditingBrand(null);
        fetchBrands();
      } else {
        const errorText = await response.text();
        throw new Error(errorText || `Failed to ${editingBrand ? 'update' : 'add'} brand.`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(`❌ ${error.message}`);
    }
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setFormData({
      brandName: brand.brandName,
      description: brand.description || "",
      imageFile: null
    });
    setImagePreview(brand.imageUrl ? `http://localhost:5275/${brand.imageUrl}` : null);
    setShowAddForm(true);
  };

  const handleDelete = async (brand) => {
    if (!window.confirm(`Are you sure you want to delete "${brand.brandName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5275/api/Brand/${brand.brandId}`, {
        method: "DELETE",
        headers: { ...authHeaders }
      });

      if (response.status === 401) {
        throw new Error("Unauthorized: Please login again.");
      }
      if (response.status === 403) {
        throw new Error("Forbidden: Only Admins can delete brands.");
      }
      if (response.status === 409) {
        throw new Error("Cannot delete brand: It is being used by existing bikes.");
      }

      if (response.ok) {
        alert("✅ Brand deleted successfully!");
        fetchBrands();
      } else {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to delete brand.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert(`❌ ${error.message}`);
    }
  };

  const handleCancel = () => {
    setFormData({ brandName: "", description: "", imageFile: null });
    setImagePreview(null);
    setShowAddForm(false);
    setEditingBrand(null);
  };

  return (
    <>
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
          
          .brand-card {
            position: relative;
            overflow: hidden;
          }
          
          .brand-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s;
          }
          
          .brand-card:hover::before {
            left: 100%;
          }
          
          .upload-area:hover {
            border-color: #667eea !important;
            background-color: #f8f9ff !important;
          }
          
          .brand-image-container img {
            transition: transform 0.3s ease;
          }
          
          .brand-card:hover .brand-image-container img {
            transform: scale(1.05);
          }
        `}
      </style>
      <div className="container-fluid mt-4">
      {/* Header Section */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="brand-header-section text-center py-5" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '20px',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-50%',
              right: '-50%',
              width: '200%',
              height: '200%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
              animation: 'float 6s ease-in-out infinite'
            }}></div>
            <div className="position-relative">
              <h1 className="display-4 fw-bold mb-3">
                <i className="fas fa-tags me-3"></i>Brand Management
              </h1>
              <p className="lead mb-4">Create, manage, and organize your bike brands with style</p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <button
                  className="btn btn-light btn-lg px-4 py-2"
                  onClick={() => setShowAddForm(true)}
                  style={{ borderRadius: '50px' }}
                >
                  <i className="fas fa-plus me-2"></i> Add New Brand
                </button>
                <button
                  className="btn btn-outline-light btn-lg px-4 py-2"
                  onClick={() => navigate("/admin")}
                  style={{ borderRadius: '50px' }}
                >
                  <i className="fas fa-arrow-left me-2"></i> Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="row mb-5" data-aos="fade-up">
          <div className="col-lg-8 mx-auto">
            <div className="card shadow-lg border-0" style={{ borderRadius: '20px' }}>
              <div className="card-header bg-gradient text-white" style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '20px 20px 0 0',
                border: 'none'
              }}>
                <h4 className="m-0 text-center">
                  <i className="fas fa-edit me-2"></i>
                  {editingBrand ? 'Edit Brand' : 'Add New Brand'}
                </h4>
              </div>
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="row g-4">
                    {/* Brand Image Upload */}
                    <div className="col-12">
                      <label className="form-label fw-bold">
                        <i className="fas fa-image me-2"></i>Brand Logo/Image
                      </label>
                      <div className="image-upload-container">
                        <div className="upload-area" style={{
                          border: '2px dashed #dee2e6',
                          borderRadius: '15px',
                          padding: '2rem',
                          textAlign: 'center',
                          backgroundColor: '#f8f9fa',
                          transition: 'all 0.3s ease'
                        }}>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="d-none"
                            id="brandImage"
                          />
                          <label htmlFor="brandImage" className="upload-label" style={{ cursor: 'pointer' }}>
                            {imagePreview ? (
                              <div className="preview-container">
                                <img
                                  src={imagePreview}
                                  alt="Brand Preview"
                                  className="img-fluid rounded"
                                  style={{ maxHeight: '200px', maxWidth: '300px' }}
                                />
                                <div className="mt-3">
                                  <button
                                    type="button"
                                    className="btn btn-outline-primary btn-sm"
                                    onClick={() => document.getElementById('brandImage').click()}
                                  >
                                    <i className="fas fa-edit me-1"></i>Change Image
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <i className="fas fa-cloud-upload-alt text-muted" style={{ fontSize: '3rem' }}></i>
                                <p className="mt-3 mb-0 text-muted">Click to upload brand logo</p>
                                <small className="text-muted">PNG, JPG, GIF up to 10MB</small>
                              </div>
                            )}
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Brand Name */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold">
                        <i className="fas fa-tag me-2"></i>Brand Name *
                      </label>
                      <input
                        type="text"
                        name="brandName"
                        className="form-control form-control-lg"
                        value={formData.brandName}
                        onChange={handleInputChange}
                        placeholder="e.g. Honda, Yamaha, TVS"
                        required
                        style={{ borderRadius: '10px' }}
                      />
                    </div>

                    {/* Description */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold">
                        <i className="fas fa-info-circle me-2"></i>Description
                      </label>
                      <input
                        type="text"
                        name="description"
                        className="form-control form-control-lg"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Optional description"
                        style={{ borderRadius: '10px' }}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="col-12">
                      <div className="d-flex gap-3 justify-content-center">
                        <button 
                          type="submit" 
                          className="btn btn-success btn-lg px-5"
                          style={{ borderRadius: '50px' }}
                        >
                          <i className="fas fa-save me-2"></i>
                          {editingBrand ? 'Update Brand' : 'Add Brand'}
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-lg px-5"
                          onClick={handleCancel}
                          style={{ borderRadius: '50px' }}
                        >
                          <i className="fas fa-times me-2"></i> Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Brands Grid */}
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold">
              <i className="fas fa-tags me-2 text-primary"></i>All Brands
              <span className="badge bg-primary ms-2">{brands.length}</span>
            </h3>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted fs-5">Loading brands...</p>
            </div>
          ) : brands.length === 0 ? (
            <div className="text-center py-5">
              <div className="empty-state">
                <div className="mb-4">
                  <i className="fas fa-tags text-muted" style={{ fontSize: '5rem' }}></i>
                </div>
                <h3 className="text-muted mb-3">No Brands Found</h3>
                <p className="text-muted fs-5 mb-4">Start by adding your first brand to organize your bike inventory.</p>
                <button
                  className="btn btn-primary btn-lg px-4"
                  onClick={() => setShowAddForm(true)}
                  style={{ borderRadius: '50px' }}
                >
                  <i className="fas fa-plus me-2"></i>Add Your First Brand
                </button>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {brands.map((brand, index) => (
                <div key={brand.brandId} className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay={index * 100}>
                  <div className="brand-card h-100" style={{
                    background: 'white',
                    borderRadius: '20px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    border: '1px solid #f0f0f0'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                  }}>
                    {/* Brand Image */}
                    <div className="brand-image-container" style={{
                      height: '200px',
                      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      {brand.imageUrl ? (
                        <img
                          src={`http://localhost:5275/${brand.imageUrl}`}
                          alt={brand.brandName}
                          className="img-fluid"
                          style={{
                            maxHeight: '100%',
                            maxWidth: '100%',
                            objectFit: 'contain'
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div 
                        className="fallback-icon"
                        style={{
                          display: brand.imageUrl ? 'none' : 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '100%',
                          flexDirection: 'column',
                          color: '#6c757d'
                        }}
                      >
                        <i className="fas fa-tags" style={{ fontSize: '3rem' }}></i>
                        <small className="mt-2">No Image</small>
                      </div>
                      
                      {/* Brand ID Badge */}
                      <div className="position-absolute top-0 end-0 m-3">
                        <span className="badge bg-primary" style={{ borderRadius: '20px' }}>
                          #{brand.brandId}
                        </span>
                      </div>
                    </div>

                    {/* Brand Content */}
                    <div className="brand-content p-4">
                      <h4 className="brand-name fw-bold mb-2" style={{ color: '#2c3e50' }}>
                        {brand.brandName}
                      </h4>
                      <p className="brand-description text-muted mb-4" style={{ minHeight: '40px' }}>
                        {brand.description || "No description available"}
                      </p>
                      
                      {/* Action Buttons */}
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-outline-warning flex-fill"
                          onClick={() => handleEdit(brand)}
                          title="Edit Brand"
                          style={{ borderRadius: '10px' }}
                        >
                          <i className="fas fa-edit me-1"></i>Edit
                        </button>
                        <button
                          className="btn btn-outline-danger flex-fill"
                          onClick={() => handleDelete(brand)}
                          title="Delete Brand"
                          style={{ borderRadius: '10px' }}
                        >
                          <i className="fas fa-trash me-1"></i>Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
}

export default BrandManagement;
