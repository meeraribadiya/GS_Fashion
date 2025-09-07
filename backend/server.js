
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");
const app = express();
// Configure CORS
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json());
// Static files serve (CSS, JS, etc.)
app.use(express.static(path.join(__dirname, "..")));
// Serve images from root images folder
app.use('/images', express.static(path.join(__dirname, '..', 'images')));
// Root  index.html serve 
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});
// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "miramysql@2006",
  database: "gs_fashion"
});
// Check connection
db.connect(err => {
  if (err) {
    console.error(" MySQL connection error:", err);
    return;
  }
  console.log(" Connected to MySQL Database!");
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
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
