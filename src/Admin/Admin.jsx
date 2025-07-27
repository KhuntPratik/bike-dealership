import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "../all.css";
import { useNavigate } from "react-router-dom";

function Admin() {
  const navigate = useNavigate();
  const url = "http://localhost:5275/api/Bike";
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        console.log("Fetched bikes:", res);
        setData(res);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  return (
    <>
      <section className="py-5 mt-5">
        <div className="container-fluid mt-5">
          <div className="row">
            {data.map((bike, index) => (
              <div
                className="col-md-4"
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 100}
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
                    <div className="bike-price fw-bold">₹{bike.price}</div>
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
                        onClick={() => {
                          const confirmDelete = window.confirm(
                            `Are you sure you want to delete ${bike.bikeName}?`
                          );
                          if (!confirmDelete) return;

                          fetch(`http://localhost:5275/api/Bike/${bike.bikeId}`, {
                            method: "DELETE",
                          })
                            .then((res) => {
                              if (res.ok) {
                                setData((prevData) =>
                                  prevData.filter((b) => b.bikeId !== bike.bikeId)
                                );
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
                        }}
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
