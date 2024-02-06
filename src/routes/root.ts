import express from "express";
import { join } from "path";

const rootRouter = express.Router();

rootRouter.get("^/$|/index(.html)?", function (_req, res) {
  res.sendFile(join(process.cwd(), "src", "public", "html", "index.html"));
});

export default rootRouter;
