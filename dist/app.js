import { join } from 'path';
import expresssession from 'express-session';
import express from 'express';
import AdminJS from 'adminjs';
import { buildAuthenticatedRouter } from '@adminjs/express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { Database, Resource } from '@adminjs/mongoose';
import provider from './admin/auth-provider.js';
import options from './admin/options.js';
import initializeDb from './db/index.js';
import errLogger from './middleware/errLogger.js';
import errorHandlerMiddleware from './middleware/errorMiddleware.js';
import offersRoute from './routes/offersRoute.js';
import productsRoute from './routes/productRoute.js';
import usersRoute from './routes/userRoute.js';
import authRoute from './routes/authRoute.js';
import rootRouter from './routes/root.js';
import { corsOptions } from './config/corsCongif.js';
import { logger } from './middleware/logger.js';
dotenv.config();
const port = process.env.PORT || 3500;
const PORT = process.env.PORT || 3500;
const secretKey = process.env.EXPRESS_SESSION_KEY;
const app = express();
AdminJS.registerAdapter({ Database, Resource });
const start = async () => {
    await initializeDb();
    const admin = new AdminJS(options);
    if (process.env.NODE_ENV === 'production') {
        await admin.initialize();
    }
    else {
        admin.watch();
    }
    const router = buildAuthenticatedRouter(admin, {
        cookiePassword: process.env.COOKIE_SECRET,
        cookieName: 'adminjs',
        provider,
    }, null, {
        secret: process.env.COOKIE_SECRET,
        saveUninitialized: true,
        resave: true,
    });
    app.use(admin.options.rootPath, router);
    app.use(logger);
    app.use(cookieParser());
    app.use(cors(corsOptions));
    const sessionMiddleware = expresssession({
        secret: secretKey,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 2,
            secure: false,
            httpOnly: false,
        },
    });
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(sessionMiddleware);
    app.use('/', express.static(join(process.cwd(), 'src', 'public')));
    app.use('/api', rootRouter);
    app.use('/api/auth', authRoute);
    app.use('/api/users', usersRoute);
    app.use('/api/products', productsRoute);
    app.use('/api/offers', offersRoute);
    app.all('/*', (req, res) => {
        res.status(404);
        if (req.accepts('html')) {
        }
        else if (req.accepts('json')) {
            res.json({ message: 'Not Found !' });
        }
        else {
            res.type('text').send('Not Found');
        }
    });
    app.use(errLogger);
    app.use(errorHandlerMiddleware);
    mongoose.connection.once('open', () => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log('Server is running on : ', `http://localhost:${PORT}`);
            console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`);
        });
    });
    mongoose.connection.on('error', (err) => {
        console.log(`MongoDB connection error: ${err.message}`);
    });
    app.listen(port, () => {
        console.log(`AdminJS available at http://localhost:${port}${admin.options.rootPath}`);
    });
};
start();
