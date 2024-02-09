import express from "express";
import { AuthenticationController } from "../controllers/authController.js";

const authRoute = express.Router();

authRoute
  .post("/login", AuthenticationController.login)
  .post("/logout", AuthenticationController.logout)

export default authRoute;
