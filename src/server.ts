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
import session from "express-session";
import authRoute from "./routes/authRoute.js";
import { deleteAllDocuments } from "./utils/deleteMany.js";
import User from "./models/userModel.js";
import { requiredAdminRoles } from "./middleware/checkUserRoles.js";
import { requireAuth } from "./middleware/requiredAuth.js";
import productsRoute from "./routes/productRoute.js";
import errorHandlerMiddleware from "./middleware/errorMiddleware.js";
// env var
dotenv.config({ path: join(process.cwd(), "src", ".env") });

const PORT = process.env.PORT || 3500;
const secretKey = process.env.EXPRESS_SESSION_KEY!;

const app = express();

// connect to DB
dbConnection();
// deleteAllDocuments(User);
// logger middleware
app.use(logger);

//cookie-parser to manage secure cookie , during the proccess of authentication and authorization
app.use(cookieParser());

// cors
app.use(cors(corsOptions));

// session authentication configuration
const sessionMiddleware = session({
  secret: secretKey,
  resave: false, // Don't resave sessions if unmodified
  saveUninitialized: false, // Don't create empty sessions
  cookie: {
    // TODO comme here before deployment
    maxAge: 1000 * 60 * 2, // Session expires in 1 hour
    secure: false, // Set to true for HTTPS only
    httpOnly: false, // Only accessible via HTTP
  },
});
// built in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// custom middleware
app.use(sessionMiddleware);

// static files
app.use("/", express.static(join(process.cwd(), "src", "public")));

// root router
app.use("/api", rootRouter);

// auth routes
app.use("/api/auth", authRoute);

// users Route
app.use("/api/users", usersRoute);

/**
 * Secure routes defined in here
 */
// make sure that only  get routes are not protected
// products Routes
app.use("/api/products",productsRoute);


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
app.use(errorHandlerMiddleware);
