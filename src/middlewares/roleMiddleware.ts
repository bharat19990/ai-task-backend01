import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../features/users/user.types.js';

/**
 * Middleware to restrict access based on user roles.
 * Must be used after the protect middleware.
 */
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
      return;
    }

    if (!roles.includes(req.user.role as UserRole)) {
      res.status(403).json({
        success: false,
        message: 'Access denied - insufficient permissions',
      });
      return;
    }

    next();
  };
};
