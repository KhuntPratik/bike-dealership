import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "../all.css";
import { useNavigate } from "react-router-dom";

function Admin() {
  const navigate = useNavigate();
  const url = "http://localhost:5275/api/Bike";
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBikes = () => {
    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        console.log("Fetched bikes:", res);
        setData(res || []);
      })
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBikes();
  }, []);

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const handleDelete = (bike) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${bike.bikeName}?`
    );
    if (!confirmDelete) return;

    fetch(`http://localhost:5275/api/Bike/${bike.bikeId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          setData((prevData) => prevData.filter((b) => b.bikeId !== bike.bikeId));
          alert("Bike deleted successfully");
        } else {
          return res.text().then((text) => {
            throw new Error(text || "Failed to delete bike");
          });
        }
      })
      .catch((err) => {
        console.error("Delete error:", err);
        alert("Error deleting bike: " + err.message);
      });
  };

  const formatCurrency = (num) => {
    if (!num && num !== 0) return "-";
    try {
      return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(num);
    } catch {
      return `₹${num}`;
    }
  };

  // Derived metrics
  const totalBikes = data.length;
  const totalValue = data.reduce((sum, b) => sum + (Number(b.price) || 0), 0);
  const avgPrice = totalBikes ? Math.round(totalValue / totalBikes) : 0;
  const distinctModels = new Set(data.map((b) => b.model)).size;
  const fuelCounts = data.reduce((acc, b) => {
    const key = (b.fuel || "Unknown").toString();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const topFuel = Object.keys(fuelCounts).length
    ? Object.entries(fuelCounts).sort((a, b) => b[1] - a[1])[0][0]
    : "N/A";
  const recentBikes = data.slice(0, 5);

  return (
    <>
      <section className="py-5 mt-5 admin-dashboard">
        <div className="container-fluid mt-4">
          {/* Header */}
          <div className="row align-items-center mb-4" data-aos="fade-up">
            <div className="col-12 d-flex justify-content-between flex-wrap gap-3">
              <div>
                <h2 className="admin-title m-0">
                  <i className="fas fa-tachometer-alt me-2"></i> Admin Dashboard
                </h2>
                <p className="text-muted m-0">Manage inventory, monitor key metrics, and perform quick actions</p>
              </div>
              <div className="quick-actions d-flex gap-2">
                <button className="btn btn-success" onClick={() => navigate("/postbike")}>
                  <i className="fas fa-plus me-2"></i> Add Bike
                </button>
                <button className="btn btn-outline-primary" onClick={() => navigate("/product")}>
                  <i className="fas fa-motorcycle me-2"></i> View All Bikes
                </button>
                <button className="btn btn-outline-secondary" onClick={fetchBikes} disabled={loading}>
                  <i className="fas fa-sync-alt me-2"></i> {loading ? "Refreshing..." : "Refresh"}
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="row g-3 stats-grid" data-aos="fade-up">
            <div className="col-sm-6 col-lg-3">
              <div className="stat-card">
                <div className="stat-icon bg-primary-subtle text-primary">
                  <i className="fas fa-warehouse"></i>
                </div>
                <div className="stat-content">
                  <div className="stat-label">Total Bikes</div>
                  <div className="stat-value">{totalBikes}</div>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="stat-card">
                <div className="stat-icon bg-success-subtle text-success">
                  <i className="fas fa-rupee-sign"></i>
                </div>
                <div className="stat-content">
                  <div className="stat-label">Avg. Price</div>
                  <div className="stat-value">{formatCurrency(avgPrice)}</div>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="stat-card">
                <div className="stat-icon bg-warning-subtle text-warning">
                  <i className="fas fa-th-large"></i>
                </div>
                <div className="stat-content">
                  <div className="stat-label">Different Models</div>
                  <div className="stat-value">{distinctModels}</div>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="stat-card">
                <div className="stat-icon bg-info-subtle text-info">
                  <i className="fas fa-gas-pump"></i>
                </div>
                <div className="stat-content">
                  <div className="stat-label">Top Fuel</div>
                  <div className="stat-value">{topFuel}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Bikes Table */}
          <div className="row mt-4" data-aos="fade-up">
            <div className="col-12">
              <div className="card table-card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="m-0"><i className="fas fa-clock me-2"></i>Recent Bikes</h5>
                  <button className="btn btn-sm btn-outline-primary" onClick={() => navigate("/product")}>
                    See all
                  </button>
                </div>
                <div className="table-responsive">
                  <table className="table align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Bike</th>
                        <th>Model</th>
                        <th>Fuel</th>
                        <th>KM</th>
                        <th className="text-end">Price</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBikes.length === 0 && (
                        <tr>
                          <td colSpan="6" className="text-center text-muted py-4">No data available</td>
                        </tr>
                      )}
                      {recentBikes.map((b, idx) => (
                        <tr key={idx}>
                          <td className="d-flex align-items-center gap-2">
                            <img src={b.imageUrl1} alt={b.bikeName} className="table-thumb rounded" />
                            <div>
                              <div className="fw-semibold">{b.bikeName}</div>
                              <small className="text-muted">ID: {b.bikeId}</small>
                            </div>
                          </td>
                          <td>{b.model}</td>
                          <td>
                            <span className="chip">{b.fuel || "-"}</span>
                          </td>
                          <td>{b.km}</td>
                          <td className="text-end">{formatCurrency(Number(b.price) || 0)}</td>
                          <td className="text-end">
                            <div className="btn-group">
                              <button className="btn btn-sm btn-outline-primary" onClick={() => navigate(`/product/${b.bikeId}`)}>
                                View
                              </button>
                              <button className="btn btn-sm btn-warning" onClick={() => navigate(`/edit-bike/${b.bikeId}`)}>
                                Edit
                              </button>
                              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(b)}>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Inventory Grid */}
          <div className="row mt-4" data-aos="fade-up">
            <div className="col-12 d-flex justify-content-between align-items-center mb-2">
              <h5 className="m-0"><i className="fas fa-boxes me-2"></i>Inventory</h5>
              <small className="text-muted">Manage your full bike list below</small>
            </div>
            {data.map((bike, index) => (
              <div
                className="col-md-4"
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 50}
              >
                <div className="bike-card shadow rounded p-3">
                  <div className="bike-image">
                    <img
                      src={bike.imageUrl1}
                      alt={bike.bikeName}
                      className="img-fluid rounded"
                    />
                  </div>
                  <div className="bike-details mt-3">
                    <h3 className="bike-title">{bike.bikeName}</h3>
                    <div className="bike-price fw-bold">{formatCurrency(Number(bike.price) || 0)}</div>
                    <div className="bike-features mt-2">
                      <div className="bike-feature">
                        <i className="fas fa-calendar me-2"></i>
                        <span>{bike.model}</span>
                      </div>
                      <div className="bike-feature">
                        <i className="fas fa-road me-2"></i>
                        <span>{bike.km} km</span>
                      </div>
                      <div className="bike-feature">
                        <i className="fas fa-gas-pump me-2"></i>
                        <span>{bike.fuel}</span>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between mt-4">
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => navigate(`/product/${bike.bikeId}`)}
                      >
                        View
                      </button>
                      <button
                        className="btn btn-warning"
                        onClick={() => navigate(`/edit-bike/${bike.bikeId}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(bike)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Admin;