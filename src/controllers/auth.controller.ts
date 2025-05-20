import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET ?? "mi_clave_secreta";

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  // Simula validación de usuario. Reemplaza esto con lógica real.
  if (username === "admin" && password === "1234") {
    const user = { username }; // Aquí puedes incluir más info
    const token = jwt.sign(user, SECRET_KEY, { expiresIn: "1h" });
    res.status(StatusCodes.OK).json({ token });
    return;
  }

  res
    .status(StatusCodes.UNAUTHORIZED)
    .json({ message: "Las credenciales no son válidas" });
  return;
};
