import { Router } from "express";
import AcessControlController from "./controllers/AcessControlController";
import PermissionController from "./controllers/PermissionController";
import ProductController from "./controllers/ProductController";
import RoleController from "./controllers/RoleController";
import SessionController from "./controllers/SessionController";
import UserController from "./controllers/UserController";
import { ensureAutenticado } from "./middlewares/auth";
import { can, is } from "./middlewares/permission";

const routes = Router();

routes.get("/", (req, res) => {
  return res.json("Ok");
});
// login
routes.post("/session", SessionController.create);

//user
routes.post("/users", UserController.create);
routes.get("/users", UserController.index);
routes.get("/users/:user_id", ensureAutenticado, UserController.user);
routes.put("/users/:user_id", ensureAutenticado, UserController.update);

//role
routes.post("/:user_id/role", is(["admin"]), ensureAutenticado, RoleController.create);

//permission
routes.post("/permission", ensureAutenticado, PermissionController.create);

//products
routes.get("/:user_id/products", can(["list_product"]) ,ProductController.index);
routes.post("/user/:user_id/products", ensureAutenticado, can(["create_product"]), ProductController.create);

// acl
routes.post(
  "/users/acl/:user_id",
  ensureAutenticado,
  AcessControlController.userAccess
);
routes.post(
  "/roles/:role_id",
  ensureAutenticado,
  AcessControlController.rolePermissionAccess
);

export { routes };
