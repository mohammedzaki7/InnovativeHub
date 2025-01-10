const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "secret");
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Invalid token. Please log in again." });
  }

  if (!decodedToken) {
    const error = new Error("Not authenticated to do this request.");
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  req.userMail = decodedToken.email;
  next();
};
