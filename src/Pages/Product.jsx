import React, { useState, useEffect, useContext } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "../all.css";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";


function Product() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getUserInfo } = useContext(AuthContext);
  const userInfo = getUserInfo();

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [brand, setBrand] = useState("");
  const [bikeName, setBikeName] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [brands, setBrands] = useState([]);
  const [sortOrder, setSortOrder] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success"); // success | error | warning | info


  // Fetch wishlist items from API
  useEffect(() => {
    // Preload wishlist from localStorage for immediate UI coloring
    try {
      const cached = localStorage.getItem("wishlistIds");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          const normalized = parsed
            .map((n) => Number(n))
            .filter((n) => Number.isFinite(n));
          if (normalized.length) setWishlist(Array.from(new Set(normalized)));
        }
      }
    } catch { }

    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");

        if (!token || !userStr) return;

        const user = JSON.parse(userStr);

        const response = await fetch(`http://localhost:5275/api/Wishlist/GetBike?userId=${user.userId}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch wishlist");

        const data = await response.json();
        // Normalize to numeric bike ids for reliable comparisons
        const bikeIds = data
          .map((item) => {
            const rawId =
              item?.bikeId ??
              item?.BikeId ??
              item?.bike?.bikeId ??
              item?.bike?.id ??
              item?.bike_id;
            const n = Number(rawId);
            return Number.isNaN(n) ? null : n;
          })
          .filter((id) => id !== null);
        // de-duplicate
        const uniqueIds = Array.from(new Set(bikeIds));
        setWishlist(uniqueIds);
        try {
          localStorage.setItem("wishlistIds", JSON.stringify(uniqueIds));
        } catch { }
      } catch (err) {
        console.error(err);
      }
    };

    fetchWishlist();
  }, []);

  // 🧠 2️⃣ Toggle wishlist handler
  const toggleWishlist = async (bikeId) => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      setAlertMessage("Please login to add items to your wishlist");
      setAlertSeverity("warning");
      setAlertOpen(true);
      navigate("/login");
      return;
    }

    const user = JSON.parse(userStr);
    const numericBikeId = Number(bikeId);
    const isInWishlist = wishlist.includes(numericBikeId);

    if (!isInWishlist) {
      try {
        const wishlistData = {
          WishlistId: 0,
          UserId: parseInt(user.userId),
          BikeId: numericBikeId,
          CreatedAt: new Date().toISOString(),
          ModifiedAt: new Date().toISOString(),
        };

        const response = await fetch("http://localhost:5275/api/Wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(wishlistData),
        });

        if (!response.ok) throw new Error("Failed to add to wishlist");

        setWishlist((prev) => {
          const next = Array.from(new Set([...(prev || []), numericBikeId]));
          localStorage.setItem("wishlistIds", JSON.stringify(next));
          return next;
        });

        // ✅ Show success alert
        setAlertMessage("Added to wishlist ❤️");
        setAlertSeverity("success");
        setAlertOpen(true);

      } catch (error) {
        console.error("Error adding to wishlist:", error);
        setAlertMessage("Failed to add to wishlist");
        setAlertSeverity("error");
        setAlertOpen(true);
      }
    } else {
      // Already in wishlist
      setAlertMessage("Already in your wishlist ❤️");
      setAlertSeverity("info");
      setAlertOpen(true);
    }
  };


  // ✅ Fetch all available bikes (no pagination)
  const fetchAvailableBikes = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5275/api/Bike/GetAvailableBikes/available");
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

      setData(bikes);
      setFilteredData([]);
    } catch (error) {
      console.error("❌ Error fetching available bikes:", error);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Fetch bikes by filters
  const fetchFilteredBikes = async () => {
    setIsLoading(true);
    try {
      let url = `http://localhost:5275/api/Bike/FilterBikes/filter?`;

      if (brand) url += `brand=${encodeURIComponent(brand)}&`;
      if (bikeName) url += `bikeName=${encodeURIComponent(bikeName)}&`;
      if (minPrice) url += `minPrice=${encodeURIComponent(minPrice)}&`;
      if (maxPrice) url += `maxPrice=${encodeURIComponent(maxPrice)}&`;
      if (sortOrder) url += `sortOrder=${encodeURIComponent(sortOrder)}&`;

      url = url.replace(/&$/, "");

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const result = await res.json();
      console.log("📊 Filter results:", result);

      const bikes = Array.isArray(result)
        ? result
        : Array.isArray(result.bikes)
          ? result.bikes
          : Array.isArray(result.data)
            ? result.data
            : [];

      setFilteredData(bikes);
      setFiltersApplied(true);
    } catch (error) {
      console.error("❌ Error fetching filtered bikes:", error);
      setFilteredData([]);
      setFiltersApplied(true); // show empty state when filters yield no results
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategoryWiseBikes = async (brandId) => {
    try {
      const res = await fetch(
        `http://localhost:5275/api/Bike/GetCategoryWiseBike/CategoryWiseBike?id=${brandId}`
      );
      const result = await res.json();
      setFilteredData(result);
    } catch (error) {
      console.error("Error fetching category-wise bikes:", error);
    }
  };

  const fetchSortedBikes = async (order) => {
    try {
      let url = "http://localhost:5275/api/Bike/withoutbooking";
      if (order === "asc") {
        url = "http://localhost:5275/api/Bike/GetAllBikesPriceAscending/price-asc";
      } else if (order === "name-asc") {
        url = "http://localhost:5275/api/Bike/GetAllBikesAscending/all-asc";
      }

      const res = await fetch(url);
      const result = await res.json();
      setData(result);
      setFilteredData([]); // clear filters when sorting
      setFiltersApplied(false);
    } catch (error) {
      console.error("Error fetching sorted bikes:", error);
    }
  };

  const handleReset = () => {
    console.log("🔄 Resetting all filters...");
    setBrand("");
    setBikeName("");
    setMinPrice("");
    setMaxPrice("");
    setSortOrder("");
    setFilteredData([]);
    setFiltersApplied(false);
    fetchAvailableBikes();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      fetchFilteredBikes();
    }
  };

  const handleSortChange = (e) => {
    const order = e.target.value;
    setSortOrder(order);
    if (order === "asc") {
      fetchSortedBikes("asc");
    } else if (order === "name-asc") {
      fetchSortedBikes("name-asc");
    } else if (order === "default") {
      setFilteredData([]);
      setFiltersApplied(false);
      fetchAvailableBikes();
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const brandId = urlParams.get("brandId");

    // Fetch bikes based on URL params
    if (brandId) {
      fetchCategoryWiseBikes(brandId);
    } else {
      fetchAvailableBikes();
    }

    // Initialize AOS
    AOS.init({ duration: 800 });
    fetch("http://localhost:5275/api/Brand")
      .then((res) => res.json())
      .then((data) => setBrands(data))
      .catch((err) => console.error("Error loading brands", err));
  }, [location.search]);

  const bikesToShow = filtersApplied ? filteredData : data;

  return (
    <>
      <section className="py-5 mt-5">
        {/* ✅ Filter Section */}
        <div className="container mb-4">
          <div className="card shadow-sm p-4 rounded-4">
            <h5 className="fw-bold mb-3">🔍 Filter Bikes</h5>
            <div className="row g-3 align-items-center">

              {/* Brand Filter */}
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                >
                  <option value="">All Brands</option>
                  {brands.map((b, index) => (
                    <option key={index} value={b.brandName || b.name}>
                      {b.brandName || b.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bike Name Search */}
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by Bike Name"
                  value={bikeName}
                  onChange={(e) => setBikeName(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>

              {/* Sorting */}
              <div className="col-md-2">
                <select
                  className="form-select"
                  value={sortOrder}
                  onChange={handleSortChange}
                >
                  <option value="default">Default</option>
                  <option value="asc">Price: Low to High</option>
                  <option value="name-asc">Name: A → Z</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="col-md-12 d-flex gap-2 mt-3">
                <button className="btn btn-primary" onClick={fetchFilteredBikes}>
                  Apply Filter
                </button>
                <button className="btn btn-outline-secondary" onClick={handleReset}>
                  Reset
                </button>
                <button
                  className="btn btn-danger ms-auto"
                  onClick={() => navigate("/wishlist")}
                >
                  <i className="fas fa-heart me-2"></i>
                  View Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Bike Listing Section stays same */}
        <div className="container-fluid mt-5">
          {isLoading ? (
            <p className="text-center text-lg fw-bold">Loading bikes...</p>
          ) : bikesToShow.length === 0 ? (
            <div className="text-center py-5">
              <div className="alert alert-info">
                <i className="fas fa-info-circle fa-2x mb-3"></i>
                <h4>No Bikes Available</h4>
              </div>
            </div>
          ) : (
            <div className="row">
              {bikesToShow.map((bike, index) => {
                const bikeId = Number(bike.bikeId || bike.id || bike.bike_id);
                const isWishlisted = Number.isFinite(bikeId) && wishlist.includes(bikeId);
                return (
                  <div
                    className="col-md-4"
                    key={bikeId || index}
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <div className="bike-card" style={{ borderRadius: "16px", boxShadow: "0 6px 18px rgba(0,0,0,0.08)", overflow: "hidden", background: "#fff" }}>
                      <div className="bike-image position-relative" style={{ height: "320px", backgroundColor: "#f8f9fa", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                        <img
                          src={bike.imageUrl1 ? `http://localhost:5275/${bike.imageUrl1}` : '/placeholder-bike.jpg'}
                          alt={bike?.bikeName || "Bike"}
                          className="img-fluid rounded"
                          style={{
                            height: "100%",
                            objectFit: "contain",
                            width: "auto",
                            backgroundColor: "transparent",
                            display: "block"
                          }}
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjhGOUZBIi8+CjxwYXRoIGQ9Ik0xMjUgNzVIMTc1VjEyNUgxMjVWNzVaIiBmaWxsPSIjREREREREIi8+CjxwYXRoIGQ9Ik0xMzUgODVIMTY1VjExNUgxMzVWODVaIiBmaWxsPSIjQ0NDQ0NDIi8+CjxjaXJjbGUgY3g9IjE0NSIgY3k9IjEwNSIgcj0iNSIgZmlsbD0iI0ZGRkZGRiIvPgo8dGV4dCB4PSIxNTAiIHk9IjE1MCIgZmlsbD0iIzk5OTk5OSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5CSUtFIE1BR0U8L3RleHQ+Cjwvc3ZnPgo=';
                          }}
                        />

                        <button
                          className="wishlist-btn"
                          onClick={() => toggleWishlist(bikeId)}
                          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                          style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            background: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "44px",
                            height: "44px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            boxShadow: isWishlisted
                              ? "0 4px 8px rgba(255, 51, 102, 0.2)"
                              : "0 2px 5px rgba(0,0,0,0.1)",
                            transition: "all 0.3s",
                            zIndex: 1,
                          }}
                        >
                          <i
                            className={`fa${isWishlisted ? "s" : "r"} fa-heart`}
                            style={{
                              color: isWishlisted ? "#ff3366" : "#777777",
                              fontSize: "1.25rem",
                              transition: "all 0.3s",
                            }}
                          ></i>
                        </button>
                      </div>

                      <div className="bike-details">
                        <h3 className="bike-title">
                          {bike.bikeName || bike.name || bike.title}
                        </h3>
                        <div className="bike-price">
                          ₹{bike.price || bike.cost || 0}
                        </div>
                        <button
                          className="btn btn-view"
                          onClick={() => navigate(`/product/${bikeId}`)}
                        >
                          View Detail
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>



      <Snackbar
        open={alertOpen}
        autoHideDuration={3000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert
          onClose={() => setAlertOpen(false)}
          severity={alertSeverity}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </MuiAlert>
      </Snackbar>


    </>
  );
}

export default Product;