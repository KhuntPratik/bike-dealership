import { BrowserRouter, Route, Routes } from "react-router-dom";
import HeroSection from "./Pages/HeroSection";
import Navbarr from "./component/Navbarr";
import Footer from "./component/Footer";
import Product from "./Pages/Product";
import About from "./Pages/About";
import Login from "./component/Login";
import Register from "./component/Register";
import BikeDetails from "./Pages/DetailsProduct";
import PostBike from "./Admin/PostBike";
import Admin from "./Admin/Admin";
import EditBike from "./Admin/EditBike";
import BikeBooking from "./Pages/Booking";
import PaymentPage from "./Pages/Payment";

function App() {

  return (
    <>
     <BrowserRouter>
      <Navbarr />
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/product" element={<Product />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/postbike" element={<PostBike/>}/>
        <Route path="/product/:id" element={<BikeDetails />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/edit-bike/:id" element={<EditBike />} />
        <Route path="/book-bike" element={<BikeBooking />} />
        <Route path="/payment" element={<PaymentPage />} />
      </Routes>
      <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
