import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../database';

export default {
  async index(req: Request, res: Response) {},

  async create(req: Request, res: Response) {
    try {
      const createPermissionBody = z.object({
        name: z.string(),
        description: z.string(),
      });

      const { name, description } = createPermissionBody.parse(req.body);

      const permition = await prisma.permission.findFirst({
        where: {
          name,
        },
      });

      if (permition) {
        return res.status(400).json("Permition already exists");
      }

      const newPermition = await prisma.permission.create({
        data: {
          name,
          description,
        },
      });

      return res.status(201).json(newPermition);
    } catch (error) {
      console.error(error);
      return res.status(500).json("Erro no servidor interno!");
    }
  },

  async update(req: Request, res: Response) {},

  async delete(req: Request, res: Response) {},
};