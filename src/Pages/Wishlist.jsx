import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import "../all.css";

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [alert, setAlert] = useState({ open: false, type: "", message: "" });
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    wishlistId: null,
  });

  useEffect(() => {
    const fetchWishlistItems = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        if (!token || !user) {
          navigate("/login");
          return;
        }

        const response = await fetch("http://localhost:5275/api/Wishlist/GetBike", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch wishlist");

        const data = await response.json();
        setWishlistItems(data);
      } catch (error) {
        setAlert({ open: true, type: "error", message: error.message });
      }
    };

    fetchWishlistItems();
  }, [navigate]);

  const handleRemoveClick = (wishlistId) => {
    // Open confirm dialog
    setConfirmDialog({ open: true, wishlistId });
  };

  const confirmRemove = async () => {
    const wishlistId = confirmDialog.wishlistId;
    setConfirmDialog({ open: false, wishlistId: null });

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5275/api/Wishlist/${wishlistId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to remove from wishlist");

      setWishlistItems((prev) => prev.filter((i) => i.wishlistId !== wishlistId));
      setAlert({
        open: true,
        type: "success",
        message: "Removed from wishlist successfully!",
      });
    } catch (error) {
      setAlert({ open: true, type: "error", message: error.message });
    }
  };

  return (
    <div className="container py-5 mt-5">
      {/* ✅ Alert Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={alert.type}
          onClose={() => setAlert({ ...alert, open: false })}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>

      {/* ✅ Confirm Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, wishlistId: null })}
      >
        <DialogTitle>Confirm Removal</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove this item from your wishlist?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, wishlistId: null })}>
            Cancel
          </Button>
          <Button color="error" onClick={confirmRemove} autoFocus>
            Remove
          </Button>
        </DialogActions>
      </Dialog>

      <div className="d-flex align-items-center mb-4">
        <div className="bg-danger text-white p-3 rounded-circle me-3">
          <i className="fas fa-heart fa-lg"></i>
        </div>
        <div>
          <h2 className="mb-0 fw-bold text-dark">My Wishlist</h2>
          <p className="text-muted mb-0">
            {wishlistItems.length}{" "}
            {wishlistItems.length === 1 ? "item" : "items"} saved for later
          </p>
        </div>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-5 my-4">
          <div className="card border-0 bg-white py-5">
            <div className="card-body">
              <div className="mb-4">
                <i className="fas fa-heart fa-4x text-danger mb-3"></i>
              </div>
              <h3 className="h4 text-dark mb-3">Your wishlist is empty</h3>
              <p className="text-muted mb-4">
                Save your favorite bikes here to easily find them later
              </p>
              <button
                className="btn btn-danger px-4"
                onClick={() => navigate("/product")}
              >
                <i className="fas fa-bicycle me-2"></i>
                Browse Bikes
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {wishlistItems.map((item) => (
            <div className="col-lg-4 col-md-6" key={item.wishlistId}>
              <div className="card h-100 border-0 position-relative wishlist-card bg-white">
                <div className="position-absolute top-0 end-0 p-3">
                  <button
                    className="btn btn-sm btn-light rounded-circle"
                    onClick={() => handleRemoveClick(item.wishlistId)}
                    title="Remove from wishlist"
                  >
                    <i className="fas fa-times text-danger"></i>
                  </button>
                </div>

                <div
                  className="card-img-top position-relative overflow-hidden bg-white"
                  style={{ height: "220px" }}
                >
                  <img
                    src={
                      item.imageUrl1
                        ? `http://localhost:5275/${item.imageUrl1}`
                        : "/placeholder-bike.jpg"
                    }
                    alt={item?.bikeName || "Bike"}
                    className="img-fluid p-3"
                    style={{
                      height: "100%",
                      objectFit: "contain",
                      width: "100%",
                    }}
                  />
                  <div className="position-absolute bottom-0 start-0 w-100 p-3">
                    <span className="badge bg-danger">Wishlisted</span>
                  </div>
                </div>

                <div className="card-body d-flex flex-column border-top border-danger">
                  <h5 className="card-title fw-bold mb-2 text-dark">
                    {item.bikeName}
                  </h5>
                  <div className="mb-2">
                    <span className="text-danger fw-bold fs-4">
                      ₹{item.price}
                    </span>
                  </div>
                  <div className="mt-auto pt-3">
                    <div className="d-flex justify-content-between">
                      <button
                        className="btn btn-outline-danger btn-sm flex-fill me-2"
                        onClick={() => navigate(`/product/${item.bikeId}`)}
                      >
                        <i className="fas fa-eye me-1"></i> Details
                      </button>
                      <button
                        className="btn btn-danger btn-sm flex-fill ms-2"
                        onClick={() => navigate("/book-bike")}
                      >
                        <i className="fas fa-calendar-check me-1"></i> Book
                      </button>
                    </div>
                    <div className="d-flex justify-content-between">
                      <button
                        className="btn btn-danger flex-fill ms-2 mt-2"
                        onClick={() => handleRemoveClick(item.wishlistId)}
                      >
                        <i className="fas fa-trash me-1"></i> Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
