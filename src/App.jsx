import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";  // ✅ wrap everything
import HeroSection from "./Pages/HeroSection";
import Navbarr from "./component/Navbarr";
import Footer from "./component/Footer";
import Product from "./Pages/Product";
import Login from "./component/Login";
import Register from "./component/Register";
import BikeDetails from "./Pages/DetailsProduct";
import PostBike from "./Admin/PostBike";
import Admin from "./Admin/Admin";
import EditBike from "./Admin/EditBike";
import BikeBooking from "./Pages/Booking";
import PaymentPage from "./Pages/Payment";
import About from "./Pages/About";
import ProtectedRoute from "./component/ProtectedRoute";
import Profile from "./Pages/Profile";
import Bookings from "./Pages/Bookings";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbarr />
        <Routes>
          {/* Public */}
          <Route path="/" element={<HeroSection />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected */}
          <Route
            path="/product"
            element={
              <ProtectedRoute allowedRoles={["Customer", "Admin"]}>
                <Product />
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute allowedRoles={["Customer", "Admin"]}>
                <About />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProtectedRoute allowedRoles={["Customer", "Admin"]}>
                <BikeDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/postbike"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <PostBike />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-bike/:id"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <EditBike />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book-bike"
            element={
              <ProtectedRoute allowedRoles={["Customer", "Admin"]}>
                <BikeBooking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute allowedRoles={["Customer", "Admin"]}>
                <PaymentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["Customer", "Admin"]}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute allowedRoles={["Customer", "Admin"]}>
                <Bookings />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
