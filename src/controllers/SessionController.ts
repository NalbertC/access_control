import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { authConfig } from "../configs/auth";
import { prisma } from "../database";
import { checarSenha } from "../services/auth";

export default {
  async create(req: Request, res: Response) {
    try {


      const { username, password } = req.body;

      const usuario = await prisma.user.findUnique({
        where: { username },
      });

      if (!usuario) {
        return res.status(404).json("Usuário não encontrado");
      }

      const check = await checarSenha(password, usuario.password);

      if (!check) {
        return res.status(401).json("Senha inválida");
      }

      const { id } = usuario;

      return res.status(201).json({
        user: {
          id: usuario.id,
          username: usuario.username,
        },
        token: jwt.sign({ id }, authConfig.secret, {
          expiresIn: authConfig.expiresIn,
        }),
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json("Erro no servidor interno!");
    }
  },
};
