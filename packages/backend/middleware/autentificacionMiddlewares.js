export default function authMiddleware(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      error: "No logueado",
      message: "Por favor inicie sesión",
      redirect: "/login",
    });
  }
  next();
}
