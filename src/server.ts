import * as dotenv from "dotenv";
import express from "express";
import { join } from "node:path";
import cookieParser from "cookie-parser";
import cors from "cors";
import rootRouter from "./routes/root.js";
import { logEvent, logger } from "./middleware/logger.js";
import errLogger from "./middleware/errLogger.js";
import { corsOptions } from "./config/corsCongif.js";
import mongoose from "mongoose";
import dbConnection from "./config/dbConnection.js";
import usersRoute from "./routes/userRoute.js";

// env var
dotenv.config({ path: join(process.cwd(), "src", ".env") });

const PORT = process.env.PORT || 3500;
const app = express();

// connect to DB
dbConnection();

// logger middleware
app.use(logger);

//cookie-parser to manage secure cookie , during the proccess of authentication and authorization
app.use(cookieParser());

// cors
app.use(cors(corsOptions));

// built in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static files
app.use("/", express.static(join(process.cwd(), "src", "public")));

// root router
app.use("/", rootRouter);

// users Route
app.use("/users", usersRoute);

// catch all routes
app.all("/*", function (req, res) {
  res.status(404);

  if (req.accepts("html")) {
    // nothing
  } else if (req.accepts("json")) {
    res.json({ message: "Not Found !" });
  } else {
    res.type("text").send("Not Found");
  }
});

// listenner
mongoose.connection.once("open", function () {
  console.log("Connected to MongoDB");
  app.listen(PORT, function () {
    console.log("Server is running on  : ", `http://localhost:${PORT}`);
  });
});

mongoose.connection.on("error", (err) => {
  logEvent(`${err.no}: ${err.code} ${err.syscal}`, "mongoError.log");
  console.log("error : ", err.message);
});

// custom error handler
app.use(errLogger);
