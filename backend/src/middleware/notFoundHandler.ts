import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '@/types';

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new NotFoundError('API endpoint');
  next(error);
};
