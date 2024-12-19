const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const jwt = require('jsonwebtoken');
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const authRoute = require("./routes/auth");
const path = require("path");
const cors = require('cors');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
  }
};
connectDB();

app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use(express.json());
require('dotenv').config();
app.use(cors())
app.use(helmet());
app.use(morgan("common"));




const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploaded successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json("Error uploading file");
  }
});

// Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);

app.listen(8800, () => {
  console.log("Backend server is running on port 8800!");
});
