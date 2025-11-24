import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import logger from "../logger/logger.js";

const client = jwksClient({
  jwksUri:
    process.env.KEYCLOAK_BASE_URL + "/realms/ecomerce/protocol/openid-connect/certs",
});

async function getKey(kid) {
  return new Promise((resolve, reject) => {
    client.getSigningKey(kid, (err, key) => {
      if (err) reject(err);
      else resolve(key.getPublicKey());
    });
  });
}

export async function validarToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ mensaje: "Token requerido" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded) return res.status(401).json({ mensaje: "Token inválido" });

    const key = await getKey(decoded.header.kid);

    const payload = jwt.verify(token, key, { algorithms: ["RS256"] });
    req.user = payload;
    logger.info("Token validado para el usuario: " + payload.sub);
    next();
  } catch (err) {
    logger.error("Error al validar token: " + err.message);
    res.status(401).json({ mensaje: "Token no válido" });
  }
}

export function soloRol(rolRequerido) {
  return (req, res, next) => {
    const roles = req.user?.realm_access?.roles || [];
    if (!roles.includes(rolRequerido)) {
      return res
        .status(403)
        .json({ mensaje: "Acceso denegado, rol equivocado" });
    }
    next();
  };
}
