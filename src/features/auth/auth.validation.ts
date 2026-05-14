import { Request, Response, NextFunction } from 'express';

interface ValidationSchema {
  body?: Record<string, FieldValidator>;
}

interface FieldValidator {
  required?: boolean;
  type?: 'string' | 'email';
  minLength?: number;
  maxLength?: number;
  message?: string;
}

/**
 * Validates incoming request body against a schema.
 */
const validate = (schema: ValidationSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: string[] = [];

    if (schema.body) {
      for (const [field, rules] of Object.entries(schema.body)) {
        const value = req.body[field];

        if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
          errors.push(rules.message || `${field} is required`);
          continue;
        }

        if (value) {
          if (rules.type === 'email' && !/^\S+@\S+\.\S+$/.test(value)) {
            errors.push(`${field} must be a valid email address`);
          }

          if (rules.minLength && value.length < rules.minLength) {
            errors.push(`${field} must be at least ${rules.minLength} characters`);
          }

          if (rules.maxLength && value.length > rules.maxLength) {
            errors.push(`${field} cannot exceed ${rules.maxLength} characters`);
          }
        }
      }
    }

    if (errors.length > 0) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
      return;
    }

    next();
  };
};

// Auth validation schemas
export const loginValidation = validate({
  body: {
    email: {
      required: true,
      type: 'email',
      message: 'Email is required',
    },
    password: {
      required: true,
      minLength: 6,
      message: 'Password is required',
    },
  },
});

export const registerValidation = validate({
  body: {
    name: {
      required: true,
      minLength: 2,
      maxLength: 50,
      message: 'Name is required',
    },
    email: {
      required: true,
      type: 'email',
      message: 'Email is required',
    },
    password: {
      required: true,
      minLength: 6,
      message: 'Password is required (min 6 characters)',
    },
  },
});
