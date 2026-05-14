import User from '../users/user.model.js';
import { IUser, IUserResponse } from '../users/user.types.js';
import { AppError } from '../../middlewares/errorMiddleware.js';

/**
 * Auth service handles all business logic for authentication.
 */
class AuthService {
  /**
   * Authenticate user with email and password.
   */
  async login(email: string, password: string): Promise<IUser> {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    return user;
  }

  /**
   * Get user by ID (for current user endpoint).
   */
  async getUserById(userId: string): Promise<IUserResponse> {
    const user = await User.findById(userId).select('-password');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

export default new AuthService();
