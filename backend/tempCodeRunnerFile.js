const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",                 // ⚠️ yaha apna MySQL username likho
  password: "miramysql@2006",   // ⚠️ yaha apna password likho
  database: "gs_fashion"
});

// Check connection
db.connect(err => {
  if (err) {
    console.error("❌ MySQL connection error:", err);
    return;
  }
  console.log("✅ Connected to MySQL Database!");
});

// ================== ROUTES ==================

// ✅ Get all products
app.get("/products", (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// ✅ Get single product
app.get("/products/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM products WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results[0]);
  });
});

// ✅ Add new product
app.post("/products", (req, res) => {
  const { name, category, image, sizes, in_stock, description } = req.body;
  const query =
    "INSERT INTO products (name, category, image, sizes, in_stock, description) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(query, [name, category, image, sizes, in_stock, description], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({
      id: result.insertId,
      name,
      category,
      image,
      sizes,
      in_stock,
      description,
    });
  });
});

// ✅ Update product
app.put("/products/:id", (req, res) => {
  const { id } = req.params;
  const { name, category, image, sizes, in_stock, description } = req.body;
  const query =
    "UPDATE products SET name=?, category=?, image=?, sizes=?, in_stock=?, description=? WHERE id=?";
  db.query(query, [name, category, image, sizes, in_stock, description, id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true, message: "✅ Product updated successfully!" });
  });
});

// ✅ Delete product
app.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM products WHERE id=?", [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true, message: "🗑️ Product deleted successfully!" });
  });
});

// ================== START SERVER ==================
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
