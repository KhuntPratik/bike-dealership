import React from 'react'

const Footer = () => {
  return (
    <div>
        <footer className="bg-dark text-white py-5">
    <div className="container">
      <div className="row g-4">
   
        <div className="col-lg-4 col-md-6">
          <h5 className="mb-4"><i className="fas fa-motorcycle me-2"></i>Maa Bhagwati Bikes</h5>
          <p className="mb-4">Your trusted partner in bike deals. We provide the best service for buying and selling used bikes with complete transparency and customer satisfaction.</p>
          <div className="social-links">
            <a href="#" className="text-white me-3"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="text-white me-3"><i className="fab fa-twitter"></i></a>
            <a href="#" className="text-white me-3"><i className="fab fa-instagram"></i></a>
            <a href="#" className="text-white"><i className="fab fa-whatsapp"></i></a>
          </div>
        </div>


        <div className="col-lg-2 col-md-6">
          <h5 className="mb-4">Quick Links</h5>
          <ul className="list-unstyled">
            <li className="mb-2"><a href="#" className="text-white text-decoration-none"><i className="fas fa-chevron-right me-2"></i>Home</a></li>
            <li className="mb-2"><a href="#about" className="text-white text-decoration-none"><i className="fas fa-chevron-right me-2"></i>About Us</a></li>
            <li className="mb-2"><a href="#services" className="text-white text-decoration-none"><i className="fas fa-chevron-right me-2"></i>Services</a></li>
            <li className="mb-2"><a href="#bikes" className="text-white text-decoration-none"><i className="fas fa-chevron-right me-2"></i>Bikes</a></li>
            <li className="mb-2"><a href="#contact" className="text-white text-decoration-none"><i className="fas fa-chevron-right me-2"></i>Contact</a></li>
          </ul>
        </div>

        <div className="col-lg-3 col-md-6">
          <h5 className="mb-4">Our Services</h5>
          <ul className="list-unstyled">
            <li className="mb-2"><a href="#" className="text-white text-decoration-none"><i className="fas fa-chevron-right me-2"></i>Buy Old Bikes</a></li>
            <li className="mb-2"><a href="#" className="text-white text-decoration-none"><i className="fas fa-chevron-right me-2"></i>Sell Your Bike</a></li>
            <li className="mb-2"><a href="#" className="text-white text-decoration-none"><i className="fas fa-chevron-right me-2"></i>Bike Exchange</a></li>
            <li className="mb-2"><a href="#" className="text-white text-decoration-none"><i className="fas fa-chevron-right me-2"></i>Bike Finance</a></li>
            <li className="mb-2"><a href="#" className="text-white text-decoration-none"><i className="fas fa-chevron-right me-2"></i>RTO Work</a></li>
          </ul>
        </div>

 
        <div className="col-lg-3 col-md-6">
          <h5 className="mb-4">Contact Info</h5>
          <ul className="list-unstyled">
            <li className="mb-3">
              <i className="fas fa-map-marker-alt me-2"></i>
              123 Bike Street, City Name, State - 123456
            </li>
            <li className="mb-3">
              <i className="fas fa-phone me-2"></i>
              <a href="tel:+1234567890" className="text-white text-decoration-none">+91 8780777688</a>
            </li>
            <li className="mb-3">
              <i className="fas fa-envelope me-2"></i>
              <a href="mailto:info@maabhagwatibikes.com" className="text-white text-decoration-none">maabhagwatibikes@gmail.com</a>
            </li>
            <li className="mb-3">
              <i className="fas fa-clock me-2"></i>
              Mon - Sat: 9:00 AM - 8:00 PM
            </li>
          </ul>
        </div>
      </div>

    
      <div className="row mt-5 pt-4 border-top border-secondary">
        <div className="col-md-6 text-center text-md-start">
          <p className="mb-0">&copy; 2025 Maa Bhagwati Bikes. All rights reserved.</p>
        </div>
        <div className="col-md-6 text-center text-md-end">
          <p className="mb-0">
            <a href="#" className="text-white text-decoration-none me-3">Privacy Policy</a>
            <a href="#" className="text-white text-decoration-none me-3">Terms & Conditions</a>
            <a href="#" className="text-white text-decoration-none">FAQ</a>
          </p>
        </div>
      </div>
    </div>
  </footer>
    </div>
  )
}

export default Footer
