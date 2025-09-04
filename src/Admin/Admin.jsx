import React, { useState, useEffect, useContext } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "../all.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Admin() {
  const navigate = useNavigate();
  const { getToken } = useContext(AuthContext);
  const token = getToken && getToken();
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
  const [bike, setBike] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({ totalRecords: 0, totalAmount: 0 });
    const [bookingsummary, setBookingSummary] = useState({ totalRecords: 0,totalSum:0});


  // Pagination removed: show all bikes

 const fetchAvailableBikes = async () => {
    // setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5275/api/Bike/available");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const result = await res.json();
      console.log("📌 API Response:", result);

      const bikes = Array.isArray(result)
        ? result
        : Array.isArray(result.bikes)
        ? result.bikes
        : Array.isArray(result.data)
        ? result.data
        : [];

      setBike(bikes);
      // setFilteredData([]);
    } catch (error) {
      console.error("❌ Error fetching available bikes:", error);
      setBike([]);
    } finally {
      // setIsLoading(false);
    }
  };

  const fetchSummary = () => {
    fetch("http://localhost:5275/api/Bike/summary", { headers: { ...authHeaders } })
      .then((res) => res.json())
      .then((res) => setSummary(res || { totalRecords: 0, totalAmount: 0 }))
      .catch((err) => console.error("Summary fetch error:", err));
  };

  const fetchBookingSummary = () =>{
    fetch("http://localhost:5275/api/Booking/summary", { headers: { ...authHeaders } })
      .then((res) => res.json())
      .then((res) => setBookingSummary(res || { totalRecords: 0,totalSum:0}))
      .catch((err) => console.error("Summary fetch error:", err));
  }


  useEffect(() => {
   fetchAvailableBikes();
    fetchSummary();
    fetchBookingSummary();
  }, []);

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const handleDelete = (bike) => {
    if (!window.confirm(`Are you sure you want to delete ${bike.bikeName}?`))
      return;

    fetch(`http://localhost:5275/api/Bike/${bike.bikeId}`, {
      method: "DELETE",
      headers: { ...authHeaders }
    })
      .then((res) => {
        if (res.status === 401) {
          throw new Error("Unauthorized: Please login again.");
        }
        if (res.status === 403) {
          throw new Error("Forbidden: Only Admins can delete bikes.");
        }
        if (res.ok) {
          setData((prev) => prev.filter((b) => b.bikeId !== bike.bikeId));
          alert("Bike deleted successfully");
        } else {
          throw new Error("Failed to delete bike");
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
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(num);
    } catch {
      return `₹${num}`;
    }
  };



  return (
    <>
      <section className="py-5 mt-5 admin-dashboard">
        <div className="container-fluid mt-4">
          {/* Header */}
          <div className="row align-items-center mb-4">
            <div className="col-12 d-flex justify-content-between flex-wrap gap-3">
              <div>
                <h2 className="admin-title m-0">
                  <i className="fas fa-tachometer-alt me-2"></i> Admin Dashboard
                </h2>
                <p className="text-muted m-0">
                  Manage inventory, monitor key metrics, and perform quick
                  actions
                </p>
              </div>
              <div className="quick-actions d-flex gap-2">
                <button
                  className="btn btn-success"
                  onClick={() => navigate("/postbike")}
                >
                  <i className="fas fa-plus me-2"></i> Add Bike
                </button>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => navigate("/product")}
                >
                  <i className="fas fa-motorcycle me-2"></i> View All Bikes
                </button>
                 <button
                  className="btn btn-outline-primary"
                  onClick={() => navigate("/BookingManagement")}
                >
                  <i className="fas fa-motorcycle me-2"></i> BookingManagement
                </button>


              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="row g-3 mb-4">
            <div className="col-sm-6 col-lg-3">
              <div className="stat-card">
                <div className="stat-icon bg-primary-subtle text-primary">
                  <i className="fas fa-warehouse"></i>
                </div>
                <div className="stat-content">
                  <div className="stat-label">Total Bikes</div>
                  <div className="stat-value">{summary.totalRecords}</div>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="stat-card">
                <div className="stat-icon bg-success-subtle text-success">
                  <i className="fas fa-rupee-sign"></i>
                </div>
                <div className="stat-content">
                  <div className="stat-label">Total Amount</div>
                  <div className="stat-value">
                    {formatCurrency(summary.totalAmount || 0)}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="stat-card">
                <div className="stat-icon bg-info-subtle text-info">
                  <i className="fas fa-calendar-check"></i>
                </div>
                 <div className="stat-content">
                  <div className="stat-label">Bookings Bikes Amout</div>
                   <div className="stat-value">
                    {formatCurrency(bookingsummary.totalSum || 0)}
                    </div>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="stat-card">
                <div className="stat-icon bg-warning-subtle text-warning">
                  <i className="fas fa-motorcycle"></i>
                </div>
                <div className="stat-content">
                  <div className="stat-label">TotalBikes in Bookings</div>
                   <div className="stat-value">
                    {formatCurrency(bookingsummary.totalRecords || 0)}
                    </div>
                </div>
              </div>
            </div>
          </div>

          {/* Inventory Grid */}
          <div className="row mt-4">
            <div className="col-12 d-flex justify-content-between align-items-center mb-2">
              <h5 className="m-0">
                <i className="fas fa-boxes me-2"></i>Inventory
              </h5>
              <small className="text-muted">
                Manage your full bike list below
              </small>
            </div>
            {bike.map((bike, index) => (
              <div className="col-md-4" key={bike?.bikeId ?? index}>
                <div className="bike-card shadow rounded p-3">
                  <div className="bike-image">
                    <img
                      src={bike.imageUrl1}
                      alt={bike?.bikeName || "Bike"}
                      className="img-fluid rounded"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  </div>
                  <div className="bike-details mt-3">
                    <h3 className="bike-title">{bike?.bikeName || "Unnamed Bike"}</h3>
                    <div className="bike-price fw-bold">
                      {formatCurrency(Number(bike?.price) || 0)}
                    </div>
                    <div className="bike-features mt-2">
                      <div className="bike-feature">
                        <i className="fas fa-calendar me-2"></i>
                        <span>{bike?.model ?? "N/A"}</span>
                      </div>
                      <div className="bike-feature">
                        <i className="fas fa-road me-2"></i>
                        <span>{(bike?.km ?? 0)} km</span>
                      </div>
                      <div className="bike-feature">
                        <i className="fas fa-gas-pump me-2"></i>
                        <span>{bike?.fuel ?? "N/A"}</span>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between mt-4">
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => bike?.bikeId && navigate(`/product/${bike.bikeId}`)}
                      >
                        View
                      </button>
                      <button
                        className="btn btn-warning"
                        onClick={() => bike?.bikeId && navigate(`/edit-bike/${bike.bikeId}`)}
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



          {/* Pagination removed */}
        </div>
      </section>
    </>
  );
}

export default Admin;
