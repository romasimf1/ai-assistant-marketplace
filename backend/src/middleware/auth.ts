import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '@/utils/config';
import { AuthenticationError, AuthorizationError } from '@/types';
import prisma from '@/utils/database';

interface JwtPayload {
  userId: string;
  email: string;
  subscriptionTier: string;
  iat: number;
  exp: number;
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Access token required');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      throw new AuthenticationError('Access token required');
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

    // Check if user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        subscriptionTier: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AuthenticationError('User no longer exists');
    }

    // Add user to request object
    req.user = {
      id: user.id,
      email: user.email,
      subscriptionTier: user.subscriptionTier,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AuthenticationError('Invalid access token'));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new AuthenticationError('Access token expired'));
    } else {
      next(error);
    }
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AuthenticationError('Authentication required');
    }

    if (!roles.includes(req.user.subscriptionTier)) {
      throw new AuthorizationError('Insufficient permissions');
    }

    next();
  };
};

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // Continue without authentication
    }

    const token = authHeader.substring(7);

    if (!token) {
      return next(); // Continue without authentication
    }

    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        subscriptionTier: true,
      },
    });

    if (user) {
      req.user = {
        id: user.id,
        email: user.email,
        subscriptionTier: user.subscriptionTier,
      };
    }

    next();
  } catch (error) {
    // For optional auth, we don't throw errors, just continue
    next();
  }
};
