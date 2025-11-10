import { BrowserRouter, Route, Routes } from "react-router-dom";
import HeroSection from "./Pages/HeroSection";
import Wishlist from "./Pages/Wishlist";
// Header and footer are provided by Layout
import Product from "./Pages/Product";
import About from "./Pages/About";
import Login from "./component/Login";
import Register from "./component/Register";
import BikeDetails from "./Pages/DetailsProduct";
import PostBike from "./Admin/PostBike";
import BookingManagement from "./Admin/BookingManagement";
import Admin from "./Admin/Admin";
import EditBike from "./Admin/EditBike";
import BikeBooking from "./Pages/Booking";
import PaymentPage from "./Pages/Payment";
import ProtectedRoute from "./component/ProtectedRoute";
import BookingDetails from "./Admin/BookingDetails";
import MyBookings from "./Pages/MyBookings";
import Profile from "./Pages/Profile";
import BrandManagement from "./Admin/BrandManagement";
import Insurance from "./Pages/Insurance";
import EditBrand from "./Admin/EditBrand";
import Layout from "./component/Layout";
import AddBrand from "./Admin/AddBrand";
import Dashboard from "./Admin/Dashboard";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            {/* Public routes */}
            <Route index element={<HeroSection />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route
              path="/product"
              element={
                <ProtectedRoute>
                  <Product />
                </ProtectedRoute>
              }
            />

              <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />


            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              }
            />
            <Route
              path="/about"
              element={
                <ProtectedRoute>
                  <About />
                </ProtectedRoute>
              }
            />
            <Route
              path="/postbike"
              element={
                <ProtectedRoute>
                  <PostBike />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product/:id"
              element={
                <ProtectedRoute>
                  <BikeDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/MyBookings"
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/BookingManagement"
              element={
                <ProtectedRoute>
                  <BookingManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-brand/:id"
              element={
                <ProtectedRoute>
                  <EditBrand />
                </ProtectedRoute>
              }
            />
            <Route
              path="/brand-management"
              element={
                <ProtectedRoute>
                  <BrandManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking/:id"
              element={
                <ProtectedRoute>
                  <BookingDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-bike/:id"
              element={
                <ProtectedRoute>
                  <EditBike />
                </ProtectedRoute>
              }
            />
            <Route
              path="/book-bike"
              element={
                <ProtectedRoute>
                  <BikeBooking />
                </ProtectedRoute>
              }
            />
             <Route
              path="/add-brand"
              element={
                <ProtectedRoute>
                  <AddBrand />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment"
              element={
                <ProtectedRoute>
                  <PaymentPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/insurance"
              element={
                <ProtectedRoute>
                  <Insurance />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;