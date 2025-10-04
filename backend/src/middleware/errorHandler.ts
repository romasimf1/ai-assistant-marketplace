import { Request, Response, NextFunction } from 'express';
import { ApiError } from '@/types';
import { config } from '@/utils/config';

export const errorHandler: (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => void = (err, req, res, next) => {
  let error = err;

  // Log error
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new ApiError(message, 404);
  }

  // Mongoose duplicate key
  if (err.name === 'MongoError' && (err as any).code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ApiError(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values((err as any).errors).map((val: any) => val.message).join(', ');
    error = new ApiError(message, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = new ApiError(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = new ApiError(message, 401);
  }

  // Prisma errors
  if ((err as any).code && (err as any).code.startsWith('P')) {
    const message = 'Database operation failed';
    error = new ApiError(message, 500);
  }

  // Default to 500 server error
  const statusCode = error instanceof ApiError ? error.statusCode : 500;
  const message = error.message || 'Something went wrong';

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    ...(config.server.nodeEnv === 'development' && { stack: err.stack }),
  });
};
