import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import createError from 'http-errors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { CORS_OPTIONS } from '@app/configs';
import env from '@app/env';
import router from './routes';

const app = express();

// Middleware for logging
app.use(morgan('dev'));

// Cross Origin Resources Sharing
app.use(cors(CORS_OPTIONS));

// Built in middlerware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Middleware for cookies
app.use(cookieParser());

// Midleware for compress response
app.use(compression());

// Api Routes
app.use(env.app.routePrefix, router);

// 404 Route Handler
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new createError.NotFound());
});

// Custom Error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: NextFunction): void => {
  const status = err.status || 500;
  const message =
    status === 404
      ? `The page you are looking for might have been removed had it's name changed or is temporarily unavailable.`
      : err.message;

  res.status(status).json({
    success: false,
    error: {
      status,
      message,
    },
  });
});

export default app;
