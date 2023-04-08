import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "./../database/index";

export default {
  async index(req: Request, res: Response) {
    try {
      return res.json();
    } catch (error) {
      console.error(error);
      return res.status(500).json("Erro no servidor interno!");
    }
  },

  async create(req: Request, res: Response) {
    try {
      const createRoleBody = z.object({
        name: z.string(),
        description: z.string(),
      });

      const { name, description } = createRoleBody.parse(req.body);

      const role = await prisma.role.findFirst({
        where: {
          name,
        },
      });

      if (role) {
        return res.status(400).json("Role already exists");
      }

      const newRole = await prisma.role.create({
        data: {
          name,
          description,
        },
      });

      return res.status(201).json(newRole);
    } catch (error) {
      console.error(error);
      return res.status(500).json("Erro no servidor interno!");
    }
  },

  async update(req: Request, res: Response) {},

  async delete(req: Request, res: Response) {},
};
