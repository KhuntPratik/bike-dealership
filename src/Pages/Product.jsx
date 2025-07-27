import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "../all.css";
import { useNavigate } from "react-router-dom";

function Product() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [brand, setBrand] = useState("");
  const [bikeName, setBikeName] = useState("");

  const fetchFilteredBikes = async () => {
    let url = `http://localhost:5275/api/bike/filter?`;

    if (brand) url += `brand=${encodeURIComponent(brand)}&`;
    if (bikeName) url += `bikeName=${encodeURIComponent(bikeName)}`;

    try {
      const res = await fetch(url);
      const result = await res.json();
      setFilteredData(result);
    } catch (error) {
      console.error("Error fetching bikes:", error);
    }
  };


  useEffect(() => {
    fetch("http://localhost:5275/api/Bike")
      .then((res) => res.json())
      .then((res) => {
        console.log("Fetched bikes:", res);
        setData(res);
      })
      .catch((err) => console.error("Fetch error:", err));

    fetchFilteredBikes();

    AOS.init({ duration: 800 });
  }, []);

  const bikesToShow = filteredData.length > 0 ? filteredData : data;

  return (
    <>
      <section className="py-5 mt-5">
        {/* Search Filter */}
        <div className="container mb-4 mt-3">
          <div className="row g-3 align-items-end">
            <input
              type="text"
              placeholder="Brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />

            <input
              type="text"
              placeholder="Bike Name"
              value={bikeName}
              onChange={(e) => setBikeName(e.target.value)}
            />
            <div className="col-md-3 d-grid">
              <button className="btn btn-primary" 
              onClick={fetchFilteredBikes}
              >
                Search
              </button>
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
