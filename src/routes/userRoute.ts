import express from "express";
import { join } from "path";
import { UserController } from "../controllers/userController.js";

const usersRoute = express.Router();

usersRoute.post("/", UserController.createUser);

export default usersRoute;
