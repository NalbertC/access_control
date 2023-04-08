import { NextFunction, Request, Response } from "express";
import { prisma } from "./../database/index";

export function can(permissions: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { user_id } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        id: Number(user_id),
      },
      include: {
        permissions: {
          include: {
            Permission: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json("User does not exists");
    }
    const permissionExists = user.permissions
      .map((permission) => permission.Permission.name)
      .some((permission) => permissions.includes(permission));

    if (!permissionExists) {
      return res.status(401).json("Sem permição");
    }

    return next();
  };
}

export function is(roles: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { user_id } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        id: Number(user_id),
      },
      include: {
        roles: {
          include: {
            Role: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json("User does not exists");
    }
    const roleExists = user.roles
      .map((role) => role.Role.name)
      .some((role) => roles.includes(role));

    if (!roleExists) {
      return res.status(401).json("Sem permição");
    }

    return next();
  };
}
