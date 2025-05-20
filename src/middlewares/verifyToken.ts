import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET ?? "mi_clave_secreta";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1]; // Formato: "Bearer <token>"

  if (!token) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "No tiene autirización para generar el token" });
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    // Puedes guardar info del usuario en req para usar luego
    (req as any).user = decoded;
    next();
  } catch (error: any) {
    res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: "El token no es válido o ya expiró" });
    return;
  }
};
