const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require('path');

const app = express();

// Multer configuration for file uploads
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    const date = new Date().toISOString().replace(/:/g, "-");
    cb(null, date + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Apply multer middleware for parsing form-data
const upload = multer({ storage: fileStorage, fileFilter: fileFilter });

// Serve static files from "images" directory
app.use("/images", express.static(path.join(__dirname, "images")));

// CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Import routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

// Parse JSON requests (not necessary for multipart/form-data)
app.use(express.json()); 

// Define routes
app.use("/", shopRoutes);
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);

// Global error handling
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  res.status(status).json({
    message: error.message,
    data: error.data || null,
  });
});

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://bobbob:bobbob@cluster0.7u1ew9a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then((result) => {
    const server = app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
