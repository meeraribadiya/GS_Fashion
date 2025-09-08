import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {

  return (
    <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: '#b394d6' }}>
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src="/images/gslogo.jpg" alt="GS Fashion" height="60" />
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
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin">Admin Dashboard</Link>
            </li>
          </ul>
        </div>
      </div>
      </div>
    </nav>
  );
};

export default Navbar;