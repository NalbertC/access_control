import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { authConfig } from "../configs/auth";

export function ensureAutenticado(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.json("Token de autorização não encontrado");
  }

  const [, token] = authorization.split(" ");

  try {
    const verify = jwt.verify;
    const { userId }: any = verify(token, authConfig.secret);

    req.user_id = String(userId);

    return next();
  } catch (error) {
    console.error(error);
    return res.status(400).json("Token inválido");
  }
}