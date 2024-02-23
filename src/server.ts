// // server.ts

// import { join } from 'node:path';

// import express from 'express';
// import cookieParser from 'cookie-parser';
// import cors from 'cors';
// import session from 'express-session';
// import mongoose from 'mongoose';
// import AdminJS from 'adminjs';
// import AdminJSExpress from '@adminjs/express';
// import * as dotenv from 'dotenv';
// import { Database, Resource } from '@adminjs/mongoose';

// import dbConnection from './config/dbConnection.js';
// import rootRouter from './routes/root.js';
// import errLogger from './middleware/errLogger.js';
// import { corsOptions } from './config/corsCongif.js';
// import { deleteAllDocuments } from './utils/deleteMany.js';
// import { requiredAdminRoles } from './middleware/checkUserRoles.js';
// import { requireAuth } from './middleware/requiredAuth.js';
// import productsRoute from './routes/productRoute.js';
// import errorHandlerMiddleware from './middleware/errorMiddleware.js';
// import offersRoute from './routes/offersRoute.js';
// import usersRoute from './routes/userRoute.js';
// import { logger } from './middleware/logger.js';
// import User from './models/userModel.js';
// import Offer from './models/offerModel.js';
// import Product from './models/productsModel.js';
// import authRoute from './routes/authRoute.js';

// const PORT = process.env.PORT || 3500;
// const secretKey = process.env.EXPRESS_SESSION_KEY!;
// const app = express();

// const startApp = async () => {
//   // connect to DB
//   // await dbConnection();

//   const admin = new AdminJS({ resources: [User, Offer, Product] });
//   const adminRouter = AdminJSExpress.buildRouter(admin);
//   app.use(admin.options.rootPath, adminRouter);

//   // deleteAllDocuments(User);
//   // logger middleware
//   app.use(logger);

//   // cookie-parser to manage secure cookie
//   app.use(cookieParser());

//   // cors
//   app.use(cors(corsOptions));

//   // session authentication configuration
//   const sessionMiddleware = session({
//     secret: secretKey,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       maxAge: 1000 * 60 * 2,
//       secure: false,
//       httpOnly: false,
//     },
//   });
//   app.use(express.json());
//   app.use(express.urlencoded({ extended: true }));
//   app.use(sessionMiddleware);

//   // static files
//   app.use('/', express.static(join(process.cwd(), 'src', 'public')));

//   // root router
//   app.use('/api', rootRouter);

//   // auth routes
//   app.use('/api/auth', authRoute);

//   // users Route
//   app.use('/api/users', usersRoute);

//   // Secure routes
//   // Make sure that only get routes are not protected
//   app.use('/api/products', productsRoute);
//   app.use('/api/offers', offersRoute);

//   // Catch-all routes
//   app.all('/*', (req, res) => {
//     res.status(404);

//     if (req.accepts('html')) {
//       // nothing
//     } else if (req.accepts('json')) {
//       res.json({ message: 'Not Found !' });
//     } else {
//       res.type('text').send('Not Found');
//     }
//   });

//   // custom error handler
//   app.use(errLogger);
//   app.use(errorHandlerMiddleware);

//   // listener
//   mongoose.connection.once('open', () => {
//     console.log('Connected to MongoDB');
//     app.listen(PORT, () => {
//       console.log('Server is running on : ', `http://localhost:${PORT}`);
//       console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`);
//     });
//   });

//   mongoose.connection.on('error', (err) => {
//     console.log(`MongoDB connection error: ${err.message}`);
//   });
// };
// startApp();
// export default startApp;
