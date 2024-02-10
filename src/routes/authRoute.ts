import express from "express";
import { AuthenticationController } from "../controllers/authController.js";

const authRoute = express.Router();

authRoute
  .post("/login", AuthenticationController.login)
  .get("/logout", AuthenticationController.logout)
  .get("/status", AuthenticationController.getUserStatus);

export default authRoute;
