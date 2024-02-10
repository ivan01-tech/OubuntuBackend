import express from "express";
import { join } from "path";
import { UserController } from "../controllers/userController.js";
import { requireAuth } from "../middleware/requiredAuth.js";
import { requiredAdminRoles } from "../middleware/checkUserRoles.js";

const usersRoute = express.Router();

usersRoute
  .post("/", UserController.createUser)
  .get("/", UserController.getAllUsers)
  .delete("/", UserController.deleteUser)
  .patch("/:userId", UserController.updateUser)
  .get("/:userId", UserController.getUserById)
  .post(
    "/change_roles",
    requireAuth,
    requiredAdminRoles,
    UserController.changeUserRoles
  );

export default usersRoute;
