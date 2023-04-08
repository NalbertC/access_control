import { Request, Response } from "express";
import { prisma } from "../database";
import { criptografarSenha } from "../services/auth";

export default {
  async index(req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany();
      return res.status(200).json(users);
    } catch (error) {
      console.error(error);
      return res.status(500).json("Internal server eroor");
    }
  },

  async create(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      const user = await prisma.user.findUnique({
        where: {
          username,
        },
      });

      if (user) {
        return res.status(400).json("User found");
      }

      const pass = await criptografarSenha(password);

      const newUser = await prisma.user.create({
        data: {
          username,
          password: pass,
        },
      });

      return res.status(201).json("User created");
    } catch (error) {
      console.error(error);
      return res.status(500).json("Internal server eroor");
    }
  },

  async user(req: Request, res: Response) {
    try {
      const { user_id } = req.params;

      const user = await prisma.user.findUnique({
        where: {
          id: Number(user_id),
        },
        include: {
          permissions: {
            include: {
              Permission: true
            }
          },
          roles: {
            include: {
              Role: true
            }
          },
        },
      });

      if (!user) {
        return res.status(404).json("User not found");
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json("Internal server eroor");
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { user_id } = req.params;
      const { username } = req.body;

      const user = await prisma.user.findUnique({
        where: {
          id: Number(user_id),
        },
      });

      if (!user) {
        return res.status(404).json("User not found");
      }

      const updateUser = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          username,
        },
      });

      return res.status(200).json("User updated");
    } catch (error) {
      console.error(error);
      return res.status(500).json("Internal server eroor");
    }
  },
};
