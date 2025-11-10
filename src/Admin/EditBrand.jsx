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

  useEffect(() => {
    if (!isAdmin || !isAdmin()) {
      alert("❌ Only Admins can access Brand Management");
      navigate("/admin");
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5275/api/Brand", {
        headers: { ...authHeaders },
      });
      if (response.status === 401) throw new Error("Unauthorized: Please login again.");
      if (response.status === 403) throw new Error("Forbidden: Only Admins can access brands.");
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

  // ✅ Handle Delete Brand
  const handleDelete = async (brand) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${brand.brandName}"? This action cannot be undone.`
      )
    )
      return;

    try {
      const response = await fetch(`http://localhost:5275/api/Brand/${brand.brandId}`, {
        method: "DELETE",
        headers: { ...authHeaders },
      });

      if (response.status === 401) throw new Error("Unauthorized: Please login again.");
      if (response.status === 403) throw new Error("Forbidden: Only Admins can delete brands.");
      if (response.status === 409)
        throw new Error("Cannot delete brand: It is being used by existing bikes.");

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

  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <div className="col-12">
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : brands.length === 0 ? (
            <p className="text-center">No brands found</p>
          ) : (
            <div className="row g-4 mt-5">
              {brands.map((brand, index) => (
                <div
                  key={brand.brandId}
                  className="col-lg-4 col-md-6"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="brand-card h-100">
                    <div className="brand-image-container text-center" style={{ height: "200px" }}>
                      <img
                        src={`http://localhost:5275/${brand.brandImage}`}
                        alt={brand.brandName}
                        className="img-fluid h-100"
                        style={{ objectFit: "contain" }}
                      />
                    </div>

                    <div className="brand-content p-4">
                      <h4 className="brand-name fw-bold mb-2">{brand.brandName}</h4>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-outline-warning flex-fill"
                          onClick={() => navigate(`/edit-brand/${brand.brandId}`)}
                        >
                          <i className="fas fa-edit me-1"></i>Edit
                        </button>

                        {/* ✅ Fixed Delete Button */}
                        <button
                          className="btn btn-outline-danger flex-fill"
                          onClick={() => handleDelete(brand)}
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
  );
}

export default BrandManagement;
