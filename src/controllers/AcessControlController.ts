import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../database";

export default {
  async userAccess(req: Request, res: Response) {
    try {
      const UserACL = z.object({
        user_id: z.string(),
      });

      const UserACLBody = z.object({
        roles: z.array(z.number()),
        permissions: z.array(z.number()),
      });

      const { user_id } = UserACL.parse(req.params);

      const user = await prisma.user.findUnique({
        where: {
          id: Number(user_id),
        },
      });

      if (!user) {
        return res.status(400).json("User does not exists!");
      }

      const { roles, permissions } = UserACLBody.parse(req.body);

      const allPermissions = await prisma.permission.findMany();
      const allRoles = await prisma.role.findMany();

      const permissionExists = allPermissions.filter((permission) =>
        permissions.includes(permission.id)
      );

      const rolesExists = allRoles.filter((role) => roles.includes(role.id));

      //   console.log({ roles, permissions,permissionExists,rolesExists });

      const userACL = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          permissions: {
            create: permissionExists.map((i) => {
              return {
                permission_id: i.id,
              };
            }),
          },
          roles: {
            create: rolesExists.map((i) => {
              return {
                role_id: i.id,
              };
            }),
          },
        },
        include: {
          permissions: true,
          roles: true,
        },
      });

      return res.json(userACL);
    } catch (error) {
      console.error(error);
      return res.status(500).json("Erro no servidor interno!");
    }
  },

  async rolePermissionAccess(req: Request, res: Response) {
    try {
      const roleParams = z.object({
        role_id: z.string(),
      });

      const rolePermissionsBody = z.object({
        permissions: z.array(z.number()),
      });

      const { role_id } = roleParams.parse(req.params);

      const role = await prisma.role.findUnique({
        where: {
          id: Number(role_id),
        },
      });

      if (!role) {
        return res.status(404).json("Role does not exists");
      }

      const { permissions } = rolePermissionsBody.parse(req.body);

      const allPermissions = await prisma.permission.findMany();

      const permissionExists = allPermissions.filter((permission) =>
        permissions.includes(permission.id)
      );

      const rolePermission = await prisma.role.update({
        where: {
          id: role.id,
        },
        data: {
          permissions: {
            create: permissionExists.map((i) => {
              return {
                permission_id: i.id,
              };
            }),
          },
        },
      });

      return res.json(rolePermission);
    } catch (error) {
      console.error(error);
      return res.status(500).json("Internal server error");
    }
  },

  async delete(req: Request, res: Response) {},
};
