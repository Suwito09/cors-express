const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

// Middleware untuk memverifikasi token JWT
const protect = (req, res, next) => {
  let token = req.headers["authorization"]; // Mendapatkan token dari header Authorization

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  token = token.split(" ")[1]; // Token biasanya ada di header Authorization: "Bearer <token>"

  try {
    // Verifikasi token menggunakan kunci rahasia
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Menyimpan informasi user di request untuk akses selanjutnya
    req.user = decoded;
    next(); // Lanjutkan ke middleware atau route berikutnya
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = protect;
