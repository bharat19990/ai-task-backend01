import jwt from 'jsonwebtoken';
import { Response } from 'express';

/**
 * Generates a JWT token and sets it as an HTTP-only cookie.
 */
export const generateTokenAndSetCookie = (res: Response, userId: string): string => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
    expiresIn: (process.env.JWT_EXPIRE || '7d') as jwt.SignOptions['expiresIn'],
  } as jwt.SignOptions);

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });

  return token;
};

/**
 * Clears the authentication cookie.
 */
export const clearTokenCookie = (res: Response): void => {
  res.cookie('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: 0,
    path: '/',
  });
};
