import React from 'react';
import { Link } from 'react-router-dom';

const Navbarr = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="fas fa-motorcycle"></i> Maa Bhagwati Bikes
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                <i className="fas fa-home"></i> Home
              </Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#about">
                <i className="fas fa-info-circle"></i> About
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#services">
                <i className="fas fa-cogs"></i> Services
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#contact">
                <i className="fas fa-envelope"></i> Contact
              </a>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/product">
                <i className="fas fa-motorcycle"></i> Bikes
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link contact-btn" to="/login">
                <i class="fa-solid fa-user"></i> Login
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbarr;
