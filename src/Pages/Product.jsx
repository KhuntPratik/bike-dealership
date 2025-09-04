import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "../all.css";
import { useNavigate, useLocation } from "react-router-dom";

function Product() {
  const navigate = useNavigate();
  const location = useLocation();

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [brand, setBrand] = useState("");
  const [bikeName, setBikeName] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [brands, setBrands] = useState([]);

  const fetchFilteredBikes = async () => {
    let url = `http://localhost:5275/api/bike/filter?`;

    if (brand) url += `brand=${encodeURIComponent(brand)}&`;
    if (bikeName) url += `bikeName=${encodeURIComponent(bikeName)}&`;
    if (minPrice) url += `minPrice=${encodeURIComponent(minPrice)}&`;
    if (maxPrice) url += `maxPrice=${encodeURIComponent(maxPrice)}`;

    try {
      const res = await fetch(url);
      const result = await res.json();
      setFilteredData(result);
    } catch (error) {
      console.error("Error fetching bikes:", error);
    }
  };

  const fetchCategoryWiseBikes = async (brandId) => {
    try {
      const res = await fetch(`http://localhost:5275/api/Bike/CategoryWiseBike?id=${brandId}`);
      const result = await res.json();
      setFilteredData(result);
    } catch (error) {
      console.error("Error fetching category-wise bikes:", error);
    }
  };

  const handleReset = () => {
    setBrand("");
    setBikeName("");
    setMinPrice("");
    setMaxPrice("");
    setFilteredData([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      fetchFilteredBikes();
    }
  };

  // Derived available price range from current dataset
  const priceArraySource = data && data.length > 0 ? data : filteredData;
  const allPrices = priceArraySource.map((b) => Number(b.price) || 0);
  const availableMinPrice = 0;
  const availableMaxPrice = allPrices.length ? Math.max(...allPrices) : 100000;
  const sliderMinValue = minPrice !== "" ? Number(minPrice) : availableMinPrice;
  const sliderMaxValue = maxPrice !== "" ? Number(maxPrice) : availableMaxPrice;
  const sliderGap = Math.max(Math.round((availableMaxPrice - availableMinPrice) / 50), 500);

  const formatCurrency = (num) => {
    try {
      return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(num);
    } catch {
      return `₹${num}`;
    }
  };

  const handleMinSliderChange = (e) => {
    const value = Number(e.target.value);
    const clamped = Math.min(value, (maxPrice !== "" ? Number(maxPrice) : availableMaxPrice) - sliderGap);
    setMinPrice(String(clamped));
  };

  const handleMaxSliderChange = (e) => {
    const value = Number(e.target.value);
    const clamped = Math.max(value, (minPrice !== "" ? Number(minPrice) : availableMinPrice) + sliderGap);
    setMaxPrice(String(clamped));
  };

  useEffect(() => {
    // Check if brandId is in URL parameters
    const urlParams = new URLSearchParams(location.search);
    const brandId = urlParams.get('brandId');

    if (brandId) {
      // If brandId is present, fetch bikes for that brand
      fetchCategoryWiseBikes(brandId);
    } else {
      // Otherwise fetch all bikes
      fetch("http://localhost:5275/api/Bike")
        .then((res) => res.json())
        .then((res) => {
          console.log("Fetched bikes:", res);
          setData(res);
        })
        .catch((err) => console.error("Fetch error:", err));

      // Load brands for dropdown
      fetch("http://localhost:5275/api/Brand")
        .then((res) => res.json())
        .then((data) => setBrands(data))
        .catch((err) => console.error("Error loading brands", err));
    }

    fetchFilteredBikes();

    AOS.init({ duration: 800 });
  }, [location.search]);

  const bikesToShow = filteredData.length > 0 ? filteredData : data;

  // Compute track background for range fill
  const calcPercent = (val) => ((val - availableMinPrice) / (availableMaxPrice - availableMinPrice)) * 100;
  const minPercent = calcPercent(sliderMinValue);
  const maxPercent = calcPercent(sliderMaxValue);
  const trackStyle = {
    background: `linear-gradient(to right, #e5e7eb 0%, #e5e7eb ${minPercent}%, var(--primary-color) ${minPercent}%, var(--primary-color) ${maxPercent}%, #e5e7eb ${maxPercent}%, #e5e7eb 100%)`
  };

  return (
    <>
      <section className="py-5 mt-5">
        {/* Search Filter */}
        <div className="container mb-4 mt-3">
          <div className="card filter-card shadow-sm p-3 p-md-4">
            <div className="row g-3 align-items-end">
              <div className="col-md-3">
                <label className="form-label fw-semibold text-secondary">Brand</label>
                <div className="input-group input-with-icon">
                  <span className="input-group-text"><i className="fas fa-tags"></i></span>
                  <select
                    className="form-select"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  >
                    <option value="">All Brands</option>
                    {brands.map((b) => (
                      <option key={b.brandId} value={b.brandName}>{b.brandName}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-3">
                <label className="form-label fw-semibold text-secondary">Bike Name</label>
                <div className="input-group input-with-icon">
                  <span className="input-group-text"><i className="fas fa-motorcycle"></i></span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Splendor"
                    value={bikeName}
                    onChange={(e) => setBikeName(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="col-md-4">
                <label className="form-label fw-semibold text-secondary d-flex justify-content-between">
                  <span>Price Range</span>
                  <span className="text-muted">
                    {formatCurrency(sliderMinValue)} - {formatCurrency(sliderMaxValue)}
                  </span>
                </label>
                <div className="price-range">
                  <div className="slider-track" style={trackStyle}></div>
                  <div className="range-input">
                    <input
                      type="range"
                      min={availableMinPrice}
                      max={availableMaxPrice}
                      step={sliderGap}
                      value={sliderMinValue}
                      onChange={handleMinSliderChange}
                    />
                    <input
                      type="range"
                      min={availableMinPrice}
                      max={availableMaxPrice}
                      step={sliderGap}
                      value={sliderMaxValue}
                      onChange={handleMaxSliderChange}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-2 d-grid">
                <div className="filter-actions d-flex gap-2">
                  <button className="btn btn-primary w-100" onClick={fetchFilteredBikes}>
                    <i className="fas fa-search me-2"></i>Search
                  </button>
                  <button className="btn btn-outline-secondary w-100" onClick={handleReset}>
                    <i className="fas fa-undo me-2"></i>Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bike Listing */}
        <div className="container-fluid mt-5">
          <div className="row">
            {bikesToShow.map((bike, index) => (
              <div
                className="col-md-4"
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="bike-card">
                  <div className="bike-image">
                    <img src={bike.imageUrl1} alt={bike.bikeName} />
                  </div>
                  <div className="bike-details">
                    <h3 className="bike-title">{bike.bikeName}</h3>
                    <div className="bike-price">₹{bike.price}</div>
                    <div className="bike-features">
                      <div className="bike-feature">
                        <i className="fas fa-calendar"></i>
                        <span>{bike.model}</span>
                      </div>
                      <div className="bike-feature">
                        <i className="fas fa-road"></i>
                        <span>{bike.km} km</span>
                      </div>
                      <div className="bike-feature">
                        <i className="fas fa-gas-pump"></i>
                        <span>{bike.fuel}</span>
                      </div>
                    </div>
                    <button
                      className="btn btn-view"
                      onClick={() => navigate(`/product/${bike.bikeId}`)}
                    >
                      View Detail
                    </button>
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

export default Product;
