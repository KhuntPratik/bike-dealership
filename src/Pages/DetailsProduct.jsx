import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function BikeDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [bike, setBike] = useState(null);
  const [user, setUser] = useState(null);

  // ✅ Load user from localStorage (set after login)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ✅ Fetch bike details
  useEffect(() => {
    console.log("URL parameter ID:", id);
    fetch(`http://localhost:5275/api/Bike/GetById/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Bike data fetched:", data);
        setBike(data);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, [id]);

  if (!bike) return <div className="text-center mt-5">Loading...</div>;

  // Extract image URLs
  const images = [
    `http://localhost:5275/${bike.imageUrl1}`,
    `http://localhost:5275/${bike.imageUrl2}`,
    `http://localhost:5275/${bike.imageUrl3}`,
    `http://localhost:5275/${bike.imageUrl4}`
  ].filter(Boolean);

  return (
    <div className="container my-5 mt-5">
      <div className="card shadow p-4 rounded">
        <div className="row">
          {/* Left: Carousel */}
          <div className="col-md-6 mt-5">
            <div
              id="bikeCarousel"
              className="carousel slide"
              data-bs-ride="carousel"
            >
              <div className="carousel-inner rounded">
                {images.map((img, index) => (
                  <div
                    className={`carousel-item ${index === 0 ? "active" : ""}`}
                    key={index}
                  >
                    <div className="d-flex align-items-center justify-content-center w-100" style={{ height: "360px", backgroundColor: "#f8f9fa", overflow: "hidden" }}>
                      <img
                        src={img}
                        className="d-block"
                        alt={`Slide ${index + 1}`}
                        style={{ height: "100%", width: "auto", objectFit: "contain" }}
                        loading="lazy"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#bikeCarousel"
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#bikeCarousel"
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>

          {/* Right: Bike Info */}
          <div className="col-md-6 mt-5">
            <h2 className="text-primary">{bike.bikeName}</h2>
            <h4 className="text-success mb-3">
              ₹{bike.price?.toLocaleString()}
            </h4>

            <ul className="list-group list-group-flush mb-3">
              <li className="list-group-item">Model Year: {bike.model}</li>
              <li className="list-group-item">KM Driven: {bike.km} km</li>
              <li className="list-group-item">Fuel Type: {bike.fuel}</li>
              <li className="list-group-item">Engine: {bike.engineCC} CC</li>
              <li className="list-group-item">Owner: {bike.owner}</li>
              <li className="list-group-item">Dealer ID: {bike.dealerId}</li>
            </ul>

            <button
              className="btn btn-primary w-100"
              onClick={() => {
                const bikeId = bike.bikeId;
                const username = user?.username || "Guest"; // ✅ Auto-filled from login
                const email = user?.email || "";
                const phone = user?.phone || "";

                navigate("/book-bike", {
                  state: {
                    bikeId: bikeId,
                    bikeName: bike.bikeName,
                    userName: username,
                    email: email,
                    phone: phone,
                  },
                });
              }}
            >
              Book Now
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="mt-4">
          <h5>Description</h5>
          <p>{bike.description || "No additional description provided."}</p>
        </div>
      </div>
    </div>
  );
}

export default BikeDetails;
