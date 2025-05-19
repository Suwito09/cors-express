const express = require("express");
const mongoose = require("mongoose");
//const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
//app.use(cors());

// Koneksi ke MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Routes
app.use("/api/users", userRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
