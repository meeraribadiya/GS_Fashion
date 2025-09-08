import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
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

  if (error) {
    return (
      <div className="container py-5">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Welcome to GS Fashion</h1>
      
      <div className="row mb-5">
        <div className="col-md-12">
          <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-indicators">
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active"></button>
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"></button>
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2"></button>
            </div>
            <div className="carousel-inner rounded shadow">
              <div className="carousel-item active">
                <img src="/images/poster1.jpg" className="d-block w-100" alt="Fashion Banner 1" />
              </div>
              <div className="carousel-item">
                <img src="/images/poster2.jpg" className="d-block w-100" alt="Fashion Banner 2" />
              </div>
              <div className="carousel-item">
                <img src="/images/poster3.jpg" className="d-block w-100" alt="Fashion Banner 3" />
              </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </div>
      
      <h2 className="text-center mb-4">Featured Products</h2>
      
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
        {products.slice(0, 8).map(product => (
          <div className="col" key={product.id}>
            <div className="card h-100 shadow-sm">
              <img 
                src={product.image ? `/images/${product.image}` : '/images/placeholder.svg'} 
                className="card-img-top" 
                alt={product.name} 
              />
              {!product.in_stock && (
                <div className="position-absolute top-0 end-0 p-2">
                  <span className="badge bg-danger">Out of Stock</span>
                </div>
              )}
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text text-muted">{product.category}</p>
                <p className="card-text fw-bold">₹{product.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;