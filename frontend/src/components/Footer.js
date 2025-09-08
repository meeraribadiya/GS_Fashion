import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5>GS Fashion</h5>
            <p className="text-muted">Quality fashion for everyone</p>
          </div>
          <div className="col-md-4 mb-3">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-decoration-none text-muted">Home</Link></li>
              <li><Link to="/contact" className="text-decoration-none text-muted">Contact</Link></li>
            </ul>
          </div>
          <div className="col-md-4 mb-3">
            <h5>Contact Us</h5>
            <address className="text-muted">
              <p>Email: info@gsfashion.com</p>
              <p>Phone: +1 234 567 8900</p>
            </address>
          </div>
        </div>
        <div className="text-center pt-3 border-top border-secondary">
          <p className="text-muted small">&copy; {new Date().getFullYear()} GS Fashion. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;