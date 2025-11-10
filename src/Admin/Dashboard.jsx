import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user, isAdmin, isCustomer, getUserInfo } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
    totalRevenue: 0,
    availableBikes: 0
  });

  const userInfo = getUserInfo();

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalBookings: 24,
        activeBookings: 3,
        totalRevenue: 45200,
        availableBikes: 12
      });
    }, 1000);
  }, []);

  const recentBookings = [
    { id: 1, bike: "Royal Enfield Classic 350", date: "2024-01-15", status: "Active", amount: 1800 },
    { id: 2, bike: "Yamaha MT-15", date: "2024-01-14", status: "Completed", amount: 1200 },
    { id: 3, bike: "Honda CB Shine", date: "2024-01-13", status: "Completed", amount: 800 },
  ];

  const quickActions = [
    { icon: "🏍️", title: "Book a Bike", description: "Rent your favorite bike", link: "/product", color: "linear-gradient(135deg, #dc3545 0%, #c82333 100%)" },
    { icon: "📅", title: "My Bookings", description: "View your bookings", link: "/MyBookings", color: "linear-gradient(135deg, #28a745 0%, #20c997 100%)" },
    { icon: "🛡️", title: "Insurance", description: "Get vehicle insurance", link: "/insurance", color: "linear-gradient(135deg, #007bff 0%, #6610f2 100%)" },
    { icon: "👤", title: "Profile", description: "Update your profile", link: "/profile", color: "linear-gradient(135deg, #6f42c1 0%, #e83e8c 100%)" },
  ];

  const adminQuickActions = [
    { icon: "🚀", title: "Manage Bikes", description: "Add or edit bikes", link: "/admin/bikes", color: "linear-gradient(135deg, #dc3545 0%, #c82333 100%)" },
    { icon: "📊", title: "Analytics", description: "View business insights", link: "/admin/analytics", color: "linear-gradient(135deg, #28a745 0%, #20c997 100%)" },
    { icon: "👥", title: "Users", description: "Manage customers", link: "/admin/users", color: "linear-gradient(135deg, #007bff 0%, #6610f2 100%)" },
    { icon: "💰", title: "Revenue", description: "Financial reports", link: "/admin/revenue", color: "linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)" },
  ];

  return (
    <div className="dashboard-container mt-5">
      {/* Header */}
      <div className="dashboard-header">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col">
              <h1 className="dashboard-title">
                Welcome back, <span className="text-primary">{userInfo?.username || 'User'}</span>!
              </h1>
              <p className="dashboard-subtitle">
                {isAdmin() ? "Manage your bike rental business" : "Track your bike rentals and bookings"}
              </p>
            </div>
            <div className="col-auto">
              <div className="user-widget d-flex align-items-center">
                <div className="user-avatar me-3">
                  <span className="avatar-initial">
                    {(userInfo?.username || 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="user-info">
                  <strong className="d-block">{userInfo?.username || 'User'}</strong>
                  <small className="text-muted">{userInfo?.role || user?.role}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container-fluid mt-4">
        <div className="row g-4">
          {/* Total Bookings */}
          <div className="col-xl-3 col-md-6">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "linear-gradient(135deg, #dc3545 0%, #c82333 100%)" }}>
                <i className="fas fa-calendar-check"></i>
              </div>
              <div className="stat-content">
                <h3>{stats.totalBookings}</h3>
                <p>Total Bookings</p>
                <div className="stat-trend text-success">
                  <i className="fas fa-arrow-up me-1"></i>
                  12% from last month
                </div>
              </div>
            </div>
          </div>

          {/* Active Bookings */}
          <div className="col-xl-3 col-md-6">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)" }}>
                <i className="fas fa-biking"></i>
              </div>
              <div className="stat-content">
                <h3>{stats.activeBookings}</h3>
                <p>Active Bookings</p>
                <div className="stat-trend text-info">
                  <i className="fas fa-clock me-1"></i>
                  {stats.activeBookings > 0 ? 'Ongoing' : 'No active bookings'}
                </div>
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="col-xl-3 col-md-6">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "linear-gradient(135deg, #007bff 0%, #6610f2 100%)" }}>
                <i className="fas fa-rupee-sign"></i>
              </div>
              <div className="stat-content">
                <h3>₹{stats.totalRevenue.toLocaleString()}</h3>
                <p>Total Spent</p>
                <div className="stat-trend text-success">
                  <i className="fas fa-chart-line me-1"></i>
                  8% savings
                </div>
              </div>
            </div>
          </div>

          {/* Available Bikes */}
          <div className="col-xl-3 col-md-6">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)" }}>
                <i className="fas fa-motorcycle"></i>
              </div>
              <div className="stat-content">
                <h3>{stats.availableBikes}</h3>
                <p>Available Bikes</p>
                <div className="stat-trend text-primary">
                  <i className="fas fa-bell me-1"></i>
                  Ready to book
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="row g-4 mt-2">
          {/* Quick Actions */}
          <div className="col-lg-8">
            <div className="dashboard-card">
              <div className="card-header">
                <h5 className="card-title">
                  <i className="fas fa-bolt me-2"></i>
                  Quick Actions
                </h5>
                <p className="card-subtitle">Get things done quickly</p>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  {(isAdmin() ? adminQuickActions : quickActions).map((action, index) => (
                    <div key={index} className="col-md-6">
                      <Link to={action.link} className="quick-action-card">
                        <div 
                          className="action-icon"
                          style={{ background: action.color }}
                        >
                          <span className="action-emoji">{action.icon}</span>
                        </div>
                        <div className="action-content">
                          <h6>{action.title}</h6>
                          <p>{action.description}</p>
                        </div>
                        <div className="action-arrow">
                          <i className="fas fa-chevron-right"></i>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="dashboard-card mt-4">
              <div className="card-header">
                <h5 className="card-title">
                  <i className="fas fa-history me-2"></i>
                  Recent Bookings
                </h5>
                <Link to="/MyBookings" className="btn btn-sm btn-outline-primary">
                  View All
                </Link>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Bike</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Amount</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map(booking => (
                        <tr key={booking.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="bike-icon me-3">
                                <i className="fas fa-motorcycle"></i>
                              </div>
                              <span className="fw-semibold">{booking.bike}</span>
                            </div>
                          </td>
                          <td>{booking.date}</td>
                          <td>
                            <span className={`status-badge ${booking.status.toLowerCase()}`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="fw-bold">₹{booking.amount}</td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary">
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            {/* Recent Activity */}
            <div className="dashboard-card">
              <div className="card-header">
                <h5 className="card-title">
                  <i className="fas fa-bell me-2"></i>
                  Recent Activity
                </h5>
              </div>
              <div className="card-body">
                <div className="activity-list">
                  <div className="activity-item">
                    <div className="activity-icon success">
                      <i className="fas fa-check-circle"></i>
                    </div>
                    <div className="activity-content">
                      <p>Booking confirmed for Royal Enfield</p>
                      <small className="text-muted">2 hours ago</small>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon primary">
                      <i className="fas fa-motorcycle"></i>
                    </div>
                    <div className="activity-content">
                      <p>New bike added to collection</p>
                      <small className="text-muted">1 day ago</small>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon warning">
                      <i className="fas fa-exclamation-triangle"></i>
                    </div>
                    <div className="activity-content">
                      <p>Insurance renewal reminder</p>
                      <small className="text-muted">2 days ago</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Bookings */}
            <div className="dashboard-card mt-4">
              <div className="card-header">
                <h5 className="card-title">
                  <i className="fas fa-clock me-2"></i>
                  Upcoming Bookings
                </h5>
              </div>
              <div className="card-body">
                <div className="upcoming-booking">
                  <div className="booking-icon">
                    <i className="fas fa-motorcycle"></i>
                  </div>
                  <div className="booking-details">
                    <h6>Yamaha R15 V4</h6>
                    <p className="text-muted mb-1">Starts: Tomorrow, 9:00 AM</p>
                    <span className="badge bg-primary">Confirmed</span>
                  </div>
                </div>
                <div className="upcoming-booking mt-3">
                  <div className="booking-icon">
                    <i className="fas fa-motorcycle"></i>
                  </div>
                  <div className="booking-details">
                    <h6>KTM Duke 200</h6>
                    <p className="text-muted mb-1">Starts: Jan 20, 2:00 PM</p>
                    <span className="badge bg-warning">Pending</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .dashboard-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          padding-top: 2rem;
        }

        .dashboard-header {
          background: white;
          padding: 2rem 0;
          border-bottom: 1px solid #e9ecef;
          margin-bottom: 1rem;
        }

        .dashboard-title {
          font-size: 2rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }

        .dashboard-subtitle {
          color: #6c757d;
          font-size: 1.1rem;
          margin-bottom: 0;
        }

        .user-widget {
          background: white;
          padding: 1rem;
          border-radius: 1rem;
          border: 1px solid #e9ecef;
        }

        .user-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 1.25rem;
        }

        .stat-card {
          background: white;
          border-radius: 1rem;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          border: 1px solid #e9ecef;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
        }

        .stat-content h3 {
          font-size: 2rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 0.25rem;
        }

        .stat-content p {
          color: #6c757d;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .stat-trend {
          font-size: 0.875rem;
          font-weight: 500;
        }

        .dashboard-card {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          border: 1px solid #e9ecef;
          overflow: hidden;
        }

        .card-header {
          padding: 1.5rem 1.5rem 0.5rem;
          border-bottom: 1px solid #e9ecef;
        }

        .card-title {
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 0.25rem;
        }

        .card-subtitle {
          color: #6c757d;
          margin-bottom: 0;
        }

        .card-body {
          padding: 1.5rem;
        }

        .quick-action-card {
          display: flex;
          align-items: center;
          padding: 1.25rem;
          background: white;
          border-radius: 12px;
          border: 1px solid #e9ecef;
          text-decoration: none;
          color: inherit;
          transition: all 0.3s ease;
        }

        .quick-action-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          color: inherit;
          text-decoration: none;
        }

        .action-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1rem;
          flex-shrink: 0;
        }

        .action-emoji {
          font-size: 1.5rem;
        }

        .action-content h6 {
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: #2c3e50;
        }

        .action-content p {
          color: #6c757d;
          margin-bottom: 0;
          font-size: 0.875rem;
        }

        .action-arrow {
          margin-left: auto;
          color: #6c757d;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .status-badge.active {
          background: #d1ecf1;
          color: #0c5460;
        }

        .status-badge.completed {
          background: #d4edda;
          color: #155724;
        }

        .bike-icon {
          width: 32px;
          height: 32px;
          background: #f8f9fa;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6c757d;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .activity-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .activity-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: white;
        }

        .activity-icon.success {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
        }

        .activity-icon.primary {
          background: linear-gradient(135deg, #007bff 0%, #6610f2 100%);
        }

        .activity-icon.warning {
          background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);
        }

        .activity-content p {
          margin-bottom: 0.25rem;
          font-weight: 500;
        }

        .upcoming-booking {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 12px;
        }

        .booking-icon {
          width: 40px;
          height: 40px;
          background: white;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #dc3545;
          font-size: 1.25rem;
        }

        .booking-details h6 {
          margin-bottom: 0.25rem;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .dashboard-title {
            font-size: 1.5rem;
          }
          
          .stat-card {
            padding: 1rem;
          }
          
          .stat-icon {
            width: 50px;
            height: 50px;
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;