import express from "express";
import { join } from "path";
import { UserController } from "../controllers/userController.js";

const usersRoute = express.Router();

usersRoute
  .post("/", UserController.createUser)
  .get("/", UserController.getAllUsers)
  .delete("/", UserController.deleteUser)
  .patch("/:userId", UserController.updateUser)
  .get("/:userId", UserController.getUserById);

export default usersRoute;
