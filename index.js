const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Conectado a MongoDB");
  })
  .catch((err) => console.error("Error conectando a MongoDB:", err));

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors());

app.use("/images", express.static(path.join(__dirname, "public/images")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "_" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage: storage });

app.post("/", upload.single("file"), (req, res) => {
  try {
    const { desc } = req.body;
    const img = req.file ? req.file.filename : null;

    const newPost = {
      desc,
      img,
      createdAt: new Date(),
    };

    console.log("Nuevo post creado:", newPost);
    res.status(200).json(newPost);
  } catch (error) {
    console.error("Error creando el post:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.listen(process.env.PORT || 8800, () => {
  console.log("Backend server is running!");
});

