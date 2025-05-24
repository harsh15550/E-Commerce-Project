import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const {token} = req.cookies;
    
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const {id} = jwt.verify(token, process.env.secretKey);
    req.user = id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};