import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const API_URL = 'http://localhost:5000';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/products`);
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
          <div className="position-sticky pt-3">
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link to="/admin" className="nav-link active">
                  <i className="fas fa-tachometer-alt me-2"></i>
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/products" className="nav-link">
                  <i className="fas fa-box me-2"></i>
                  Products
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/orders" className="nav-link">
                  <i className="fas fa-shopping-cart me-2"></i>
                  Orders
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/users" className="nav-link">
                  <i className="fas fa-users me-2"></i>
                  Users
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Admin Dashboard</h1>
          </div>

          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card bg-primary text-white h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-uppercase">Total Products</h6>
                      <h1>{products.length}</h1>
                    </div>
                    <i className="fas fa-box fa-2x"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card bg-success text-white h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-uppercase">In Stock</h6>
                      <h1>{products.filter(p => p.in_stock).length}</h1>
                    </div>
                    <i className="fas fa-check-circle fa-2x"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card bg-danger text-white h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-uppercase">Out of Stock</h6>
                      <h1>{products.filter(p => !p.in_stock).length}</h1>
                    </div>
                    <i className="fas fa-times-circle fa-2x"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h2>Recent Products</h2>
          <div className="table-responsive">
            <table className="table table-striped table-sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 10).map(product => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>₹{product.price}</td>
                    <td>
                      {product.in_stock ? 
                        <span className="badge bg-success">In Stock</span> : 
                        <span className="badge bg-danger">Out of Stock</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;