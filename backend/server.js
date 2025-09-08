
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");
const db = require('./config/database');
const app = express();
// Configure CORS to allow access from all devices
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Static files serve (CSS, JS, etc.)
app.use(express.static(path.join(__dirname, "..")));
// Serve images from root images folder
app.use('/images', express.static(path.join(__dirname, '..', 'images')));
// Root  index.html serve 
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});
// Initialize database connection
db.connect(err => {
  if (err) {
    console.error("Database connection error:", err);
    return;
  }
  console.log("MySQL connected successfully");
});
// Test routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

app.get('/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// ROUTES
app.get("/products", (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});
app.get("/products/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM products WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results[0]);
  });
});
app.post("/products", (req, res) => {
  const { name, category, image, sizes, price, in_stock, description } = req.body;
  const query =
    "INSERT INTO products (name, category, image, sizes, price, in_stock, description) VALUES (?, ?, ?, ?, ?, ?, ?)";
  db.query(query, [name, category, image, sizes, parseFloat(price) || 0, in_stock, description], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({
      id: result.insertId,
      name,
      category,
      image,
      sizes,
      price: parseFloat(price) || 0,
      in_stock,
      description,
    });
  });
});
app.put("/products/:id", (req, res) => {
  const { id } = req.params;
  const { name, category, image, sizes, price, in_stock, description } = req.body;
  const query =
    "UPDATE products SET name=?, category=?, image=?, sizes=?, price=?, in_stock=?, description=? WHERE id=?";
  db.query(query, [name, category, image, sizes, parseFloat(price) || 0, in_stock, description, id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true, message: " Product updated successfully!" });
  });
});
app.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM products WHERE id=?", [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true, message: "🗑️ Product deleted successfully!" });
  });
});
//START SERVER 
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Access from local network: http://0.0.0.0:${PORT}`);
  console.log(`💻 Access from localhost: http://localhost:${PORT}`);
});
