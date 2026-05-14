import { Request, Response, NextFunction } from 'express';
import authService from './auth.service.js';
import { generateTokenAndSetCookie } from '../../utils/generateToken.js';
import jwt from 'jsonwebtoken';

/**
 * Auth controller handles HTTP request/response for authentication.
 */
class AuthController {
  /**
   * POST /api/auth/login
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      const user = await authService.login(email, password);

      // Generate JWT token
      const token = jwt.sign(
        { id: String(user._id) },
        process.env.JWT_SECRET as string,
        { expiresIn: (process.env.JWT_EXPIRE || '7d') as any }
      );

      // Still set cookie (works locally) AND return token in body (works on Vercel cross-domain)
      generateTokenAndSetCookie(res, String(user._id));

      res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/logout
   */
  async logout(_req: Request, res: Response): Promise<void> {
    res.clearCookie('token');
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  }

  /**
   * GET /api/auth/me
   */
  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await authService.getUserById(String(req.user!._id));

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
