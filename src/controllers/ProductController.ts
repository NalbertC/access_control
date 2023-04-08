import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../database";

export default {
  async index(req: Request, res: Response) {
    try {
      const products = await prisma.product.findMany();
      return res.json(products);
    } catch (error) {
      console.error(error);
      return res.status(500).json("Internal server error");
    }
  },

  async create(req: Request, res: Response) {
    try {
      const createProductBody = z.object({
        name: z.string(),
        description: z.string().optional(),
        price: z.number(),
      });

      const { name, description, price } = createProductBody.parse(req.body);

      const product = await prisma.product.create({
        data: {
          name,
          description,
          price,
        },
      });
      return res.json(product);
    } catch (error) {
      console.error(error);
      return res.status(500).json("Internal server error");
    }
  },
};
