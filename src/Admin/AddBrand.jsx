import { Alert, Snackbar } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddBrand() {
  const [brandName, setBrandName] = useState("");
  const [brandImage, setBrandImage] = useState(null);


  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!brandName || !brandImage) {
      setAlertSeverity("warning");
      setAlertMessage("⚠️ Please fill all fields");
      setAlertOpen(true);
      return;
    }

    const formData = new FormData();
    formData.append("brandName", brandName);
    formData.append("brandImage", brandImage);

    try {
      const res = await fetch("http://localhost:5275/api/Brand/InsertBrand", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setAlertSeverity("success");
        setAlertMessage("✅ Brand added successfully!");
        setAlertOpen(true);

        // ⏳ Wait for alert to show, then navigate
        setTimeout(() => {
          navigate("/brand-management");
        }, 1500);
      } else {
        setAlertSeverity("error");
        setAlertMessage("❌ Failed to add brand");
        setAlertOpen(true);
      }
    } catch (err) {
      console.error(err);
      setAlertSeverity("error");
      setAlertMessage("❌ Error adding brand");
      setAlertOpen(true);
    }
  };


  return (
    <div className="container mt-5">
      <div className="card shadow p-4 rounded-4">
        <h4 className="mb-4 text-center fw-bold">Add New Brand</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">Brand Name</label>
            <input
              type="text"
              className="form-control"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Brand Image</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => setBrandImage(e.target.files[0])}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 rounded-pill">
            Add Brand
          </button>
        </form>
      </div>


      <Snackbar
        open={alertOpen}
        autoHideDuration={4000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setAlertOpen(false)}
          severity={alertSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>

    </div>
  );
}

export default AddBrand;
