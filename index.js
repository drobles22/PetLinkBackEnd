const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const path = require("path");

// Configurar variables de entorno
dotenv.config();

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error conectando a MongoDB:", err));

// Middleware
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

// Configuración de Multer para subir archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images"); // Guardar en la carpeta "public/images"
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName); // Asignar un nombre único al archivo
  },
});

const upload = multer({ storage });

// Endpoint para subir archivos
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    res.status(200).json({
      message: "Archivo subido correctamente",
      fileName: req.file.filename,
    });
  } catch (error) {
    console.error("Error al subir el archivo:", error);
    res.status(500).json({ error: "Error al subir el archivo" });
  }
});

// Rutas
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);

// Servidor
const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
  console.log(`Backend corriendo en el puerto ${PORT}`);
});
