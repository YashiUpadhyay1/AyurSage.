// Import the jsonwebtoken library to handle token verification [cite: 10]
const jwt = require("jsonwebtoken");

/**
 * Authentication Middleware
 * Purpose: To verify the user's JWT before allowing access to protected wellness routes [cite: 40]
 */
const auth = (req, res, next) => {
  try {
    // Access the Authorization header from the incoming request [cite: 24]
    const authHeader = req.headers.authorization;

    // Check if the Authorization header exists
    if (!authHeader) {
      return res.status(401).json({ message: "No Authorization Header" });
    }

    // Extract the token from the "Bearer <token>" format
    const token = authHeader.split(" ")[1];

    // Validate that the token string is present after splitting
    if (!token) {
      return res.status(401).json({ message: "Invalid Token" });
    }

    /**
     * Verify the token using the secret key stored in environment variables
     * jwt.verify will throw an error if the token is expired or tampered with [cite: 10]
     */
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user's unique ID from the token payload to the request object [cite: 34]
    req.userId = decoded.id;

    // Call next() to pass control to the next middleware or route handler [cite: 32]
    next();
  } catch (err) {
    // Log authentication failures for debugging purposes
    console.error("AUTH ERROR:", err.message);
    
    // Return an unauthorized status if verification fails [cite: 40]
    return res.status(401).json({ message: "Token Failed" });
  }
};

// Export the middleware for use in routes like mlRoutes.js and dosha.js 
module.exports = auth;