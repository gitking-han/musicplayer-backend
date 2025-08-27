const jwt = require("jsonwebtoken");

const fetchuser = (req, res, next) => {
  // Get token from header
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data.user; // attach user payload to request
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = fetchuser;
