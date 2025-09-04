import React, { useState, useEffect, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbarr = () => {
	const [cartCount, setCartCount] = useState(0);
	const [isScrolled, setIsScrolled] = useState(false);

	const { 
		user, 
		logout, 
		isAuthenticated, 
		isAdmin, 
		isCustomer, 
		getUserInfo,
		loading 
	} = useContext(AuthContext);
	
	const navigate = useNavigate();

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	// collapse navbar on link click (mobile)
	const collapseIfOpen = () => {
		const nav = document.getElementById('navbarNav');
		if (nav && nav.classList.contains('show')) {
			nav.classList.remove('show');
		}
	};

	// Don't render navbar while loading
	if (loading) {
		return null;
	}

	const userInfo = getUserInfo();
	const userInitial = (userInfo?.username || 'U').toString().trim().charAt(0).toUpperCase();

	return (
		<nav className={`navbar navbar-expand-lg fixed-top ${isScrolled ? 'scrolled' : ''}`}>
			<div className="container">
				<Link className="navbar-brand" to="/">
					<div className="brand-logo">
						<i className="fas fa-motorcycle"></i>
						<span className="brand-text">Maa Bhagwati Bikes</span>
					</div>
				</Link>
				
				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarNav"
					aria-controls="navbarNav"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon"></span>
				</button>
				
				<div className="collapse navbar-collapse" id="navbarNav">
					<ul className="navbar-nav ms-auto align-items-center">
						<li className="nav-item">
							<NavLink className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} to="/" onClick={collapseIfOpen}>
								<i className="fas fa-home"></i> Home
							</NavLink>
						</li>
						
						{/* Role-based navigation */}
						{isAuthenticated() && (
							<>
								<li className="nav-item">
									<NavLink className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} to="/product" onClick={collapseIfOpen}>
										<i className="fas fa-motorcycle"></i> Bikes
									</NavLink>
								</li>
								
								{/* Admin-only navigation */}
								{isAdmin() && (
									<>
										<li className="nav-item">
											<NavLink className={({isActive}) => `nav-link admin-link ${isActive ? 'active' : ''}`} to="/admin" onClick={collapseIfOpen}>
												<i className="fas fa-tachometer-alt"></i> Admin Panel
											</NavLink>
										</li>
									</>
								)}
								
								{/* Customer navigation */}
								{isCustomer() && (
									<li className="nav-item">
										<NavLink className={({isActive}) => `nav-link customer-link ${isActive ? 'active' : ''}`} to="/book-bike" onClick={collapseIfOpen}>
											<i className="fas fa-calendar-check"></i> Book Bike
										</NavLink>
									</li>
								)}
							</>
						)}
						
						<li className="nav-item">
							<a className="nav-link" href="/#about" onClick={collapseIfOpen}>
								<i className="fas fa-info-circle"></i> About
							</a>
						</li>
						<li className="nav-item">
							<a className="nav-link" href="/#services" onClick={collapseIfOpen}>
								<i className="fas fa-cogs"></i> Services
							</a>
						</li>
						<li className="nav-item">
							<a className="nav-link" href="/#contact" onClick={collapseIfOpen}>
								<i className="fas fa-envelope"></i> Contact
							</a>
						</li>
						
						
					
						
						{/* User Menu */}
						<li className="nav-item dropdown">
							<a className="nav-link dropdown-toggle user-menu d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown" onClick={collapseIfOpen}>
								<span className="avatar-initial me-2">{userInitial}</span>
								{isAuthenticated() && (
									<span className="user-role-badge">
										{userInfo.role || user?.role}
									</span>
								)}
							</a>
							<ul className="dropdown-menu dropdown-menu-end">
								{!isAuthenticated() ? (
									<>
										<li>
											<NavLink className="dropdown-item" to="/login" onClick={collapseIfOpen}>
												<i className="fas fa-sign-in-alt me-2"></i>Login
											</NavLink>
										</li>
										<li>
											<NavLink className="dropdown-item" to="/register" onClick={collapseIfOpen}>
												<i className="fas fa-user-plus me-2"></i>Register
											</NavLink>
										</li>
									</>
								) : (
									<>
										{/* User info header */}
										<li className="dropdown-header">
											<div className="user-info">
												<strong>{userInfo.username || 'User'}</strong>
												<small className="text-muted d-block">
													{userInfo.role || user?.role}
												</small>
											</div>
										</li>
										<li><hr className="dropdown-divider" /></li>
										
										{/* Profile link */}
										<li>
											<NavLink className="dropdown-item" to="/profile" onClick={collapseIfOpen}>
												<i className="fas fa-user me-2"></i>Profile
											</NavLink>
										</li>
										
										{/* Role-specific menu items */}
										{isAdmin() && (
											<li>
												<NavLink className="dropdown-item" to="/admin" onClick={collapseIfOpen}>
													<i className="fas fa-tachometer-alt me-2"></i>Admin Dashboard
												</NavLink>
											</li>
										)}
										
										{isCustomer() && (
											<li>
												<NavLink className="dropdown-item" to="/bookings" onClick={collapseIfOpen}>
													<i className="fas fa-calendar me-2"></i>My Bookings
												</NavLink>
											</li>
										)}
										
										<li><hr className="dropdown-divider" /></li>
										
										{/* Logout */}
										<li>
											<button className="dropdown-item text-danger" onClick={handleLogout}>
												<i className="fas fa-sign-out-alt me-2"></i>Logout
											</button>
										</li>
									</>
								)}
							</ul>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
};

export default Navbarr;
