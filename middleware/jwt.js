import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies?.accessToken || req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "You are not authenticated!" });

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) return res.status(403).json({ message: "Token is not valid!" });
    req.userId = payload.id;
    req.isSeller = payload.isSeller;
    req.isAdmin = payload.isAdmin;
    next();
  });
};

export const verifySeller = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.isSeller) {
      next();
    } else {
      return res.status(403).json({ message: "Only sellers can do this!" });
    }
  });
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.isAdmin) {
      next();
    } else {
      return res.status(403).json({ message: "Only admins can do this!" });
    }
  });
};
