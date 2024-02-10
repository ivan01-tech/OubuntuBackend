import express from "express";
import ProductController from "../controllers/productsController.js";
import { requireAuth } from "../middleware/requiredAuth.js";
import { requiredAdminRoles } from "../middleware/checkUserRoles.js";

const productsRoute = express.Router();

productsRoute
  .get("/", ProductController.getAllUsers)
  .post("/", requireAuth, requiredAdminRoles, ProductController.createProduct)
  .delete(
    "/",
    requireAuth,
    requiredAdminRoles,
    ProductController.deleteProduct
  );

export default productsRoute;
